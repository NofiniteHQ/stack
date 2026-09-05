# AI Agent Guidelines for Nofinite Stack

Welcome, fellow AI! If you are modifying this codebase, please adhere to the following repository rules.

## Release & Versioning Pipeline (CRITICAL)

This monorepo uses a **Unified Changesets Pipeline**. 

**ALL packages** (`@nofinite/nui`, `@nofinite/nuicss`, and `nofinite` [the CLI]) are managed by Changesets and automatically published via the `.github/workflows/release.yml` workflow.

### Rules:
- **NEVER manually bump the `version` field in any `package.json`.**
- To trigger a version bump, you MUST create a markdown file in the `.changeset/` directory (or run `pnpm changeset`). 
- When your code is merged into `main`, the Changesets bot will handle bumping the `package.json` automatically, updating the changelog, and opening a "Version Packages" PR.
- When the bot's PR is merged, `release.yml` will automatically build and publish all updated packages to NPM.

## Testing NPM Packages Before Publishing

**NEVER publish official patch versions (e.g., 3.0.6, 3.0.7) to NPM just to test if a build works.**
If you need to verify that a package's exports, CSS files, or tarball contents are correct before going live, use one of these standard methods:
1. **Local Tarball (Recommended):** Run `pnpm pack` inside the package directory to generate a `.tgz` file. Install this exact artifact in a separate local test project (`npm install /path/to/tarball.tgz`).
2. **Changesets Pre-releases:** Run `pnpm changeset pre enter beta` to publish to a `@beta` tag instead of polluting the `latest` release history.

## Node.js Tooling & CSS Imports

Be extremely careful when adding raw CSS imports (e.g., `import '../styles/index.css'`) to TypeScript files that are exposed as plugin entrypoints.
Node.js tooling (such as Nx project graph evaluators, Jest, and UnoCSS's `jiti` config loader) cannot parse raw CSS files natively and will crash with an `Unknown file extension '.css'` error.
- If a config file (like `nuicss.config.ts`) needs to import a preset from another package in this workspace, **import directly from the specific sub-module** (e.g., `src/plugin/preset`) to bypass the top-level CSS import in the main entrypoint.

# AI Guidelines

- **Temporary Files:** ALL AI-generated scratch scripts, temporary HTML/JS testing files, data parsing scripts, or any other temporary garbage files MUST be placed in the /temp/ directory. Do not place them in the root directory. The /temp/ directory is gitignored and ensures the workspace stays clean.
