# Implementation Plan: Enterprise-Grade Remediation & Custom Watch Patterns for `nuicss-cli`

> Dedicated Plan File: `implementation_plan_nuicss_cli.md`  
> Package: `@nofinite/nuicss-cli` (`packages/nuicss-cli`)

---

## 1. Objective

Transform `@nofinite/nuicss-cli` into an enterprise-grade, battle-tested compiler, linter, and toolkit for the NUICSS design system. Remediate all 15 audit findings across P0 (functional corruption, stateful regex bug, launcher double invocation, missing error handling), P1 (watcher debouncing, in-memory caching, TypeScript config loading via `jiti`, production minification), and P2 (linter false positives, CLI routing, NPM tarball size optimization), while empowering users to configure **custom watch files and arbitrary file extensions** without restrictions.

---

## 2. Current Behavior vs Problem

1. **Stateful Regex `lastIndex` Bug (`compile.ts`):** `DIRECTIVE_REGEX` has a `/g` flag on a module-level variable. `DIRECTIVE_REGEX.test(inputCss)` mutates `lastIndex`, causing every alternate rebuild in watch mode to return `false`, outputting raw unexpanded `@nuicss;` directives into production stylesheets.
2. **Double Invocation (`bin/nuicss.js`):** `bin/nuicss.js` calls `import('../dist/index.js').then(m => m.runCli())`. Because `src/index.ts` also unconditionally runs `runCli()` on module load, running under Node executes the entire command twice concurrently.
3. **Silent Failure on Missing Input:** If `-i non-existent.css` is specified with a typo, `compile.ts` silently ignores the file, falls back to default `@nuicss;`, and exits with code `0`. Custom styles are lost in CI without error.
4. **Granular Directives Emit Zero CSS:** `@nuicss tokens;` and `@nuicss components;` emit empty comment blocks instead of extracting the design tokens or component superclasses from the base stylesheet.
5. **Dangerous Path Fallback in `migrate` & `check`:** If an explicit path is provided that does not exist, both commands silently fall back to scanning and modifying the entire current workspace directory.
6. **Hardcoded Watch Extensions & Inflexible Watching:** The watcher and template scanner only match a hardcoded set of 10 extensions (`.html`, `.tsx`, etc.). Custom templates (`.jinja`, `.liquid`, `.twig`, `.ejs`, `.erb`, `.hbs`, `.mdx`, `.vue`, `.templ`, etc.) or user-specified watch files cannot be watched.
7. **Watcher Event Dropping & Synchronous I/O:** Watching has no debouncing and no in-memory file cache; simultaneous file writes are dropped via `if (isRebuilding) return;`, and every rebuild re-reads every file synchronously from disk.
8. **Incomplete Minification:** `--minify` only minifies the generated utilities chunk, leaving the 190KB base stylesheet and custom CSS unminified.
9. **Node Fails to Load `nuicss.config.ts`:** Node throws `ERR_UNKNOWN_FILE_EXTENSION` when dynamically importing `.ts` config files, causing custom user configs to be silently ignored under Node.
10. **Linter False Positives & Narrow Rules:** `check` flags internal anchor links (`<a href="#bad">`) as hex colors and only checks for a single blue button pattern, missing all other 14 superclass patterns.
11. **NPM Package Bloat:** Publishing all 5 platform native binaries (~387 MB unpacked) directly inside the NPM package bloats `npm install` to 171.5 MB download over the wire.

---

## 3. Proposed Solution

### Phase 1: Core Compiler & Watcher Enterprise Hardening

- **Stateless Directive Expansion:** Eliminate `/g` from `DIRECTIVE_REGEX` or use a fresh regex instance per compilation to guarantee 100% deterministic expansion across all watch rebuilds.
- **Granular Layer Extraction:** Extract `@layer base` (tokens) and `@layer components` (superclasses) from `styles.css`. When `@nuicss tokens;` is used, emit tokens; when `@nuicss components;` is used, emit components; when `@nuicss utilities;` is used, emit generated utilities; when `@nuicss;` is used, emit the unified stylesheet.
- **Strict Input Path Validation:** Validate existence of `-i/--input`. If explicitly passed and missing on disk, throw a fatal error and exit with code `1`.
- **Full Production Minification:** When `--minify` is enabled, run CSS compression across the complete output stylesheet (tokens + base + components + utilities + user custom CSS).
- **Node Launcher Single-Run Contract:** Remove duplicate invocation in `bin/nuicss.js` and ensure `src/index.ts` only invokes `runCli()` when executed directly.

