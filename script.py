with open("packages/nuicss/README.md", "rb") as f:
    text = f.read()

# Only replace the specific corrupted instances
text = text.replace(b"?\"and", b"\xe2\x80\x94and")
text = text.replace(b"more?\"in", b"more\xe2\x80\x94in")

text = text.replace(
    b"NUI CSS v2 introduces a completely custom **Just-In-Time (JIT) TypeScript Engine**. By reading your source files at development time (via Vite or PostCSS) or directly in the browser via CDN, NUI CSS compiles exactly the CSS you need",
    b"NUI CSS provides a highly optimized **Just-In-Time (JIT) compiler**. By reading your source files, it compiles exactly the CSS you need"
)

text = text.replace(b"# NUI CSS v2", b"# NUI CSS")

text = text.replace(
    b"<script src=\"https://unpkg.com/@nofinite/nuicss/dist/browser.js\"></script>",
    b"<!-- 1. The Nuicss variables and reset -->\n<link rel=\"stylesheet\" href=\"https://unpkg.com/@nofinite/nuicss@latest/dist/index.css\" />\n\n<!-- 2. The Nuicss JIT Runtime Engine -->\n<script src=\"https://unpkg.com/@nofinite/nuicss@latest/dist/index.global.js\"></script>"
)

text = text.replace(
    b"import '@nofinite/nuicss/virtual.css';\nimport React from 'react';",
    b"import '@nofinite/nuicss/styles.css'; // Core variables and reset\nimport '@nofinite/nuicss/virtual.css'; // Auto-generated utility classes\nimport React from 'react';"
)

text = text.replace(
    b"export default {\n  plugins: {\n    '@nofinite/nuicss/postcss': {}\n  }\n};",
    b"import nuicssPostcss from '@nofinite/nuicss/postcss';\n\nexport default {\n  plugins: [\n    nuicssPostcss()\n  ]\n};"
)

text = text.replace(
    b"/* index.css */\n@nuicss base;\n@nuicss utilities;",
    b"/* index.css */\n@unocss;"
)

configOld = b"import type { NuicssConfig } from '@nofinite/nuicss';\n\nexport default {\n  // 1. Scan specific files\n  content: ['./src/**/*.{tsx,jsx,html}'],\n  \n  // 2. Override default theme tokens\n  theme: {\n    colorsBg: {\n      surface: '#111111'\n    }\n  },\n\n  // 3. Inject Custom RegEx Engine Rules\n  rules: [\n    {\n      pattern: /^super-bold$/,\n      generator: () => 'font-weight: 1000; letter-spacing: -2px;'\n    }\n  ]\n} satisfies NuicssConfig;"
configNew = b"import { defineConfig, nuicssPreset } from '@nofinite/nuicss';\n\nexport default defineConfig({\n  presets: [\n    nuicssPreset()\n  ],\n  theme: {\n    colors: {\n      primary: '#ff0055'\n    }\n  },\n  content: {\n    pipeline: {\n      include: ['./src/**/*.{tsx,jsx,html}']\n    }\n  }\n});"
text = text.replace(configOld, configNew)

text = text.replace(b"NUI CSS v2 comes with helper utilities", b"NUI CSS comes with helper utilities")

# Add acknowledgements
text += b"\n\n## Acknowledgements\n\nNUI CSS's underlying compilation engine is powered by the incredible [UnoCSS](https://github.com/unocss/unocss) ecosystem.\n"

with open("packages/nuicss/README.md", "wb") as f:
    f.write(text)

with open("packages/nui/README.md", "rb") as f:
    nui = f.read()

nui = nui.replace(b"complex details?\"like focus management and accessibility?\"so", b"complex details\xe2\x80\x94like focus management and accessibility\xe2\x80\x94so")

nuiOld = b"```bash\n# pnpm\npnpm add @nofinite/nui\n\n# npm\nnpm install @nofinite/nui\n\n# yarn\nyarn add @nofinite/nui\n```"
nuiNew = b"NUI relies on our utility CSS engine `@nofinite/nuicss`. You must install both packages.\n\n```bash\n# pnpm\npnpm add @nofinite/nui @nofinite/nuicss\n\n# npm\nnpm install @nofinite/nui @nofinite/nuicss\n```\n\nOnce installed, simply wrap your application in the `<NUIProvider>`:\n\n```tsx\nimport { NUIProvider } from '@nofinite/nui';\nimport '@nofinite/nuicss/styles.css';\nimport '@nofinite/nuicss/virtual.css';\n\nfunction App({ children }) {\n  return (\n    <NUIProvider>\n      {children}\n    </NUIProvider>\n  );\n}\n```"
nui = nui.replace(nuiOld, nuiNew)

with open("packages/nui/README.md", "wb") as f:
    f.write(nui)

print("success!")
