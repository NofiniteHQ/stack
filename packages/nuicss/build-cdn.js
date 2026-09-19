const fs = require('fs');
const path = require('path');
const { nuicssPreset } = require('./dist/index.js');

console.log('Generating browser config...');
const config = nuicssPreset();

// Read the compiled CSS to inject it directly via JS (One-link CDN)
const baseCss = fs.readFileSync('dist/index.css', 'utf8');

const runtimeDir = path.join(
  path.dirname(require.resolve('@unocss/runtime')),
  '..'
);
const presetWind4Path = path.join(runtimeDir, 'preset-wind4.global.js');
const coreRuntimePath = path.join(runtimeDir, 'core.global.js');

if (!fs.existsSync(presetWind4Path) || !fs.existsSync(coreRuntimePath)) {
  console.error('Could not find required @unocss/runtime files!');
  process.exit(1);
}

const presetWind4Code = fs.readFileSync(presetWind4Path, 'utf8');
const coreRuntimeCode = fs.readFileSync(coreRuntimePath, 'utf8');

const cdnConfigScript = `
// Inject Base CSS (Reset + Design Tokens)
(function() {
  if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.id = 'nuicss-base';
    style.textContent = ${JSON.stringify(baseCss)};
    document.head.appendChild(style);
  }
})();

// Direction map for border utilities
var borderDirectionMap = {
  't-': ['border-top-color'],
  'b-': ['border-bottom-color'],
  'l-': ['border-left-color'],
  'r-': ['border-right-color'],
  'x-': ['border-left-color', 'border-right-color'],
  'y-': ['border-top-color', 'border-bottom-color'],
  '': ['border-color'],
};

// Configure UnoCSS Runtime with Preset Wind4 & NuiCSS Rules
window.__unocss = window.__unocss || {};
window.__unocss.presets = [
  (window.__unocss_runtime && window.__unocss_runtime.presets && window.__unocss_runtime.presets.presetWind4)
    ? window.__unocss_runtime.presets.presetWind4()
    : {}
];
window.__unocss.theme = Object.assign(window.__unocss.theme || {}, ${JSON.stringify(
  config.theme
)});
window.__unocss.shortcuts = Object.assign(window.__unocss.shortcuts || {}, ${JSON.stringify(
  config.shortcuts
)});
window.__unocss.rules = (window.__unocss.rules || []).concat([
  [
    /^bg-(page|canvas|surface|surface-raised|surface-overlay|subtle|muted|accent|overlay|glass|inset|card)(?:\\/(\\d+))?$/,
    function(m) {
      var name = m[1];
      var opacity = m[2];
      var varName = name === 'glass' ? '--glass-bg' : (name === 'accent' ? '--bg-accent' : '--bg-' + name);
      var val = opacity
        ? 'color-mix(in srgb, var(' + varName + ') ' + opacity + '%, transparent)'
        : 'color-mix(in srgb, var(' + varName + ') var(--un-bg-opacity, 100%), transparent)';
      return { 'background-color': val };
    }
  ],
  [
    /^text-(default|subtle|muted|accent|inverse|disabled|card)(?:\\/(\\d+))?$/,
    function(m) {
      var name = m[1];
      var opacity = m[2];
      var varName = '--fg-' + name;
      var val = opacity
        ? 'color-mix(in srgb, var(' + varName + ') ' + opacity + '%, transparent)'
        : 'color-mix(in srgb, var(' + varName + ') var(--un-text-opacity, 100%), transparent)';
      return { 'color': val };
    }
  ],
  [
    /^border-([trblxy]-)?(default|subtle|strong|hover|focus|disabled|glassBorder)(?:\\/(\\d+))?$/,
    function(m) {
      var dir = m[1] || '';
      var name = m[2];
      var opacity = m[3];
      var props = borderDirectionMap[dir] || ['border-color'];
      var varName = name === 'glassBorder' ? '--glass-border' : '--border-' + name;
      var val = opacity
        ? 'color-mix(in srgb, var(' + varName + ') ' + opacity + '%, transparent)'
        : 'color-mix(in srgb, var(' + varName + ') var(--un-border-opacity, 100%), transparent)';
      var res = {};
      for (var i = 0; i < props.length; i++) {
        res[props[i]] = val;
      }
      return res;
    }
  ]
]);
`;

console.log('Assembling Preset-Wind4 + Config + Core Runtime...');
const finalBundle = [
  '// @nofinite/nuicss CDN Bundle - UnoCSS Preset-Wind4 + NuiCSS Base + Runtime',
  presetWind4Code,
  cdnConfigScript,
  coreRuntimeCode,
].join('\n');

fs.writeFileSync('dist/index.global.js', finalBundle, 'utf8');
console.log(
  'Built dist/index.global.js successfully! (' +
    Buffer.byteLength(finalBundle, 'utf8') +
    ' bytes)'
);