### Phase 2: User-Defined Custom Watch Patterns, Flexible Extensions & In-Memory Cache

- **Custom Watch & Content Options:**
  - Support arbitrary user patterns passed as CLI arguments: `nuicss compile "templates/**/*.jinja" --watch`.
  - Add `--watch-files <patterns...>` option for watching additional arbitrary files/directories (e.g. `nuicss -i input.css -o dist/output.css --watch --watch-files "templates/**/*.liquid,content/**/*.md"`).
  - Support configuring `content` and `watch` in `nuicss.config.ts`.
  - Expand default template extensions to include `.jinja`, `.liquid`, `.twig`, `.ejs`, `.erb`, `.hbs`, `.mdx`, `.markdown`, `.templ`.
  - Ensure any user-specified pattern or extension is watched and scanned without being filtered out by the default extension list.
- **High-Performance In-Memory File Cache:**
  - Maintain `fileCache: Map<string, string>` in memory.
  - On watch events, only re-read the specific modified file from disk.
  - Use `uno.applyExtractors()` for fast token collection rather than redundant full CSS generation per file.
- **Debounced Watch Pipeline:**
  - Wrap watcher rebuilds with a 50ms trailing debounce so rapid multi-file saves are cleanly grouped and never dropped.
  - Watch only the specified patterns, input CSS file, and config file instead of whole-disk subscription.

### Phase 3: TypeScript Config Execution (`jiti`) & Linter Precision

- **Seamless `nuicss.config.ts` Execution in Node:** Integrate `jiti` into `loadConfig` so that `.ts`, `.mts`, and `.js` config files are loaded natively in both Node.js and Bun without requiring extra runtime flags.
- **Linter False Positive Elimination:** Update `HEX_COLOR_REGEX` in `check.ts` to only match in styling contexts (CSS properties, `style="..."`, `class="... bg-[#...] ..."`), completely ignoring `<a href="#...">` and issue `#123` links.
- **Full Superclass Linter Coverage:** Expand `check.ts` to detect all 15 superclass clusters from `DEFAULT_MIGRATION_RULES` in `@nofinite/nuicss/migrate` (buttons, badges, cards, inputs, tables).
- **Strict Target Path Validation:** In `migrate` and `check`, throw a fatal error if an explicitly specified target path does not exist, eliminating silent full-workspace scanning.
- **CLI Routing & `add` Command:** Add a first-class `add` command (`nuicss add <component>`) and provide suggestions on unknown commands.

### Phase 4: Packaging & Distribution Optimization

- **Lightweight NPM Package:** Configure `package.json` `files` to publish `bin/nuicss.js` and `dist/` to NPM (~400 KB tarball), enabling instant global installs and CI speed.
- **GitHub Release Standalone Distribution:** `build.ps1` continues to compile the standalone cross-platform native binaries for non-Node users with zero Node dependencies.

---

## 4. Affected Files & Modules

