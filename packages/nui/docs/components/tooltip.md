# Tooltip (tooltip)

## Import
```tsx
import { Tooltip } from '@nofinite/nui';
```

## Architecture & Styling Rules
- **Semantic Tokens ONLY:** Use `bg-surface`, `text-default`, `border-subtle`, `bg-primary-subtle`, `text-danger`, etc. DO NOT USE raw tailwind colors (no `bg-blue-500`, no `text-gray-900`).
- **Accessibility:** Must adhere to strict WAI-ARIA standards. Ensure proper `role` and `aria-*` attributes.

## API / Props
### `Tooltip` Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `label`* | `ReactNode` | `-` | The text or content displayed inside the tooltip |
| `children`* | `ReactElement<unknown, string \| JSXElementConstructor<any>>` | `-` | The trigger element. Must be a single valid React Element (like a button) |
| `className` | `string` | `-` | Additional CSS classes for the tooltip container |
| `delay` | `number` | `200` | Delay in milliseconds before showing the tooltip on hover/focus. Defaults to 200. |
| `offset` | `number` | `8` | Distance in pixels between the tooltip and the trigger. Defaults to 8. |


