# @nofinite/markon

## 2.0.0

### Major Changes

- Major architectural rewrite and decoupling into standalone rich-text suite:
  - Universal block editor powered by TipTap 2, lowlight, and KaTeX math formulas.
  - Framework-agnostic DOM engine (`MarkonEditor`), React editor adapter (`@nofinite/markon/react`), and isomorphic publication renderer (`MarkonRender` / `renderMarkon`).
  - Standardized codeblock language selector to 16 categorized languages.
  - Symmetrical icon-only typography selector and contextual floating bubble menu.
  - Interactive table suite with drag-and-drop row/column manipulation.
  - Optimistic upload placeholders, IndexedDB local draft auto-save, and markdown round-trip parity.
  - Fully integrated with `@nofinite/nuicss` design tokens.
