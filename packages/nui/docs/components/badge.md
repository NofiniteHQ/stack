# Badge (badge)

## Import
```tsx
import { Badge, BadgeGroup } from '@nofinite/nui';
```

## Architecture & Styling Rules
- **Semantic Tokens ONLY:** Use `bg-surface`, `text-default`, `border-subtle`, `bg-primary-subtle`, `text-danger`, etc. DO NOT USE raw tailwind colors (no `bg-blue-500`, no `text-gray-900`).
- **Accessibility:** Must adhere to strict WAI-ARIA standards. Ensure proper `role` and `aria-*` attributes.

## API / Props
### `Badge` Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `count` | `number` | `-` | Displays a numerical count inside the badge |
| `max` | `number` | `99` | The maximum number to display before showing a '+' (e.g., 99+) |
| `variant` | `BadgeVariant` | `default` | - |
| `size` | `BadgeSize` | `md` | - |
| `pill` | `boolean` | `false` | Rounds the edges to create a pill shape |
| `dot` | `boolean` | `false` | Renders a small, empty circular indicator instead of text |
| `href` | `string` | `-` | If provided, renders the badge as an <a> tag |
| `onClick` | `MouseEventHandler<HTMLElement>` | `-` | If provided, renders the badge as a <button> tag |
| `iconLeft` | `ReactNode` | `-` | - |
| `iconRight` | `ReactNode` | `-` | - |
| `asChild` | `boolean` | `-` | Renders the component using its child element |

### `BadgeGroup` Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `max` | `number` | `3` | - |


