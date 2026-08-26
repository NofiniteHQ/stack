# Slider (slider)

## Import
```tsx
import { Slider } from '@nofinite/nui';
```

## Architecture & Styling Rules
- **Semantic Tokens ONLY:** Use `bg-surface`, `text-default`, `border-subtle`, `bg-primary-subtle`, `text-danger`, etc. DO NOT USE raw tailwind colors (no `bg-blue-500`, no `text-gray-900`).
- **Accessibility:** Must adhere to strict WAI-ARIA standards. Ensure proper `role` and `aria-*` attributes.

## API / Props
### `Slider` Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `min` | `number` | `0` | The minimum allowed value. Defaults to 0. |
| `max` | `number` | `100` | The maximum allowed value. Defaults to 100. |
| `step` | `number` | `1` | The interval between valid values. Defaults to 1. |
| `value` | `number` | `-` | The controlled value of the slider. |
| `defaultValue` | `number` | `-` | The initial uncontrolled value of the slider. |
| `onChange` | `(value: number) => void` | `-` | Callback fired when the value changes. |
| `disabled` | `boolean` | `false` | Disables the slider and prevents interaction. |


