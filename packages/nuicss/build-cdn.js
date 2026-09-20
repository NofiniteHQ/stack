const fs = require('fs');
const path = require('path');
const { createGenerator } = require('unocss');
const {
  nuicssPreset,
  rawShortcuts,
  primitiveShortcuts,
  formShortcuts,
} = require('./dist/index.js');

async function build() {
  console.log('Generating browser config and static stylesheets...');
  const config = nuicssPreset();

  // Read the compiled base CSS (Reset + Design Tokens)
  const baseCss = fs.readFileSync('dist/index.css', 'utf8');

  // ========================================================
  // 1. Generate Static Superclass CSS Bundles
  // ========================================================
  const uno = await createGenerator(config);

  // 1a. All Components (components.css)
  if (Array.isArray(rawShortcuts)) {
    const allTokens = rawShortcuts
      .map(([k]) => (typeof k === 'string' ? `${k} nui-${k}` : ''))
      .join(' ');
    const { css: allCss } = await uno.generate(allTokens);
    const layeredAllCss = `@layer components {\n${allCss}\n}`;
    fs.writeFileSync('dist/components.css', layeredAllCss, 'utf8');
    console.log(
      `Generated dist/components.css (${Buffer.byteLength(
        layeredAllCss,
        'utf8'
      )} bytes)`
    );

    // 1b. Standalone All-In-One styles.css (Base + Components)
    const combinedStyles = `@layer base, components, utilities;\n\n${baseCss}\n\n${layeredAllCss}`;
    fs.writeFileSync('dist/styles.css', combinedStyles, 'utf8');
    console.log(
      `Generated dist/styles.css (${Buffer.byteLength(
        combinedStyles,
        'utf8'
      )} bytes)`
    );
  }

  // 1c. Primitives Only (primitives.css)
  if (Array.isArray(primitiveShortcuts)) {
    const primitiveTokens = primitiveShortcuts
      .map(([k]) => (typeof k === 'string' ? `${k} nui-${k}` : ''))
      .join(' ');
    const { css: primCss } = await uno.generate(primitiveTokens);
    const layeredPrimCss = `@layer components {\n${primCss}\n}`;
    fs.writeFileSync('dist/primitives.css', layeredPrimCss, 'utf8');
    console.log(
      `Generated dist/primitives.css (${Buffer.byteLength(
        layeredPrimCss,
        'utf8'
      )} bytes)`
    );
  }

  // 1d. Forms Only (forms.css)
  if (Array.isArray(formShortcuts)) {
    const formTokens = formShortcuts
      .map(([k]) => (typeof k === 'string' ? `${k} nui-${k}` : ''))
      .join(' ');
    const { css: fCss } = await uno.generate(formTokens);
    const layeredFormsCss = `@layer components {\n${fCss}\n}`;
    fs.writeFileSync('dist/forms.css', layeredFormsCss, 'utf8');
    console.log(
      `Generated dist/forms.css (${Buffer.byteLength(
        layeredFormsCss,
        'utf8'
      )} bytes)`
    );
  }

  // ========================================================
  // 2. Generate One-Link Browser Runtime (dist/index.global.js)
  // ========================================================
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
window.__nuicss = window.__nuicss || window.__unocss || {};
window.__unocss = window.__nuicss;

var windPreset = (window.__unocss_runtime && window.__unocss_runtime.presets && window.__unocss_runtime.presets.presetWind4)
  ? window.__unocss_runtime.presets.presetWind4()
  : {};

var protectedShortcutPrefixes = [
  'empty-state',
  'link-muted',
  'link-hover',
  'hover-card',
  'link-preview',
  'file-list',
  'file-item',
];

if (windPreset && windPreset.variants) {
  for (var i = 0; i < windPreset.variants.length; i++) {
    var v = windPreset.variants[i];
    if (v && v.name === 'pseudo') {
      var origMatch = v.match;
      v.match = (function(orig) {
        return function(matcher, ctx) {
          for (var p = 0; p < protectedShortcutPrefixes.length; p++) {
            if (matcher.startsWith(protectedShortcutPrefixes[p])) return undefined;
          }
          return orig(matcher, ctx);
        };
      })(origMatch);
    }
  }
}

window.__unocss.presets = [windPreset];
window.__unocss.theme = Object.assign(window.__unocss.theme || {}, ${JSON.stringify(
    config.theme
  )});
window.__unocss.shortcuts = Array.isArray(${JSON.stringify(config.shortcuts)})
  ? (window.__unocss.shortcuts || []).concat(${JSON.stringify(
    config.shortcuts
  )})
  : Object.assign(window.__unocss.shortcuts || {}, ${JSON.stringify(
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
        : 'var(' + varName + ')';
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
        : 'var(' + varName + ')';
      return { 'color': val };
    }
  ],
  [
    /^border-([trblxy]-)?(default|subtle|strong|hover|focus|disabled|glass|glassBorder)(?:\\/(\\d+))?$/,
    function(m) {
      var dir = m[1] || '';
      var name = m[2];
      var opacity = m[3];
      var props = borderDirectionMap[dir] || ['border-color'];
      var varName = (name === 'glass' || name === 'glassBorder') ? '--glass-border' : '--border-' + name;
      var val = opacity
        ? 'color-mix(in srgb, var(' + varName + ') ' + opacity + '%, transparent)'
        : 'var(' + varName + ')';
      var res = {};
      for (var i = 0; i < props.length; i++) {
        res[props[i]] = val;
      }
      return res;
    }
  ],
  [
    /^fill-(muted|default|subtle|accent|primary|danger|success|warning|info)$/,
    function(m) {
      var name = m[1];
      var varName = (name === 'muted' || name === 'default' || name === 'subtle')
        ? '--fg-' + name
        : '--color-' + name;
      return { fill: 'var(' + varName + ')' };
    }
  ],
  [
    /^stroke-(default|subtle|strong|muted)$/,
    function(m) {
      var name = m[1];
      var varName = name === 'muted' ? '--fg-muted' : '--border-' + name;
      return { stroke: 'var(' + varName + ')' };
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
}

build().catch((err) => {
  console.error('Build CDN failed:', err);
  process.exit(1);
});
