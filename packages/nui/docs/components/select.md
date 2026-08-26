# Select (select)

## Import
```tsx
import { Select } from '@nofinite/nui';
```

## Architecture & Styling Rules
- **Semantic Tokens ONLY:** Use `bg-surface`, `text-default`, `border-subtle`, `bg-primary-subtle`, `text-danger`, etc. DO NOT USE raw tailwind colors (no `bg-blue-500`, no `text-gray-900`).
- **Accessibility:** Must adhere to strict WAI-ARIA standards. Ensure proper `role` and `aria-*` attributes.

## API / Props
### `Select` Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `data`* | `SelectOption[]` | `-` | Array of available options |
| `value` | `string` | `-` | Controlled state value |
| `defaultValue` | `string` | `-` | Uncontrolled initial value |
| `onChange` | `(value: string) => void` | `-` | Callback fired when an option is selected |
| `placeholder` | `string` | `Select...` | Text displayed when no option is selected |
| `name` | `string` | `-` | Name attribute applied to the hidden input for native form submission |
| `error` | `boolean` | `false` | Applies error styling to the trigger button |


