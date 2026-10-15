# Contributing to the Nofinite Ecosystem

Thank you for your interest in contributing to the Nofinite open-source ecosystem! This document outlines our development workflows, coding standards, commit policies, and architectural requirements.

---

## 1. Getting Started

### Prerequisites

- **Node.js:** `>= 20.0.0`
- **Package Manager:** `pnpm` (`corepack enable && corepack prepare pnpm@latest --activate`)

### Setup

```bash
# Clone the repository
git clone https://github.com/nofinite/stack.git
cd stack

# Install dependencies across all packages
pnpm install

# Build the entire ecosystem
pnpm build

# Run tests
pnpm test
```

---

## 2. GitFlow Branch Promotion Model

We follow a structured GitFlow promotion strategy:

```
feature/fix/chore branches
          │
          ▼
         dev        (Integration & staging branch - PRs target dev)
          │
          ▼
        main        (Production release branch)
```

- **Feature, Fix & Chore Branches:** Create branch from `dev` (`git checkout -b feat/kanban-keyboard-nav`).
- **Target `dev`:** All PRs and daily development target `dev`.
- **Never Commit Directly to `main`:** Releases are promoted from `dev` to `main` during official release cuts.
- Before opening a PR targeting `dev`, ensure your branch is rebased on the latest `dev`.

---

## 3. Commit Etiquette & The Two-Tier Release Protocol

### Tier 1 — Frequent Local Checkpoints (Safety Savepoints)

We strongly enforce making frequent local git commits after every working functional change.

- **Why?** Frequent local commits act as safety savepoints to ensure you never lose working code and can immediately `git reset` if an experiment fails.
- **Local commits are NOT NPM releases.** Do not bump `package.json` version fields on local commits.
- **Format:** Use standard Conventional Commits:
  - `feat(kanban): add multi-column drag drop reordering`
  - `fix(markon): prevent cursor jump on image paste`
  - `refactor(nuicss): consolidate badge superclasses`

### Tier 2 — Changesets (Pre-Release Intent Tracking)

When you complete a publishable feature, bugfix, or breaking change in any package under `packages/*`:

1. Create a Changeset file:
   ```bash
   pnpm changeset
   ```
   Or create a `.changeset/<descriptive-name>.md` file directly.
2. Select the affected packages and specify the SemVer impact:
   - `patch`: Backward-compatible bug fixes and minor styling refinements.
   - `minor`: Backward-compatible new components, props, or features.
   - `major`: Breaking API changes or removals.
3. Commit the Changeset file alongside your implementation.

---

## 4. The Zero Downstream CSS Invariant

When authoring or modifying components in **NUI**, **Nofinite Kanban**, **Nofinite Markon**, **Nofinite Charts**, **Nofinite Media**, **Nofinite Locale**, or **Nofinite Utils**:

- **NEVER create new `.css` files** in downstream package directories.
- **ALL styling belongs in NUICSS (`packages/nuicss`):**
  - Component layouts, drag-and-drop indicators, toolbar styles, animations, and OKLCH color maps must be authored directly in `packages/nuicss/src/styles/theme.css` or modular subpaths.
  - Downstream components only apply semantic NUICSS superclasses (`kanban-board`, `markon-editor`, `btn`, `card`, `badge`).
- **Why this is strictly enforced:** Users must only ever need to import `@nofinite/nuicss/styles.css` to use any component across our entire ecosystem.

---

## 5. Central Documentation Standards (`d:\stack\docs/`)

Whenever you introduce a new component, prop, or feature:

1. **Update Central Docs:** Add or update the corresponding Markdown documentation in `d:\stack\docs/<package-name>/`.
2. **Keep Package READMEs Lean:** Keep `packages/<package-name>/README.md` focused on installation, basic zero-config usage, and links to full documentation.
3. **Pure Markdown Only:** Central docs in `stack` must be standard GitHub-flavored Markdown without Next.js-specific imports, ensuring they can be read offline in an IDE and consumed cleanly by our public docs website (`d:\oss-docs`).

---

## 6. Visual & Quality Verification

Before declaring any UI task complete:

1. **Unit tests are not enough:** Unit tests (`pnpm test`) only verify DOM presence and props logic; they do NOT prove visual aesthetics, spatial harmony, or layout rendering.
2. **Visual Verification:** Always perform visual inspection (browser preview or screenshot in `/temp/`) to ensure borders, colors, and layout geometry render flawlessly.
3. **NPM Output Verification:** Before finalizing changes, run `npm pack --dry-run` in the affected package directory to verify that all compiled artifacts (`dist/`) are present.

---

## 7. Community & Ethics

All contributors are expected to uphold our standards of respectful, collaborative, and inclusive communication. Please review our [Code of Conduct](./CODE_OF_CONDUCT.md) before contributing.
