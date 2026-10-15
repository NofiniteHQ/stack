# ContextMenu

A **right-click triggered contextual action menu** that provides spatially anchored commands with keyboard navigation, collision-aware positioning, accessibility semantics, and portal-based rendering.

Supports **icons, separators, disabled items, danger actions, focus management, keyboard navigation, viewport collision detection, and trigger composition via `asChild`.**

---

## Usage

### Basic Context Menu

```tsx id="1p9azk"
import { ContextMenu } from '@nofinite/nui';

<ContextMenu
  items={[
    { label: 'Rename', onSelect: () => rename() },
    { label: 'Duplicate', onSelect: () => duplicate() },
    { type: 'separator' },
    { label: 'Delete', danger: true, onSelect: () => remove() },
  ]}
>
  <div>Right click me</div>
</ContextMenu>;
```

---

### With Icons

```tsx id="9j3l2s"
<ContextMenu
  items={[
    { label: 'Copy', icon: <CopyIcon />, onSelect: copy },
    { label: 'Paste', icon: <PasteIcon />, onSelect: paste },
  ]}
>
  <FileCard />
</ContextMenu>
```

---

### Disabled Items

```tsx id="2kx8sa"
<ContextMenu
  items={[
    { label: 'Open', onSelect: openFile },
    { label: 'Rename', disabled: true },
    { label: 'Delete', danger: true, onSelect: deleteFile },
  ]}
>
  <FileRow />
</ContextMenu>
```

---

### Using `asChild` Trigger

```tsx id="0z82xa"
<ContextMenu asChild items={items}>
  <Button variant="ghost">Right click</Button>
</ContextMenu>
```

---

## Props

| Prop        | Type                | Default | Description                               |
| ----------- | ------------------- | ------- | ----------------------------------------- |
| `children`  | `ReactNode`         | —       | Trigger element                           |
| `items`     | `ContextMenuItem[]` | —       | Menu items definition                     |
| `className` | `string`            | `""`    | Custom panel styling                      |
| `asChild`   | `boolean`           | `false` | Avoid wrapper and attach handler directly |

---

## ContextMenuItem Structure

| Field      | Type                    | Description                   |
| ---------- | ----------------------- | ----------------------------- |
| `label`    | `string`                | Item text                     |
| `icon`     | `ReactNode`             | Optional leading icon         |
| `onSelect` | `() => void`            | Action handler                |
| `danger`   | `boolean`               | Highlights destructive action |
| `disabled` | `boolean`               | Disables interaction          |
| `type`     | `'item' \| 'separator'` | Item or divider               |

---

## Variants

```tsx id="0d2kqp"
<ContextMenu items={items} />                 // Default
<ContextMenu items={itemsWithIcons} />        // Icon items
<ContextMenu items={itemsWithSeparator} />    // Divider groups
<ContextMenu items={dangerItems} />           // Danger actions
```

**Available variants**

- `default` — Standard contextual actions
- `icon` — Items with visual affordances
- `grouped` — Separator-based grouping
- `danger` — Destructive emphasis items

**Guidelines**

- Use `default` for simple action lists
- Use `icon` when recognition speed matters
- Use `grouped` to separate semantic clusters
- Use `danger` only for destructive operations

---

## States

| State      | Description                |
| ---------- | -------------------------- |
| `closed`   | Menu hidden                |
| `open`     | Menu visible               |
| `active`   | Keyboard highlighted item  |
| `disabled` | Non-interactive item       |
| `danger`   | Destructive action styling |

---

## Keyboard Interaction

| Key             | Behavior                      |
| --------------- | ----------------------------- |
| `ArrowDown`     | Move to next enabled item     |
| `ArrowUp`       | Move to previous enabled item |
| `Home`          | Jump to first enabled item    |
| `End`           | Jump to last enabled item     |
| `Enter / Space` | Execute active item           |
| `Escape`        | Close menu                    |

---

## Accessibility

- Implements **ARIA menu pattern**
- Focus automatically moved to menu on open
- Active item tracked via keyboard navigation
- `aria-disabled` for disabled items
- Screen reader friendly separators
- Click-outside and Escape dismissal
- Scroll/resize auto-dismiss for spatial correctness

---

## Design Tokens

```css id="x8p3sw"
:root {
  --nui-radius-lg: 12px;
  --nui-radius-sm: 4px;
  --nui-space-1: 4px;
  --nui-space-2: 8px;

  --nui-bg-surface: #ffffff;
  --nui-bg-subtle: #f3f4f6;
  --nui-border-default: #e5e7eb;
  --nui-fg-default: #111827;
  --nui-fg-muted: #6b7280;
  --nui-color-danger: #ef4444;
}
```

---

## Best Practices

### Do

- Use for contextual object-level actions
- Keep menus short and relevant
- Group related commands with separators
- Use danger styling for destructive actions
- Provide icons for high-frequency workflows

### Don’t

- Place global navigation commands inside context menu
- Include too many actions causing cognitive overload
- Mix unrelated destructive and safe actions
- Disable keyboard navigation
- Rely solely on hover for discoverability
