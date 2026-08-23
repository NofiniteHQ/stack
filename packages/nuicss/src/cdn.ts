import { nuicssPreset } from './plugin/preset.ts';

const config = nuicssPreset();

window.__unocss = window.__unocss || {};
window.__unocss.theme = { ...(window.__unocss.theme || {}), ...config.theme };
window.__unocss.shortcuts = { ...(window.__unocss.shortcuts || {}), ...config.shortcuts };
// Note: We don't need to specify the presets because uno.global.js will automatically apply presetUno.
// Actually, uno.global.js applies presetUno by default. Our preset uses presetUno and presetWind.
// presetWind is a superset of presetUno. If uno.global.js only has presetUno, we might miss wind features.
