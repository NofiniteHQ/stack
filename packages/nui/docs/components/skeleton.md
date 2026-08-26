# Skeleton (skeleton)

## Import
```tsx
import { Skeleton } from '@nofinite/nui';
```

## Architecture & Styling Rules
- **Semantic Tokens ONLY:** Use `bg-surface`, `text-default`, `border-subtle`, `bg-primary-subtle`, `text-danger`, etc. DO NOT USE raw tailwind colors (no `bg-blue-500`, no `text-gray-900`).
- **Accessibility:** Must adhere to strict WAI-ARIA standards. Ensure proper `role` and `aria-*` attributes.

## API / Props
### `Skeleton` Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `size` | `SkeletonSize` | `md` | The predefined height mapping for the skeleton |
| `width` | `string \| number` | `-` | Explicit width override (supports numbers as px, or strings like '100%') |
| `height` | `string \| number` | `-` | Explicit height override (supports numbers as px, or strings like '50px') |
| `animated` | `boolean` | `true` | Enables or disables the sweeping shimmer animation. Defaults to true. |
| `circle` | `boolean` | `false` | Forces the skeleton into a perfect circle, ignoring the size height |
| `ariaHidden` | `boolean` | `true` | Hides the element from screen readers. Defaults to true (recommended). |


