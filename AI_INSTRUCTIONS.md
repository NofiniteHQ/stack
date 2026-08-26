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
