# Implementation Plan: Phased NUICSS CLI Re-Architecture & Nofinite Decoupling

## 1. Objective

1. **Phase 1:** Decouple `nofinite` CLI completely from the `stack` monorepo into an independent repository at `d:\nofinite-cli`, and remove `packages/cli` from `d:\stack`.
2. **Phase 2:** Purge legacy Go files (`cmd/`, `pkg/`, `go.mod`, `go.sum`) from `packages/nuicss-cli` and configure unified TypeScript package dependencies.
3. **Phase 3:** Implement the brand-shielded TypeScript CLI engine in `packages/nuicss-cli/src/` using UnoCSS under the hood with **strict zero-leakage branding** (all banners, logs, messages, and config references branded 100% as NUICSS).
4. **Phase 4:** Setup Bun standalone cross-compilation (`build.ps1`), verify zero-Node native executables (Windows, Linux, macOS), and verify `npm pack`.

_Execution Rule: Work is strictly executed one phase at a time. After completing each phase, work stops and waits for the user to say "next" before proceeding._

---

## 2. Zero-Leakage Branding Contract

The user has explicitly mandated that **under no circumstances should the UnoCSS name leak to the user**:

- **Banners & Startup:** Must print `NUICSS CLI v0.2.0`, never `UnoCSS v66...`.
- **Watch Logs:** Must print `[NUICSS] Watching for changes...` and `[NUICSS] ⚡ Rebuilt dist/output.css`, intercepting or overriding any default UnoCSS console outputs.
- **Config Files:** Must load and generate `nuicss.config.ts` (or `nuicss.config.js`). Never prompt for `uno.config.ts`.
- **Directives & Stylesheets:** Must document and process `@nuicss;`, `@nuicss tokens;`, `@nuicss components;`, never mentioning internal UnoCSS presets.
- **Layers:** Emits `data-nuicss-layer` and `@layer base, components, utilities;`.

---

## 3. Phased Execution Roadmap

### Phase 1: Decouple & Carve Out `nofinite` CLI

- **Scope:**
  - Create directory `d:\nofinite-cli`.
  - Copy `d:\stack\packages\cli/` contents (excluding `node_modules` and `dist`) into `d:\nofinite-cli/`.
  - Initialize clean independent git repository in `d:\nofinite-cli`.
  - Verify `pnpm install` and `pnpm build` in `d:\nofinite-cli`.
  - Delete `packages/cli` from `d:\stack`.
  - Commit the decoupling in `d:\stack`.
- **Gate:** STOP and wait for user to say "next".

### Phase 2: Purge Legacy Go Code & Configure Package Dependencies

- **Scope:**
  - Remove `packages/nuicss-cli/cmd/`.
  - Remove `packages/nuicss-cli/pkg/`.
  - Remove `packages/nuicss-cli/go.mod` and `packages/nuicss-cli/go.sum`.
  - Update `packages/nuicss-cli/package.json` with TypeScript configuration and dependencies (`@unocss/cli`, `@unocss/core`, `@nofinite/nuicss`, `cac`, `jsonc-parser`, `colorette`).
  - Configure `tsconfig.json`.
- **Gate:** STOP and wait for user to say "next".

### Phase 3: Implement Brand-Shielded TypeScript Engine

- **Scope:**
  - `src/index.ts`: CLI entrypoint using `cac`.
  - `src/commands/compile.ts`: Runs `@unocss/cli` `build()` engine with `nuicssPreset()`, shielding all logger outputs to `[NUICSS]`.
  - `src/commands/init.ts`: Non-destructive `.vscode/settings.json` updater via `jsonc-parser`, generates `input.css` and `nuicss.config.ts`.
  - `src/commands/migrate.ts`: Direct call to `@nofinite/nuicss` codemod with backtick support.
  - `src/commands/check.ts`: Template linter checking design token compliance.
  - `src/commands/tokens.ts`: OKLCH palette viewer respecting `NO_COLOR`.
- **Gate:** STOP and wait for user to say "next".

### Phase 4: Bun Standalone Binary Matrix & Verification

- **Scope:**
  - Update `build.ps1` to compile cross-platform standalone binaries via `bun build --compile`.
  - Update `bin/nuicss.js` Node launcher wrapper.
  - Run comprehensive verification tests on standalone binary and `npm pack`.
  - Local git commit in `d:\stack`.
- **Gate:** Final report to user.
