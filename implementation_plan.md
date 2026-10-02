# Implementation Plan: NUICSS CLI Deep Remediation & Enterprise-Grade Architecture

## 1. Objective

Remediate all critical, high, and medium defects identified during the forensic audit of `packages/nuicss-cli`, align the CLI with modern industry benchmarks (Tailwind CLI v4, Biome, LightningCSS), and elevate the toolkit into an enterprise-grade compiler and linter.

_Note: Per user instructions, component code generation (`nuicss add`) is deferred to a future phase._

---

## 2. Identified Defect Matrix & Target Architecture

| Component                        | Current Defect                                                                                                                      | Enterprise Target                                                                                                                           |
| :------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------ |
| **`pkg/initializer`**            | Silently wipes `.vscode/settings.json` when comments or trailing commas (JSONC) exist.                                              | Non-destructive JSONC updater that preserves comments, formatting, and creates a `.bak` backup.                                             |
| **`pkg/compiler`**               | Directive parser drops base CSS on `@nuicss ` or leaves invalid CSS on `@nuicss\n`.                                                 | Multi-variant regex supporting `@nuicss;`, `@nuicss tokens;`, `@nuicss components;`, and `@import "nuicss";`.                               |
| **`cmd/nuicss`**                 | Subcommands like `compile` and `build` drop flags. Unknown commands silently attempt compilation. Duplicate flag help text.         | Full POSIX-compliant command routing with explicit subcommand handling, unknown command errors, and stdin/stdout piping.                    |
| **`pkg/minifier`**               | Replaces `" + "` with `"+"` breaking CSS `calc()` operations per W3C specification. String replacement mutates quotes and SVG URIs. | Safe tokenized minification preserving `calc()` whitespace, quotes, and custom properties. Zero double-minification of pre-minified assets. |
| **`pkg/watcher`**                | Path comparison without `filepath.Abs` triggers infinite compilation loops on output file writes. New folders ignored.              | Absolute normalized path comparison, ignore output directory, and dynamic runtime folder registration.                                      |
| **`pkg/migrator`**               | Rigid sequential regex misses classes in different orders. Missing 5 superclass rules from `@nofinite/nuicss`. Globbing broken.     | Order-independent class matching, synchronized 15 superclass rules, and proper glob resolution.                                             |
| **`pkg/embedded` & `build.ps1`** | Embedded CSS & JSON assets out-of-sync with `packages/nuicss/dist`. Linux ARM64 missing. Duplicate binaries.                        | Pre-build asset synchronization hook, Linux ARM64 cross-compilation, and deduplicated binary packaging.                                     |
| **`bin/nuicss.js`**              | Missing Linux ARM64 mapping (crashes on AWS Graviton / Apple Silicon Docker). Missing `chmodSync(0o755)`.                           | Full platform/arch mapping with POSIX executable permission enforcement.                                                                    |
| **`pkg/scanner`**                | Dead, orphaned code never called anywhere.                                                                                          | Wired up into a first-class `nuicss check` (design system linter) to enforce token usage in CI/CD.                                          |

---

## 3. Proposed Remediation Steps

### Phase 1: Project Initializer (`pkg/initializer/initializer.go`)

- **JSONC-Safe Settings Update**:
  - Implement a JSONC comment stripper / regex-based property injector that preserves existing `.vscode/settings.json` comments, formatting, and indentation.
  - Before writing, create a safety backup `.vscode/settings.json.bak`.
  - Append `"./.vscode/nuicss.html-data.json"` and `"./.vscode/nuicss.css-data.json"` into `"html.customData"` and `"css.customData"`.
- **Config Scaffolding**:
  - If `nuicss.config.ts` or `nuicss.config.json` does not exist, scaffold a clean starter configuration file.

### Phase 2: Directive Engine & Compiler (`pkg/compiler/compiler.go`)

- **Robust Directive Parsing**:
  - Replace rigid `strings.Contains` and `strings.ReplaceAll` with a multi-variant regular expression:
    `@(?:nuicss(?:\s+([a-zA-Z0-9_-]+))?|import\s+["'](?:@nofinite\/)?nuicss(?:\/([a-zA-Z0-9_-]+))?["'])\s*;?`
  - Support granular directives:
    - `@nuicss;` / `@nuicss` -> full base stylesheet (tokens + resets + superclasses).
    - `@nuicss tokens;` -> CSS variables and theme tokens only.
    - `@nuicss components;` -> component superclasses only.
    - `@nuicss reset;` -> CSS resets only.
