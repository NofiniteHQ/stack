# Publishing & Engineering Standards for Nofinite Stack

Welcome, developers and AI agents! If you are contributing, modifying, or managing releases in this monorepo, you **must strictly adhere** to the following repository rules and publishing standards.

---

## 1. Branch Strategy & Promotion Flow (Strict GitFlow)

All development and publishing in this repository strictly follow GitFlow:

```
[ Feature / Fix Branch ]
          │
          ▼  (PR into dev)
    [ dev Branch ]  ◄── Staging & Integration Testing
          │
          ▼  (PR into main)
   [ main Branch ]  ◄── Production & Publishing Trigger
          │
          ▼  (Automated by Changesets Bot)
[ NPM & GitHub Releases ]
          │
          ▼  (Mandatory Back-Sync)
   [ Sync dev Branch ]
```

### Mandatory Rules:

1. **Never commit or push directly to `dev` or `main`.** Both are protected branches requiring pull requests and status checks.
2. **Feature branches always target `dev`.** Create your branch off `dev` (`feat/*`, `fix/*`, `chore/*`) and open a PR targeting `dev`.
3. **`dev` targets `main` for releases.** Once features are verified and integrated on `dev`, open a PR from `dev` into `main`.
4. **Mandatory Back-Sync:** When `main` completes a release (the Changesets bot merges version bumps and updates changelogs directly on `main`), **`main` MUST be back-merged into `dev` immediately**. This prevents `dev` from diverging or carrying outdated versions and consumed changeset ghosts.

---

## 2. Release & Versioning Pipeline (Changesets)

All packages (`@nofinite/nui`, `@nofinite/nuicss`, `nofinite`, `@nofinite/utils`, `@nofinite/locale`) are orchestrated by [Changesets](https://github.com/changesets/changesets) and published automatically via `.github/workflows/release.yml`.

### Strict Rules:

- **NEVER manually edit the `"version"` field in any `package.json`.**
- To queue a release, create a markdown file in `.changeset/<descriptive-name>.md` (or run `pnpm changeset`).
- **Semantic Versioning (SemVer) Discipline:**
  - **`patch`**: Strictly for backward-compatible bug fixes, minor layout refinements, and documentation corrections.
  - **`minor`**: For backward-compatible new features, new components, engine upgrades, or new public APIs.
  - **`major`**: For breaking changes, deprecations, or major architectural migrations.
- **Write High-Quality Release Notes in Changesets:** The text inside the `.changeset/*.md` file is automatically consumed by GitHub Actions to generate the official GitHub Release and package `CHANGELOG.md`. Always structure it with clear headers, bullet points, and code snippets.

---

## 3. Mandatory Pre-Flight Verification Before Release PRs

Before creating or merging any release PR, you **MUST** run and pass the following checks locally:

### A. Full Monorepo Build

```bash
pnpm nx run-many -t build
```

- All packages must build with **zero errors**.
- Bundler configs must have `emptyOutDir: true` to prevent stale artifacts from masking missing files.

### B. Full Test Suite Pass

```bash
pnpm nx run-many -t test
```

- All unit and integration test suites must pass 100%. No skipped tests, no unhandled rejections, and no regressions.

### C. NPM Package Tarball Verification (`npm pack`)

```bash
cd packages/<package-name>
npm pack --dry-run
```

- **Inspect the tarball output!**
- Ensure `dist/` is populated and contains expected files:
  - For `@nofinite/nui`: Verify `dist/styles.css` and component directories (`dist/components/button`, `dist/components/modal`, etc.) are present.
  - For `@nofinite/nuicss`: Verify `dist/index.css`, `dist/components.css`, and IntelliSense JSON files are present.
- **Never publish empty or null folders to NPM.**

### D. Lockfile Integrity

```bash
pnpm install --frozen-lockfile
```

- Whenever dependencies are added, updated, or removed, run `pnpm install --no-frozen-lockfile` locally and commit the updated `pnpm-lock.yaml`. CI runs with `--frozen-lockfile` and will fail if the lockfile is out of date.

---

## 4. Testing Packages Without Polluting NPM

**NEVER publish official patch versions (e.g. 3.0.8, 3.0.9) to NPM just to see if a build works.**

If you need to test packaged output in an external project:

1. **Local Tarball Installation:**
   ```bash
   cd packages/<package-name>
   pnpm pack
   ```
   Install the generated `.tgz` file in your test project:
   ```bash
   pnpm add /path/to/nofinite-nui-3.x.x.tgz
   ```
2. **Changesets Pre-releases (Staging Tags):**
   ```bash
   pnpm changeset pre enter beta
   ```
   This publishes to an npm `@beta` dist-tag without polluting the standard `latest` release history.

---

## 5. Node.js Tooling & CSS Import Discipline

Be extremely careful when importing raw CSS (e.g. `import '../styles/index.css'`) into TypeScript files that are evaluated by Node.js tooling (Nx project graph, Vitest, Jest, UnoCSS/Jiti).

- Node.js cannot parse raw CSS and will crash with `Unknown file extension '.css'`.
- If a config file (like `nuicss.config.ts`) needs to import a preset, **import directly from the sub-module** (`src/plugin/preset`) rather than the main entrypoint.
- Keep `@nofinite/nuicss` in `external` in `packages/nui/vite.config.ts` so Rollup does not traverse into external package sources, keeping the module root clean (`dist/components/`).

---

## 6. Single Source of Truth for Design Tokens

`@nofinite/nuicss` is the sole source of truth for design tokens, OKLCH color palettes, and component superclasses across the entire ecosystem.

- **Never write hardcoded hex/sRGB color literals** or verbose Tailwind utility clusters when a NUICSS token (`var(--color-primary)`, `var(--bg-surface)`) or superclass (`btn`, `card`, `input`, `badge`, `table-container`) exists.
- Ensure semantic class names are deduplicated correctly using NUI's extended `twMerge` utility in `cn()`.

---

## 7. Clean Environment & Temporary Files

- **Scratch & Temp Files:** ALL AI-generated scratch scripts, temporary HTML/JS test files, debug logs, or intermediate files **MUST be placed in the `/temp/` directory**.
- Do not create scratch files in the repository root or package source folders.
- The `/temp/` directory is gitignored to ensure the monorepo remains pristine.
- Always delete any locally generated `.tgz` tarball files before committing.
