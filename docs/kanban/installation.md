# Installation & Setup

Add **Nofinite Kanban** (`@nofinite/kanban`) to your React application.

---

## 1. Package Installation

Install the package alongside its peer dependencies:

```bash
# pnpm
pnpm add @nofinite/kanban @nofinite/nuicss

# npm
npm install @nofinite/kanban @nofinite/nuicss

# yarn
yarn add @nofinite/kanban @nofinite/nuicss
```

---

## 2. Stylesheet Configuration

All styling rules, column geometry, drop indicators, and card dragging animations are pre-compiled into **NUICSS**.

Import the single unified stylesheet at the root of your application (`app/layout.tsx`, `main.tsx`, or `src/index.css`):

```tsx
import '@nofinite/nuicss/styles.css';
```

> **Zero Downstream CSS Note:** You do **not** need to import `@nofinite/kanban/styles.css`. NUICSS provides all necessary superclasses (`.kanban-board`, `.kanban-column`, `.kanban-card`).

### Optional: Modular Subpath Import

If your application uses fine-grained CSS tree-shaking, you can import only the Kanban stylesheet:

```tsx
import '@nofinite/nuicss/kanban.css';
```

---

## 3. Requirements & Compatibility

- **React:** `>= 18.0.0` or React 19
- **Design Tokens:** `@nofinite/nuicss` for OKLCH theme colors and semantic tokens (`--bg-surface`, `--color-border`, `--color-primary`).
- **Drag Engine:** Uses Pragmatic Drag-and-Drop under the hood. No external context wrappers (such as `<DragDropContext>`) are required.

---

## 4. Basic Import

Import the `Kanban` component in your React components:

```tsx
import { Kanban, type KanbanColumnProps } from '@nofinite/kanban';
```
