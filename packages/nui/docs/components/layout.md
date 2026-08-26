# Layout (layout)

## Import
```tsx
import { Container, Flex, Stack, HStack, Grid } from '@nofinite/nui';
```

## Architecture & Styling Rules
- **Semantic Tokens ONLY:** Use `bg-surface`, `text-default`, `border-subtle`, `bg-primary-subtle`, `text-danger`, etc. DO NOT USE raw tailwind colors (no `bg-blue-500`, no `text-gray-900`).
- **Accessibility:** Must adhere to strict WAI-ARIA standards. Ensure proper `role` and `aria-*` attributes.

## API / Props
### `Container` Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `size` | `"sm" \| "md" \| "lg" \| "xl" \| "full"` | `lg` | The maximum width bounds for the container. Defaults to 'lg'. |
| `asChild` | `boolean` | `false` | Merges props into the immediate child when true, allowing polymorphic rendering |

### `Flex` Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `direction` | `"row" \| "column" \| "row-reverse" \| "column-reverse"` | `row` | Defines the flex-direction. Defaults to 'row'. |
| `align` | `"start" \| "center" \| "end" \| "stretch" \| "baseline"` | `stretch` | Defines the align-items cross-axis behavior. Defaults to 'stretch'. |
| `justify` | `"start" \| "center" \| "end" \| "between" \| "around" \| "evenly"` | `start` | Defines the justify-content main-axis behavior. Defaults to 'start'. |
| `wrap` | `"wrap" \| "nowrap" \| "wrap-reverse"` | `nowrap` | Defines the flex-wrap behavior. Defaults to 'nowrap'. |
| `gap` | `string \| number` | `0` | The gap between flex items. Accepts numbers (px) or valid CSS strings. Defaults to 0. |

### `Stack` Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `align` | `"start" \| "center" \| "end" \| "stretch" \| "baseline"` | `stretch` | Defines the align-items cross-axis behavior. Defaults to 'stretch'. |
| `wrap` | `"wrap" \| "nowrap" \| "wrap-reverse"` | `nowrap` | Defines the flex-wrap behavior. Defaults to 'nowrap'. |
| `justify` | `"start" \| "center" \| "end" \| "between" \| "around" \| "evenly"` | `start` | Defines the justify-content main-axis behavior. Defaults to 'start'. |
| `gap` | `string \| number` | `0` | The gap between flex items. Accepts numbers (px) or valid CSS strings. Defaults to 0. |

### `HStack` Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `align` | `"start" \| "center" \| "end" \| "stretch" \| "baseline"` | `stretch` | Defines the align-items cross-axis behavior. Defaults to 'stretch'. |
| `wrap` | `"wrap" \| "nowrap" \| "wrap-reverse"` | `nowrap` | Defines the flex-wrap behavior. Defaults to 'nowrap'. |
| `justify` | `"start" \| "center" \| "end" \| "between" \| "around" \| "evenly"` | `start` | Defines the justify-content main-axis behavior. Defaults to 'start'. |
| `gap` | `string \| number` | `0` | The gap between flex items. Accepts numbers (px) or valid CSS strings. Defaults to 0. |

### `Grid` Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `columns` | `number \| "auto-fit" \| "auto-fill"` | `auto-fit` | Number of fixed columns, or responsive auto algorithms. Defaults to 'auto-fit'. |
| `gap` | `string \| number` | `16` | The gap between grid items. Accepts numbers (px) or valid CSS strings. Defaults to 16. |
| `minColWidth` | `string` | `250px` | The minimum width a column can shrink to before wrapping. Used with auto-fit/fill. Defaults to '250px'. |


