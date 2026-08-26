# Statcard (statcard)

## Import
```tsx
import { StatCard } from '@nofinite/nui';
```

## Architecture & Styling Rules
- **Semantic Tokens ONLY:** Use `bg-surface`, `text-default`, `border-subtle`, `bg-primary-subtle`, `text-danger`, etc. DO NOT USE raw tailwind colors (no `bg-blue-500`, no `text-gray-900`).
- **Accessibility:** Must adhere to strict WAI-ARIA standards. Ensure proper `role` and `aria-*` attributes.

## API / Props
### `StatCard` Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `label`* | `ReactNode` | `-` | - |
| `value`* | `ReactNode` | `-` | - |
| `icon` | `ReactNode` | `-` | - |
| `trend` | `"up" \| "down" \| "neutral"` | `-` | - |
| `trendValue` | `ReactNode` | `-` | - |
| `trendLabel` | `ReactNode` | `-` | - |
| `isLoading` | `boolean` | `false` | - |
| `info` | `ReactNode` | `-` | - |
| `progressValue` | `number` | `-` | - |
| `progressMax` | `number` | `100` | - |
| `accent` | `"success" \| "warning" \| "default" \| "danger" \| "brand"` | `default` | - |
| `sparklineData` | `number[]` | `-` | - |


