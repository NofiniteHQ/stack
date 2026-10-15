# Resizable

A layout primitive that enables users to resize adjacent panels via drag or keyboard interaction. It supports horizontal and vertical orientations, flexible panel constraints, and WAI-ARIA compliant separator behavior.

The component is composed of:

- `Resizable` (root container)
- `Resizable.Panel`
- `Resizable.Handle`

---

## Usage

### Basic horizontal split

```tsx id="4ng9k5"
import { Resizable } from '@nofinite/nui';

export function Example() {
  return (
    <Resizable>
      <Resizable.Panel defaultSize={50}>Left</Resizable.Panel>
      <Resizable.Handle />
      <Resizable.Panel defaultSize={50}>Right</Resizable.Panel>
    </Resizable>
  );
}
```

### Vertical split

```tsx id="snkz2o"
<Resizable direction="vertical">
  <Resizable.Panel defaultSize={30}>Top</Resizable.Panel>
  <Resizable.Handle />
  <Resizable.Panel defaultSize={70}>Bottom</Resizable.Panel>
</Resizable>
```

### With constraints

```tsx id="e7i6kq"
<Resizable>
  <Resizable.Panel minSize={20} maxSize={80} defaultSize={40} />
  <Resizable.Handle />
  <Resizable.Panel />
</Resizable>
```

### With grip icon

```tsx id="s8sdhi"
<Resizable.Handle withIcon />
```

### Layout change callback

```tsx id="3h3s38"
<Resizable onLayout={(sizes) => console.log(sizes)} />
```

---

## Props

### Resizable (Root)

| Prop        | Type                         | Default      | Description                   |
| ----------- | ---------------------------- | ------------ | ----------------------------- |
| `direction` | `'horizontal' \| 'vertical'` | `horizontal` | Layout direction              |
| `onLayout`  | `(sizes: number[]) => void`  | —            | Called after resize completes |
| `className` | `string`                     | —            | Additional class names        |

Extends `HTMLDivElement` attributes.

---

### Resizable.Panel

| Prop          | Type     | Default | Description                  |
| ------------- | -------- | ------- | ---------------------------- |
| `defaultSize` | `number` | —       | Initial flex grow percentage |
| `minSize`     | `number` | `0`     | Minimum size percentage      |
| `maxSize`     | `number` | `100`   | Maximum size percentage      |
| `className`   | `string` | —       | Additional class names       |

---

### Resizable.Handle

| Prop        | Type      | Default | Description                   |
| ----------- | --------- | ------- | ----------------------------- |
| `withIcon`  | `boolean` | `false` | Shows grip icon inside handle |
| `className` | `string ` | —       | Additional class names        |

---

## Variants

### Direction

```tsx id="sbq9u0"
<Resizable direction="horizontal" />
<Resizable direction="vertical" />
```

**Available variants**

- horizontal
- vertical

**Guidelines**

- Use **horizontal** for sidebars and split editors
- Use **vertical** for stacked panes and dashboards
- Prefer consistent orientation across a workspace

---

### Handle visual variant

```tsx id="p02s3n"
<Resizable.Handle />
<Resizable.Handle withIcon />
```

**Available variants**

- default
- withIcon

**Guidelines**

- Use icon grip for discoverability
- Use default for minimal UI
- Prefer icon when drag affordance is unclear

---

## States

- Default
- Hover (handle highlight)
- Focus visible (keyboard)
- Dragging
- Constraint-limited resize
- Keyboard resize
- Orientation-dependent cursor

---

## Keyboard Interaction

| Key           | Behavior                           |
| ------------- | ---------------------------------- |
| Arrow keys    | Resize panels based on orientation |
| Shift + Arrow | Resize by 10% step                 |
| Home          | Move toward minimum bound          |
| End           | Move toward maximum bound          |

Handles follow separator interaction pattern.

---

## Accessibility

- Uses `role="separator"` on handle
- Orientation via `aria-orientation`
- Dynamic `aria-valuenow` updates
- Keyboard operable resizing
- Focusable handle with visible focus ring
- Pointer drag does not remove keyboard operability (manual focus restoration)

---

## Design Tokens

| Token                | Usage                     |
| -------------------- | ------------------------- |
| --nui-border-default | Handle divider color      |
| --nui-color-primary  | Active/hover handle color |
| --nui-bg-subtle      | Focus background          |
| --nui-bg-surface     | Grip background           |
| --nui-fg-muted       | Grip icon color           |

---

## Best Practices

### Do

- Define min/max constraints for predictable layouts
- Use icon grips in complex editors
- Persist layout using onLayout
- Ensure panels contain overflow-safe content
- Use consistent panel sizing strategy

### Don’t

- Nest many resizable groups without performance consideration
- Omit constraints in critical layouts
- Place scroll containers directly on handles
- Use vertical + horizontal nesting without UX clarity
