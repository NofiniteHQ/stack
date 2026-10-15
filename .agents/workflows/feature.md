# Feature Workflow

Use this workflow for new features or meaningful functionality changes.

## Phase 1 — Understand

Inspect:

- Relevant applications
- Libraries
- Existing similar functionality
- APIs
- Data models
- Configuration
- Tests

Determine:

- Current behavior
- Desired behavior
- Affected areas
- Dependencies
- Compatibility requirements

---

## Phase 2 — Plan

Create `temp/<project>_implementation_plan.md`.

Include:

1. Objective
2. Current implementation
3. Proposed implementation
4. Files/modules affected
5. Data/API changes
6. Dependencies
7. Alternatives
8. Risks
9. Verification

---

## Phase 3 — STOP

Do not implement.

Wait for explicit user approval.

---

## Phase 4 — Implement

Follow only the approved scope.

If implementation reveals a major architectural issue:

STOP and update the plan.

Do not silently change the approved architecture.

---

## Phase 5 — Verify

Run relevant:

- Tests
- Type checks
- Lint
- Build
- Runtime verification

---

## Phase 6 — Review

Inspect the final diff.

Remove temporary/debug artifacts.

---

## Phase 7 — Commit

Create a logical local commit in the affected repository.

Never commit at a workspace level unless the workspace itself is a Git repository.

## Stack GitFlow Promotion

Stack uses the following branch promotion model:

feature/fix/chore
↓
dev
↓
main

- Feature, fix, and chore branches target `dev`.
- `dev` is the integration and staging branch.
- `dev` targets `main` for production releases.
- Never merge directly into `main`.
- After a production release updates `main`, synchronize `main` back into `dev`.
- Before opening a PR targeting `dev`, verify whether `origin/main` contains changes missing from the working branch. Resolve required upstream differences before opening the PR.
