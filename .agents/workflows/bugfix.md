# Bug Fix Workflow

Use this workflow for bugs that affect behavior.

## 1. Understand

Inspect:

- Relevant repository
- Relevant files
- Execution path
- Existing tests
- Related implementations

Determine the actual behavior before modifying code.

---

## 2. Reproduce

When possible:

- Reproduce the problem.
- Capture the actual error.
- Identify the affected environment.
- Determine whether the issue is deterministic.

Do not fix a bug based solely on assumptions.

---

## 3. Identify Root Cause

Determine:

- What is failing?
- Why is it failing?
- Which module owns the behavior?
- What existing behavior must remain unchanged?

---

## 4. Plan

Create or update:

`temp/<project>_implementation_plan.md`

Include:

- Reproduction
- Root cause
- Proposed fix
- Affected repository
- Affected files
- Regression prevention
- Verification

---

## 5. STOP

**STOP HERE.**

Do not modify source code.

Present the plan to the user.

Wait for explicit approval.

---

## 6. Approval

Proceed only after explicit user approval.

If the user changes the requested solution:

- Update the plan.
- STOP again.

---

## 7. Implement

Make the smallest correct fix.

Do not perform unrelated refactoring.

If the actual root cause differs materially from the approved plan:

**STOP and update the plan.**

---

## 8. Verify

Verify:

- Original issue is fixed.
- Existing behavior remains intact.
- Appropriate regression coverage exists.

Run verification inside the repository that owns the change.

---

## 9. Review

Review the repository's final diff.

Confirm no unrelated files are included.

---

## 10. Commit

Create a logical local commit in the affected repository.

Never commit at a workspace level unless the workspace itself is a Git repository.
