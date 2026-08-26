# Breadcrumbs (breadcrumbs)

## Import
```tsx
import { Breadcrumbs } from '@nofinite/nui';
```

## Architecture & Styling Rules
- **Semantic Tokens ONLY:** Use `bg-surface`, `text-default`, `border-subtle`, `bg-primary-subtle`, `text-danger`, etc. DO NOT USE raw tailwind colors (no `bg-blue-500`, no `text-gray-900`).
- **Accessibility:** Must adhere to strict WAI-ARIA standards. Ensure proper `role` and `aria-*` attributes.

## API / Props
### `Breadcrumbs` Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `data` | `BreadcrumbItem[]` | `-` | Array of items for Smart Default mode |
| `maxItems` | `number` | `5` | The maximum number of items to display before truncating the middle path. Default: 5 |
| `separator` | `ReactNode` | `›` | The visual separator between items. Default: '›' |


