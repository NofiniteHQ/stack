# @nofinite/markon

## 2.1.0

### Minor Changes

- a0021b4: Zero-dependency SSR sanitization, lean packaging, and CJS/ESM interop improvements:

  - Replaced Node `jsdom` dependency with a deterministic zero-dependency SSR HTML allowlist tokenizer/sanitizer (`sanitizeHtmlSsr`).
  - Externalized runtime dependencies (~95% smaller packed tarball with zero DOM emulators or `.map` bloat).
  - Converted `@tiptap/*` extensions to named imports for clean CJS/ESM interop and added npm provenance publishing metadata (`publishConfig.provenance`).

### Patch Changes

- Updated dependencies [a0021b4]
  - @nofinite/utils@2.1.0

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
