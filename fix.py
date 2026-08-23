# -*- coding: utf-8 -*-
with open("packages/nuicss/README.md", "r", encoding="utf-8") as f:
    t = f.read()

# Fix "Nofinite animations"
t = t.replace("modern Nofinite animations:", "modern animations:")

# Fix the Vite wording
t = t.replace(
    "Import the virtual module into your application's root entry file (e.g., `main.tsx` or `App.tsx`):",
    "Import the core styles and generated utilities into your application's root entry file (e.g., `main.tsx` or `App.tsx`):"
)

# Fix the PostCSS wording
t = t.replace(
    "Include the `@nuicss` directives in your main CSS file:",
    "Include the `@unocss` directive in your main CSS file:"
)

with open("packages/nuicss/README.md", "w", encoding="utf-8") as f:
    f.write(t)

print("done")
