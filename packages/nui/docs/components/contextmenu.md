# Contextmenu (contextmenu)

## Import
```tsx
import { ContextMenu } from '@nofinite/nui';
```

## Architecture & Styling Rules
- **Semantic Tokens ONLY:** Use `bg-surface`, `text-default`, `border-subtle`, `bg-primary-subtle`, `text-danger`, etc. DO NOT USE raw tailwind colors (no `bg-blue-500`, no `text-gray-900`).
- **Accessibility:** Must adhere to strict WAI-ARIA standards. Ensure proper `role` and `aria-*` attributes.

## API / Props
### `ContextMenu` Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `items`* | `ContextMenuItem[]` | `-` | - |
| `className` | `string` | `-` | - |
| `asChild` | `boolean` | `false` | * If true, the ContextMenu will not wrap children in a <div>. Instead, it clones the child and directly attaches the onContextMenu event. Child MUST be a valid single React Element. |


