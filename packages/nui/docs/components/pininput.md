# Pininput (pininput)

## Import
```tsx
import { PinInput } from '@nofinite/nui';
```

## Architecture & Styling Rules
- **Semantic Tokens ONLY:** Use `bg-surface`, `text-default`, `border-subtle`, `bg-primary-subtle`, `text-danger`, etc. DO NOT USE raw tailwind colors (no `bg-blue-500`, no `text-gray-900`).
- **Accessibility:** Must adhere to strict WAI-ARIA standards. Ensure proper `role` and `aria-*` attributes.

## API / Props
### `PinInput` Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `length` | `number` | `4` | - |
| `value` | `string` | `-` | - |
| `defaultValue` | `string` | `` | - |
| `onChange` | `(value: string) => void` | `-` | - |
| `onComplete` | `(value: string) => void` | `-` | - |
| `mask` | `boolean` | `false` | - |
| `disabled` | `boolean` | `false` | - |
| `autoFocus` | `boolean` | `false` | - |
| `placeholder` | `string` | `○` | - |
| `type` | `"numeric" \| "alphabetic" \| "alphanumeric"` | `numeric` | - |
| `otp` | `boolean` | `false` | - |
| `size` | `"sm" \| "md" \| "lg"` | `md` | - |


