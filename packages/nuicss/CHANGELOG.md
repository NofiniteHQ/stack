# @nofinite/nuicss

## 3.0.5

### Patch Changes

- eb5c75c: fix: Nuicss PostCSS wrapper natively configures UnoCSS and fixes missing Typescript declarations.

## 3.0.4

### Patch Changes

- 8bbe3ff: fix(plugin): safely unwrap postcss default export for CJS environments

## 3.0.2

### Patch Changes

- fdb9185: fix(nuicss): remove CommonJS require statements from CDN build to support direct browser execution

## 3.0.1

### Patch Changes

- e1dbb0b: fix(nuicss): include index.global.js CDN script in nx build target

## 3.0.0

### Major Changes

- 7d77e5e: **NUI CSS 3.0.0 Architecture Rewrite:**
  - **UnoCSS Integration:** Transitioned to an UnoCSS-powered underlying engine, drastically improving compilation speed and leveraging standard utilities.
  - **Zero-Configuration:** Developers can now seamlessly import `@nofinite/nuicss/styles.css` without polluting their stack with virtual module imports.
  - **Semantic Tokens:** Built-in semantic design system variables (e.g. `bg-surface`, `text-muted`, `border-subtle`).
  - **Enhanced DX:** Fully compliant with existing open source configurations. Included Vitest suite for preset robustness.

## 2.0.1

### Patch Changes

- 89e6f95: fix(nuicss): run esbuild without npx for ci/cd compatibility
- d365a79: fix(nuicss): include `browser.js` CDN bundle in automated releases

## 2.0.0

### Major Changes

- 8eb980e: NuiCSS 2.0.0 Architecture Rewrite:
  - Replaced UnoCSS dependency with a highly optimized, fully native TypeScript Just-In-Time (JIT) Engine.
  - Added comprehensive native support for `@media` breakpoints and `@container` queries natively.
  - Full Vite integration plugin (`nuicssVitePlugin`) for seamless developer experience.
  - Resolved dependency topology cycles and deadlocks in the Nx build graph.
  - Overhauled and optimized modifier generation (e.g., `group-hover/name` and `peer-focus`).
