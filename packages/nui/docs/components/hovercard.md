# Hovercard (hovercard)

## Import
```tsx
import { HoverCard, HoverCard.Trigger, HoverCard.Content } from '@nofinite/nui';
```

## Architecture & Styling Rules
- **Semantic Tokens ONLY:** Use `bg-surface`, `text-default`, `border-subtle`, `bg-primary-subtle`, `text-danger`, etc. DO NOT USE raw tailwind colors (no `bg-blue-500`, no `text-gray-900`).
- **Accessibility:** Must adhere to strict WAI-ARIA standards. Ensure proper `role` and `aria-*` attributes.

## API / Props
### `HoverCard` Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `openDelay` | `number` | `200` | Delay in milliseconds before the card opens. Defaults to 200ms. |
| `closeDelay` | `number` | `300` | Delay in milliseconds before the card closes. Defaults to 300ms. |

### `HoverCard.Content` Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `placement` | `HoverCardPlacement` | `bottom` | Preferred placement of the card relative to the trigger. Defaults to 'bottom' |
| `offset` | `number` | `12` | Gap in pixels between the trigger and the card. Defaults to 8px. |
| `hideArrow` | `boolean` | `false` | If true, hides the directional arrow pointing to the trigger. |


