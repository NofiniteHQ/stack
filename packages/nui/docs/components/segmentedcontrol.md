# Segmentedcontrol (segmentedcontrol)

## Import
```tsx
import { SegmentedControl } from '@nofinite/nui';
```

## Architecture & Styling Rules
- **Semantic Tokens ONLY:** Use `bg-surface`, `text-default`, `border-subtle`, `bg-primary-subtle`, `text-danger`, etc. DO NOT USE raw tailwind colors (no `bg-blue-500`, no `text-gray-900`).
- **Accessibility:** Must adhere to strict WAI-ARIA standards. Ensure proper `role` and `aria-*` attributes.

## API / Props
### `SegmentedControl` Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `options`* | `SegmentedControlOption[]` | `-` | - |
| `value` | `string` | `-` | - |
| `defaultValue` | `string` | `-` | - |
| `onChange` | `(value: string) => void` | `-` | - |
| `name` | `string` | `-` | - |
| `disabled` | `boolean` | `false` | - |
| `size` | `"sm" \| "md" \| "lg"` | `md` | - |
| `fullWidth` | `boolean` | `false` | - |


