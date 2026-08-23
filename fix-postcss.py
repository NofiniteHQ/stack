# -*- coding: utf-8 -*-
with open("packages/nuicss/README.md", "r", encoding="utf-8") as f:
    t = f.read()

t = t.replace(
    "Include the `@unocss` directive in your main CSS file:\n\n```css\n/* index.css */\n@unocss;\n```",
    "Import the CSS engine in your main CSS file:\n\n```css\n/* index.css */\n@import '@nofinite/nuicss/styles.css';\n```"
)

with open("packages/nuicss/README.md", "w", encoding="utf-8") as f:
    f.write(t)
