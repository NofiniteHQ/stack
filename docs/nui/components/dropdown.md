# Dropdown

A compound menu component for contextual actions anchored to a trigger.
Implements controlled open state via internal context, keyboard navigation, focus restoration, and outside-click dismissal.

Architecture follows a **compound component pattern** with context-driven state propagation.

---

## Usage

### Basic

```tsx id="dd1">
import { Dropdown } from '@nofinite/nui';
<Dropdown>
  <Dropdown.Trigger>Options</Dropdown.Trigger>
  <Dropdown.Menu>
    <Dropdown.Item>Profile</Dropdown.Item>
    <Dropdown.Item>Settings</Dropdown.Item>
    <Dropdown.Item>Logout</Dropdown.Item>
  </Dropdown.Menu>
</Dropdown>;
```

---

### Custom trigger (Button component)

```tsx id="dd2">
<Dropdown>
  <Dropdown.Trigger>
    <Button variant="ghost">Menu</Button>
  </Dropdown.Trigger>

  <Dropdown.Menu>
    <Dropdown.Item>Account</Dropdown.Item>
    <Dropdown.Item>Billing</Dropdown.Item>
  </Dropdown.Menu>
</Dropdown>
```

---

### End-aligned menu

```tsx id="dd3">
<Dropdown>
  <Dropdown.Trigger>More</Dropdown.Trigger>
  <Dropdown.Menu align="end">
    <Dropdown.Item>Edit</Dropdown.Item>
    <Dropdown.Item>Delete</Dropdown.Item>
  </Dropdown.Menu>
</Dropdown>
```

---

### With action handlers

```tsx id="dd4">
<Dropdown>
  <Dropdown.Trigger>Actions</Dropdown.Trigger>
  <Dropdown.Menu>
    <Dropdown.Item onSelect={() => save()}>Save</Dropdown.Item>
    <Dropdown.Item onSelect={() => remove()}>Delete</Dropdown.Item>
  </Dropdown.Menu>
</Dropdown>
```

---

## Props

### Root

| Prop      | Type      | Default | Description        |
| --------- | --------- | ------- | ------------------ |
| children  | ReactNode | —       | Compound children  |
| className | string    | —       | Root wrapper class |

---

### Trigger

| Prop     | Type      | Description                |
| -------- | --------- | -------------------------- |
| children | ReactNode | Trigger element or content |

Behavior:

- Accepts element cloning (preserves child props)
- Injects ARIA attributes
- Toggles open state

---

### Menu

| Prop      | Type                 | Default    | Description          |
| --------- | -------------------- | ---------- | -------------------- |
| align     | `'start'   \| 'end'` | "start"    | Horizontal alignment |
| className | string               | —          | Menu override        |
| children  | ReactNode            | Menu items |                      |

Extends `HTMLAttributes<HTMLDivElement>`.

---

### Item

| Prop      | Type       | Description        |
| --------- | ---------- | ------------------ |
| onSelect  | () => void | Selection callback |
| className | string     | Style override     |
| children  | ReactNode  | Item content       |

Extends `HTMLAttributes<HTMLDivElement>`.

---

## Subcomponents

- Dropdown.Trigger
- Dropdown.Menu
- Dropdown.Item

Compound composition is required.

---

## Variants

```tsx
<Dropdown.Menu align="start" />
<Dropdown.Menu align="end" />
<Dropdown.Item />
<Dropdown.Item className="nui-text-danger" />
```

**Available variants:**

- start (default)
- end
- default item
- danger item

**Guidelines:**

- Use start alignment for inline actions
- Use end alignment for corner anchored menus
- Use danger items for destructive actions

---

## Sizes

Intrinsic sizing model:

| Element | Behavior         |
| ------- | ---------------- |
| Menu    | min-width: 180px |
| Item    | full-width row   |
| Trigger | inline-flex      |

Width should be extended via utilities.

---

## Shapes / Modes

**States**

- Closed (unmounted)
- Open (mounted)
- Outside-click dismissed
- Escape dismissed
- Keyboard navigated
- Focus restored to trigger

**Interaction modes**

- Mouse selection
- Keyboard arrow navigation
- Enter/Space activation

---

## Design tokens / theming

Uses NUI tokens:

- `--nui-bg-surface`
- `--nui-bg-subtle`
- `--nui-fg-default`
- `--nui-border-default`
- `--nui-color-primary`
- `--nui-color-danger`
- `--nui-space-*`
- `--nui-radius-*`
- `--nui-text-sm`
- `--nui-weight-medium`

Z-index: `1000`

---

## Accessibility

Implemented:

- Trigger
  - `aria-haspopup="menu"`
  - `aria-expanded`
- Menu
  - `role="menu"`
- Items
  - `role="menuitem"`
  - Programmatic focus via roving arrow navigation
- Keyboard navigation
  - Escape closes
  - ArrowUp / ArrowDown cycling
  - Enter / Space activation
- Focus restoration to trigger
- Outside click dismissal

Limitations:

- No typeahead search
- No roving tab index pattern (arrow-only navigation)
- No submenu support
- No aria-activedescendant model

---

## Animation model

Entry animation:

- Scale + translateY fade-in
- Duration: 150ms
- Transform origin: top-left
- GPU accelerated

Unmount on close (no exit animation).

---

## Architectural notes

Design characteristics:

- Compound context architecture
- Element cloning trigger injection
- Ref composition strategy
- DOM query for focusable menu items
- Controlled focus lifecycle
- Lightweight state model (boolean open)

---

## Best practices

### Do

- Use compound composition
- Keep menu lightweight
- Provide semantic labels inside items
- Use danger state for destructive actions

### Don’t

- Nest dropdowns (no submenu support)
- Use heavy layout content inside menu
- Remove trigger element from DOM during open state
- Disable focus styling
