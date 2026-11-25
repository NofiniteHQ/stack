# @nofinite/markon

## 2.1.0

### Minor Changes

- a0021b4: Production readiness, cross-platform CLI packaging, SSR sanitization, and monorepo hardening release:

  - **`@nofinite/markon` (`2.1.0`):** Replaced Node `jsdom` dependency with a zero-dependency deterministic SSR HTML allowlist tokenizer/sanitizer (`sanitizeHtmlSsr`), externalized runtime dependencies (~95% smaller packed tarball with zero DOM emulators or `.map` bloat), and converted `@tiptap/*` extensions to named imports for clean CJS/ESM interop.
  - **`@nofinite/nuicss` (`3.3.0`) & `nuicss` (`0.2.0`):** Replaced Windows-only CLI build script with a cross-platform Node pipeline (`build-cli.mjs`), established `nuicss` as the sole `npx nuicss` binary owner (migrated out of `@nofinite/nuicss`), ensured test-free CLI tarballs, preserved clean `flags.css` source state during builds, and added npm provenance metadata.
  - **`@nofinite/nui` (`3.3.0`), `@nofinite/charts` (`1.1.0`), `@nofinite/kanban` (`1.1.0`), & `@nofinite/media` (`1.1.0`):** Enforced strict TypeScript & Nx module boundaries, isolated declaration `out-tsc/lib` builds, removed legacy duplicate `floating-arrow`, and added npm provenance metadata.
  - **`@nofinite/locale` (`2.1.0`):** Added full zero-dependency internationalization toolkit (`LocaleProvider`, `useLocale`, `useTranslation` at `@nofinite/locale/react`, BCP 47 parsing/directionality at `/bcp47`, native `Intl` formatters at `/format`, and translator engine at `/i18n`).
  - **`@nofinite/utils` (`2.1.0`):** Added client-safe `@nofinite/utils/browser` & `"browser"` export condition (excluding native `argon2`), dedicated `@nofinite/utils/server` barrel, and tree-shakeable utility subpaths (`cn`, `dom`, `math`, `date`, `async`, `array`, `object`, `string`, `validation`).

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
