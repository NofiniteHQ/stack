# DataGrid

A **feature-rich tabular data component** designed for structured data presentation with built-in **sorting, pagination, row selection, keyboard navigation, custom cell rendering, and action slots**.

Supports both **controlled and uncontrolled modes** for pagination and selection while preserving accessibility semantics via ARIA grid roles.

---

## Usage

### Basic DataGrid

```tsx
import { DataGrid } from '@nofinite/nui';

<DataGrid
  columns={[
    { key: 'name', title: 'Name' },
    { key: 'email', title: 'Email' },
    { key: 'role', title: 'Role' },
  ]}
  rows={users}
/>;
```

---

### Sortable Columns

```tsx
<DataGrid
  columns={[
    { key: 'name', title: 'Name', sortable: true },
    { key: 'salary', title: 'Salary', sortable: true },
  ]}
  rows={employees}
/>
```

---

### Custom Cell Rendering

```tsx
<DataGrid
  columns={[
    { key: 'name', title: 'Name' },
    {
      key: 'status',
      title: 'Status',
      render: (row) => <Badge>{row.status}</Badge>,
    },
  ]}
  rows={data}
/>
```

---

### Row Selection

```tsx
<DataGrid selectable rows={data} columns={columns} />
```

---

### Pagination Control

```tsx
<DataGrid
  page={page}
  onPageChange={setPage}
  pageSize={20}
  rows={data}
  columns={columns}
/>
```

---

### Row Actions

```tsx
<DataGrid
  rows={data}
  columns={columns}
  renderRowActions={(row) => (
    <>
      <Button onClick={() => edit(row)}>Edit</Button>
      <Button variant="danger" onClick={() => remove(row)}>
        Delete
      </Button>
    </>
  )}
/>
```

---

## Props

| Prop                | Type                    | Default  | Description                |
| ------------------- | ----------------------- | -------- | -------------------------- |
| `columns`           | `DataGridColumn<T>[]`   | —        | Column definitions         |
| `rows`              | `T[]`                   | —        | Dataset                    |
| `page`              | `number`                | internal | Controlled page            |
| `pageSize`          | `number`                | `10`     | Rows per page              |
| `onPageChange`      | `(page:number)=>void`   | —        | Page callback              |
| `selectable`        | `boolean`               | `false`  | Enables checkbox selection |
| `selectedRowIds`    | `Set<string \| number>` | internal | Controlled selection       |
| `onSelectionChange` | `(ids:Set)=>void`       | —        | Selection callback         |
| `onRowClick`        | `(row:T)=>void`         | —        | Row click handler          |
| `renderRowActions`  | `(row:T)=>ReactNode`    | —        | Action slot                |
| `className`         | `string`                | —        | Custom styles              |
| `disablePagination` | `boolean`               | `false`  | Turns off pagination       |

---

## Column Definition

| Field      | Type                            | Description       |
| ---------- | ------------------------------- | ----------------- |
| `key`      | `keyof T`                       | Data field        |
| `title`    | `ReactNode`                     | Header label      |
| `sortable` | `boolean`                       | Enables sorting   |
| `width`    | `string \| number`              | Column width      |
| `align`    | `'left' \| 'center' \| 'right'` | Cell alignment    |
| `render`   | `(row:T)=>ReactNode`            | Custom cell       |
| `sortFn`   | `(a,b)=>number`                 | Custom comparator |

---

## Variants

```tsx
<DataGrid rows={data} columns={columns} />                     // Default
<DataGrid selectable rows={data} columns={columns} />          // Selectable
<DataGrid disablePagination rows={data} columns={columns} />   // Static grid
<DataGrid renderRowActions={actions} rows={data} columns={columns} /> // Action grid
```

**Available variants**

- `default` — Standard tabular data
- `selectable` — Checkbox-based selection
- `action` — Row-level actions column
- `static` — Pagination disabled
- `interactive` — Row click enabled

**Guidelines**

- Use `selectable` for bulk operations
- Use `action` when row-specific commands exist
- Use `static` for small datasets
- Use `interactive` when rows act as navigation targets

---

## States

| State       | Description            |
| ----------- | ---------------------- |
| `idle`      | Default rendering      |
| `sorted`    | Column sorting active  |
| `selected`  | Row selected           |
| `focused`   | Keyboard navigated row |
| `empty`     | No dataset             |
| `paginated` | Multiple pages         |

---

## Keyboard Interaction

| Key             | Behavior                    |
| --------------- | --------------------------- |
| `ArrowDown`     | Move focus to next row      |
| `ArrowUp`       | Move focus to previous row  |
| `Enter / Space` | Select row or trigger click |

---

## Accessibility

- Implements **ARIA grid pattern**
- `aria-rowcount` for dataset size
- `aria-selected` for selected rows
- Header sorting announced via `aria-sort`
- Focusable wrapper enabling keyboard navigation
- Checkbox selection accessible via labels

---

## Design Tokens

```css
:root {
  --nui-radius-lg: 12px;
  --nui-radius-md: 8px;
  --nui-space-3: 12px;
  --nui-space-4: 16px;

  --nui-bg-surface: #ffffff;
  --nui-bg-subtle: #f9fafb;
  --nui-border-default: #e5e7eb;
  --nui-fg-default: #111827;
  --nui-fg-muted: #6b7280;
}
```

---

## Best Practices

### Do

- Provide stable row IDs for predictable selection
- Use custom `sortFn` for complex data types
- Keep column count manageable for readability
- Use pagination for large datasets
- Add row actions for contextual workflows

### Don’t

- Mix row navigation and destructive actions without visual distinction
- Overuse sortable columns causing cognitive overload
- Disable pagination for extremely large datasets
- Depend solely on hover for action visibility
- Render expensive components inside large grids without memoization
