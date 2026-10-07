# Implementation Plan: Centralize Storybook, Resolve Nx Collision, Clean Git Artifacts & Fix Generator

## 1. Objective

1. **Centralize Storybook Architecture**: Hoist the monorepo Storybook configuration from `packages/nui/.storybook` to the workspace root (`.storybook`), eliminating Nx module boundary violations (`@nx/enforce-module-boundaries`), decoupling leaf package dependencies, and updating workspace scripts.
2. **Resolve Nx Project Graph Collision**: Add an explicit `project.json` for `packages/nuicss-cli` with project name `"nuicss-cli"`, restoring full functionality to Nx commands (`nx test`, `nx build`, `nx run nui:test`).
3. **Clean Up Git Artifacts & Stray Files**: Remove tracked temporary files (`debug-storybook.log`, `tsc-errors.txt`, `tsconfig.tsbuildinfo`, `docs/components/video.md`) and untracked tarballs (`nofinite-nui-3.0.6.tgz`) from `packages/nui`, and ensure `.gitignore` prevents future regressions.
4. **Fix Syntax & Module Errors in `generate.js`**: Convert `packages/nui/scripts/generate.js` to clean ES Module syntax, remove invalid escaped backticks, and align output exports with `src/index.ts`.

---

## 2. Current Behavior & Identified Problems

| Area                     | Current Behavior                                                                                                                                                                                                              | Problem                                                                                                                                                                                        |
| :----------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Storybook Config**     | Storybook configuration resides in `packages/nui/.storybook` and reaches out to `../../charts`, `../../markon`, `../../media`, `../../kanban`.                                                                                | Inverts monorepo architecture; creates Nx module boundary lint errors; tightly couples independent packages to `nui`; confuses developers on where Storybook lives.                            |
| **Nx Project Collision** | `packages/nuicss/project.json` is named `"nuicss"`. `packages/nuicss-cli` lacks a `project.json`, so Nx infers name `"nuicss"` from `package.json`.                                                                           | **Fatal blocker**: Any Nx command (`pnpm nx run nui:test`, `pnpm nx test`) crashes with `Failed to process project graph. The following projects are defined in multiple locations: - nuicss`. |
| **Git Artifacts**        | `debug-storybook.log`, `tsc-errors.txt`, and `tsconfig.tsbuildinfo` are tracked in git inside `packages/nui`. `nofinite-nui-3.0.6.tgz` (650KB) sits untracked. `docs/components/video.md` references decoupled `VideoPlayer`. | Pollutes git history; pollutes npm packages; confuses AI models and developers with stale documentation and error logs.                                                                        |
| **Component Generator**  | `packages/nui/scripts/generate.js` uses CommonJS `require()` in an ES module package and has escaped backticks (`console.error(\`Component...\`)`).                                                                           | Executing `pnpm run generate` crashes immediately with `SyntaxError: Invalid or unexpected token`.                                                                                             |

---

## 3. Proposed Solution

### Step 1: Centralize Storybook Configuration to Root (`.storybook`)

1. Create `.storybook/` at `d:\stack\.storybook/`:
   - `.storybook/main.ts`:
     - Update stories glob paths to point to `../packages/{nui,charts,markon,media,kanban}/src/**/*.stories.*`.
     - Update Vite plugin imports and aliases relative to root (`nuicssVitePlugin`, `tsconfigPaths`).
     - Point UnoCSS config to `resolve(__dirname, '../packages/nui/nuicss.config.ts')`.
   - `.storybook/preview.ts`:
     - Import `../packages/nuicss/dist/index.css`.
     - Import `NUIProvider` from `../packages/nui/src/components/nuiprovider/NUIProvider`.
     - Preserve theme detection decorator and story sort order (`['NUI', 'Charts', 'Markon', 'Media', 'Kanban']`).
   - `.storybook/test-runner.ts`:
     - Move from `packages/nui/.storybook/test-runner.ts`.
2. Remove `packages/nui/.storybook/`.
3. Update `d:\stack\package.json`:
   - Change `"storybook"` script to: `"storybook dev -p 6006 -c .storybook"`.
   - Change `"build:storybook"` script to: `"storybook build -c .storybook -o dist/storybook"`.
4. Update `packages/nui/package.json`:
   - Update `"test-storybook"` script to reference root config if needed: `"test-storybook -c ../../.storybook"`.

### Step 2: Fix Nx Project Collision (`packages/nuicss-cli`)

1. Create `packages/nuicss-cli/project.json`:
   ```json
   {
     "name": "nuicss-cli",
     "$schema": "../../node_modules/nx/schemas/project-schema.json",
     "sourceRoot": "packages/nuicss-cli",
     "projectType": "library",
     "targets": {
       "build": {
         "executor": "nx:run-commands",
         "options": {
           "command": "powershell -ExecutionPolicy Bypass -File ./build.ps1",
           "cwd": "packages/nuicss-cli"
         }
       },
       "typecheck": {
         "executor": "nx:run-commands",
         "options": {
           "command": "tsc --noEmit",
           "cwd": "packages/nuicss-cli"
         }
       }
     }
   }
   ```