- **Clean Fallback**:
  - If no directive is present, prepend base CSS cleanly without leaving orphaned directive literals.
- **Streaming & Stdout Support**:
  - If output path is `"-"`, stream compiled CSS directly to `os.Stdout`.

### Phase 3: Minification Engine (`pkg/minifier/minifier.go`)

- **CSS Specification Conformance**:
  - Remove the invalid `{" + ", "+"}` replacement. In CSS Values & Units Level 3/4, whitespace around `+` and `-` in `calc()` is mandatory.
- **Quote- & Function-Safe Minification**:
  - Ensure string replacements do not touch characters inside quoted strings (`"..."`, `'...'`) or SVG `data:image/...` URIs.
- **Skip Redundant Minification**:
  - Since `embedded.StylesMinCSS` is already minified by LightningCSS, only apply minification to user-appended custom CSS to prevent double-minification degradation.

### Phase 4: CLI Router & Subcommands (`cmd/nuicss/main.go`)

- **Explicit Subcommands**:
  - Support `compile`, `build`, `init`, `migrate`, `tokens`, `list`, `version`, `help`, and `check`.
- **Flag Handling**:
  - For `compile` / `build` (and default mode), parse flags using a clean FlagSet without non-flag argument drops.
  - If an unknown command is provided (`nuicss unknown`), exit with error:
    `Error: unknown command "unknown". Run 'nuicss help' for available commands.`
- **Flag Deduplication**:
  - Eliminate duplicate flag declarations in the flag set so `nuicss help` displays clean, POSIX-standard usage.

### Phase 5: File Watcher (`pkg/watcher/watcher.go`)

- **Path Normalization**:
  - Convert both `event.Name` and `opts.CompileOpts.OutputPath` to absolute, clean paths via `filepath.Abs()` to prevent false positives and infinite loops.
- **Dynamic Directory Addition**:
  - Watch for `fsnotify.Create` events on directories and dynamically add new subfolders to `watcher.Add(path)`.
- **Ignore Output Directory**:
  - Exclude the output directory from the watch list.

### Phase 6: Codemod Migrator (`pkg/migrator/migrator.go`)

- **Order-Independent Class Matching**:
  - Tokenize HTML/JSX class attributes into individual tokens (`strings.Fields`).
  - Perform cluster subset matching against required classes so `px-4 py-2 bg-blue-600 text-white` matches regardless of token order.
- **Full Rule Synchronization**:
  - Add all 5 missing superclasses from `@nofinite/nuicss`:
    - `metric-card`
    - `card-responsive`
    - `press-scale`
    - `hover-lift`
    - `skeleton-shimmer`
- **Glob Resolution & Path Verification**:
  - Validate directory existence before walking.
  - Implement pattern matching so `src/**/*.tsx` filters correctly.

### Phase 7: Design System Linter (`pkg/scanner/scanner.go`)

- **Repurpose Scanner into `nuicss check`**:
  - Wire `scanner.go` to scan templates for:
    1. Hardcoded hex colors (`#...`) where semantic NUICSS tokens should be used.
    2. Legacy unmigrated Tailwind button/badge clusters.
  - Output diagnostics in standard linter format (`file:line:col - warning/error`) suitable for CI/CD pipelines.

### Phase 8: Asset Synchronization & Packaging (`build.ps1`, `bin/nuicss.js`)

- **Pre-Build Asset Sync**:
  - Add a pre-compilation step in `build.ps1` that copies latest `styles.css`, `styles.min.css`, `nuicss.html-data.json`, and `nuicss.css-data.json` from `packages/nuicss/dist/` into `packages/nuicss-cli/pkg/embedded/`.
- **Linux ARM64 Target**:
  - Add `GOOS=linux GOARCH=arm64` cross-compilation in `build.ps1` -> `bin/nuicss-linux-arm64`.
