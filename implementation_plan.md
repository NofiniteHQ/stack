# Full Launch Execution Plan: All 8 Packages & Release Verification Pipeline

## 1. Objective

Execute the complete pre-release and publishing preparation pipeline across all 8 target packages in `d:\stack`:

1. **NUI** (`@nofinite/nui`): `3.1.0` → **`3.2.0`** (minor)
2. **NUICSS** (`@nofinite/nuicss`): `3.1.0` → **`3.2.0`** (minor)
3. **Nofinite Utils** (`@nofinite/utils`): `2.0.0` → **`2.0.1`** (patch)
4. **Nofinite Charts** (`@nofinite/charts`): **`1.0.0`** (v1 Launch)
5. **Nofinite Kanban** (`@nofinite/kanban`): **`1.0.0`** (v1 Launch)
6. **Nofinite Media** (`@nofinite/media`): **`1.0.0`** (v1 Launch)
7. **Nofinite Markon** (`@nofinite/markon`): **`2.0.0`** (v2 Major Launch)
8. **NUICSS CLI** (`nuicss`): **`0.1.0`** (Initial Public Launch)

_(Note: `@nofinite/locale` remains untouched at `2.0.0`)._

---

## 2. Remote Branch Status: `chore/monorepo-deps-upgrade`

- **Audit Result:** `origin/chore/monorepo-deps-upgrade` (commit `68a0ae0` from Sep 22, 2026) is **100% merged into `dev`**.
- Current local `dev` is 124 commits ahead of that branch, containing all downstream features, stories, refactors, and documentation.
- There are **zero** unmerged commits from remote. The remote branch is an old merged branch that can be safely deleted or left as-is.

---

## 3. End-to-End Execution Phases

### Phase 1: Update AI Rules & Constitution

Files:

- [`d:\stack\AGENTS.md`](file:///d:/stack/AGENTS.md)
- [`d:\stack\.agents\rules\release.md`](file:///d:/stack/.agents/rules/release.md)

1. **Decouple Task/Audit Logging from Changesets:**
   - Record technical implementation details in commit messages, PR descriptions, and `docs/` or package release notes.
   - Restrict Changesets strictly to mechanical release triggers for already-published packages.
2. **The Unreleased Package & Launch Version Invariant:**
   - Packages unpublished on NPM (`404`) or at milestone targets must not receive incremental bump changesets.
   - The version in `package.json` is the ground truth launch version.

### Phase 2: Changeset Configuration & Realignment

Files:

- [`d:\stack\.changeset/config.json`](file:///d:/stack/.changeset/config.json)
- [`.changeset/*.md`](file:///d:/stack/.changeset/)

1. Set `"updateInternalDependencies": "out-of-range"` in `config.json` so that `nuicss` (CLI) is not accidentally bumped by internal dependency patch triggers.
2. Realign changesets so that only:
   - `@nofinite/nui`: `minor` (to reach `3.2.0`)
   - `@nofinite/nuicss`: `minor` (to reach `3.2.0`)
   - `@nofinite/utils`: `patch` (to reach `2.0.1`)
3. Consolidate technical descriptions and remove frontmatter bump headers for `charts`, `kanban`, `media`, `markon`, and `nuicss`.

### Phase 3: Execute Changeset Version & Author Launch Changelogs

1. Run `npx changeset version` to bump NUI, NUICSS, and Utils, updating their `CHANGELOG.md` files.
2. Author clean, professional initial release `CHANGELOG.md` files:
   - `packages/charts/CHANGELOG.md` (v1.0.0)
   - `packages/kanban/CHANGELOG.md` (v1.0.0)
   - `packages/media/CHANGELOG.md` (v1.0.0)
   - `packages/markon/CHANGELOG.md` (v2.0.0)
   - `packages/nuicss-cli/CHANGELOG.md` (v0.1.0)
     _(Following release standards: zero AI meta-talk, zero emojis, purely technical concrete notes)._

### Phase 4: Full Monorepo Build

Run:

```bash
pnpm nx run-many --target=build --all
```

And build standalone assets for `nuicss-cli`. Verify all packages emit their required `dist/` directories, types (`dist/index.d.ts`), and stylesheets (`dist/styles.css`).

### Phase 5: Test Suite Execution

Run:

```bash
pnpm nx run-many --target=test --all
```

Verify 100% test pass rate across all packages.

### Phase 6: Compulsory Tarball Physical Verification (`npm pack --dry-run`)

Run `npm pack --dry-run` on every single package:

1. `packages/nui` (verify `dist/components`, `dist/styles.css`, `dist/index.js`)
2. `packages/nuicss` (verify `dist/styles.css`, `dist/kanban.css`, `dist/markon.css`, `dist/index.js`)
3. `packages/utils` (verify `dist/index.js`, `dist/index.d.ts`)
4. `packages/charts` (verify `dist/index.js`, `dist/react.js`, `dist/styles.css`)
5. `packages/kanban` (verify `dist/index.js`, `dist/react.js`, `dist/styles.css`)
6. `packages/media` (verify `dist/index.js`, `dist/react.js`, `dist/styles.css`)
7. `packages/markon` (verify `dist/index.js`, `dist/react.js`, `dist/renderer.js`, `dist/styles.css`)
8. `packages/nuicss-cli` (verify `bin/nuicss.js`, `dist/index.js`, `dist/embedded/`)

### Phase 7: Local Safety Git Commit

Create a clean, logical git commit documenting the release preparation and changes across the repository.
