# Link (link)

## Import
```tsx
import { Link } from '@nofinite/nui';
```

## Architecture & Styling Rules
- **Semantic Tokens ONLY:** Use `bg-surface`, `text-default`, `border-subtle`, `bg-primary-subtle`, `text-danger`, etc. DO NOT USE raw tailwind colors (no `bg-blue-500`, no `text-gray-900`).
- **Accessibility:** Must adhere to strict WAI-ARIA standards. Ensure proper `role` and `aria-*` attributes.

## API / Props
### `Link` Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `variant` | `LinkVariant` | `default` | - |
| `underline` | `LinkUnderline` | `hover` | - |
| `isExternal` | `boolean` | `false` | Automatically applies `target="_blank"` and `rel="noopener noreferrer"` for external routing security. |
| `asChild` | `boolean` | `false` | * Polymorphic Prop: When true, delegates rendering to its child. Crucial for integrating with framework routers like Next.js `<Link>` or React Router. |


