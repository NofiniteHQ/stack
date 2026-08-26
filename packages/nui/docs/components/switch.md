# Switch (switch)

## Import
```tsx
import { Switch } from '@nofinite/nui';
```

## Architecture & Styling Rules
- **Semantic Tokens ONLY:** Use `bg-surface`, `text-default`, `border-subtle`, `bg-primary-subtle`, `text-danger`, etc. DO NOT USE raw tailwind colors (no `bg-blue-500`, no `text-gray-900`).
- **Accessibility:** Must adhere to strict WAI-ARIA standards. Ensure proper `role` and `aria-*` attributes.

## API / Props
### `Switch` Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `checked` | `boolean` | `-` | - |
| `defaultChecked` | `boolean` | `-` | - |
| `onChange` | `(checked: boolean) => void` | `-` | - |
| `disabled` | `boolean` | `false` | - |
| `label` | `ReactNode` | `-` | - |
| `description` | `ReactNode` | `-` | - |
| `name` | `string` | `-` | - |
| `value` | `string` | `-` | - |
| `size` | `"sm" \| "md"` | `md` | - |
| `wrapperClassName` | `string` | `-` | - |


