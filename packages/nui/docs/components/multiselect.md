# Multiselect (multiselect)

## Import
```tsx
import { MultiSelect } from '@nofinite/nui';
```

## Architecture & Styling Rules
- **Semantic Tokens ONLY:** Use `bg-surface`, `text-default`, `border-subtle`, `bg-primary-subtle`, `text-danger`, etc. DO NOT USE raw tailwind colors (no `bg-blue-500`, no `text-gray-900`).
- **Accessibility:** Must adhere to strict WAI-ARIA standards. Ensure proper `role` and `aria-*` attributes.

## API / Props
### `MultiSelect` Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `options`* | `MultiSelectOption[]` | `-` | Array of available options |
| `value` | `string[]` | `-` | Controlled state for selected values |
| `defaultValue` | `string[]` | `-` | Uncontrolled initial state for selected values |
| `onChange` | `(value: string[]) => void` | `-` | Callback fired when the selection changes |
| `placeholder` | `string` | `Select multiple...` | Text displayed when no options are selected |
| `name` | `string` | `-` | Name attribute applied to hidden inputs for native form submission |
| `error` | `boolean` | `false` | Toggles error styling |
| `maxTags` | `number` | `3` | Number of tags to render before collapsing into a summary string (e.g., "3 selected") |


