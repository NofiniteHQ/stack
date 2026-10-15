# Coding Rules

## 1. General Principles

Write code that is:

- Clear
- Minimal
- Maintainable
- Consistent with the repository
- Easy to test
- Easy to review

Prefer readability over cleverness.

---

## 2. Existing Code Style

Follow the project's existing:

- Naming conventions
- Formatting
- File organization
- Error handling
- Type conventions
- Import conventions
- Component patterns
- API patterns

Do not introduce a competing style.

---

## 3. Minimal Changes

Modify only what is necessary.

Avoid rewriting working code without a concrete reason.

Do not change unrelated code merely because it could be improved.

---

## 4. Duplication

Before creating new functionality:

- Search for similar implementations.
- Reuse existing utilities where appropriate.
- Avoid creating duplicate abstractions.

Do not prematurely extract abstractions solely to eliminate a small amount of duplication.

---

## 5. Error Handling

Errors should:

- Be handled at the appropriate boundary.
- Preserve useful diagnostic information.
- Avoid leaking secrets or sensitive data.
- Follow existing project conventions.

Never silently swallow errors unless that behavior is intentional and documented.

---

## 6. Comments

Prefer self-explanatory code.

Add comments when they explain:

- Why something exists
- Why a non-obvious approach is required
- Important constraints
- Security considerations
- Compatibility workarounds

Do not add comments that merely restate the code.

---

## 7. Dead Code

Do not leave:

- Debug statements
- Temporary logging
- Commented-out implementations
- Unused imports
- Unused variables
- Experimental code

unless explicitly required.
