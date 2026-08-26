# Accordion (accordion)

## Import
```tsx
import { Accordion } from '@nofinite/nui';
```

## Architecture & Styling Rules
- **Semantic Tokens ONLY:** Use `bg-surface`, `text-default`, `border-subtle`, `bg-primary-subtle`, `text-danger`, etc. DO NOT USE raw tailwind colors (no `bg-blue-500`, no `text-gray-900`).
- **Accessibility:** Must adhere to strict WAI-ARIA standards. Ensure proper `role` and `aria-*` attributes.

## API / Props
### `Accordion` Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `data` | `AccordionItem[]` | `-` | Array of items for Smart Default mode |
| `defaultOpenId` | `string` | `-` | ID of the item that should be open by default |
| `multiple` | `boolean` | `false` | If true, allows multiple accordion panels to remain open simultaneously |


