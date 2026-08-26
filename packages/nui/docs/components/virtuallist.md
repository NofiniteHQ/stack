# Virtuallist (virtuallist)

## Import
```tsx
import { VirtualList } from '@nofinite/nui';
```

## Architecture & Styling Rules
- **Semantic Tokens ONLY:** Use `bg-surface`, `text-default`, `border-subtle`, `bg-primary-subtle`, `text-danger`, etc. DO NOT USE raw tailwind colors (no `bg-blue-500`, no `text-gray-900`).
- **Accessibility:** Must adhere to strict WAI-ARIA standards. Ensure proper `role` and `aria-*` attributes.

## API / Props
### `VirtualList` Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `items`* | `T[]` | `-` | Array of data items to render |
| `height` | `number` | `-` | Height of the scrollable viewport in pixels. If omitted, it will automatically size to its container. |
| `itemHeight` | `number` | `-` | Fixed height for each row in pixels. Defaults to 40. |
| `overscan` | `number` | `-` | Extra rows to render above and below the viewport to prevent white flashes during fast scrolling |
| `keyExtractor` | `(item: T, index: number) => string \| number` | `-` | Extracts a unique React key for each item. Crucial for stable rendering during sorts/filters! |
| `renderItem`* | `(item: T, index: number) => ReactNode` | `-` | The render function for the row |
| `ref` | `ForwardedRef<VirtualListHandle>` | `-` | - |


