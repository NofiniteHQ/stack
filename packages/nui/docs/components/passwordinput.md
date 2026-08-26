# Passwordinput (passwordinput)

## Import
```tsx
import { PasswordInput } from '@nofinite/nui';
```

## Architecture & Styling Rules
- **Semantic Tokens ONLY:** Use `bg-surface`, `text-default`, `border-subtle`, `bg-primary-subtle`, `text-danger`, etc. DO NOT USE raw tailwind colors (no `bg-blue-500`, no `text-gray-900`).
- **Accessibility:** Must adhere to strict WAI-ARIA standards. Ensure proper `role` and `aria-*` attributes.

## API / Props
### `PasswordInput` Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `error` | `ReactNode` | `-` | - |
| `label` | `ReactNode` | `-` | - |
| `leftIcon` | `ReactNode` | `-` | - |
| `rightIcon` | `ReactNode` | `-` | - |
| `description` | `ReactNode` | `-` | - |
| `inputSize` | `"sm" \| "md" \| "lg"` | `-` | - |
| `rightIconClassName` | `string` | `-` | - |
| `wrapperClassName` | `string` | `-` | - |


