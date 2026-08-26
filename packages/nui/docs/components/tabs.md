# Tabs (tabs)

## Import
```tsx
import { Tabs } from '@nofinite/nui';
```

## Architecture & Styling Rules
- **Semantic Tokens ONLY:** Use `bg-surface`, `text-default`, `border-subtle`, `bg-primary-subtle`, `text-danger`, etc. DO NOT USE raw tailwind colors (no `bg-blue-500`, no `text-gray-900`).
- **Accessibility:** Must adhere to strict WAI-ARIA standards. Ensure proper `role` and `aria-*` attributes.

## API / Props
### `Tabs` Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `value` | `string` | `-` | Controlled state value representing the active tab |
| `defaultValue` | `string` | `-` | Uncontrolled initial value |
| `onChange` | `(value: string) => void` | `-` | Callback fired when the active tab changes |
| `data` | `TabDataItem[]` | `-` | Data array for Smart Mode mapping |


