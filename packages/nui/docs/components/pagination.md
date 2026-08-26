# Pagination (pagination)

## Import
```tsx
import { Pagination } from '@nofinite/nui';
```

## Architecture & Styling Rules
- **Semantic Tokens ONLY:** Use `bg-surface`, `text-default`, `border-subtle`, `bg-primary-subtle`, `text-danger`, etc. DO NOT USE raw tailwind colors (no `bg-blue-500`, no `text-gray-900`).
- **Accessibility:** Must adhere to strict WAI-ARIA standards. Ensure proper `role` and `aria-*` attributes.

## API / Props
### `Pagination` Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `page`* | `number` | `-` | The current active page number (1-indexed) |
| `total`* | `number` | `-` | The total number of pages available |
| `onChange`* | `(page: number) => void` | `-` | Callback fired when a new page is selected |
| `siblings` | `number` | `1` | Number of page links to show on each side of the current page. Defaults to 1. |
| `className` | `string` | `-` | Custom class name applied to the root navigation element |
| `disabled` | `boolean` | `false` | Disables all interaction with the pagination controls |


