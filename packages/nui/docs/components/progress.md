# Progress (progress)

## Import
```tsx
import { Progress } from '@nofinite/nui';
```

## Architecture & Styling Rules
- **Semantic Tokens ONLY:** Use `bg-surface`, `text-default`, `border-subtle`, `bg-primary-subtle`, `text-danger`, etc. DO NOT USE raw tailwind colors (no `bg-blue-500`, no `text-gray-900`).
- **Accessibility:** Must adhere to strict WAI-ARIA standards. Ensure proper `role` and `aria-*` attributes.

## API / Props
### `Progress` Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `value` | `number` | `-` | The current progress value |
| `max` | `number` | `100` | The maximum possible value. Defaults to 100. |
| `indeterminate` | `boolean` | `false` | Forces the progress bar into an animated indeterminate state |
| `size` | `"sm" \| "md" \| "lg"` | `md` | The visual height of the progress bar. Defaults to 'md'. |
| `variant` | `"success" \| "warning" \| "default" \| "danger"` | `default` | The semantic color variant. Defaults to 'default'. |
| `label` | `string` | `Progress` | WAI-ARIA hidden label for screen readers. Defaults to 'Progress'. |


