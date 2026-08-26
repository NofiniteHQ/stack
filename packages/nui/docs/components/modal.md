# Modal (modal)

## Import
```tsx
import { Modal } from '@nofinite/nui';
```

## Architecture & Styling Rules
- **Semantic Tokens ONLY:** Use `bg-surface`, `text-default`, `border-subtle`, `bg-primary-subtle`, `text-danger`, etc. DO NOT USE raw tailwind colors (no `bg-blue-500`, no `text-gray-900`).
- **Accessibility:** Must adhere to strict WAI-ARIA standards. Ensure proper `role` and `aria-*` attributes.

## API / Props
### `Modal` Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `open`* | `boolean` | `-` | - |
| `onClose`* | `() => void` | `-` | - |
| `title` | `ReactNode` | `-` | - |
| `description` | `ReactNode` | `-` | - |
| `labelledById` | `string` | `-` | - |
| `describedById` | `string` | `-` | - |
| `disableClickOutside` | `boolean` | `false` | - |
| `disableEsc` | `boolean` | `false` | - |
| `initialFocusRef` | `RefObject<HTMLElement>` | `-` | - |
| `overlayClassName` | `string` | `-` | - |
| `hideCloseButton` | `boolean` | `false` | Hides the 'X' close button in the top right corner. |


