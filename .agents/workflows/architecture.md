# Architecture Change Workflow

Use this workflow for architectural changes.

Examples:

- New application
- New service
- New database
- New framework
- Major library change
- API redesign
- Authentication architecture
- Infrastructure redesign
- Major monorepo restructuring

---

## Phase 1 — Investigate

Understand the current architecture before proposing changes.

Identify:

- Existing components
- Dependencies
- Data flow
- Deployment model
- Interfaces
- Constraints
- Consumers

---

## Phase 2 — Alternatives

Consider reasonable alternatives.

For each meaningful option, document:

- Architecture
- Advantages
- Disadvantages
- Complexity
- Performance implications
- Maintenance implications
- Migration requirements

Do not declare an option "best" without explaining the criteria.

---

## Phase 3 — Plan

Create `implementation_plan.md`.

The plan must contain:

1. Problem
2. Current architecture
3. Proposed architecture
4. Alternatives
5. Decision rationale
6. Affected systems
7. Migration strategy
8. Compatibility
9. Security
10. Performance
11. Risks
12. Verification
13. Rollback strategy

---

## Phase 4 — STOP

Wait for explicit user approval.

Do not implement architectural changes before approval.

---

## Phase 5 — Implement

Implement the approved architecture.

If the implementation requires a materially different architecture:

STOP and request approval for the change.

---

## Phase 6 — Verify

Verify:

- Existing functionality
- New functionality
- Integration points
- Build
- Tests
- Performance where relevant
- Security where relevant

---

## Phase 7 — Review & Commit

Create a logical local commit in the affected repository.

Never commit at a workspace level unless the workspace itself is a Git repository.
