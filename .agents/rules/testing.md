# Testing & Verification Rules

## 1. Verification Is Mandatory

Every implementation must be verified at an appropriate level.

Verification may include:

- Unit tests
- Integration tests
- End-to-end tests
- Type checking
- Linting
- Build
- Runtime verification
- API validation
- Database validation

---

## 2. Run Verification in the Correct Repository

Always execute repository-specific verification from the repository that owns the changed code.

Do not assume workspace-level commands exist.

Before inventing a command, inspect:

- `package.json`
- `go.mod`
- `go.work`
- `project.json`
- `nx.json`
- Makefiles
- CI configuration
- Repository documentation

Use the project's existing commands whenever possible.

---

## 3. Multi-Repository Changes

If multiple repositories are changed:

- Verify each repository independently.
- Do not claim that one repository's tests verify another repository.
- Report results per repository.

---

## 4. Match Verification to Risk

### Small isolated change

Use relevant targeted verification.

### Feature

Use relevant:

- Tests
- Type checks
- Lint
- Build

### Architecture/API/database change

Use appropriate:

- Unit tests
- Integration tests
- Build
- Contract verification
- Migration verification
- Runtime checks

---

## 5. Existing Tests

Inspect existing tests before creating new ones.

Do not delete or weaken tests merely because they fail.

If approved behavior changes, update tests to reflect that behavior.

---

## 6. Test Failures

When a test fails:

1. Read the actual error.
2. Determine the root cause.
3. Determine whether the implementation caused it.
4. Fix the underlying problem where appropriate.
5. Never blindly modify tests to make them pass.

---

## 7. Reporting

Clearly report:

- Repository tested
- Command executed
- Result
- Failures
- Warnings
- Anything that could not be verified

Never claim successful verification without evidence.

## Stack UI Verification

For UI, styling, or interactive component changes, unit tests alone are insufficient.

Visual behavior MUST also be verified using appropriate browser inspection or Playwright-based verification.

Relevant screenshots or temporary visual artifacts must follow the repository's temporary-file rules.

Do not declare a UI change complete solely because unit tests pass.

## Compiled Artifact Verification

When diagnosing NUI or NUICSS build, styling, or generated-CSS issues, source-code inspection alone is insufficient.

When relevant, inspect:

- compiled CSS
- generated build chunks
- package distribution artifacts
- runtime computed styles

Do not claim that a token, class, or generated artifact does not exist solely because it was not found by searching source files.
