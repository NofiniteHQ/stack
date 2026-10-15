# TreeView

A hierarchical list component that allows users to navigate, expand, and select nested items. Supports controlled selection, default expansion, keyboard navigation, accessibility semantics, and custom icons.

---

## Usage

### Basic usage

```tsx id="tv1"
import { TreeView } from '@nofinite/nui';

const data = [
  { id: '1', label: 'Parent 1' },
  { id: '2', label: 'Parent 2' },
];

<TreeView data={data} />;
```

### With default expanded nodes

```tsx id="tv2"
<TreeView data={data} defaultExpandedIds={['1']} />
```

### Controlled selection

```tsx id="tv3"
const [selectedId, setSelectedId] = useState<string | undefined>();

<TreeView
  data={data}
  selectedId={selectedId}
  onSelect={(id) => setSelectedId(id)}
/>;
```

### With icons and nested children

```tsx id="tv4"
const data = [
  {
    id: '1',
    label: 'Parent 1',
    icon: <FolderIcon />,
    children: [
      { id: '1-1', label: 'Child 1' },
      { id: '1-2', label: 'Child 2' },
    ],
  },
];

<TreeView data={data} />;
```

---

## Props

| Prop                 | Type                                   | Default | Description                           |
| -------------------- | -------------------------------------- | ------- | ------------------------------------- |
| `data`               | `TreeNode[]`                           | —       | Array of tree nodes to render         |
| `selectedId`         | `string`                               | —       | Controlled selected node ID           |
| `defaultExpandedIds` | `string[]`                             | []      | List of node IDs to expand by default |
| `onSelect`           | `(id: string, node: TreeNode) => void` | —       | Callback when a node is selected      |
| `className`          | `string`                               | —       | Additional wrapper styling            |

**TreeNode type**

| Prop       | Type         | Description                      |
| ---------- | ------------ | -------------------------------- |
| `id`       | `string`     | Unique identifier for the node   |
| `label`    | `ReactNode`  | Node label                       |
| `icon`     | `ReactNode`  | Optional icon                    |
| `children` | `TreeNode[]` | Nested child nodes               |
| `disabled` | `boolean`    | Disables selection and expansion |

---

## Variants

### Nested tree with icons

```tsx id="tv5"
<TreeView data={nestedData} />
```

### Disabled nodes

```tsx id="tv6"
const data = [
  { id: '1', label: 'Active Node' },
  { id: '2', label: 'Disabled Node', disabled: true },
];
<TreeView data={data} />;
```

**Available variants**

- Single-level tree
- Multi-level nested tree
- Controlled selection
- Default expanded nodes
- Nodes with icons
- Disabled nodes

**Guidelines**

- Use for hierarchical datasets like folders, categories, or menus
- Provide icons for clarity when representing types of nodes
- Keep nested levels reasonable for readability
- Use disabled nodes for non-interactable items

---

## States

- Default (collapsed)
- Expanded
- Selected
- Disabled
- Focus-visible
- Hover
- Nested levels

---

## Keyboard Interaction

- ArrowUp / ArrowDown → navigate visible nodes
- ArrowRight → expand collapsed node or move to first child
- ArrowLeft → collapse expanded node or move to parent
- Enter / Space → select node and toggle expansion
- Home → focus first visible node
- End → focus last visible node
- Disabled nodes skipped in navigation

---

## Accessibility

- `role="tree"` on root, `role="group"` on nested lists, `role="treeitem"` on items
- `aria-expanded` for nodes with children
- `aria-selected` for selected node
- `aria-disabled` for disabled nodes
- Keyboard navigable according to WAI-ARIA TreeView standard
- Focus visible styling applied for accessibility

---

## Design Tokens

| Token                | Usage                      |
| -------------------- | -------------------------- |
| --nui-font-sans      | Font family                |
| --nui-fg-default     | Text color                 |
| --nui-fg-muted       | Chevron / icon color       |
| --nui-bg-subtle      | Hover / focus background   |
| --nui-color-primary  | Selected / focus outline   |
| --nui-radius-md      | Node border radius         |
| --nui-space-1        | Vertical padding           |
| --nui-space-2        | Horizontal padding / gap   |
| --nui-text-sm        | Label font size            |
| --nui-weight-medium  | Selected label font weight |
| --nui-border-default | Chevron hover background   |

---

## Best Practices

### Do

- Use for hierarchical data structures
- Provide visual cues like icons or chevrons
- Keep nesting levels readable (2–3 levels recommended)
- Use disabled state for non-interactive nodes
- Support keyboard navigation for accessibility

### Don’t

- Overload tree with too many levels or items
- Hide interactive functionality from keyboard users
- Mix unrelated actions inside tree nodes
- Remove focus indicators
- Use long labels that overflow without ellipsis