- **Node Launcher Enhancements (`bin/nuicss.js`)**:
  - Add mapping for `linux` + `arm64` -> `nuicss-linux-arm64`.
  - On POSIX platforms, verify and set `0o755` permissions via `fs.chmodSync`.
  - Deduplicate `bin/nuicss.exe` and `bin/nuicss-windows-amd64.exe`.

---

## 4. Affected Files & Modules

- [`packages/nuicss-cli/cmd/nuicss/main.go`](file:///d:/stack/packages/nuicss-cli/cmd/nuicss/main.go)
- [`packages/nuicss-cli/pkg/compiler/compiler.go`](file:///d:/stack/packages/nuicss-cli/pkg/compiler/compiler.go)
- [`packages/nuicss-cli/pkg/compiler/compiler_test.go`](file:///d:/stack/packages/nuicss-cli/pkg/compiler/compiler_test.go)
- [`packages/nuicss-cli/pkg/initializer/initializer.go`](file:///d:/stack/packages/nuicss-cli/pkg/initializer/initializer.go)
- [`packages/nuicss-cli/pkg/initializer/initializer_test.go`](file:///d:/stack/packages/nuicss-cli/pkg/initializer/initializer_test.go)
- [`packages/nuicss-cli/pkg/minifier/minifier.go`](file:///d:/stack/packages/nuicss-cli/pkg/minifier/minifier.go)
- [`packages/nuicss-cli/pkg/minifier/minifier_test.go`](file:///d:/stack/packages/nuicss-cli/pkg/minifier/minifier_test.go)
- [`packages/nuicss-cli/pkg/migrator/migrator.go`](file:///d:/stack/packages/nuicss-cli/pkg/migrator/migrator.go)
- [`packages/nuicss-cli/pkg/migrator/migrator_test.go`](file:///d:/stack/packages/nuicss-cli/pkg/migrator/migrator_test.go)
- [`packages/nuicss-cli/pkg/watcher/watcher.go`](file:///d:/stack/packages/nuicss-cli/pkg/watcher/watcher.go)
- [`packages/nuicss-cli/pkg/scanner/scanner.go`](file:///d:/stack/packages/nuicss-cli/pkg/scanner/scanner.go)
- [`packages/nuicss-cli/pkg/embedded/`](file:///d:/stack/packages/nuicss-cli/pkg/embedded/)
- [`packages/nuicss-cli/build.ps1`](file:///d:/stack/packages/nuicss-cli/build.ps1)
- [`packages/nuicss-cli/bin/nuicss.js`](file:///d:/stack/packages/nuicss-cli/bin/nuicss.js)
- [`packages/nuicss-cli/README.md`](file:///d:/stack/packages/nuicss-cli/README.md)

---

## 5. Verification Strategy

1. **Unit Tests**:
   - `go test -v ./...` in `packages/nuicss-cli` covering all packages.
   - Comprehensive test cases for:
     - JSONC preservation and `.bak` generation in `initializer_test.go`.
     - Directive variants (`@nuicss`, `@nuicss;`, `@nuicss tokens;`, `@import "nuicss"`) in `compiler_test.go`.
     - `calc()` expressions with `+` and `-`, string quotes, and SVG data URIs in `minifier_test.go`.
     - Arbitrary class ordering in `migrator_test.go`.
     - Design token validation in `scanner_test.go`.
2. **E2E CLI Tests**:
   - Test `nuicss compile -i custom.css -o out.css`.
   - Test `nuicss build -m`.
   - Test `nuicss check src/`.
   - Test `nuicss unknown` error handling and exit codes.
   - Test `node bin/nuicss.js` launcher across simulated platforms.
3. **Build & Package Verification**:
   - Run `build.ps1` to compile Windows, macOS (amd64 + arm64), and Linux (amd64 + arm64) binaries.
   - Run `npm pack` inside `packages/nuicss-cli` and verify the tarball contents and size.

---

## 6. Risks & Rollback

- **Risk**: Modifying `settings.json` format.
  - **Mitigation**: Automated `.vscode/settings.json.bak` backup file creation prior to write operations.
- **Rollback**: Clean git commits allow immediate reverting via `git reset --hard HEAD~1` if unexpected regressions occur.
