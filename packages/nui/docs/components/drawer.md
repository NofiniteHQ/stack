# Drawer (drawer)

## Import
```tsx
import { Drawer } from '@nofinite/nui';
```

## Architecture & Styling Rules
- **Semantic Tokens ONLY:** Use `bg-surface`, `text-default`, `border-subtle`, `bg-primary-subtle`, `text-danger`, etc. DO NOT USE raw tailwind colors (no `bg-blue-500`, no `text-gray-900`).
- **Accessibility:** Must adhere to strict WAI-ARIA standards. Ensure proper `role` and `aria-*` attributes.

## API / Props
### `Drawer` Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `open`* | `boolean` | `-` | Controls the open/closed state of the drawer |
| `onClose`* | `() => void` | `-` | Callback fired when the drawer requests to be closed (e.g., Escape key, outside click) |
| `position` | `"left" \| "right" \| "bottom" \| "top"` | `right` | The edge of the screen the drawer attaches to. Defaults to 'right' |
| `disableEsc` | `boolean` | `false` | Prevents the drawer from closing when the Escape key is pressed |
| `disableClickOutside` | `boolean` | `false` | Prevents the drawer from closing when a click occurs outside the content area |
| `overlayClassName` | `string` | `-` | Custom class name applied to the backdrop overlay |
| `title` | `ReactNode` | `-` | Optional title displayed at the top of the Drawer |
| `description` | `ReactNode` | `-` | Optional description displayed below the title |
| `hideCloseButton` | `boolean` | `false` | If true, hides the default close 'X' button |
| `transitionDuration` | `number` | `0.3` | Transition duration in seconds. Defaults to 0.3 |