2. Verify Nx resolves the project graph without errors: `pnpm nx show projects`.

### Step 3: Clean Up Git Artifacts & Stale Docs

1. Remove tracked artifacts from git index and disk:
   - `git rm packages/nui/debug-storybook.log`
   - `git rm packages/nui/tsc-errors.txt`
   - `git rm --cached packages/nui/tsconfig.tsbuildinfo` (remove file from disk)
   - `git rm packages/nui/docs/components/video.md`
2. Remove untracked tarball:
   - Delete `packages/nui/nofinite-nui-3.0.6.tgz`.
3. Update root `.gitignore`:
   - Ensure `debug-*.log`, `tsc-errors.txt`, and `*.log` patterns are ignored.

### Step 4: Fix Syntax & Module Architecture in `packages/nui/scripts/generate.js`

1. Rewrite `packages/nui/scripts/generate.js` as an ES Module:
   - Use `import fs from 'node:fs'`, `import path from 'node:path'`, `import readline from 'node:readline'`, `import { fileURLToPath } from 'node:url'`.
   - Define `__dirname = path.dirname(fileURLToPath(import.meta.url))`.
2. Fix all syntax errors:
   - Replace escaped backticks ` \`` with valid template literals ``  ` ``.
   - Replace escaped interpolations `\${` with `${`.
3. Fix export targeting:
   - Target `src/index.ts` (instead of non-existent `src/components/index.ts`) so newly generated components are correctly exported.
4. Verify by running the script with test input or verifying syntax via Node.js compiler check.

---

## 4. Affected Files & Modules

| File / Directory                        | Change Description                                                                      |
| :-------------------------------------- | :-------------------------------------------------------------------------------------- |
| `packages/nuicss-cli/project.json`      | **CREATE**: Define explicit unique Nx project name `"nuicss-cli"`.                      |
| `.storybook/main.ts`                    | **CREATE**: Centralized Storybook configuration pointing to all package sources.        |
| `.storybook/preview.ts`                 | **CREATE**: Centralized Storybook preview decorator and styling setup.                  |
| `.storybook/test-runner.ts`             | **CREATE**: Centralized Storybook test runner hooks.                                    |
| `packages/nui/.storybook/`              | **DELETE**: Remove old package-scoped configuration directory.                          |
| `package.json` (root)                   | **UPDATE**: Point `storybook` and `build:storybook` scripts to `-c .storybook`.         |
| `packages/nui/package.json`             | **UPDATE**: Point `test-storybook` to root `.storybook`.                                |
| `packages/nui/scripts/generate.js`      | **UPDATE**: Convert to ESM, fix syntax errors and backtick escaping, fix export target. |
| `packages/nui/debug-storybook.log`      | **DELETE (git rm)**: Remove tracked debug log.                                          |
| `packages/nui/tsc-errors.txt`           | **DELETE (git rm)**: Remove tracked error dump.                                         |
| `packages/nui/tsconfig.tsbuildinfo`     | **DELETE (git rm)**: Remove tracked tsbuildinfo cache.                                  |
| `packages/nui/nofinite-nui-3.0.6.tgz`   | **DELETE**: Remove untracked npm tarball.                                               |
| `packages/nui/docs/components/video.md` | **DELETE (git rm)**: Remove stale video documentation.                                  |
| `.gitignore`                            | **UPDATE**: Add explicit rules for debug logs and error text dumps.                     |

---

## 5. Verification Strategy

1. **Nx Project Graph Check**: Run `pnpm nx show projects` and ensure all 8 packages (`charts`, `kanban`, `locale`, `markon`, `media`, `nui`, `nuicss`, `nuicss-cli`) are recognized without collisions.
2. **Nx Test Execution**: Run `pnpm nx run nui:test` to confirm the target executor runs successfully.
3. **Storybook Validation**: Test Storybook configuration parsing (`pnpm exec storybook --version` or dry run build check).
4. **Generator Script Test**: Run `node packages/nui/scripts/generate.js` to ensure zero syntax or ESM loading errors.
5. **Git Status & Artifact Check**: Confirm `git status` shows clean tracking, artifacts removed, and no untracked garbage.

---

## 6. Risks & Rollback

- **Risk**: Storybook resolution of `@nofinite/nuicss` styles if `dist` is not compiled.  
  _Mitigation_: Point preview imports directly or ensure build order is preserved.
- **Rollback**: Local git commit will be created immediately upon completion, allowing instant revert if needed.
