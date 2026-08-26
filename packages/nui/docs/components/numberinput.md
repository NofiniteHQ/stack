# Numberinput (numberinput)

## Import
```tsx
import { NumberInput } from '@nofinite/nui';
```

## Architecture & Styling Rules
- **Semantic Tokens ONLY:** Use `bg-surface`, `text-default`, `border-subtle`, `bg-primary-subtle`, `text-danger`, etc. DO NOT USE raw tailwind colors (no `bg-blue-500`, no `text-gray-900`).
- **Accessibility:** Must adhere to strict WAI-ARIA standards. Ensure proper `role` and `aria-*` attributes.

## API / Props
### `NumberInput` Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `value` | `number \| ""` | `-` | - |
| `defaultValue` | `number \| ""` | `-` | - |
| `onChange` | `(value: number \| "") => void` | `-` | - |
| `min` | `number` | `-` | - |
| `max` | `number` | `-` | - |
| `step` | `number` | `1` | - |
| `hideStepper` | `boolean` | `false` | - |
| `error` | `ReactNode` | `-` | - |
| `label` | `ReactNode` | `-` | - |
| `leftIcon` | `ReactNode` | `-` | - |
| `rightIcon` | `ReactNode` | `-` | - |
| `description` | `ReactNode` | `-` | - |
| `inputSize` | `"sm" \| "md" \| "lg"` | `-` | - |
| `rightIconClassName` | `string` | `-` | - |
| `wrapperClassName` | `string` | `-` | - |


