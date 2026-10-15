# Dependency Change Workflow

Use this workflow when adding, removing, upgrading, or replacing dependencies.

## 1. Understand

Identify:

- Which repository is affected.
- Which application/library uses the dependency.
- Existing dependencies serving the same purpose.
- Current version and constraints.
- Runtime/build impact.

---

## 2. Evaluate

Determine whether the dependency is actually necessary.

Consider:

- Existing project capabilities
- Compatibility
- Maintenance
- Security
- License
- Performance
- Bundle/runtime impact
- Long-term maintenance

Compare reasonable alternatives when the decision is significant.

---

## 3. Plan

Create or update:

`temp/<project>_implementation_plan.md`

Include:

- Dependency
- Purpose
- Current solution
- Alternatives
- Reason for selection
- Version strategy
- Compatibility
- Security considerations
- Verification

---

## 4. STOP

**STOP HERE.**

Do not install or modify dependencies.

Present the plan and wait for explicit approval.

---

## 5. Approval

Proceed only after explicit approval.

---

## 6. Implement

Modify only the affected repository.

Update the appropriate dependency manifest and lockfile.

Do not upgrade unrelated packages.

---

## 7. Verify

Verify:

- Dependency installation
- Lockfile consistency
- Type checking
- Tests
- Build
- Relevant runtime behavior

---

## 8. Review

Review:

- Dependency manifest
- Lockfile
- Diff
- Unintended dependency changes

---

## 9. Commit

Create a logical local commit in the affected repository.
