# Engineering & Publishing Standards for AI Agents and Contributors

All AI agents and developers working in this monorepo MUST strictly adhere to these rules without exception.

---

## 1. Core Engineering & Workflow Rules

- **Implementation Plans:** Always write an implementation_plan.md for major architectural changes, complex bugs, or work affecting multiple files/areas before modifying any code. You may skip the plan ONLY for trivial or minor bug fixes.
- **Compulsory Git Commits:** You MUST make a local git commit immediately after making ANY changes (even minor bug fixes). This acts as a crucial save point so we can revert if something breaks. Do not rely solely on remote pushes; local commits are compulsory after every change.
- **Industry Standards & Tool Comparison:** Always follow modern industry best practices and use highly performant tools. Before introducing a new package or tool, you must compare alternatives, explicitly explain why the chosen tool is the best fit, and detail how it aligns with our existing architecture.
- **Temporary Files:** ALL AI-generated scratch scripts, temporary HTML/JS testing files, data parsing scripts, or any other temporary garbage files MUST be placed in the `/temp/` directory. Do not place them in the root directory. The `/temp/` directory is gitignored and ensures the workspace stays clean.

---

## 2. Strict GitFlow Promotion Flow (`feature -> dev -> main`)

- **Strict Promotion Pipeline:** All work happens exclusively on feature/fix branches (`feat/*`, `fix/*`, `chore/*`).
  1. Open a Pull Request from your feature branch into **`dev`** for integration testing and staging.
  2. Only open a Pull Request from **`dev`** into **`main`** for production releases.
  3. **NEVER merge directly into `main`.**
- **Mandatory Post-Release Back-Sync (`main -> dev`):** After `main` publishes (the Changesets action creates version bumps and updates changelogs directly on `main`), **`main` MUST be back-merged into `dev` immediately**. This prevents `dev` from lagging behind, carrying outdated version baselines, or resurrecting already-consumed changesets.
- **Pre-PR Upstream Verification:** Before opening a PR targeting `dev`, verify if `origin/main` has updates that `dev` is missing. If so, merge `origin/main` into your feature branch first so no outdated code or stale changesets are reintroduced.

---

## 3. Release & Changeset Pipeline

- **NEVER Manually Edit Versions:** NEVER manually edit the `"version"` field in any `package.json`.
- **Changeset Requirement:** Every publishable change must be accompanied by a `.changeset/<descriptive-name>.md` file specifying:
  - `patch`: Strictly for backward-compatible bug fixes, minor layout refinements, and documentation corrections.
  - `minor`: For backward-compatible new features, new components, engine upgrades, or new public APIs.
  - `major`: For breaking changes, deprecations, or major architectural migrations.
- **Single Release Changeset:** When preparing a consolidated release across multiple packages, combine the version bumps and notes into a single descriptive changeset file (e.g., `.changeset/release-vX-Y-Z.md`).

---

## 4. Audited Changelogs & Zero-Fluff Release Notes

All changelogs, changeset descriptions, release commit messages, and GitHub release summaries MUST strictly adhere to the following standards:

- **Mandatory Code Audit (`git diff`):** Never write release notes from memory or surface assumptions. You MUST run an explicit code audit (`git diff`) comparing proposed changes against the previous published baseline on NPM / `origin/main`.
- **Concrete Before-and-After Differences:** Explicitly document what existed in the previous published version versus what is introduced or changed in the new version. Detail what was added, fixed, refactored, or deprecated per package.
- **Strictly Zero Emojis (No Marketing Fluff):** Official release notes, changeset files, commit messages, and changelogs must contain **ZERO emojis** (strictly avoid 🚀, ✨, 🔥, 🎉, 📦, etc.). The language must remain strictly professional, technical, concise, and understandable.
- **No AI Meta-Talk or Robotic Boilerplates:** NEVER write internal process declarations, prompt echoes, or artificial robotic intros (e.g., strictly avoid phrases like _"Comprehensive release notes based on code diff audit comparing version X against published baseline..."_ or _"Here is the changelog..."_). Write directly for external developers and consumers. Start immediately with an executive highlight or categorized headings (`### New Components`, `### Bug Fixes`, `### Architecture & Design Tokens`).
- **Clean Changeset Heading Formatting:** Changesets automatically prepends the commit hash bullet (`- <hash>: `) to the first line of the changeset file. Never start a changeset body with `# Release X.Y.Z` or `# @nofinite/pkg`, as this generates malformed nested header syntax (`- <hash>: # Release X.Y.Z`) in consumer PRs and changelogs. Use clean subheadings (`### New Features`) or direct paragraphs.
- **Permanent Record Discipline:** The text in `.changeset/*.md` directly populates package `CHANGELOG.md` files and official GitHub Releases. Write with permanent architectural and technical precision.

