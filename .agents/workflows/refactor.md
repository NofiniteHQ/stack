# Refactoring Workflow

Use this workflow when changing internal structure without intentionally changing behavior.

## 1. Understand

Identify:

- Current behavior
- Current architecture
- Dependencies
- Consumers
- Public interfaces
- Tests
- Repository boundary

---

## 2. Define Invariants

Identify behavior that must remain unchanged.

Examples:

- API contracts
- Return values
- Database behavior
- Authentication behavior
- Component behavior
- Public exports

---

## 3. Plan

Create or update:

`implementation_plan.md`

Include:

- Current structure
- Problem with current structure
- Target structure
- Files/modules affected
- Migration steps
- Compatibility
- Risks
- Verification
- Rollback

---

## 4. STOP

**STOP HERE.**

Do not modify source code.

Present the plan and wait for explicit approval.

---

## 5. Approval

Proceed only after explicit approval.

If the target architecture changes materially:

- Update the plan.
- STOP again.

---

## 6. Implement

Restructure the approved areas.

Do not combine unrelated feature work with the refactor.

Preserve approved behavioral invariants.

---

## 7. Verify

Run the appropriate tests, type checks, linting, and builds.

Verify that intended behavior remains unchanged.

---

## 8. Review

Inspect the complete diff.

Look specifically for accidental behavior changes.

---

## 9. Commit

Create a logical local commit in the repository that owns the refactored code.
