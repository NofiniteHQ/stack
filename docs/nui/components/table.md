# Table

A generic, fully typed data table component supporting column configuration, sorting, custom cell rendering, alignment control, and responsive overflow handling.

---

## Usage

### Basic usage

```tsx
import { Table } from '@nofinite/nui';

<Table
  columns={[
    { key: 'name', label: 'Name' },
    { key: 'age', label: 'Age' },
  ]}
  data={data}
  rowKey="id"
/>;
```

### Sortable columns

```tsx
<Table
  columns={[
    { key: 'name', label: 'Name', sortable: true },
    { key: 'age', label: 'Age', sortable: true },
  ]}
  data={data}
  rowKey="id"
/>
```

### Custom render cells

```tsx
<Table
  columns={[
    {
      key: 'status',
      label: 'Status',
      render: (row) => <Badge>{row.status}</Badge>,
    },
  ]}
  data={data}
  rowKey="id"
/>
```

### Custom sort function

```tsx
<Table
  columns={[
    {
      key: 'price',
      label: 'Price',
      sortable: true,
      sortFn: (a, b) => a.price - b.price,
    },
  ]}
  data={data}
  rowKey="id"
/>
```

---

## Props

| Prop      | Type                        | Default             | Description            |
| --------- | --------------------------- | ------------------- | ---------------------- |
| columns   | TableColumnTable&lt;T&gt;[] | —                   | Column configuration   |
| data      | T[]                         | —                   | Row dataset            |
| rowKey    | keyof T \| (row:T)=>string  | —                   | Unique row identifier  |
| emptyText | ReactNode                   | "No data available" | Empty state content    |
| className | string                      | —                   | Table styling override |

---

## Column Definition

| Field      | Type                            | Description          |
| ---------- | ------------------------------- | -------------------- |
| `key`      | `keyof T`                       | Data accessor key    |
| `label`    | `string`                        | Column header label  |
| `sortable` | `boolean`                       | Enables sorting      |
| `align`    | `'left' \| 'center' \| 'right'` | Cell alignment       |
| `render`   | `(row:T)=>ReactNode`            | Custom cell renderer |
| `sortFn`   | `(a:T,b:T)=>number`             | Custom sorting logic |

---

## Variants

### Sorting variants

```tsx
<Table columns={[{ key:'name', label:'Name', sortable:true }]} />
<Table columns={[{ key:'name', label:'Name' }]} />
```

### Alignment variants

```tsx
<Table columns={[{ key:'amount', label:'Amount', align:'right' }]} />
<Table columns={[{ key:'status', label:'Status', align:'center' }]} />
```

### Rendering variants

```tsx
<Table columns={[{ key:'avatar', label:'User', render:(r)=> <Avatar /> }]} />
<Table columns={[{ key:'name', label:'Name' }]} />
```

### State variants

```tsx
<Table data={[]} />
<Table emptyText="Nothing found" />
```

**Available variants**

- Sortable table
- Non-sortable table
- Custom rendered table
- Aligned table
- Empty state table
- Custom sort logic table
- Responsive overflow table

**Guidelines**

- Use custom renderers for complex cells
- Prefer numeric sortFn for precision sorting
- Align numeric data right for readability
- Provide empty state messaging
- Keep column count reasonable for mobile

---

## States

- Default
- Hover row
- Sort ascending
- Sort descending
- Unsorted
- Empty state
- Focus-visible header button

---

## Keyboard Interaction

- Tab → focuses sortable headers
- Enter / Space → toggles sort
- Focus-visible ring on header button
- Screen readers announce sort direction

---

## Accessibility

- Semantic `<table>` structure
- `scope="col"` for headers
- `aria-sort` reflects sorting state
- Sort button ensures keyboard sorting
- Focus-visible styling for headers
- Empty state conveyed within table body
- Responsive overflow preserves semantics

---

## Design Tokens

| Token                | Usage               |
| -------------------- | ------------------- |
| --nui-border-default | Borders             |
| --nui-bg-surface     | Table background    |
| --nui-bg-subtle      | Header + hover      |
| --nui-fg-default     | Text                |
| --nui-fg-muted       | Header label        |
| --nui-fg-subtle      | Sort icon           |
| --nui-color-primary  | Sort active + focus |
| --nui-radius-lg      | Container radius    |
| --nui-space-\*       | Spacing scale       |

---

## Best Practices

### Do

- Use custom renderers for interactive cells
- Keep rowKey stable and unique
- Add sortFn for dates and derived values
- Align numeric columns right
- Use responsive container for overflow

### Don’t

- Use index as rowKey
- Overload table with too many columns
- Use heavy components inside cells unnecessarily
- Rely on string sorting for numeric values
- Hide important actions inside render without affordance
