# Resizable (resizable)

## Import
```tsx
import { Resizable } from '@nofinite/nui';
```

## Architecture & Styling Rules
- **Semantic Tokens ONLY:** Use `bg-surface`, `text-default`, `border-subtle`, `bg-primary-subtle`, `text-danger`, etc. DO NOT USE raw tailwind colors (no `bg-blue-500`, no `text-gray-900`).
- **Accessibility:** Must adhere to strict WAI-ARIA standards. Ensure proper `role` and `aria-*` attributes.

## API / Props
### `Resizable` Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `direction` | `"horizontal" \| "vertical"` | `horizontal` | The flex layout direction. Defaults to 'horizontal'. |
| `onLayout` | `(sizes: number[]) => void` | `-` | Callback fired when the user completes a resize action, providing an array of panel sizes (percentages) |


