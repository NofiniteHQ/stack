# Timerangepicker (timerangepicker)

## Import
```tsx
import { TimeRangePicker } from '@nofinite/nui';
```

## Architecture & Styling Rules
- **Semantic Tokens ONLY:** Use `bg-surface`, `text-default`, `border-subtle`, `bg-primary-subtle`, `text-danger`, etc. DO NOT USE raw tailwind colors (no `bg-blue-500`, no `text-gray-900`).
- **Accessibility:** Must adhere to strict WAI-ARIA standards. Ensure proper `role` and `aria-*` attributes.

## API / Props
### `TimeRangePicker` Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `value` | `TimeRange` | `-` | Controlled time range object |
| `defaultValue` | `TimeRange` | `-` | Uncontrolled default time range object |
| `onChange` | `(v: TimeRange) => void` | `-` | Callback fired when either the start or end time changes |
| `clockType` | `12 \| 24` | `12` | Uses 12-hour or 24-hour clock formatting. Defaults to 12. |
| `minuteStep` | `number` | `1` | Step interval for the minute column. Defaults to 1. |
| `placeholder` | `string` | `Select time range` | Placeholder text displayed when no range is selected |
| `nameFrom` | `string` | `-` | Name attribute applied to the "from" hidden input for native forms |
| `nameTo` | `string` | `-` | Name attribute applied to the "to" hidden input for native forms |
| `disabled` | `boolean` | `false` | Disables the picker entirely |


