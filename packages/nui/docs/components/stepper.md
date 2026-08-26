# Stepper (stepper)

## Import
```tsx
import { Stepper } from '@nofinite/nui';
```

## Architecture & Styling Rules
- **Semantic Tokens ONLY:** Use `bg-surface`, `text-default`, `border-subtle`, `bg-primary-subtle`, `text-danger`, etc. DO NOT USE raw tailwind colors (no `bg-blue-500`, no `text-gray-900`).
- **Accessibility:** Must adhere to strict WAI-ARIA standards. Ensure proper `role` and `aria-*` attributes.

## API / Props
### `Stepper` Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `data`* | `(string \| StepItem)[]` | `-` | Array of steps. Can be simple strings or rich objects. |
| `active`* | `number` | `-` | The 0-based index of the currently active step. |
| `onChange` | `(index: number) => void` | `-` | Callback fired when a step is clicked. |
| `disableFuture` | `boolean` | `false` | Prevents the user from clicking on steps that come after the currently active one. |
| `orientation` | `"horizontal" \| "vertical"` | `horizontal` | The orientation of the stepper |


