# Datepicker (datepicker)

## Import
```tsx
import { DatePicker } from '@nofinite/nui';
```

## Architecture & Styling Rules
- **Semantic Tokens ONLY:** Use `bg-surface`, `text-default`, `border-subtle`, `bg-primary-subtle`, `text-danger`, etc. DO NOT USE raw tailwind colors (no `bg-blue-500`, no `text-gray-900`).
- **Accessibility:** Must adhere to strict WAI-ARIA standards. Ensure proper `role` and `aria-*` attributes.

## API / Props
### `DatePicker` Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `value` | `string` | `-` | - |
| `defaultValue` | `string` | `-` | - |
| `onChange` | `(v: string) => void` | `-` | - |
| `minDate` | `string` | `-` | - |
| `maxDate` | `string` | `-` | - |
| `placeholder` | `string` | `Select date` | - |
| `name` | `string` | `-` | - |
| `locale` | `string` | `en-US` | - |
| `id` | `string` | `-` | - |
| `className` | `string` | `-` | - |
| `disabled` | `boolean` | `false` | - |
| `formatDisplay` | `(date: Date) => string` | `-` | - |


