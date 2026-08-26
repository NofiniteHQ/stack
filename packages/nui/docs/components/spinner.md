# Spinner (spinner)

## Import
```tsx
import { Spinner } from '@nofinite/nui';
```

## Architecture & Styling Rules
- **Semantic Tokens ONLY:** Use `bg-surface`, `text-default`, `border-subtle`, `bg-primary-subtle`, `text-danger`, etc. DO NOT USE raw tailwind colors (no `bg-blue-500`, no `text-gray-900`).
- **Accessibility:** Must adhere to strict WAI-ARIA standards. Ensure proper `role` and `aria-*` attributes.

## API / Props
### `Spinner` Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `size` | `"sm" \| "md" \| "lg" \| "xl"` | `md` | The predefined size of the spinner. Defaults to 'md'. |
| `variant` | `"primary" \| "muted" \| "inverse"` | `primary` | The color theme variant. Defaults to 'primary'. |
| `label` | `string` | `Loading...` | WAI-ARIA label read by screen readers. Defaults to 'Loading...'. |


