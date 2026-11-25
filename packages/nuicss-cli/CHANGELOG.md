# nuicss

## 0.2.0

### Minor Changes

- a0021b4: Sole `npx nuicss` binary ownership, cross-platform Node build pipeline, and test-free packaging:

  - Established `nuicss` as the sole `npx nuicss` binary owner (migrated out of `@nofinite/nuicss`).
  - Replaced Windows-only CLI build script with a cross-platform Node pipeline (`scripts/build-cli.mjs`) with embedded assets.
  - Excluded test files from published tarballs, hardened path containment, and added npm provenance publishing metadata (`publishConfig.provenance`).

### Patch Changes

- Updated dependencies [a0021b4]
  - @nofinite/nuicss@3.3.0

## 0.1.0

### Minor Changes

- Initial public release of NUICSS CLI:
  - Lightning-fast standalone compiler and toolkit for the NUICSS design system.
  - Automatic scanning of component superclasses and zero-runtime CSS generation powered by UnoCSS.
  - Watch mode with in-memory caching and sub-millisecond incremental rebuilds.
  - TypeScript configuration loader supporting `nuicss.config.ts`, `nuicss.config.js`, and `nuicss.config.json`.
  - Component scaffolder (`nuicss add <component>`) and design token linter (`nuicss check`).
  - Bundled embedded assets for VS Code HTML/CSS custom data autocompletion.
