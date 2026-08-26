# Alert (alert)

## Import
```tsx
import { Alert } from '@nofinite/nui';
```

## Architecture & Styling Rules
- **Semantic Tokens ONLY:** Use `bg-surface`, `text-default`, `border-subtle`, `bg-primary-subtle`, `text-danger`, etc. DO NOT USE raw tailwind colors (no `bg-blue-500`, no `text-gray-900`).
- **Accessibility:** Must adhere to strict WAI-ARIA standards. Ensure proper `role` and `aria-*` attributes.

## API / Props
### `Alert` Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `variant` | `AlertVariant` | `info` | - |
| `title` | `ReactNode` | `-` | - |
| `closable` | `boolean` | `false` | Determines if the close icon button is rendered |
| `onClose` | `() => void` | `-` | Callback fired when the close button is clicked.  Note: The component is controlled; it does not unmount itself. |
| `className` | `string` | `-` | - |
| `asChild` | `boolean` | `-` | Renders the component using its child element |


