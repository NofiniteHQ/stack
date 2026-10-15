# @nofinite/kanban

## 1.0.0

### Major Changes

- Initial public release of Nofinite Kanban:
  - Universal task board suite powered by Atlassian's Pragmatic Drag and Drop (`@atlaskit/pragmatic-drag-and-drop`).
  - Featherweight ~4.5 kB footprint with native pointer events, bi-directional card dragging across columns, and column reordering.
  - Framework-agnostic DOM binder (`createKanbanBoard`) and React adapter (`<Kanban>`).
  - Column management with configurable WIP limits, custom move validation, and dynamic status badges.
  - Full keyboard cross-column accessibility, focus retention, and ARIA live region announcements.
  - Styling powered exclusively by `@nofinite/nuicss` superclasses.
