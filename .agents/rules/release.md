# Stack Release Rules

## Changesets

All publishable package changes MUST use Changesets.

Never manually edit the `version` field in `package.json`.

Use:

- `patch` for backward-compatible bug fixes, minor layout refinements, and documentation corrections.
- `minor` for backward-compatible new features, new components, engine upgrades, and new public APIs.
- `major` for breaking changes, deprecations, and major architectural migrations.

Every publishable change must include an appropriate `.changeset/<descriptive-name>.md` file.

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
