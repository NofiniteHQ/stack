# Implementation Plan: Developer Architecture, Central Docs & AI Governance Rules

## Executive Summary

This implementation plan establishes a mature, enterprise-grade engineering and documentation architecture across the Nofinite ecosystem. It accomplishes four major goals:

1. **Developer Guidelines & Governance:** Introduces `ARCHITECTURE.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, and Architectural Decision Records (ADRs) in `d:\stack`.
2. **Central Monorepo Documentation Hub (`d:\stack\docs/`):** Establishes a clean, centralized markdown documentation tree at the root of `d:\stack` that directly mirrors `d:\oss-docs` routes, eliminating per-package clutter while preserving canonical API specifications.
3. **AI Engineering Rules & Constitution Modernization:** Updates `AGENTS.md` and `.agents/rules/` across `d:\stack`, `d:\nuix`, and `d:\oss-docs` to enforce the **Zero Downstream CSS Invariant**, the **Official Brand Taxonomy**, the **Two-Tier Commit vs. Release Protocol**, and the **Cross-Repo Docs Sync Contract**.
4. **Release & Changelog System Integrity:** Initializes `CHANGELOG.md` across all missing domain packages (`Nofinite Charts`, `Nofinite Kanban`, `Nofinite Locale`, `Nofinite Markon`, `Nofinite Media`) and creates a comprehensive consolidation Changeset for the accumulated unreleased features.

---

## 1. Problem Statement & Root Cause Analysis

### Current State

1. **Style Fragmentation & Past AI Errors:** Previous AI agents created isolated `.css` bundles in downstream packages because `AGENTS.md` did not have an explicit "Zero Downstream CSS Invariant".
2. **Release & Versioning Void:** Despite over 110 commits on `dev`, package versions remained statically at 1.0.0/2.0.0, `.changeset/` remained untouched since September 22, and 5 out of 8 packages had no `CHANGELOG.md`.
3. **Documentation Drift:** Package documentation was scattered and ad-hoc. There was no centralized home in `d:\stack` for canonical Markdown specs, making syncing with `d:\oss-docs` manual and prone to drift.
4. **Missing Developer Onboarding:** The monorepo lacked root-level `ARCHITECTURE.md`, `CONTRIBUTING.md`, and `CODE_OF_CONDUCT.md` files for human contributors and AI agents.
5. **Brand Ambiguity:** AI agents frequently referred to packages using raw npm strings (`@nofinite/kanban`) or incorrect brand names ("NUI Kanban" instead of the official "Nofinite Kanban").

---

## 2. Proposed Architecture & System Design

### 2.1 The Two-Tier Commit vs. Release Protocol

We explicitly formalize the distinction between local commits and NPM releases:

- **Tier 1 — Local Safety Commits (Frequent Checkpoints):**
  Commits are made locally after every working step/refactor. This is a crucial safety savepoint preventing hallucination loss and providing zero-risk `git reset` anchors. A local commit is **not** an NPM release.
- **Tier 2 — Changeset Intent Tracking:**
  When a unit of feature or bugfix work is completed on a package, a `.changeset/<name>.md` file is committed. This records SemVer intent (`patch`, `minor`, `major`) and human-readable release notes without bumping `package.json`.
- **Tier 3 — Batched Release Milestone:**
  Releases happen in batched cycles (`npx changeset version`). This consumes changesets, bumps `package.json` versions, and compiles `CHANGELOG.md` files in a clean, isolated release commit.

### 2.2 Official Brand Taxonomy

All discussions, documentation, and agent reasoning must enforce:

- **NUICSS** (`@nofinite/nuicss`): Single-source CSS engine, tokens, OKLCH palettes, and semantic superclasses.
- **NUI** (`@nofinite/nui`): Core headless & polymorphic React component library.
- **Nofinite Charts** (`@nofinite/charts`): Data visualization primitives.
- **Nofinite Kanban** (`@nofinite/kanban`): Drag-and-drop kanban boards and workflow cards.
- **Nofinite Markon** (`@nofinite/markon`): Markdown WYSIWYG editor, floating bubble menus, codeblock highlight.
- **Nofinite Media** (`@nofinite/media`): Video/audio player primitives and media token bridges.
- **Nofinite Locale** (`@nofinite/locale`): Internationalization and localization primitives.
- **Nofinite Utils** (`@nofinite/utils`): Shared TypeScript core utilities.

### 2.3 Central Monorepo Documentation Hub (`d:\stack\docs/`)

Instead of scattering `docs/` inside each individual package, `d:\stack` maintains a central `docs/` directory that directly mirrors `d:\oss-docs/content/docs/`:

```
d:\stack/
├── ARCHITECTURE.md          # Macro blueprint: System topology, NUICSS single-engine rule, package roles
├── CONTRIBUTING.md          # How to clone, build, run tests, GitFlow rules, local commits, Changeset workflow
├── CODE_OF_CONDUCT.md      # Ethics & community standards (Contributor Covenant 2.1)
│
├── docs/                    # Central Markdown Source of Truth (1-to-1 mirror with oss-docs)
│   ├── architecture/        # Architectural Decision Records (ADRs)
│   │   ├── 001-unified-nuicss-engine.md
│   │   └── 002-package-boundaries-and-subpaths.md
│   ├── nuicss/              # NUICSS styling engine, tokens, OKLCH, CLI
│   ├── nui/                 # NUI core components
│   ├── kanban/              # Nofinite Kanban
│   ├── charts/              # Nofinite Charts
│   ├── markon/              # Nofinite Markon
│   ├── media/               # Nofinite Media
│   ├── locale/              # Nofinite Locale
│   └── utils/               # Nofinite Utils
│
└── packages/
    ├── kanban/
    │   ├── README.md        # Lightweight npm overview & quickstart (for npmjs.com)
    │   ├── CHANGELOG.md     # Package changelog tracking releases
    │   └── src/
    └── ...
