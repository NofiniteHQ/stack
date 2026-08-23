const fs = require('fs');
let text = fs.readFileSync('packages/nuicss/README.md', 'utf8');

// The weird characters are probably the Unicode replacement character or just a mangled byte sequence.
// Let's replace any character that is not ASCII with a standard dash.
text = text.replace(/\?"/g, "—");
text = text.replace(//g, "");

// Overview
text = text.replace("NUI CSS provides a highly optimized **Just-In-Time (JIT) compiler**. By reading your source files, it compiles exactly the CSS you need—and absolutely nothing more—in milliseconds.", "NUI CSS provides a highly optimized **Just-In-Time (JIT) compiler**. By reading your source files, it compiles exactly the CSS you need—and absolutely nothing more—in milliseconds.");

// CDN
text = text.replace(/<script src="https:\/\/unpkg.com\/@nofinite\/nuicss\/dist\/browser.js"><\/script>/, `<!-- 1. The Nuicss variables and reset -->\n<link rel="stylesheet" href="https://unpkg.com/@nofinite/nuicss@latest/dist/index.css" />\n\n<!-- 2. The Nuicss JIT Runtime Engine -->\n<script src="https://unpkg.com/@nofinite/nuicss@latest/dist/index.global.js"></script>`);

// Vite
const viteOld = `import '@nofinite/nuicss/virtual.css';
import React from 'react';`;
const viteNew = `import '@nofinite/nuicss/styles.css'; // Core variables and reset
import '@nofinite/nuicss/virtual.css'; // Auto-generated utility classes
import React from 'react';`;
text = text.replace(viteOld, viteNew);

// Postcss
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
text = text.replace(postcssOld, postcssNew);

const postcssCssOld = `/* index.css */
@nuicss base;
@nuicss utilities;`;
const postcssCssNew = `/* index.css */
@unocss;`;
text = text.replace(postcssCssOld, postcssCssNew);


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
  theme: {
    colors: {
      primary: '#ff0055'
    }
  },
  content: {
    pipeline: {
      include: ['./src/**/*.{tsx,jsx,html}']
    }
  }
});`;
text = text.replace(configOld, configNew);

// Remove "v2"
text = text.replace("NUI CSS v2 comes with helper utilities", "NUI CSS comes with helper utilities");

fs.writeFileSync('packages/nuicss/README.md', text, 'utf8');

// NUI README
let nui = fs.readFileSync('packages/nui/README.md', 'utf8');
nui = nui.replace("?\"", "—");
nui = nui.replace(//g, "");
nui = nui.replace("complex details?""like focus management and accessibility?""so", "complex details—like focus management and accessibility—so");
nui = nui.replace("complex details—like focus management and accessibility—so", "complex details—like focus management and accessibility—so");

nui = nui.replace(/```bash\n# pnpm\npnpm add @nofinite\/nui\n\n# npm\nnpm install @nofinite\/nui\n\n# yarn\nyarn add @nofinite\/nui\n```/, `NUI relies on our utility CSS engine \`@nofinite/nuicss\`. You must install both packages.

\`\`\`bash
# pnpm
pnpm add @nofinite/nui @nofinite/nuicss

# npm
npm install @nofinite/nui @nofinite/nuicss
\`\`\`

Once installed, simply wrap your application in the \`<NUIProvider>\`:

\`\`\`tsx
import { NUIProvider } from '@nofinite/nui';
import '@nofinite/nuicss/styles.css';
import '@nofinite/nuicss/virtual.css';

function App({ children }) {
  return (
    <NUIProvider>
      {children}
    </NUIProvider>
  );
}
\`\`\``);
fs.writeFileSync('packages/nui/README.md', nui, 'utf8');

