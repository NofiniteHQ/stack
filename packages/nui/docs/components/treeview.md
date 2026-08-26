# Treeview (treeview)

## Import
```tsx
import { TreeContext, TreeView, TreeView.Item } from '@nofinite/nui';
```

## Architecture & Styling Rules
- **Semantic Tokens ONLY:** Use `bg-surface`, `text-default`, `border-subtle`, `bg-primary-subtle`, `text-danger`, etc. DO NOT USE raw tailwind colors (no `bg-blue-500`, no `text-gray-900`).
- **Accessibility:** Must adhere to strict WAI-ARIA standards. Ensure proper `role` and `aria-*` attributes.

## API / Props
### `TreeView` Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `data` | `TreeNode[]` | `-` | - |
| `selectedId` | `string` | `-` | - |
| `defaultExpandedIds` | `string[]` | `[]` | - |
| `onSelect` | `(id: string, node: any) => void` | `-` | - |

### `TreeView.Item` Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `id`* | `string` | `-` | - |
| `label`* | `ReactNode` | `-` | - |
| `icon` | `ReactNode` | `-` | - |
| `disabled` | `boolean` | `-` | - |
| `level` | `number` | `1` | - |
| `tabIndex` | `number` | `-` | - |


