---
'@nofinite/nui': patch
'@nofinite/markon': patch
'@nofinite/charts': patch
'@nofinite/nuicss': patch
'@nofinite/utils': patch
---

### Dependency Upgrades & Engine Maintenance

- **`@nofinite/nui`:**

  - Upgraded `framer-motion` to `13.4.0` (Motion v13 architecture with optimized animation pipeline).
  - Upgraded `lucide-react` to `1.47.0` (Lucide v1.x standard release).
  - Upgraded `react-hook-form` to `7.88.0` and `tailwind-merge` to `3.7.0`.
  - Removed obsolete Vidstack and KaTeX bundle extraction hooks from Vite configuration.

- **`@nofinite/markon`:**

  - Removed unused `lucide-react` runtime dependency to reduce package size.
  - Upgraded `tailwind-merge` to `3.7.0`.

- **`@nofinite/charts`:**

  - Upgraded `@types/d3-shape` to `3.2.0`.

- **`@nofinite/nuicss`:**

  - Upgraded `valibot` to `1.5.0` and `postcss` to `8.5.28`.
  - Removed unused `esbuild` development dependency.

- **`@nofinite/utils`:**
  - Upgraded `jose` to `6.2.12`, `argon2` to `0.45.1`, `uuid` to `14.0.2`, and `zeptomail` to `8.0.1`.
