# Stack Release Rules

## Two-Tier Commit vs. Release Protocol

1. **Tier 1 — Local Safety Commits (Frequent Checkpoints):**

   - Make local git commits frequently after each working step or refactor.
   - Local commits act as safety savepoints to prevent code loss and enable instant rollback (`git reset`).
   - **A local commit is NOT an NPM release.** Do not manually bump `package.json` version numbers on local commits.

2. **Tier 2 — Separation of Task Logging & Changeset Intent:**
   - **Task/Audit Logging:** Document technical implementation details, architectural rationale, and work completed in commit messages, PR descriptions, and central documentation (`d:\stack\docs/<pkg>/`). Never misuse `.changeset/` as an everyday engineering work log or development diary.
   - **Changesets for Published Packages:** When completing a publishable feature, bugfix, or breaking change for an **already-published** package on NPM, include an appropriate `.changeset/<descriptive-name>.md` file tracking the SemVer impact (`patch`, `minor`, `major`).
   - **The Unreleased Package Invariant:** Unpublished packages (`404` status on registry, e.g. v1.0.0, v0.1.0) or packages at pre-staged milestone launch versions (e.g. v2.0.0) MUST NOT have bump changesets created for them. Their version in `package.json` is their launch version.
   - Never manually edit the `version` field in `package.json` for published packages during local development.
   - Never create manual empty changelogs during development.
3. **Tier 3 — Batched Release Milestone Cuts:**
   - Version bumps and compiled `CHANGELOG.md` generation occur only when executing an official release cut via `npx changeset version`.
   - This batches accumulated changesets into a single clean release commit across the monorepo.

## Changesets

Use:

- `patch` for backward-compatible bug fixes, minor layout refinements, and documentation corrections.
- `minor` for backward-compatible new features, new components, engine upgrades, and new public APIs.
- `major` for breaking changes, deprecations, and major architectural migrations.

Only published packages on NPM receiving post-release changes should be included in changeset frontmatter. Never tag unpublished packages in changeset headers.

Changeset descriptions must be based on the actual implementation and reviewed diff.

Do not fabricate release information or describe changes that were not actually implemented.

## Release Notes

Changesets, changelogs, release commit messages, and GitHub release summaries must:

- describe concrete changes
- remain technically precise
- contain no emojis
- contain no AI meta-talk
- avoid marketing fluff

Do not start a Changeset body with release/package headings such as:

`# Release X.Y.Z`

or

`# @nofinite/package`

Use descriptive subheadings or direct paragraphs instead.

## Release Verification

Before a release PR:

- Build the workspace.
- Run the full test suite.
- Verify modified package tarballs with `npm pack --dry-run`.
- Verify expected distribution files are present.
- Verify lockfile integrity when dependencies changed.

Never publish an official NPM version merely to test packaging.

Use local tarballs or Changesets prereleases for staging verification.

## Package Tarball Verification

For modified publishable packages, inspect the result of:

```bash
npm pack --dry-run
```

Verify that expected distribution artifacts are physically included.

For example, verify the package-specific dist/ files required by the package's current build configuration.

Never assume that a successful build automatically means the published tarball is correct.
