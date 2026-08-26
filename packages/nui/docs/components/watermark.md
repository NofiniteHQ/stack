# Watermark (watermark)

## Import
```tsx
import { Watermark } from '@nofinite/nui';
```

## Architecture & Styling Rules
- **Semantic Tokens ONLY:** Use `bg-surface`, `text-default`, `border-subtle`, `bg-primary-subtle`, `text-danger`, etc. DO NOT USE raw tailwind colors (no `bg-blue-500`, no `text-gray-900`).
- **Accessibility:** Must adhere to strict WAI-ARIA standards. Ensure proper `role` and `aria-*` attributes.

## API / Props
### `Watermark` Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `text`* | `string \| string[]` | `-` | The text to display. Can be an array for multi-line watermarks. |
| `opacity` | `number` | `0.05` | - |
| `rotate` | `number` | `-20` | - |
| `gap` | `number` | `120` | The spacing between watermark instances |
| `fontSize` | `number` | `16` | - |
| `color` | `string` | `currentColor` | - |
| `zIndex` | `number` | `10` | - |


