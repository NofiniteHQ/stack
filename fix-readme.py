import sys

with open("packages/nuicss/README.md", "r", encoding="utf-8", errors="ignore") as f:
    text = f.read()

text = text.replace("?\"and", "—and")
text = text.replace("more?\"in", "more—in")
text = text.replace("", "—")

text = text.replace("# NUI CSS v2", "# NUI CSS")

text = text.replace("NUI CSS v2 introduces a completely custom **Just-In-Time (JIT) TypeScript Engine**.", "NUI CSS provides a highly optimized **Just-In-Time (JIT) compiler**.")

cdn_old = """<script src="https://unpkg.com/@nofinite/nuicss/dist/browser.js"></script>"""
cdn_new = """<!-- 1. The Nuicss variables and reset -->\n<link rel="stylesheet" href="https://unpkg.com/@nofinite/nuicss@latest/dist/index.css" />\n\n<!-- 2. The Nuicss JIT Runtime Engine -->\n<script src="https://unpkg.com/@nofinite/nuicss@latest/dist/index.global.js"></script>"""
text = text.replace(cdn_old, cdn_new)

vite_old = """import '@nofinite/nuicss/virtual.css';
import React from 'react';"""
vite_new = """import '@nofinite/nuicss/styles.css'; // Core variables and reset
import '@nofinite/nuicss/virtual.css'; // Auto-generated utility classes
import React from 'react';"""
text = text.replace(vite_old, vite_new)

config_old = """import type { NuicssConfig } from '@nofinite/nuicss';

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
} satisfies NuicssConfig;"""

config_new = """import { defineConfig, nuicssPreset } from '@nofinite/nuicss';

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
});"""
text = text.replace(config_old, config_new)

text = text.replace("NUI CSS v2 comes with helper utilities", "NUI CSS comes with helper utilities")

with open("packages/nuicss/README.md", "w", encoding="utf-8") as f:
    f.write(text)
