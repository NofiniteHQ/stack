# Git Rules

## 1. Repository-Aware Git

The workspace may contain:

- A single Git repository
- A monorepo
- Multiple independent Git repositories
- Git and non-Git directories together

Never assume that the workspace root is a Git repository.

Before performing any Git operation, determine which Git repository owns the files being changed.

The workspace is an organizational boundary, not necessarily a Git boundary.

---

## 2. Identify the Owning Repository

For every file being changed:

1. Determine whether the file is inside a Git repository.
2. Identify the root of that Git repository.
3. Treat that repository as the owning repository for the file.
4. Perform Git operations against that repository only.

Use repository-targeted Git commands:

```bash
git -C <repository> status
git -C <repository> diff
git -C <repository> add <exact-file>
git -C <repository> commit
```

Do not assume that the current working directory is the Git repository.

Do not use `cd` as part of Git instructions. Use `git -C <repository>` or the tool's working-directory mechanism when available.

---

## 3. Single Repository

If the workspace itself is a Git repository:

```text
workspace/
├── .git/
├── apps/
├── libs/
└── packages/
```

The workspace root is the repository root.

Git operations may target the workspace repository:

```bash
git -C <workspace> status
git -C <workspace> diff
```

---

## 4. Monorepo

If multiple applications, libraries, or packages belong to one Git repository:

```text
workspace/
├── .git/
├── apps/
├── libs/
└── packages/
```

Treat the common Git root as the single repository boundary.

Changes to different applications or libraries within that repository belong to the same Git repository.

Do not create separate commits merely because files belong to different applications or libraries.

---

## 5. Multi-Repository Workspace

If the workspace contains multiple independent Git repositories:

```text
workspace/
├── service-a/
│   └── .git/
├── service-b/
│   └── .git/
└── service-c/
    └── .git/
```

Each repository must be handled independently.

A change inside `service-a/` belongs to the `service-a` repository.

A change inside `service-b/` belongs to the `service-b` repository.

Never commit files from one repository into another repository.

Never create a workspace-level commit when the workspace itself is not a Git repository.

---

## 6. Mixed Git and Non-Git Workspace

A workspace may contain both Git repositories and directories that are not tracked by Git:

```text
workspace/
├── service-a/
│   └── .git/
├── service-b/
│   └── .git/
├── scripts/
└── shared-config/
```

If a changed file is not inside a Git repository:

- Do not initialize Git automatically.
- Do not create a parent repository automatically.
- Do not invent a commit location.
- Do not claim the change was committed.

If version control is required for that location, ask the user how it should be tracked.

---

## 7. Workspace-Level Files

Workspace-level files may exist outside any Git repository, for example:

- `AGENTS.md`
- `.agents/`
- Workspace documentation
- Shared configuration
- Workspace-level scripts

Before committing such files, determine which Git repository owns them.

If no Git repository owns them, leave them uncommitted unless the user explicitly requests a version-control change.

Do not create a parent repository automatically.

---

## 8. Multi-Repository Tasks

If one approved task affects multiple independent repositories:

1. Identify every affected repository.
2. List the affected repositories in `temp/<project>_implementation_plan.md`.
3. Check the status of every affected repository.
4. Implement only the approved changes.
5. Verify each repository independently.
6. Review each repository independently.
7. Create a separate logical commit in each affected repository.

Example:

```text
Task
├── auth repository
│   └── commit
│
└── account repository
    └── commit
```

Never combine independent repository changes into a single synthetic parent commit.

---

## 9. Existing Changes

Before modifying a Git repository, check its current status:

```bash
git -C <repository> status
```

Identify any pre-existing changes.

Pre-existing user changes MUST be preserved.

Never:

- Reset them
- Clean them
- Revert them
- Overwrite them
- Include them accidentally in a commit

If it is unclear which changes belong to the current task, stop and ask the user.

---

## 10. Staging

NEVER use:

```bash
git add .
git add -A
git commit -a
```

Always stage files explicitly:

```bash
git -C <repository> add <exact-file>
```

Only stage files that belong to the approved task.

If multiple files are part of the approved task, explicitly list those files.

Never rely on the current working tree being clean as justification for using blanket staging.

---

## 11. Diff Review

Before committing, inspect the affected repository:

```bash
git -C <repository> diff
git -C <repository> status
```

Confirm:

- Only intended files changed.
- Only approved changes are staged.
- No unrelated user changes are included.
- No secrets are included.
- No temporary files are included.
- No debug artifacts are included.
- No unrelated refactoring is included.

---

## 12. Commit

Create a commit only after:

1. The implementation was explicitly approved when required.
2. The approved implementation is complete.
3. Appropriate verification succeeds.
4. The final diff has been reviewed.
5. Only task-related files are staged.

Create the commit in the Git repository that owns the changed files.

Use a logical commit message describing the completed change.

Never create a commit in a parent workspace merely because multiple repositories are present.

---

## 13. Remote Operations

Do not perform remote Git operations unless explicitly requested.

This includes:

- Push
- Force push
- Pull
- Fetch
- Remote branch creation
- Remote branch deletion
- History rewriting
- Tag pushing

Never force push or rewrite history unless the user explicitly requests it.

---

## 14. Parent Repository

Never create or assume a parent Git repository merely because multiple repositories exist inside the same workspace.

If the workspace root has no `.git` repository, it is not a Git repository.

Do not create a parent commit.

Child repositories remain independent.

---

## 15. Repository-Aware Commit Rule

The final rule is:

> **Changes are committed to the Git repository that owns the changed files, not necessarily the workspace containing those files.**

This rule applies equally to:

- Single repositories
- Monorepos
- Multi-repository workspaces
- Mixed Git/non-Git workspaces