| File                                                                                                          | Changes                                                                                                                                                              |
| :------------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`packages/nuicss-cli/src/commands/compile.ts`](file:///d:/stack/packages/nuicss-cli/src/commands/compile.ts) | Fix regex `lastIndex` bug, granular directives, input validation, custom watch patterns/files, in-memory cache, debouncing, full minification, `jiti` config loading |
| [`packages/nuicss-cli/src/commands/check.ts`](file:///d:/stack/packages/nuicss-cli/src/commands/check.ts)     | Fix hex regex false positives, expand to all 15 superclass patterns, strict target path validation                                                                   |
| [`packages/nuicss-cli/src/commands/migrate.ts`](file:///d:/stack/packages/nuicss-cli/src/commands/migrate.ts) | Strict target path validation, expand template extensions                                                                                                            |
| [`packages/nuicss-cli/src/commands/add.ts`](file:///d:/stack/packages/nuicss-cli/src/commands/add.ts)         | Implement `nuicss add <component>` scaffolding command                                                                                                               |
| [`packages/nuicss-cli/src/index.ts`](file:///d:/stack/packages/nuicss-cli/src/index.ts)                       | Register `add`, add `--watch-files` option, prevent duplicate execution, handle unknown commands                                                                     |
| [`packages/nuicss-cli/bin/nuicss.js`](file:///d:/stack/packages/nuicss-cli/bin/nuicss.js)                     | Clean single-entry invocation without double execution                                                                                                               |
| [`packages/nuicss-cli/package.json`](file:///d:/stack/packages/nuicss-cli/package.json)                       | Add `jiti` dependency, optimize `files` array for lightweight NPM publishing                                                                                         |
| [`packages/nuicss-cli/build.ps1`](file:///d:/stack/packages/nuicss-cli/build.ps1)                             | Support building both lightweight npm package and standalone binaries                                                                                                |

---

## 5. Dependencies & Tools

- `jiti`: Modern TypeScript runtime loader for seamless `nuicss.config.ts` execution under Node.js.
- `@unocss/core`: `applyExtractors()` for high-throughput candidate token extraction.
- `chokidar`: Debounced, scoped file watching.
- `bun`: Standalone native cross-compilation for non-Node binaries.

---

## 6. Alternatives Considered

- **Alternative A: Bundle entire `esbuild` or `ts-node` for config loading.**
  - _Reason rejected:_ `jiti` is significantly lighter, purpose-built for CLI config loading (used by Nuxt, Tailwind v4, Vite plugins), and works in ESM + CJS without transpilation daemons.
- **Alternative B: Retain native binaries inside the NPM tarball.**
  - _Reason rejected:_ Bloating `npm install` to 171.5 MB download / 387 MB disk on every user and CI machine is unacceptable when 99% of NPM users run Node. Providing binaries via GitHub releases aligns with industry standards (e.g., Tailwind CLI, biome, esbuild).

---

## 7. Risks & Mitigations

- **Risk:** Custom regex for hex color might miss edge cases in inline styles.
  - **Mitigation:** Test against standard JSX/HTML/Vue syntax and verify against HTML anchors and Markdown headers.
- **Risk:** In-memory caching might become stale if files are deleted.
  - **Mitigation:** Handle `unlink` events in Chokidar by removing deleted files from `fileCache`.

---

## 8. Security Considerations

- Path traversal prevention: resolve all custom user globs and watch paths safely against `cwd`.
- Do not execute arbitrary untrusted files; `jiti` only evaluates the explicit config file path specified by user flag or local root config.

---

## 9. Verification Strategy

1. **Bug Verification:**
   - Multi-cycle watch rebuild test to ensure `@nuicss;` directives expand consistently on 10 consecutive file saves.
   - Non-existent input test: verify `nuicss -i missing.css` exits with code `1`.
   - Granular directives test: verify `@nuicss tokens;` and `@nuicss components;` emit actual CSS.
   - Launcher test: verify `node bin/nuicss.js version` outputs exactly once.
2. **Custom Watch Verification:**
   - Test `nuicss compile "templates/**/*.jinja" --watch`: verify `.jinja` file changes trigger instant rebuilds.
   - Test `--watch-files "custom/*.xyz"`: verify custom files trigger rebuilds.
3. **Linter & Codemod Verification:**
   - Test `check` against `<a href="#bad">` and `#123` to verify zero false positives.
   - Test `check` against all 15 superclass clusters.
   - Test `add` command: verify `nuicss add button` outputs component guidance.
4. **NPM & Binary Verification:**
   - Run `pnpm --filter nuicss typecheck` and `pnpm --filter nuicss build`.
   - Run `npm pack --dry-run` to verify lightweight package size (<1 MB).
   - Test standalone binary execution on non-Node target.

---

## 10. Rollback Considerations

Changes are strictly localized to `packages/nuicss-cli`. If needed, `git restore packages/nuicss-cli` immediately reverts the package to the previous commit (`98cd366`).

---

## 11. Completion & Verification Summary

All 4 phases have been fully implemented, verified, and committed locally to `dev`:

### Phase 1: Core Compiler & Watcher Enterprise Hardening (Commit `b46b4d8`)

- **Fixed Regex Bug:** Stateless `getDirectiveRegex()` guarantees 100% deterministic directive expansion across consecutive watch rebuilds.
- **Granular Layers:** Implemented `extractCssLayers()` separating `@layer base` (`@nuicss tokens;`), `@layer components` (`@nuicss components;`), and utilities.
- **Strict Input Validation:** Exits with code `1` immediately if `-i/--input` file is not found on disk.
- **Full Production Minification:** Whole-stylesheet minification via LightningCSS (with regex fallback) for zero wasted bytes.
- **Double-Invocation Prevention:** `isMain` guard ensures `runCli()` executes exactly once under Node and Bun.

### Phase 2: Custom Watch Patterns, Flexible Extensions & In-Memory Cache (Commit `fbcd1e8`)

- **Custom Watch CLI Option:** `--watch-files <files>` accepts comma-separated paths and glob patterns.
- **Arbitrary Template Extensions:** Expanded default extensions to include `.jinja`, `.liquid`, `.twig`, `.ejs`, `.erb`, `.hbs`, `.mdx`, `.templ`, etc.
- **Path-Agnostic Glob Matching:** `globToRegExp` matches relative paths, ensuring user-defined globs (`*.xyz`) are never skipped.
- **In-Memory Cache & Debounce:** `fileCache: Map<string, string>` re-reads only modified files on watch events, paired with a 50ms trailing debounce and fast token extraction via `uno.applyExtractors()`.

### Phase 3: TypeScript Config Execution (`jiti`), Component Scaffolding & Linter Precision (Commit `ad0eea0`)

- **Native `.ts` Configs:** Integrated `jiti` into `loadConfig` for zero-flag execution of `nuicss.config.ts` in Node and Bun.
- **Linter False Positive Elimination:** Restyled `STYLE_HEX_REGEX` ignores HTML anchors (`<a href="#bad">`) and issue `#123` links while catching real styling violations.
- **Full 15 Superclass Linter Coverage:** Scans all 15 superclass clusters from `@nofinite/nuicss/migrate` (`btn`, `badge`, `card`, `input`, `table-container`).
- **Strict Target Validation:** `check` and `migrate` safely exit `1` if an explicit target does not exist.
- **Component Scaffolder:** Added `nuicss add <component>` with starter templates for 11 registry components.
- **Command Typo Suggestions:** Added Levenshtein-based suggestion fallback (`nuicss chck` -> `Did you mean: nuicss check?`).

### Phase 4: Packaging & Distribution Optimization (Commit `19459db`)

- **Lightweight NPM Package:** Configured `files: ["bin/nuicss.js", "dist/"]` in `package.json`. Verified via `npm pack --dry-run` that package download size dropped from **171.5 MB** down to **168.7 kB** (unpacked 1.8 MB), with 0 missing files.
- **Clean ESLint & Standalone Binaries:** Zero ESLint warnings or errors, and standalone binary builds succeed with Bun.

---

### Phase 5: Synchronize Upgraded NUICSS Architecture & Local-First Resolution (Completed)

- **Embedded Assets Synchronized:** Synced latest `styles.css` (216.2 kB), `nuicss.html-data.json` (326.2 kB), and `nuicss.css-data.json` (48.7 kB) from `@nofinite/nuicss` and regenerated `src/embedded/assets.ts` with consolidated Kanban, Markon, Charts, and Media design system superclasses.
- **Local-First Resolution:** Implemented `resolveBaseStyles(cwd)` in `compile.ts` to dynamically inspect `node_modules/@nofinite/nuicss/dist/styles.css` before falling back to embedded snapshot.
- **Registry & Scaffolder Expansion:** Added `media` (`@nofinite/media`) to `REGISTRY` in `list.ts` and starter template in `add.ts`; updated Kanban and Editor superclasses.
- **Clean Verification:** `build:ts`, `typecheck`, and `eslint` passed with 0 errors/warnings. `npm pack --dry-run` verified lightweight package size (182.5 kB tarball). Tested compile verified inclusion of `.nui-vidstack-player` and `.kanban-add-column-btn`.
