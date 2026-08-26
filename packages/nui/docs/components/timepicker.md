# Timepicker (timepicker)

## Import
```tsx
import { TimePicker } from '@nofinite/nui';
```

## Architecture & Styling Rules
- **Semantic Tokens ONLY:** Use `bg-surface`, `text-default`, `border-subtle`, `bg-primary-subtle`, `text-danger`, etc. DO NOT USE raw tailwind colors (no `bg-blue-500`, no `text-gray-900`).
- **Accessibility:** Must adhere to strict WAI-ARIA standards. Ensure proper `role` and `aria-*` attributes.

## API / Props
### `TimePicker` Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `value` | `string` | `-` | Standard HTML5 time format: HH:mm (24-hour format internally) |
| `defaultValue` | `string` | `-` | Uncontrolled default time |
| `onChange` | `(v: string) => void` | `-` | Callback fired when a time segment is selected |
| `clockType` | `12 \| 24` | `12` | 12-hour or 24-hour clock formatting. Defaults to 12. |
| `minuteStep` | `number` | `1` | Step interval for the minute column. Defaults to 1. |
| `placeholder` | `string` | `Select time` | Placeholder text when empty |
| `name` | `string` | `-` | Name attribute for the hidden input (for native forms) |
| `disabled` | `boolean` | `false` | Disables the time picker trigger |


