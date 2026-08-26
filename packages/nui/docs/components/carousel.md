# Carousel (carousel)

## Import
```tsx
import { Carousel } from '@nofinite/nui';
```

## Architecture & Styling Rules
- **Semantic Tokens ONLY:** Use `bg-surface`, `text-default`, `border-subtle`, `bg-primary-subtle`, `text-danger`, etc. DO NOT USE raw tailwind colors (no `bg-blue-500`, no `text-gray-900`).
- **Accessibility:** Must adhere to strict WAI-ARIA standards. Ensure proper `role` and `aria-*` attributes.

## API / Props
### `Carousel` Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `showArrows` | `boolean` | `true` | - |
| `showDots` | `boolean` | `true` | - |
| `itemWidth` | `string` | `100%` | - |
| `gap` | `string` | `1rem` | - |
| `align` | `"start" \| "center" \| "end"` | `start` | - |
| `autoPlay` | `boolean` | `false` | - |
| `interval` | `number` | `3000` | - |
| `loop` | `boolean` | `false` | - |


