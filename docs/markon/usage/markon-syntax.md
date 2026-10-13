# Markdown Syntax & Formatting Features

Deep-dive into formatting capabilities, the 16 codeblock languages, and the typography selector in **Nofinite Markon**.

---

## 1. Floating Contextual Bubble Menu

Highlighting text inside `MarkonEditor` reveals a floating formatting pill:

- **Bold (`Ctrl+B`):** Toggles strong emphasis.
- **Italic (`Ctrl+I`):** Toggles italic emphasis.
- **Strikethrough (`Ctrl+Shift+X`):** Toggles strikethrough text.
- **Inline Code (`Ctrl+E`):** Formats selection as an inline monospace code snippet.
- **Link (`Ctrl+K`):** Opens link input popup.

---

## 2. 16 Standardized Codeblock Languages

When adding or editing a code block, Markon offers an accessible dropdown categorized into 3 clean groups:

```
Web & Core:
  - TypeScript (ts)
  - JavaScript (js)
  - HTML (html)
  - CSS (css)
  - JSON (json)
  - Markdown (md)

Systems & Backend:
  - Python (py)
  - Go (go)
  - Rust (rs)
  - Java (java)
  - C++ (cpp)
  - C# (cs)

Data & Ops:
  - SQL (sql)
  - Bash / Shell (sh, bash)
  - YAML (yaml, yml)
  - Dockerfile (dockerfile)
```

Each language automatically receives syntax highlighting powered by `lowlight` and NUICSS syntax tokens.

---

## 3. Symmetrical Typography Selector

The heading dropdown is replaced with an elegant, symmetrical icon-only button:

- Clicking the button opens a clean popup menu with options:
  - **Normal Text** (`Paragraph`)
  - **Heading 1** (`Ctrl+Alt+1`)
  - **Heading 2** (`Ctrl+Alt+2`)
  - **Heading 3** (`Ctrl+Alt+3`)
  - **Heading 4** (`Ctrl+Alt+4`)
  - **Heading 5** (`Ctrl+Alt+5`)
  - **Heading 6** (`Ctrl+Alt+6`)
- Pressing `Escape` closes the selector smoothly.

---

## 4. Tables & Task Lists

- **Task Lists:** Use `- [ ] Task 1` and `- [x] Task 2` to render interactive checkboxes in the canvas.
- **Tables:** Full support for GitHub-flavored markdown tables with row/column insertion and alignment controls.
