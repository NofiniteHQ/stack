# @nofinite/nui

## 3.0.7

### Patch Changes

- df8dcd8: ### 🚀 Standalone "Zero-Config" CSS Architecture

  - **Independent Bundled CSS**: All component styles, animations, and semantic design tokens are now compiled into a standalone `@nofinite/nui/styles.css` file at build-time. End users no longer need to install or configure `@nofinite/nuicss` or UnoCSS in their application.
  - **Root Import Simplification**: Getting started only requires a single root import:
    ```tsx
    import '@nofinite/nui/styles.css';
    ```
  - **Framer Motion Type Alignment**: Resolved TypeScript typing conflicts between `HTMLMotionProps` and React HTML attributes across all interactive components (`Modal`, `Tabs`, `MegaMenu`, etc.).
  - **Direct Component Exports**: Flattened entrypoint exports directly in `index.ts` for cleaner module resolution and tree-shaking.

## 3.0.6

### Patch Changes

- 2a2a36d: refactor(nui): implement semantic design tokens and fix polymorphic asChild DOM leakage across all components

## 3.0.5

### Patch Changes

- 96fb026: fix: remove redundant AnimatePresence in TabsRoot to prevent framer-motion mode wait warnings

## 3.0.4

### Patch Changes

- 5ebc05e: fix: add .npmignore to prevent pnpm publish from ignoring dist folders

## 3.0.3

### Patch Changes

- 6fcf4a0: fix(build): ensure all 68 components are properly exported from the package entry point

## 3.0.2

### Patch Changes

- f7a2dfc: fix(build): correctly resolve Vite output directory for rollup

## 3.0.1

### Patch Changes

- 037d327: fix: explicitly externalize dependencies to prevent build crash and ensure dist is generated

## 2.0.3

### Patch Changes

- Fix: @nofinite/nui/styles.css import resolved

## 2.0.2

### Patch Changes

- Fix: css token resolved

## 2.0.0

### Major Changes

- Introduced a new design token system, added new components, enhanced existing ones, and shipped the global nui.\* API for dialogs and toasts.

## 1.1.2

### Patch Changes

- Fix: import css filename changed

## 1.1.1

### Patch Changes

- Fix: folder restructured

## 1.0.2

### Patch Changes

- fix: ensure build output is included in npm package

## 1.0.1

### Patch Changes

- fix: include dist files in npm package

## 1.0.0

### Major Changes

- Initial public release of the NUI.
