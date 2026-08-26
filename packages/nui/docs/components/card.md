# Card (card)

## Import
```tsx
import { Card } from '@nofinite/nui';
```

## Architecture & Styling Rules
- **Semantic Tokens ONLY:** Use `bg-surface`, `text-default`, `border-subtle`, `bg-primary-subtle`, `text-danger`, etc. DO NOT USE raw tailwind colors (no `bg-blue-500`, no `text-gray-900`).
- **Accessibility:** Must adhere to strict WAI-ARIA standards. Ensure proper `role` and `aria-*` attributes.

## API / Props
### `Card` Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `clickable` | `boolean` | `false` | If true, makes the card interactive via mouse and keyboard (Enter/Space) |
| `hover` | `boolean` | `false` | If true, adds a shadow elevation effect on hover |


