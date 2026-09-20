const fs = require('fs');
const path = require('path');
const { createGenerator } = require('unocss');
const {
  nuicssPreset,
  rawShortcuts,
  primitiveShortcuts,
  formShortcuts,
  overlayShortcuts,
  widgetShortcuts,
  mediaShortcuts,
} = require('./dist/index.js');

async function build() {
  console.log('Generating browser config and static stylesheets...');
  const config = nuicssPreset();

  // Read the compiled base CSS (Reset + Design Tokens)
  const baseCss = fs.readFileSync('dist/index.css', 'utf8');

  const { transform } = require('lightningcss');
  function minifyCss(filename, cssContent) {
    try {
      const { code } = transform({
        filename,
        code: Buffer.from(cssContent),
        minify: true,
      });
      return code.toString();
    } catch (err) {
      console.warn(
        `[lightningcss] Minification warning for ${filename}:`,
        err.message
      );
      return cssContent;
    }
  }

  // ========================================================
  // 1. Generate Static Superclass CSS Bundles
  // ========================================================
  const uno = await createGenerator(config);

  async function generateShortcutBundle(name, shortcuts) {
    if (!Array.isArray(shortcuts)) return;
    const tokens = shortcuts
      .map(([k]) => (typeof k === 'string' ? `${k} nui-${k}` : ''))
      .join(' ');
    const { css } = await uno.generate(tokens);
    const layeredCss = `@layer components {\n${css}\n}`;
    fs.writeFileSync(`dist/${name}.css`, layeredCss, 'utf8');
    const minCss = minifyCss(`${name}.min.css`, layeredCss);
    fs.writeFileSync(`dist/${name}.min.css`, minCss, 'utf8');
    console.log(
      `Generated dist/${name}.css (${Buffer.byteLength(
        layeredCss,
        'utf8'
      )} bytes, minified: ${Buffer.byteLength(minCss, 'utf8')} bytes)`
    );
    return layeredCss;
  }

  // 1a. All Components (components.css & components.min.css)
  const layeredAllCss = await generateShortcutBundle(
    'components',
    rawShortcuts
  );

  // 1b. Standalone All-In-One styles.css & styles.min.css (Base + Components)
  if (layeredAllCss) {
    const combinedStyles = `@layer base, components, utilities;\n\n${baseCss}\n\n${layeredAllCss}`;
    fs.writeFileSync('dist/styles.css', combinedStyles, 'utf8');
    const minStyles = minifyCss('styles.min.css', combinedStyles);
    fs.writeFileSync('dist/styles.min.css', minStyles, 'utf8');
    console.log(
      `Generated dist/styles.css (${Buffer.byteLength(
        combinedStyles,
        'utf8'
      )} bytes, minified: ${Buffer.byteLength(minStyles, 'utf8')} bytes)`
    );
  }

  // 1c. Primitives Only (primitives.css & primitives.min.css)
  await generateShortcutBundle('primitives', primitiveShortcuts);

  // 1d. Forms Only (forms.css & forms.min.css)
  await generateShortcutBundle('forms', formShortcuts);

  // 1e. Overlays Only (overlays.css & overlays.min.css)
  await generateShortcutBundle('overlays', overlayShortcuts);

  // 1f. Widgets Only (widgets.css & widgets.min.css)
  await generateShortcutBundle('widgets', widgetShortcuts);

  // 1g. Media Only (media.css & media.min.css)
  await generateShortcutBundle('media', mediaShortcuts);

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

// Ingest user-defined configurations (supporting both window.nuicss and window.tailwind drop-in)
var rawUserConfig = (typeof window !== 'undefined')
  ? ((window.nuicss && (window.nuicss.config || window.nuicss)) ||
     (window.tailwind && (window.tailwind.config || window.tailwind)) || {})
  : {};

var userTheme = rawUserConfig.theme || {};
var userExtend = userTheme.extend || {};

// Configure Engine with Preset Wind4 & NuiCSS Rules
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

var defaultTheme = ${JSON.stringify(config.theme)};
var mergedColors = Object.assign({}, defaultTheme.colors || {}, userTheme.colors || {}, userExtend.colors || {});
var mergedFontFamily = Object.assign({}, defaultTheme.fontFamily || {}, userTheme.fontFamily || {}, userExtend.fontFamily || {});

window.__unocss.presets = [windPreset];
window.__unocss.theme = Object.assign({}, defaultTheme, userTheme);
window.__unocss.theme.colors = mergedColors;
window.__unocss.theme.fontFamily = mergedFontFamily;

for (var extKey in userExtend) {
  if (extKey !== 'colors' && extKey !== 'fontFamily') {
    window.__unocss.theme[extKey] = Object.assign({}, window.__unocss.theme[extKey] || {}, userExtend[extKey]);
  }
}

var baseShortcuts = ${JSON.stringify(config.shortcuts)};
var userShortcuts = rawUserConfig.shortcuts || [];
window.__unocss.shortcuts = Array.isArray(baseShortcuts)
  ? (window.__unocss.shortcuts || []).concat(baseShortcuts).concat(userShortcuts)
  : Object.assign(window.__unocss.shortcuts || {}, baseShortcuts);

window.__unocss.rules = (window.__unocss.rules || []).concat([
  [
    /^bg-(page|canvas|surface|surface-raised|surface-overlay|subtle|muted|accent|overlay|glass|inset|card|selected|selected-hover)(?:\\/(\\d+))?$/,
    function(m) {
      var name = m[1];
      var opacity = m[2];
      var varName = name === 'glass' ? '--glass-bg' : (name === 'accent' ? '--bg-accent' : '--bg-' + name);
      var val = opacity
        ? 'color-mix(in oklch, var(' + varName + ') ' + opacity + '%, transparent)'
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
        ? 'color-mix(in oklch, var(' + varName + ') ' + opacity + '%, transparent)'
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
        ? 'color-mix(in oklch, var(' + varName + ') ' + opacity + '%, transparent)'
        : 'var(' + varName + ')';
      var res = {};
      for (var i = 0; i < props.length; i++) {
        res[props[i]] = val;
      }
      return res;
    }
  ],
  [
    /^text-fluid-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|hero)$/,
    function(m) {
      return { 'font-size': 'var(--text-fluid-' + m[1] + ')' };
    }
  ],
  [
    /^p-fluid-(xs|sm|md|lg|xl)$/,
    function(m) {
      return { padding: 'var(--space-fluid-' + m[1] + ')' };
    }
  ],
  [
    /^px-fluid-(xs|sm|md|lg|xl)$/,
    function(m) {
      return {
        'padding-left': 'var(--space-fluid-' + m[1] + ')',
        'padding-right': 'var(--space-fluid-' + m[1] + ')'
      };
    }
  ],
  [
    /^py-fluid-(xs|sm|md|lg|xl)$/,
    function(m) {
      return {
        'padding-top': 'var(--space-fluid-' + m[1] + ')',
        'padding-bottom': 'var(--space-fluid-' + m[1] + ')'
      };
    }
  ],
  [
    /^gap-fluid-(xs|sm|md|lg|xl)$/,
    function(m) {
      return { gap: 'var(--space-fluid-' + m[1] + ')' };
    }
  ],
  [
    /^cq$/,
    function() {
      return { 'container-type': 'inline-size' };
    }
  ],
  [
    /^cq-normal$/,
    function() {
      return { 'container-type': 'normal' };
    }
  ],
  [
    /^ease-(spring|bounce|smooth|out-expo)$/,
    function(m) {
      return { 'transition-timing-function': 'var(--ease-' + m[1] + ')' };
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

// Expose window.nuicss as primary API & provide 100% Tailwind CDN drop-in compatibility
var nuicssPublicApi = {
  version: ${JSON.stringify(require('./package.json').version)},
  get config() {
    return window.__unocss;
  },
  set config(newConfig) {
    if (newConfig && typeof newConfig === 'object') {
      if (newConfig.theme) {
        if (newConfig.theme.extend) {
          for (var k in newConfig.theme.extend) {
            window.__unocss.theme[k] = Object.assign(window.__unocss.theme[k] || {}, newConfig.theme.extend[k]);
          }
        }
        for (var tk in newConfig.theme) {
          if (tk !== 'extend') {
            window.__unocss.theme[tk] = Object.assign(window.__unocss.theme[tk] || {}, newConfig.theme[tk]);
          }
        }
      }
      if (window.__unocss_runtime && typeof window.__unocss_runtime.extract === 'function') {
        window.__unocss_runtime.extract();
      }
    }
  },
  get theme() {
    return window.__unocss.theme;
  },
  refresh: function() {
    if (window.__unocss_runtime && typeof window.__unocss_runtime.extract === 'function') {
      window.__unocss_runtime.extract();
    }
  }
};

window.nuicss = Object.assign(window.nuicss || {}, nuicssPublicApi);

// 100% Tailwind Drop-In Compatibility
try {
  if (!window.tailwind) {
    window.tailwind = window.nuicss;
  } else {
    Object.defineProperty(window.tailwind, 'config', {
      get: function() { return window.__unocss; },
      set: function(val) { window.nuicss.config = val; },
      configurable: true
    });
    window.tailwind.refresh = window.nuicss.refresh;
  }
} catch (e) {
  window.tailwind = window.nuicss;
}
`;

  console.log('Assembling Preset-Wind4 + Config + Core Runtime...');
  const shieldedCoreRuntime = coreRuntimeCode.replace(
    /data-unocss-runtime-layer/g,
    'data-nuicss-layer'
  );

  const finalBundle = [
    '// @nofinite/nuicss CDN Bundle - NuiCSS Base + Tailwind Compatible Runtime Engine',
    presetWind4Code,
    cdnConfigScript,
    shieldedCoreRuntime,
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
