# Checkbox (checkbox)

## Import
```tsx
import { Checkbox } from '@nofinite/nui';
```

## Architecture & Styling Rules
- **Semantic Tokens ONLY:** Use `bg-surface`, `text-default`, `border-subtle`, `bg-primary-subtle`, `text-danger`, etc. DO NOT USE raw tailwind colors (no `bg-blue-500`, no `text-gray-900`).
- **Accessibility:** Must adhere to strict WAI-ARIA standards. Ensure proper `role` and `aria-*` attributes.

## API / Props
### `Checkbox` Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `checked` | `boolean` | `-` | - |
| `defaultChecked` | `boolean` | `-` | - |
| `indeterminate` | `boolean` | `false` | - |
| `onChange` | `(checked: boolean) => void` | `-` | - |
| `label` | `ReactNode` | `-` | - |