---

## 5. Mandatory Pre-Flight Checks & NPM Verification

Prior to opening or merging any release PR, you MUST execute and pass all of the following checks locally:

1. **Full Workspace Build:**
   ```bash
   pnpm nx run-many -t build
   ```
   All packages must build with **0 errors**. Ensure bundler outputs are populated.
2. **Full Test Suite Pass:**
   ```bash
   pnpm nx run-many -t test
   ```
   All unit and integration test suites across all packages must pass 100%. No regressions, no unhandled rejections.
3. **NPM Tarball Verification (`npm pack --dry-run`):**
   ```bash
   npm pack --dry-run
   ```
   Run in every modified package directory. Inspect tarball contents to verify all expected files and directories are present:
   - For `@nofinite/nui`: Verify `dist/styles.css` (bundled stylesheet), component directories (`dist/components/*`), type declarations, and utility chunks are present.
   - For `@nofinite/nuicss`: Verify `dist/components.css`, `dist/primitives.css`, `dist/forms.css`, `dist/overlays.css`, `dist/widgets.css`, `dist/media.css`, Next.js plugin chunks, and IDE custom data JSON files (`nuicss.html-data.json`, `nuicss.css-data.json`) are present.
   - **Never publish empty or null folders to NPM.**
4. **Testing Without Polluting NPM:**
   - NEVER publish official patch versions to NPM to test if a build works.
   - Use local tarballs (`pnpm pack`) or changeset pre-releases (`pnpm changeset pre enter beta`) for staging tests.

---

## 6. Design System, Tokens & Component Architecture

- **Single Source of Truth for Design Tokens & Styles:** `@nofinite/nuicss` is the sole source of truth for design tokens, OKLCH color palettes, and component superclasses across the entire ecosystem. Never write hardcoded hex/sRGB color literals or verbose Tailwind utility clusters when a NUICSS token (`var(--color-primary)`, `var(--bg-surface)`) or superclass (`btn`, `card`, `input`, `badge`, `table-container`, etc.) exists.
- **Root-Cause Upstream Fix Rule (Zero Downstream Monkey-Patching):** NEVER add quick-fix CSS classes, utility overrides, or manual style monkey-patches in consumer applications (`oss-docs`, demo apps, or `globals.css`) to patch component styling, colors, or token bugs. If a component looks broken or unstyled downstream, the bug is 100% in `@nofinite/nui` or `@nofinite/nuicss`. All fixes must be implemented at the root library source, built, verified, and consumed cleanly.
- **The "Green Test" Fallacy & Compulsory Visual Validation:** Passing unit tests (`vitest`, `happy-dom`) only proves state logic and DOM presence; it NEVER proves visual aesthetics, spatial harmony, or layout correctness. Tests will happily pass when a modal has redundant buttons, missing borders, or flat muddy backdrops. For ANY UI, styling, or interactive component change, you MUST perform visual verification (Playwright screenshot in `/temp/` or browser inspection). Never declare a UI task complete purely based on green unit test passes.
- **Strict Compound Component & Hierarchy Contracts:** Wrapper components (e.g. `DialogProvider`, `ToastProvider`, `DropdownMenu`) must explicitly configure subcomponent defaults. Modals designed for binary confirmation or destructive decisions must enforce `hideCloseButton={true}`; never present an ambiguous corner '✕' close button alongside explicit "Cancel" and "Confirm" action buttons. Overlays and modal backdrops must combine `bg-overlay` with `backdrop-blur-sm` to guarantee modern glassmorphic visual separation rather than flat, muddy dimming.
- **Ground Truth Verification Before Diagnosis:** Never diagnose an issue or claim a token or class "does not exist" or "was never generated" based on surface grepping of source files. You MUST inspect compiled artifacts (`dist/styles.css`, build chunks) and runtime computed styles before making diagnostic claims.
- **Strict Package Isolation:** Public packages in this repository must NEVER mention or reference internal packages (`nuix`). Public packages must remain 100% self-contained and free of internal aliases.
