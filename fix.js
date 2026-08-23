const fs = require('fs');

let t = fs.readFileSync('packages/nuicss/README.md', 'utf8');

// Normalize line endings to \n so multiline replacements work
t = t.replace(/\r\n/g, '\n');

// The weird characters are actually the unicode replacement character ? or a mangled sequence.
// Wait, when I cat the file, it showed ?"
// Let's replace the EXACT sequences:
t = t.replace(/\?"/g, "—");
t = t.replace(//g, "—"); // fallback

// Fix title badge
t = t.replace(/# NUI CSS v2/, "# NUI CSS");

// Overview
t = t.replace(/NUI CSS v2 introduces a completely custom \*\*Just-In-Time \(JIT\) TypeScript Engine\*\*. By reading your source files at development time \(via Vite or PostCSS\) or directly in the browser via CDN, NUI CSS compiles exactly the CSS you need—and absolutely nothing more—in milliseconds\./, "NUI CSS provides a highly optimized **Just-In-Time (JIT) compiler**. By reading your source files, it compiles exactly the CSS you need—and absolutely nothing more—in milliseconds.");

// Vite
const viteOld = `// main.tsx
import '@nofinite/nuicss/virtual.css';
import React from 'react';`;
const viteNew = `// main.tsx
import '@nofinite/nuicss/styles.css'; // Core variables and reset
import '@nofinite/nuicss/virtual.css'; // Auto-generated utility classes
import React from 'react';`;
t = t.replace(viteOld, viteNew);

// PostCSS
const postcssOld = `// postcss.config.js
export default {
  plugins: {
    '@nofinite/nuicss/postcss': {}
  }
};`;
const postcssNew = `// postcss.config.js
import nuicssPostcss from '@nofinite/nuicss/postcss';

export default {
  plugins: [
    nuicssPostcss()
  ]
};`;
t = t.replace(postcssOld, postcssNew);

const cssOld = `/* index.css */
@nuicss base;
@nuicss utilities;`;
const cssNew = `/* index.css */
@unocss;`;
t = t.replace(cssOld, cssNew);

// Config
const configOld = `import type { NuicssConfig } from '@nofinite/nuicss';

export default {
  // 1. Scan specific files
  content: ['./src/**/*.{tsx,jsx,html}'],
  
  // 2. Override default theme tokens
  theme: {
    colorsBg: {
      surface: '#111111'
    }
  },

  // 3. Inject Custom RegEx Engine Rules
  rules: [
    {
      pattern: /^super-bold$/,
      generator: () => 'font-weight: 1000; letter-spacing: -2px;'
    }
  ]
} satisfies NuicssConfig;`;

const configNew = `import { defineConfig, nuicssPreset } from '@nofinite/nuicss';

export default defineConfig({
  presets: [
    nuicssPreset()
  ],
  // 1. Scan specific files
  content: {
    pipeline: {
      include: ['./src/**/*.{tsx,jsx,html}']
    }
  },
  // 2. Override default theme tokens
  theme: {
    colors: {
      primary: '#ff0055'
    }
  }
});`;
t = t.replace(configOld, configNew);

// Features removal / rewrite
// The user explicitly stated these are outdated:
// "Framework Agnostic: Pure CSS components with no JS dependencies. Build native HTML <dialog> modals and CSS scroll-snap carousels out-of-the-box."
// "Because NUI CSS generates standard CSS, you can build complex components relying on browser standards rather than framework logic:
// Modals: Use the HTML <dialog> tag + animate-zoom-in.
// Carousels: Use overflow-x-auto snap-x snap-mandatory wrappers."
// We should remove "Native Framework Agnostic Components" completely, and update the overview list to highlight the NEW v3 features like the Semantic Design Tokens and the UnoCSS engine features (since presetWind gives us Tailwind compat).

const overviewListOld = `* **Framework Agnostic:** Pure CSS components with no JS dependencies. Build native HTML \`<dialog>\` modals and CSS \`scroll-snap\` carousels out-of-the-box.
* **Zero-Config by Default:** Drop it into Vite, PostCSS, or a \`<script>\` tag and instantly start using utilities like \`.flex\`, \`.text-primary\`, and \`.p-4\`.
* **Arbitrary Values:** Instantly compile custom layouts using brackets: \`w-[343px]\`, \`grid-cols-[200px_1fr]\`, or \`bg-[#ff0055]\`.
* **Logic-Driven Variants:** Fully supports modern pseudo-classes and state logic (\`has-[:checked]\`, \`peer-focus\`, \`group-has-[.active]\`).
* **Micro-interactions:** Comprehensive \`scale-*\` (50 to 150) and \`delay-*\` stagger classes.
* **Built-in Keyframes:** Ships with modern animations: \`animate-zoom-in\`, \`animate-zoom-out\`, \`animate-slide-up\`, \`animate-slide-down\`.`;

const overviewListNew = `* **Semantic Tokens:** Built-in shortcuts for scalable UI design (\`.bg-surface\`, \`.text-muted\`, \`.border-subtle\`).
* **Zero-Config by Default:** Drop it into Vite, PostCSS, or a \`<script>\` tag and instantly start using standard utilities like \`.flex\`, \`.text-primary\`, and \`.p-4\`.
* **Arbitrary Values:** Compile custom layouts using brackets: \`w-[343px]\`, \`grid-cols-[200px_1fr]\`, or \`bg-[#ff0055]\`.
* **Logic-Driven Variants:** Fully supports modern pseudo-classes and state logic (\`has-[:checked]\`, \`peer-focus\`, \`group-has-[.active]\`).
* **Built-in Keyframes:** Ships with modern Nofinite animations: \`animate-zoom-in\`, \`animate-zoom-out\`, \`animate-slide-up\`, \`animate-slide-down\`.`;
t = t.replace(overviewListOld, overviewListNew);

// Remove Developer DX Feature: "Native Framework Agnostic Components"
const dxFeaturesOld = `### Native Framework Agnostic Components
Because NUI CSS generates standard CSS, you can build complex components relying on browser standards rather than framework logic:
- **Modals:** Use the HTML \`<dialog>\` tag + \`animate-zoom-in\`.
- **Carousels:** Use \`overflow-x-auto snap-x snap-mandatory\` wrappers.

### JS/TS Theme Resolver`;
const dxFeaturesNew = `### JS/TS Theme Resolver`;
t = t.replace(dxFeaturesOld, dxFeaturesNew);

fs.writeFileSync('packages/nuicss/README.md', t, 'utf8');
console.log('done nuicss');
