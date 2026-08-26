# Emptystate (emptystate)

## Import
```tsx
import { EmptyState } from '@nofinite/nui';
```

## Architecture & Styling Rules
- **Semantic Tokens ONLY:** Use `bg-surface`, `text-default`, `border-subtle`, `bg-primary-subtle`, `text-danger`, etc. DO NOT USE raw tailwind colors (no `bg-blue-500`, no `text-gray-900`).
- **Accessibility:** Must adhere to strict WAI-ARIA standards. Ensure proper `role` and `aria-*` attributes.

## API / Props
### `EmptyState` Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `icon` | `ReactNode` | `-` | The icon or illustration to display at the top of the empty state. |
| `title`* | `string` | `-` | The main title describing the empty state. |
| `description` | `ReactNode` | `-` | The descriptive text explaining what is missing or how to resolve it. |
| `actions` | `ReactNode` | `-` | Call to action buttons or links. |


