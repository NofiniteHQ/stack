# Avatar (avatar)

## Import
```tsx
import { Avatar, AvatarGroup } from '@nofinite/nui';
```

## Architecture & Styling Rules
- **Semantic Tokens ONLY:** Use `bg-surface`, `text-default`, `border-subtle`, `bg-primary-subtle`, `text-danger`, etc. DO NOT USE raw tailwind colors (no `bg-blue-500`, no `text-gray-900`).
- **Accessibility:** Must adhere to strict WAI-ARIA standards. Ensure proper `role` and `aria-*` attributes.

## API / Props
### `Avatar` Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `src` | `string` | `-` | - |
| `alt` | `string` | `-` | - |
| `name` | `string` | `-` | - |
| `size` | `AvatarSize` | `md` | - |
| `shape` | `AvatarShape` | `circle` | - |
| `status` | `AvatarStatus` | `-` | - |
| `fallbackIcon` | `ReactNode` | `-` | - |
| `loading` | `boolean` | `-` | - |
| `className` | `string` | `-` | - |

### `AvatarGroup` Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `max` | `number` | `3` | Maximum number of avatars to display before truncating |
| `size` | `AvatarSize` | `md` | Size passed down to all nested Avatar components |
| `className` | `string` | `-` | - |


