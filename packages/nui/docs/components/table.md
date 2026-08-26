# Table (table)

## Import
```tsx
import { Table.Header, Table.Body, Table.Row, Table.Head, Table.Cell, Table } from '@nofinite/nui';
```

## Architecture & Styling Rules
- **Semantic Tokens ONLY:** Use `bg-surface`, `text-default`, `border-subtle`, `bg-primary-subtle`, `text-danger`, etc. DO NOT USE raw tailwind colors (no `bg-blue-500`, no `text-gray-900`).
- **Accessibility:** Must adhere to strict WAI-ARIA standards. Ensure proper `role` and `aria-*` attributes.

## API / Props
### `Table` Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `columns` | `TableColumn<T>[]` | `-` | Array of column configuration objects |
| `data` | `T[]` | `-` | Array of data objects to render |
| `rowKey` | `string \| number \| symbol \| ((row: T) => string)` | `-` | A unique identifier for each row (string/number key, or a function that returns a string) |
| `emptyText` | `ReactNode` | `-` | Text or React Node to display when the data array is empty |
| `ref` | `Ref<HTMLTableElement>` | `-` | - |


