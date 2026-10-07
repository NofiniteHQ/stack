# Implementation Plan: Fix Broken Storybook Migration and Runtime Rendering

## Objective

Restore full functionality, runtime stability, proper styling, and clean navigation hierarchy for the centralized Storybook across all packages in the monorepo (`@nofinite/nui`, `@nofinite/charts`, `@nofinite/markon`, `@nofinite/media`, `@nofinite/kanban`), strictly adhering to `@nofinite/nuicss` as the sole source of truth for all styles and design tokens.

---

## Current Behavior & Problem Diagnosis

Following the recent Storybook centralization from `packages/nui/.storybook` to the root `.storybook`, several systemic and visual regressions occurred:

1. **Systemic Runtime Crash (`ReferenceError: React is not defined`):**
   - **Root Cause:** In the previous setup, Storybook ran from `packages/nui/`, where Vite automatically loaded `packages/nui/vite.config.ts` containing `react()` (`@vitejs/plugin-react`). In the root `.storybook/main.ts`, Vite had no `@vitejs/plugin-react` plugin. Without the React plugin, Vite defaulted to raw esbuild compilation without the automatic JSX runtime (`react/jsx-runtime`), producing `React.createElement(...)` calls in bundled story files. Because modern React 18/19 components and CSF stories do not explicitly include `import React from 'react'`, this caused a fatal `ReferenceError: React is not defined` runtime exception on every single story and autodocs page that uses JSX.
2. **Missing NUICSS Utility Classes in Decoupled Packages (`packages/nui/nuicss.config.ts` Path Mismatch):**
   - **Root Cause:** In `packages/nui/nuicss.config.ts`, lines 10–14 configured UnoCSS `content.filesystem` with:
     ```ts
     '../../markon/src/**/*.{js,ts,jsx,tsx}',
     '../../media/src/**/*.{js,ts,jsx,tsx}',
     '../../charts/src/**/*.{js,ts,jsx,tsx}',
     '../../kanban/src/**/*.{js,ts,jsx,tsx}',
     ```
     Because `nuicss.config.ts` resides in `packages/nui/`, resolving `../../markon` points to `d:\stack\..\markon` (outside the monorepo). As a result, UnoCSS silently failed to scan any source code from `markon`, `media`, `charts`, or `kanban`. The NUICSS classes and design tokens consumed by those components were never generated in `uno.css`, leaving the components unstyled or broken in Storybook.
     Additionally, line 3 imported `../../nuicss/src/plugin/preset`, which also resolves outside the workspace.
3. **Redundant & Clashing Storybook Navigation Hierarchy:**
   - **Root Cause:** `.storybook/main.ts` sets `titlePrefix` for each package (`NUI`, `Charts`, `Markon`, `Media`, `Kanban`). However, individual story files had titles that repeated or collided with the prefix:
     - `MarkonEditor.stories.tsx`: `title: 'Markon/MarkonEditor'` -> rendered as `Markon > Markon > MarkonEditor`
     - `MediaPlayer.stories.tsx`: `title: 'Media/Player'` -> rendered as `Media > Media > Player`
     - `Kanban.stories.tsx`: `title: 'Kanban'` -> rendered as `Kanban > Kanban`
     - `Chart.stories.tsx`: `title: 'Data Visualization/Chart'` -> rendered as `Charts > Data Visualization > Chart`

---

## Proposed Solution

### 1. Enable React JSX Transform in `.storybook/main.ts`

- Import `@vitejs/plugin-react` and include `react()` in `viteConfig.plugins` inside `viteFinal`.
- Set `esbuild: { jsx: 'automatic' }` as defensive redundancy so all JSX transpiles to `react/jsx-runtime`.

### 2. Fix UnoCSS Content Scanning in `packages/nui/nuicss.config.ts`

