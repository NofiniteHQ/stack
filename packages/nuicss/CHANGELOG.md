# @nofinite/nuicss

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
