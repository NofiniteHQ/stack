# Input (input)

## Import
```tsx
import { Input } from '@nofinite/nui';
```

## Architecture & Styling Rules
- **Semantic Tokens ONLY:** Use `bg-surface`, `text-default`, `border-subtle`, `bg-primary-subtle`, `text-danger`, etc. DO NOT USE raw tailwind colors (no `bg-blue-500`, no `text-gray-900`).
- **Accessibility:** Must adhere to strict WAI-ARIA standards. Ensure proper `role` and `aria-*` attributes.

## API / Props
### `Input` Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `label` | `ReactNode` | `-` | - |
| `description` | `ReactNode` | `-` | - |
| `error` | `ReactNode` | `-` | - |
| `inputSize` | `"sm" \| "md" \| "lg"` | `md` | - |
| `leftIcon` | `ReactNode` | `-` | - |
| `rightIcon` | `ReactNode` | `-` | - |
| `rightIconClassName` | `string` | `-` | - |
| `wrapperClassName` | `string` | `-` | - |


