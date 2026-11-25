# @nofinite/utils

## 2.1.0

### Minor Changes

- a0021b4: Production readiness, cross-platform CLI packaging, SSR sanitization, and monorepo hardening release:

  - **`@nofinite/markon` (`2.1.0`):** Replaced Node `jsdom` dependency with a zero-dependency deterministic SSR HTML allowlist tokenizer/sanitizer (`sanitizeHtmlSsr`), externalized runtime dependencies (~95% smaller packed tarball with zero DOM emulators or `.map` bloat), and converted `@tiptap/*` extensions to named imports for clean CJS/ESM interop.
  - **`@nofinite/nuicss` (`3.3.0`) & `nuicss` (`0.2.0`):** Replaced Windows-only CLI build script with a cross-platform Node pipeline (`build-cli.mjs`), established `nuicss` as the sole `npx nuicss` binary owner (migrated out of `@nofinite/nuicss`), ensured test-free CLI tarballs, preserved clean `flags.css` source state during builds, and added npm provenance metadata.
  - **`@nofinite/nui` (`3.3.0`), `@nofinite/charts` (`1.1.0`), `@nofinite/kanban` (`1.1.0`), & `@nofinite/media` (`1.1.0`):** Enforced strict TypeScript & Nx module boundaries, isolated declaration `out-tsc/lib` builds, removed legacy duplicate `floating-arrow`, and added npm provenance metadata.
  - **`@nofinite/locale` (`2.1.0`):** Added full zero-dependency internationalization toolkit (`LocaleProvider`, `useLocale`, `useTranslation` at `@nofinite/locale/react`, BCP 47 parsing/directionality at `/bcp47`, native `Intl` formatters at `/format`, and translator engine at `/i18n`).
  - **`@nofinite/utils` (`2.1.0`):** Added client-safe `@nofinite/utils/browser` & `"browser"` export condition (excluding native `argon2`), dedicated `@nofinite/utils/server` barrel, and tree-shakeable utility subpaths (`cn`, `dom`, `math`, `date`, `async`, `array`, `object`, `string`, `validation`).

## 2.0.1

### Patch Changes

- 68a0ae0: ### Dependency Upgrades & Engine Maintenance

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

## 2.0.0

### Major Changes

- 8eb980e: NuiCSS 2.0.0 Architecture Rewrite:
  - Replaced UnoCSS dependency with a highly optimized, fully native TypeScript Just-In-Time (JIT) Engine.
  - Added comprehensive native support for `@media` breakpoints and `@container` queries natively.
  - Full Vite integration plugin (`nuicssVitePlugin`) for seamless developer experience.
  - Resolved dependency topology cycles and deadlocks in the Nx build graph.
  - Overhauled and optimized modifier generation (e.g., `group-hover/name` and `peer-focus`).

## 1.0.0

### Minor Changes

- Initial public release of the Nofinite Utils
