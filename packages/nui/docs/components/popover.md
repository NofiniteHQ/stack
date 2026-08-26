# Popover (popover)

## Import
```tsx
import { Popover, Popover.Trigger, Popover.Content, Popover.Close } from '@nofinite/nui';
```

## Architecture & Styling Rules
- **Semantic Tokens ONLY:** Use `bg-surface`, `text-default`, `border-subtle`, `bg-primary-subtle`, `text-danger`, etc. DO NOT USE raw tailwind colors (no `bg-blue-500`, no `text-gray-900`).
- **Accessibility:** Must adhere to strict WAI-ARIA standards. Ensure proper `role` and `aria-*` attributes.

## API / Props
### `Popover` Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `defaultOpen` | `boolean` | `false` | - |

### `Popover.Content` Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `placement` | `PopoverPlacement` | `bottom` | Preferred placement of the popover relative to the trigger. Defaults to 'bottom' |
| `offset` | `number` | `8` | Gap in pixels between the trigger and the popover. Defaults to 8px. |
| `showArrow` | `boolean` | `false` | Whether to show a directional arrow pointing to the trigger. Defaults to false for modern aesthetic. |