- Change `../../nuicss/src/plugin/preset` to `../nuicss/dist/index.mjs` (or `../nuicss/src/plugin/preset`).
- Correct the relative globs for all sibling packages:
  - `'../markon/src/**/*.{js,ts,jsx,tsx}'`
  - `'../media/src/**/*.{js,ts,jsx,tsx}'`
  - `'../charts/src/**/*.{js,ts,jsx,tsx}'`
  - `'../kanban/src/**/*.{js,ts,jsx,tsx}'`
- Ensure UnoCSS scans every package and generates all NUICSS superclasses and utility tokens into `uno.css`.

### 3. Ensure Design Token & Base CSS Parity in `.storybook/preview.ts`

- Retain `@nofinite/nuicss` as the single source of truth for styles.
- In `.storybook/preview.ts`, ensure `uno.css` and `../packages/nuicss/dist/index.css` (or `../packages/nuicss/dist/styles.css`) are loaded so all design tokens and precompiled styles are available to every story.

### 4. Normalize Story Titles Across Decoupled Packages

- Update story metadata titles to work harmoniously with `titlePrefix`:
  - `packages/charts/src/react/Chart.stories.tsx`: `title: 'Chart'` (renders cleanly as `Charts/Chart`)
  - `packages/markon/src/react/MarkonEditor.stories.tsx`: `title: 'Editor'` (renders cleanly as `Markon/Editor`)
  - `packages/media/src/react/MediaPlayer.stories.tsx`: `title: 'Player'` (renders cleanly as `Media/Player`)
  - `packages/kanban/src/react/Kanban.stories.tsx`: `title: 'Board'` (renders cleanly as `Kanban/Board`)

---

## Affected Files & Modules

- `.storybook/main.ts` (Vite plugins: `@vitejs/plugin-react`, esbuild JSX options)
- `packages/nui/nuicss.config.ts` (Path fixes for filesystem globs and nuicss preset)
- `.storybook/preview.ts` (Clean token/styles loading)
- `packages/charts/src/react/Chart.stories.tsx` (Title normalization)
- `packages/markon/src/react/MarkonEditor.stories.tsx` (Title normalization)
- `packages/media/src/react/MediaPlayer.stories.tsx` (Title normalization)
- `packages/kanban/src/react/Kanban.stories.tsx` (Title normalization)

---

## Dependencies & Tools

- `@vitejs/plugin-react` (already present in repository `node_modules`)
- `@nofinite/nuicss` (sole styling and token engine)
- `@playwright/test` / Playwright runner in `temp/` for automated visual and runtime error verification
- `storybook build` / `storybook dev`

---

## Alternatives Considered

- **Keep `titlePrefix` off and manually namespace stories:** Having `titlePrefix` in `.storybook/main.ts` is cleaner because each package directory maintains its own namespace automatically without hardcoding monorepo top-level folders inside individual packages.

---

## Risks & Mitigations

- **Build Performance:** `@vitejs/plugin-react` adds standard React Fast Refresh and Babel JSX transform, which has minimal overhead during Vite builds.
- **Token Availability:** Using `@nofinite/nuicss` ensures 100% token consistency across all components without any ad-hoc CSS overrides.

---

## Security Considerations

None. These changes affect development build configurations and story files only.

---

## Verification Strategy

1. **Build Validation:** Run `pnpm run build:storybook` to ensure zero compilation or asset errors.
2. **Automated Runtime Verification:** Run `node temp/audit_storybook.js` via Playwright to verify that:
   - Zero console errors or `ReferenceError: React is not defined` occur across all 450+ stories and docs.
   - All story pages render `#storybook-root` and docs blocks without error boundaries.
3. **Visual Verification:** Check rendered output of Markon, Media, Charts, Kanban, and NUI Button/Modal in Playwright to verify full NUICSS styling and layout harmony.

---

## Rollback Considerations

If issues occur, changes are isolated to `.storybook/`, `nuicss.config.ts`, and story metadata titles, which can be cleanly reverted via Git.
