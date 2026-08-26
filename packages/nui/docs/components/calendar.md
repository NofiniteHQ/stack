# Calendar (calendar)

## Import
```tsx
import { Calendar } from '@nofinite/nui';
```

## Architecture & Styling Rules
- **Semantic Tokens ONLY:** Use `bg-surface`, `text-default`, `border-subtle`, `bg-primary-subtle`, `text-danger`, etc. DO NOT USE raw tailwind colors (no `bg-blue-500`, no `text-gray-900`).
- **Accessibility:** Must adhere to strict WAI-ARIA standards. Ensure proper `role` and `aria-*` attributes.

## API / Props
### `Calendar` Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `mode` | `"single" \| "range"` | `-` | - |
| `value` | `string \| DateRange` | `-` | - |
| `defaultValue` | `string \| DateRange` | `-` | - |
| `onChange` | `((v: string) => void) \| ((v: DateRange) => void)` | `-` | - |
| `minDate` | `string` | `-` | - |
| `maxDate` | `string` | `-` | - |
| `locale` | `string` | `-` | - |
| `defaultMonth` | `Date` | `-` | - |


