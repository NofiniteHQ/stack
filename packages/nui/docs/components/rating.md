# Rating (rating)

## Import
```tsx
import { Rating } from '@nofinite/nui';
```

## Architecture & Styling Rules
- **Semantic Tokens ONLY:** Use `bg-surface`, `text-default`, `border-subtle`, `bg-primary-subtle`, `text-danger`, etc. DO NOT USE raw tailwind colors (no `bg-blue-500`, no `text-gray-900`).
- **Accessibility:** Must adhere to strict WAI-ARIA standards. Ensure proper `role` and `aria-*` attributes.

## API / Props
### `Rating` Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `value` | `number` | `-` | Controlled state value |
| `defaultValue` | `number` | `0` | Uncontrolled initial value |
| `max` | `number` | `5` | The maximum possible rating. Determines how many icons to render. Defaults to 5. |
| `onChange` | `(value: number) => void` | `-` | Callback fired when a rating is selected |
| `icon` | `ReactNode` | `(  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>  </svg> )` | Custom React node for the empty state |
| `iconFilled` | `ReactNode` | `(  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>  </svg> )` | Custom React node for the filled state |
| `size` | `"sm" \| "md" \| "lg"` | `md` | Size variant |
| `readOnly` | `boolean` | `false` | Makes the rating strictly decorative |
| `disabled` | `boolean` | `false` | Disables interactions and applies a muted style |
| `allowHalf` | `boolean` | `false` | Enables fractional half-step selections (e.g., 3.5 stars) |


