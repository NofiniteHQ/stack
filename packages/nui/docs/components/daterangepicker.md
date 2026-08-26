# Daterangepicker (daterangepicker)

## Import
```tsx
import { DateRangePicker } from '@nofinite/nui';
```

## Architecture & Styling Rules
- **Semantic Tokens ONLY:** Use `bg-surface`, `text-default`, `border-subtle`, `bg-primary-subtle`, `text-danger`, etc. DO NOT USE raw tailwind colors (no `bg-blue-500`, no `text-gray-900`).
- **Accessibility:** Must adhere to strict WAI-ARIA standards. Ensure proper `role` and `aria-*` attributes.

## API / Props
### `DateRangePicker` Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `value` | `DateRange` | `-` | - |
| `defaultValue` | `DateRange` | `-` | - |
| `onChange` | `(r: DateRange) => void` | `-` | - |
| `minDate` | `string` | `-` | - |
| `maxDate` | `string` | `-` | - |
| `placeholder` | `string` | `Pick range` | - |
| `locale` | `string` | `en-US` | - |
| `id` | `string` | `-` | - |
| `className` | `string` | `-` | - |
| `nameFrom` | `string` | `-` | - |
| `nameTo` | `string` | `-` | - |
| `disabled` | `boolean` | `false` | - |
| `formatDisplay` | `(date: Date) => string` | `-` | - |


