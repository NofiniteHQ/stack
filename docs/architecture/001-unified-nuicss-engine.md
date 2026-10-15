# ADR 001: Unified NUICSS Engine and Elimination of Downstream Stylesheets

- **Status:** Accepted
- **Date:** 2026-10-13
- **Author:** Nofinite Core Architecture Team
- **Applies to:** `@nofinite/nuicss`, `@nofinite/kanban`, `@nofinite/markon`, `@nofinite/charts`, `@nofinite/media`, `@nofinite/nui`

---

## Context

Prior to this decision, the Nofinite ecosystem suffered from "dual-track styling":

1. **Import Fatigue:** End users installing `@nofinite/kanban`, `@nofinite/markon`, or `@nofinite/charts` had to import separate package-specific stylesheets (`@nofinite/kanban/styles.css`, `@nofinite/markon/styles.css`, etc.) in addition to `@nofinite/nuicss/styles.css`.
2. **Silent Broken Visuals:** Forgetting to import a secondary stylesheet resulted in completely collapsed or unstyled components without any TypeScript or build error.
3. **Severe Bundle Bloat:** Bundlers (Vite/Rollup) in downstream packages duplicated resets and base tokens, causing `@nofinite/charts/styles.css` to emit a redundant 196.9 kB duplicate copy of NUICSS, and duplicating over 400 kB of CSS across the ecosystem.
4. **Cascade & Specificity Hazards:** Different import orders between `@nofinite/nuicss/styles.css` and package stylesheets caused CSS `@layer` rules and OKLCH token overrides to clash unpredictably.

---

## Decision

We establish the **Zero Downstream CSS Invariant**:

1. **NUICSS as the Sole CSS Engine:**  
   All component styling, layout geometry, drag-and-drop drop-indicators, rich-text editor chrome, floating bubble menus, and animation tokens across the entire ecosystem are authored and compiled exclusively in `packages/nuicss`.
2. **Consolidation of Layout Rules:**
   - All 455 lines of Kanban board and drag-and-drop indicator geometry from `packages/kanban/src/styles.css` were consolidated into `packages/nuicss/src/styles/theme.css` Section 15.c.
   - All Markon toolbar, footer, and floating bubble menu pill styles (`.markon-bubble-menu`) were consolidated into `packages/nuicss/src/styles/theme.css` Section 6.
   - The Vidstack player OKLCH token bridge (`.nui-vidstack-player`, `--media-brand`) was integrated into `packages/nuicss/src/styles/theme.css` Section 15.d.
3. **Modular Subpath Generation:**  
   NUICSS compiles and emits dedicated modular subpaths alongside the unified bundle:
   - `@nofinite/nuicss/styles.css` — Complete ecosystem stylesheet (default).
   - `@nofinite/nuicss/kanban.css` — Modular Kanban board & DND geometry.
   - `@nofinite/nuicss/markon.css` — Modular Markon editor & TipTap styles.
   - `@nofinite/nuicss/widgets.css` — Combined modular domain widgets.
4. **Backward Compatibility Shims:**  
   Downstream package stylesheets (`packages/kanban/dist/styles.css`, `packages/charts/dist/styles.css`, `packages/markon/dist/markon.css`) were replaced with ultra-lightweight `@import '@nofinite/nuicss/styles.css'` shims (under 300 bytes), guaranteeing zero breakage for existing applications.

---

## Consequences

### Positive:

- **Single Import:** End users only need `import '@nofinite/nuicss/styles.css'` (or a single CDN `<link>`) to style every component in the ecosystem.
- **Massive Weight Reduction:** Over 400 kB of redundant compiled CSS was eliminated from downstream packages.
- **Unified Theming:** Switching OKLCH theme tokens automatically reskins Kanban, Markon, Charts, and Media in sync without separate overrides.
- **Zero Regression:** Visual Playwright testing confirmed 100% visual and layout fidelity across all components.

### Negative / Trade-offs:

- Any new component-level CSS required by domain packages must be authored upstream in `packages/nuicss` rather than inside the downstream package repository.
