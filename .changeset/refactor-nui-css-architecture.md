---
"@nofinite/nui": patch
---

### 🚀 Standalone "Zero-Config" CSS Architecture

- **Independent Bundled CSS**: All component styles, animations, and semantic design tokens are now compiled into a standalone `@nofinite/nui/styles.css` file at build-time. End users no longer need to install or configure `@nofinite/nuicss` or UnoCSS in their application.
- **Root Import Simplification**: Getting started only requires a single root import:
  ```tsx
  import '@nofinite/nui/styles.css';
  ```
- **Framer Motion Type Alignment**: Resolved TypeScript typing conflicts between `HTMLMotionProps` and React HTML attributes across all interactive components (`Modal`, `Tabs`, `MegaMenu`, etc.).
- **Direct Component Exports**: Flattened entrypoint exports directly in `index.ts` for cleaner module resolution and tree-shaking.
