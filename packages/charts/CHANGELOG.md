# @nofinite/charts

## 1.1.0

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

## 1.0.0

### Major Changes

- Initial public release of Nofinite Charts:
  - Universal vector data visualization suite powered by fine-grained D3 math algorithms (`d3-shape`, `d3-scale`, `d3-array`).
  - Native SVG path rendering with `curveMonotoneX` smoothing and 0ms CSS dark mode reactivity via `@nofinite/nuicss` tokens.
  - Framework-agnostic DOM class (`Chart`) and React adapters (`AreaChart`, `LineChart`, `BarChart`, `PieChart`, `DonutChart`, `ScatterChart`, `Sparkline`).
  - Frosted glassmorphic tooltip card popovers (`bg-surface/80`, `backdrop-blur-xl`, `saturate-150`, boundary guards preventing clipped headers).
  - Zero-overflow legend layout with adaptive plot height calculation (`plotHeight = height - 38`).
  - Adaptive horizontal bar left margins scaling dynamically up to 35% of chart width with label ellipsis truncation and tooltip titles.
  - Fully accessible data table fallback mode and WCAG 2.1 AA keyboard navigation.
