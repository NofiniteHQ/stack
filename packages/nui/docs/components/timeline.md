# Timeline (timeline)

## Import
```tsx
import { Timeline } from '@nofinite/nui';
```

## Architecture & Styling Rules
- **Semantic Tokens ONLY:** Use `bg-surface`, `text-default`, `border-subtle`, `bg-primary-subtle`, `text-danger`, etc. DO NOT USE raw tailwind colors (no `bg-blue-500`, no `text-gray-900`).
- **Accessibility:** Must adhere to strict WAI-ARIA standards. Ensure proper `role` and `aria-*` attributes.

## API / Props
### `Timeline` Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `data` | `TimelineItem[]` | `-` | Array of items for Smart Default mode |
| `orientation` | `"horizontal" \| "vertical"` | `vertical` | - |
| `hideLine` | `boolean` | `false` | If true, hides the connecting lines between all nodes |


