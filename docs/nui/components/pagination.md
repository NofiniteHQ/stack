# Pagination

A fully accessible, WAI-ARIA compliant pagination component for navigating through pages. Supports first/prev/next/last controls, arrow key navigation, and gap indicators similar to GitHub-style pagination.

---

## Usage

### Basic Pagination

```tsx
import { Pagination } from '@nofinite/nui';

<Pagination page={1} total={10} onChange={setPage} />;
```

---

### Sibling Page Control

```tsx
<Pagination page={page} total={50} siblings={2} onChange={setPage} />
```

---

### Disabled Pagination

```tsx
<Pagination page={page} total={10} disabled onChange={setPage} />
```

---

## Props

| Prop        | Type                  | Default | Description                   |
| ----------- | --------------------- | ------- | ----------------------------- |
| `page`      | `number`              | —       | Current page                  |
| `total`     | `number`              | —       | Total page count              |
| `onChange`  | `(page:number)=>void` | —       | Page change callback          |
| `siblings`  | `number`              | `1`     | Adjacent pages around current |
| `disabled`  | `boolean`             | `false` | Disables navigation           |
| `className` | `string`              | —       | Custom styles                 |

---

## Page Generation Logic

The component implements **adaptive pagination math**:

- Displays all pages when total is small
- Shows ellipsis only when more than 2 pages are hidden
- Maintains first + last page visibility
- Uses sibling window around current page

Generated item types:

| Type             | Description                |
| ---------------- | -------------------------- |
| `number`         | Page index                 |
| `left-ellipsis`  | Hidden pages before window |
| `right-ellipsis` | Hidden pages after window  |

---

## Variants

```tsx
<Pagination page={page} total={10} onChange={setPage} />                 // Default
<Pagination siblings={2} page={page} total={100} onChange={setPage} />   // Extended window
<Pagination disabled page={page} total={10} onChange={setPage} />        // Disabled
<Pagination className="custom" page={page} total={10} onChange={setPage} /> // Styled
```

**Available variants**

- `default` — Standard pagination
- `extended` — Larger sibling window
- `disabled` — Interaction blocked
- `styled` — Custom styling override

**Guidelines**

- Increase `siblings` for data-heavy navigation
- Keep default sibling size for compact UI
- Disable pagination during async loading states
- Avoid large sibling counts on small screens

---

## States

| State      | Description              |
| ---------- | ------------------------ |
| `idle`     | Default rendering        |
| `active`   | Current page highlighted |
| `disabled` | Navigation locked        |
| `ellipsis` | Hidden page ranges       |
| `focused`  | Keyboard focus visible   |

---

## Keyboard Interaction

| Key     | Behavior                  |
| ------- | ------------------------- |
| `Enter` | Navigate to page          |
| `Space` | Trigger page button       |
| `Tab`   | Move focus across buttons |

---

## Accessibility

- Semantic `<nav>` with pagination label
- `aria-current="page"` for active page
- ARIA labels for navigation buttons
- Focus-visible outline for keyboard users
- Ellipsis hidden from assistive tech via `aria-hidden`

---

## Design Tokens

```css
:root {
  --nui-radius-md: 8px;
  --nui-space-1: 4px;
  --nui-space-2: 8px;

  --nui-bg-subtle: #f9fafb;
  --nui-border-default: #e5e7eb;
  --nui-fg-default: #111827;
  --nui-fg-muted: #6b7280;
}
```

---

## Best Practices

### Do

- Use controlled state for predictable navigation
- Provide meaningful page totals
- Keep sibling count minimal for mobile
- Disable during server pagination fetch
- Maintain visual consistency with design tokens

### Don’t

- Hide first/last page in long lists
- Use pagination for small datasets
- Disable without visual feedback
- Overload pagination with extra actions
- Remove focus outline for accessibility