```

### 2.4 The Cross-Repo Docs Sync Contract

- **In `d:\stack`:** Developers and AI agents write pure, standard Markdown in `d:\stack\docs/<pkg>/` and keep `packages/<pkg>/README.md` lean.
- **In `d:\oss-docs`:** The documentation developers consume that Markdown and enrich it with interactive client components (`<ComponentPreview />`), live sandboxes, and Theme Studio pickers.

---

## 3. Affected Files and Modules

| Area                     | File Path                                                           | Action                                                       |
| :----------------------- | :------------------------------------------------------------------ | :----------------------------------------------------------- |
| **Developer Governance** | `d:\stack\ARCHITECTURE.md`                                          | Create comprehensive system blueprint                        |
| **Developer Governance** | `d:\stack\CONTRIBUTING.md`                                          | Create developer contribution & workflow guide               |
| **Developer Governance** | `d:\stack\CODE_OF_CONDUCT.md`                                       | Create standard Contributor Covenant 2.1                     |
| **Architecture ADRs**    | `d:\stack\docs\architecture\001-unified-nuicss-engine.md`           | Create ADR documenting single-engine CSS architecture        |
| **Architecture ADRs**    | `d:\stack\docs\architecture\002-package-boundaries-and-subpaths.md` | Create ADR documenting package modularity & exports          |
| **Central Docs Hub**     | `d:\stack\docs\nuicss\README.md`                                    | Create central NUICSS markdown documentation                 |
| **Central Docs Hub**     | `d:\stack\docs\nui\README.md`                                       | Create central NUI markdown documentation                    |
| **Central Docs Hub**     | `d:\stack\docs\kanban\README.md`                                    | Create central Nofinite Kanban markdown documentation        |
| **Central Docs Hub**     | `d:\stack\docs\charts\README.md`                                    | Create central Nofinite Charts markdown documentation        |
| **Central Docs Hub**     | `d:\stack\docs\markon\README.md`                                    | Create central Nofinite Markon markdown documentation        |
| **Central Docs Hub**     | `d:\stack\docs\media\README.md`                                     | Create central Nofinite Media markdown documentation         |
| **Central Docs Hub**     | `d:\stack\docs\locale\README.md`                                    | Create central Nofinite Locale markdown documentation        |
| **Central Docs Hub**     | `d:\stack\docs\utils\README.md`                                     | Create central Nofinite Utils markdown documentation         |
| **Package Changelogs**   | `packages/charts/CHANGELOG.md`                                      | Initialize standard Keep-a-Changelog template                |
| **Package Changelogs**   | `packages/kanban/CHANGELOG.md`                                      | Initialize standard Keep-a-Changelog template                |
| **Package Changelogs**   | `packages/locale/CHANGELOG.md`                                      | Initialize standard Keep-a-Changelog template                |
| **Package Changelogs**   | `packages/markon/CHANGELOG.md`                                      | Initialize standard Keep-a-Changelog template                |
| **Package Changelogs**   | `packages/media/CHANGELOG.md`                                       | Initialize standard Keep-a-Changelog template                |
| **Changesets**           | `.changeset/consolidate-ecosystem-architecture.md`                  | Create Changeset documenting styling consolidation           |
| **AI Rules (stack)**     | `d:\stack\AGENTS.md`                                                | Add 9-stage workflow, brand rules, two-tier commit protocol  |
| **AI Rules (stack)**     | `d:\stack\.agents\rules\architecture.md`                            | Add Zero Downstream CSS Invariant & Brand Taxonomy           |
| **AI Rules (stack)**     | `d:\stack\.agents\rules\release.md`                                 | Add compulsory package changelog integrity & Changeset rules |
| **AI Rules (nuix)**      | `d:\nuix\AGENTS.md`                                                 | Sync Zero Downstream CSS, Brand Taxonomy, and Doc Sync rules |
| **AI Rules (oss-docs)**  | `d:\oss-docs\AGENTS.md`                                             | Sync Brand Taxonomy, Cross-Repo Docs Sync Contract           |

---

## 4. Implementation Steps (Phased Execution)

### Phase 1: Developer Governance & Architecture

1. Write `d:\stack\ARCHITECTURE.md` defining the macro ecosystem topology, NUICSS single-engine architecture, and package roles.
2. Write `d:\stack\CONTRIBUTING.md` detailing local safety commit etiquette, Changesets, branch promotion (`feature` → `dev` → `main`), and verification steps.
3. Write `d:\stack\CODE_OF_CONDUCT.md` establishing open-source community ethics and professional conduct.
4. Establish `d:\stack\docs\architecture/` with ADRs:
   - `001-unified-nuicss-engine.md` (documents eliminating dual-track styles and migrating 450+ lines of Kanban/Markon styles to NUICSS).
   - `002-package-boundaries-and-subpaths.md` (documents headless package boundaries, modular CSS subpaths, and backward-compatible shims).

### Phase 2: Central Documentation Hub Setup (`d:\stack\docs/`)

1. Create `d:\stack\docs/{nuicss,nui,kanban,charts,markon,media,locale,utils}/`.
2. Populate clean, canonical Markdown specifications for each package (installation, zero-config quickstart, architecture, key APIs).
3. Validate that the directory structure seamlessly maps 1-to-1 with `d:\oss-docs/content/docs/`.

### Phase 3: Changelog Initialization & Changeset Creation

1. Create initial `CHANGELOG.md` in `packages/{charts,kanban,locale,markon,media}` following Keep-a-Changelog format.
2. Create `.changeset/consolidate-ecosystem-architecture.md` documenting:
   - `@nofinite/nuicss`: minor (incorporated Kanban DND, Markon floating toolbar, modular subpaths).
   - `@nofinite/kanban`: minor (migrated styles to NUICSS, lightweight shim).
   - `@nofinite/markon`: minor (migrated editor chrome to NUICSS, lightweight shim).
   - `@nofinite/charts`: minor (removed duplicate NUICSS bundle, lightweight shim).
   - `@nofinite/media`: patch (NUICSS OKLCH token bridge integration).

### Phase 4: AI Engineering Rules & Constitutions Modernization

1. Update `d:\stack\AGENTS.md` with:
   - 9-stage engineering workflow: `UNDERSTAND → PLAN → STOP → APPROVAL → IMPLEMENT → VERIFY → DOCUMENT & VERSION → REVIEW → COMMIT`.
   - Two-tier commit vs release protocol.
   - Zero Downstream CSS Invariant.
   - Official Brand Taxonomy.
2. Update `d:\stack\.agents\rules\architecture.md` and `d:\stack\.agents\rules\release.md`.
3. Update `d:\nuix\AGENTS.md` and `d:\oss-docs\AGENTS.md` to guarantee ecosystem alignment.

---

## 5. Alternatives Considered

1. **Scattered `docs/` in each package:**
   - _Rejected:_ Clutters packages, makes cross-package guides difficult, and complicates `oss-docs` syncing.
2. **Single Git Submodule for `oss-docs`:**
   - _Rejected:_ Fragile in multi-developer setups, causes detached HEAD and submodule pointer conflicts.
3. **Automated Version Bumps on Every Local Commit:**
   - _Rejected:_ Bloats versions, causes version churn, and conflicts with local checkpoint safety commits.

---

## 6. Risks & Mitigations

| Risk                                             | Impact | Mitigation Strategy                                                                                                                                        |
| :----------------------------------------------- | :----- | :--------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Accidental Breaking Change to Existing Rules** | High   | Merge new rules cleanly by extending existing constitution sections without removing existing safeguards (e.g. "Green Test Fallacy", "Upstream Fix Rule"). |
| **Documentation Inconsistencies**                | Low    | Derive all package documentation directly from verified TypeScript exports and actual source implementations.                                              |
| **Changeset Tooling Conflicts**                  | Low    | Verify Changeset format against `.changeset/config.json` before committing.                                                                                |

---

## 7. Verification Strategy

1. **File System Verification:** Ensure all files exist in their target locations (`ARCHITECTURE.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `d:\stack\docs/**`, `CHANGELOG.md` in all packages).
2. **Changeset Validation:** Run `npx changeset status` in `d:\stack` to verify that the changeset is valid and recognized by the Changeset CLI.
3. **Git Status & Boundary Check:** Ensure no rogue `.css` files were created and all workspaces have clean working trees.
4. **Mandatory Savepoint Commit:** Create a local git commit checkpoint in `d:\stack` immediately after verification.

---

## 8. Rollback Considerations

Since this task creates documentation files, governance guides, and rule updates without altering compiled package runtime logic, rollback can be achieved cleanly via `git reset --hard HEAD~1` in the owning repository if needed.
