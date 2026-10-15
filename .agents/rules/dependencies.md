# Dependency & Tool Rules

## 1. Existing Dependencies First

Before adding a package:

1. Inspect existing dependencies.
2. Search the repository for an existing solution.
3. Determine whether the requirement can be solved without a new dependency.

Do not add a dependency when existing project capabilities are sufficient.

---

## 2. Evaluate New Dependencies

When a new dependency is necessary, consider:

- Compatibility
- Maintenance status
- Security
- License
- Performance
- Bundle/runtime impact
- Ecosystem maturity
- Developer experience
- Long-term maintenance cost

For significant dependencies, compare reasonable alternatives.

---

## 3. Repository Compatibility

A dependency must fit the existing architecture.

Do not introduce:

- A second framework for the same purpose
- A competing state-management system
- A duplicate utility library
- A second styling system
- An unnecessary runtime

without explicit architectural justification.

---

## 4. Version Changes

Do not upgrade unrelated dependencies while implementing a feature.

Dependency upgrades must have their own justification.

Major upgrades require:

- Compatibility review
- Migration analysis
- Testing
- Explicit approval when they materially affect the project

## Stack Lockfile Policy

When dependencies are added, updated, or removed:

1. Update the dependency installation state using the repository's package manager.
2. Ensure `pnpm-lock.yaml` is updated consistently.
3. Verify the resulting dependency graph.
4. Commit the lockfile when it is part of the approved dependency change.

CI must remain compatible with `pnpm install --frozen-lockfile`.
