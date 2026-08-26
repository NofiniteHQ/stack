# Chip (chip)

## Import
```tsx
import { Chip } from '@nofinite/nui';
```

## Architecture & Styling Rules
- **Semantic Tokens ONLY:** Use `bg-surface`, `text-default`, `border-subtle`, `bg-primary-subtle`, `text-danger`, etc. DO NOT USE raw tailwind colors (no `bg-blue-500`, no `text-gray-900`).
- **Accessibility:** Must adhere to strict WAI-ARIA standards. Ensure proper `role` and `aria-*` attributes.

## API / Props
### `Chip` Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `removable` | `boolean` | `false` | If true, renders a trailing 'X' button that triggers onRemove |
| `selected` | `boolean` | `false` | Controls the visual and ARIA active state of the chip |
| `iconLeft` | `ReactNode` | `-` | - |
| `iconRight` | `ReactNode` | `-` | - |
| `size` | `ChipSize` | `md` | - |
| `onRemove` | `() => void` | `-` | Callback fired when the 'X' button is clicked |
| `onSelect` | `() => void` | `-` | Callback fired when the main body of the chip is clicked or activated via keyboard |


