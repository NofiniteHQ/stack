const fs = require('fs');
const path = require('path');
const { nuicssPreset } = require('./dist/index.js');

console.log('Generating browser config...');
const config = nuicssPreset();

// Read the compiled CSS to inject it directly via JS (One-link CDN)
const baseCss = fs.readFileSync('dist/index.css', 'utf8');

const cdnConfigScript = `
// Inject Base CSS
(function() {
  const style = document.createElement('style');
  style.textContent = ${JSON.stringify(baseCss)};
  document.head.appendChild(style);
})();

// Inject UnoCSS Config
window.__unocss = window.__unocss || {};
window.__unocss.theme = Object.assign(window.__unocss.theme || {}, ${JSON.stringify(config.theme)});
window.__unocss.shortcuts = Object.assign(window.__unocss.shortcuts || {}, ${JSON.stringify(config.shortcuts)});
`;

console.log('Concatenating with UnoCSS runtime...');
let runtimePath;
try {
  runtimePath = path.join(path.dirname(require.resolve('@unocss/runtime')), '../uno.global.js');
} catch (e) {
  console.error("Could not find @unocss/runtime!");
  process.exit(1);
}
const runtime = fs.readFileSync(runtimePath, 'utf8');

fs.writeFileSync('dist/index.global.js', cdnConfigScript + '\n' + runtime, 'utf8');
console.log('Built dist/index.global.js successfully!');
