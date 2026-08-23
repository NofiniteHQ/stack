# -*- coding: utf-8 -*-
with open("packages/nuicss/README.md", "r", encoding="utf-8") as f:
    t = f.read()

# Nuicss README fixes
t = t.replace(
    "Import the core styles and generated utilities into your application's root entry file (e.g., `main.tsx` or `App.tsx`):\n\n```tsx\n// main.tsx\nimport '@nofinite/nuicss/styles.css'; // Core variables and reset\nimport '@nofinite/nuicss/virtual.css'; // Auto-generated utility classes\nimport React from 'react';",
    "Import the CSS engine into your application's root entry file (e.g., `main.tsx` or `App.tsx`):\n\n```tsx\n// main.tsx\nimport '@nofinite/nuicss/styles.css';\nimport React from 'react';"
)

with open("packages/nuicss/README.md", "w", encoding="utf-8") as f:
    f.write(t)

with open("packages/nui/README.md", "r", encoding="utf-8") as f:
    n = f.read()

# Nui README fixes
n = n.replace(
    "import '@nofinite/nuicss/styles.css';\nimport '@nofinite/nuicss/virtual.css';",
    "import '@nofinite/nuicss/styles.css';"
)

with open("packages/nui/README.md", "w", encoding="utf-8") as f:
    f.write(n)
