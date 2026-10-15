# Drawer

A controlled overlay panel that slides from an edge of the viewport.
Implements focus trapping, scroll locking, inert background handling, escape key support, and animated mount/unmount lifecycle.

---

## Usage

### Basic (Right side)

```tsx id="drw1">
import { Drawer } from '@nofinite/nui';
const [open, setOpen] = useState(false);

<>
  <button onClick={() => setOpen(true)}>Open</button>
  <Drawer open={open} onClose={() => setOpen(false)}>
    Drawer content
  </Drawer>
</>;
```

### Left position

```tsx id="drw2">
<Drawer open={open} onClose={close} position="left">
  Sidebar content
</Drawer>
```

### Bottom sheet

```tsx id="drw3">
<Drawer open={open} onClose={close} position="bottom">
  Mobile sheet content
</Drawer>
```

### Disable Escape + Outside click

```tsx id="drw4">
<Drawer open={open} onClose={close} disableEsc disableClickOutside>
  Forced interaction
</Drawer>
```

---

## Props

| Prop                  | Type                                     | Default | Description                          |
| --------------------- | ---------------------------------------- | ------- | ------------------------------------ |
| `open`                | `boolean`                                | —       | Controls visibility                  |
| `onClose`             | `() => void`                             | —       | Triggered on escape or outside click |
| `position`            | `'left' \| 'right' \| 'top' \| 'bottom'` | `right` | Drawer origin                        |
| `disableEsc`          | `boolean`                                | `false` | Disables Escape key close            |
| `disableClickOutside` | `boolean`                                | `false` | Disables overlay click close         |
| `overlayClassName`    | `string`                                 | —       | Overlay class override               |
| `className`           | `string`                                 | —       | Drawer class override                |
| `children`            | `ReactNode`                              | —       | Drawer content                       |

Extends `React.HTMLAttributes<HTMLDivElement>`.

---

## Subcomponents

None exposed.

---

## Variants

Drawer supports structural and behavioral variants.

```tsx
<Drawer position="right" />
<Drawer position="left" />
<Drawer position="top" />
<Drawer position="bottom" />
<Drawer disableEsc />
<Drawer disableClickOutside />
```

**Available variants:**

- right (default)
- left
- top
- bottom
- escape-disabled
- outside-click-disabled

**Guidelines:**

- Use right/left for navigation or contextual panels
- Use bottom for mobile sheet patterns
- Avoid disabling both escape and outside click unless required by workflow

---

## Sizes

Drawer width/height is position-dependent:

| Position   | Default Dimension                       |
| ---------- | --------------------------------------- |
| left/right | `max-width: 320px`                      |
| top/bottom | `min-height: 250px`, `max-height: 90vh` |

Width/height should be customized via `className` and layout utilities.

---

## Shapes / Modes

**Positions**

- Left
- Right
- Top
- Bottom

**States**

- Mounted (in DOM)
- Visible (animated open)
- Closed (animated exit)
- Escape-triggered close
- Outside-click close
- Scroll-locked background
- Focus-trapped
- Inert-applied siblings

---

## Design tokens / theming

Uses NUI tokens:

- `--nui-bg-surface`
- `--nui-fg-default`
- `--nui-border-default`
- `--nui-radius-xl`
- Z-index stack:
  - Overlay: `9998`
  - Drawer: `9999`

Overlay uses backdrop blur + 0.5 opacity.

---

## Accessibility

Implemented behavior:

- `role="dialog"`
- `aria-modal="true"`
- Focus trapped while open
- Previous focus restored on close
- Escape key close (configurable)
- Background content inert while open
- Scroll lock applied to body
- Click outside detection (configurable)
- `prefers-reduced-motion` respected

Note: Overlay is `aria-hidden="true"` because it is non-interactive.

---

## Animation Model

Two-phase state system:

- `isMounted` → Controls DOM presence
- `isVisible` → Controls CSS transition state

Exit animation delay: 300ms  
Entrance delay before activation: ~15ms (transition trigger)

Uses GPU-accelerated `transform` transitions.

---

## Best practices

### Do

- Control open state from parent
- Use semantic heading inside drawer
- Provide a visible close button
- Keep drawer width constrained

### Don’t

- Use Drawer for full-screen modal (use Modal)
- Disable escape without strong reason
- Mount heavy trees inside if frequent toggling
- Stack multiple drawers without z-index management
