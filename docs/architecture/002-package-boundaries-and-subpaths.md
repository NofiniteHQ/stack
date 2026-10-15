# ADR 002: Headless Package Boundaries and Subpath Exports

- **Status:** Accepted
- **Date:** 2026-10-13
- **Author:** Nofinite Core Architecture Team
- **Applies to:** `@nofinite/nui`, `@nofinite/kanban`, `@nofinite/markon`, `@nofinite/charts`, `@nofinite/media`, `@nofinite/locale`, `@nofinite/utils`

---

## Context

A scalable component ecosystem must achieve two competing goals:

1. Provide highly capable, accessible, interactive components out of the box (e.g. Kanban drag-and-drop, rich Markdown editor, chart tooltips).
2. Maintain minimal bundle impact, zero vendor lock-in, and strict separation between behavioral logic and visual styling.

Without strict package boundary rules, packages easily introduce hidden runtime CSS engines, hardcode style objects, leak private internal build packages into public bundles, or prevent proper tree-shaking.

---

## Decision

1. **Headless & Polymorphic Logic Model:**  
   Domain packages (**Nofinite Kanban**, **Nofinite Markon**, **Nofinite Charts**, etc.) must focus strictly on:
   - React state management and DOM event lifecycles.
   - WAI-ARIA compliance, keyboard navigation, roving tabindex, and focus trapping.
   - Drag-and-drop mechanics and gesture handling.
   - Semantic superclass attachment (`className="kanban-board"`, `data-dragging={true}`).
   - `Slot` / `asChild` composition allowing developers to swap underlying elements.
2. **Preserved Modules Packaging (`preserveModules: true`):**  
   All packages emit preserved module file structures in their distribution bundles (`dist/`). This guarantees that consumers importing only `KanbanCard` do not pull in the entire Kanban board engine or unused dependencies.
3. **Public Package Isolation:**  
   Public packages MUST NOT reference internal-only monorepo packages in their compiled type declarations (`.d.ts`) or runtime bundles. All public packages must remain self-contained.
4. **Node.js Tooling Safety:**  
   Raw CSS files must never be imported into TypeScript modules evaluated directly by Node.js tooling (such as Nx project graph processing, Vitest, UnoCSS, or Jiti).

---

## Consequences

### Positive:

- Maximum tree-shakability across all consumer applications.
- Clean separation: behavioral bugs are fixed in domain packages; visual/theming bugs are fixed in NUICSS.
- Consumers can easily customize layouts by targeting standard NUICSS superclasses or passing custom `className` strings via polymorphic `asChild` slots.

### Negative / Trade-offs:

- Requires strict discipline during component development to ensure styling concerns are not embedded as inline style objects or ad-hoc CSS.
