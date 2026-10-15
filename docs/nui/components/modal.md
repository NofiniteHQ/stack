# Modal

A portal-based dialog primitive implementing focus isolation, background inerting, scroll locking, and controlled mounting with animated lifecycle transitions.
Designed for transactional workflows, confirmations, forms, and interruptive UI.

---

## Usage

### Basic

```tsx id="mo1">
import { Modal } from '@nofinite/nui';
<Modal open={open} onClose={() => setOpen(false)}>
  Content
</Modal>;
```

---

### With title + description

```tsx id="mo2">
<Modal
  open={open}
  onClose={close}
  title="Delete account"
  description="This action cannot be undone."
>
  <Actions />
</Modal>
```

---

### Form dialog with initial focus

```tsx id="mo3">
<Modal
  open={open}
  onClose={close}
  title="Edit profile"
  initialFocusRef={inputRef}
>
  <Form />
</Modal>
```

---

### Disable outside click

```tsx id="mo4">
<Modal open={open} onClose={close} disableClickOutside>
  Blocking flow
</Modal>
```

---

## Props

| Prop                  | Type         | Default | Description               |
| --------------------- | ------------ | ------- | ------------------------- |
| `open`                | `boolean   ` | —       | Controlled visibility     |
| `onClose`             | `() => void` | —       | Close handler             |
| `title`               | `ReactNode ` | —       | Dialog heading            |
| `description`         | `ReactNode ` | —       | Supporting text           |
| `labelledById`        | `string    ` | `auto`  | Custom title ID           |
| `describedById`       | `string    ` | `auto`  | Custom description ID     |
| `disableClickOutside` | `boolean   ` | `false` | Disable overlay dismissal |
| `disableEsc`          | `boolean   ` | `false` | Disable ESC close         |
| `initialFocusRef`     | `RefObject ` | —       | Initial focus target      |
| `overlayClassName`    | `string    ` | —       | Overlay override          |
| `className`           | `string    ` | —       | Dialog override           |
| `children`            | `ReactNode ` | —       | Dialog content            |

Extends `React.HTMLAttributes<HTMLDivElement>`.

---

## Variants

Modal exposes lifecycle state variants via data attributes.

```tsx
<Modal open />
<Modal disableEsc />
<Modal disableClickOutside />
```

**Available variants:**

- closed
- mounted
- visible
- overlay-open
- dialog-open

**Guidelines:**

- Use for interruptive workflows only
- Avoid nested modals

---

## Sizes

No intrinsic size API.  
Default constraints:

- `max-width: 500px`
- `max-height: 90vh`
- Mobile safe margin
- Scrollable content region

Sizing should be overridden via className.

---

## Shapes / Modes

**Interaction modes**

- ESC close
- Outside click close
- Explicit close button
- Controlled close only (disabled dismissal)

**Accessibility modes**

- Labelled dialog
- Described dialog
- Focus-trapped modal
- Background inert environment

**Lifecycle modes**

- Mounted
- Visible
- Animating in
- Animating out
- Unmounted

---

## Design tokens / theming

Primary tokens:

- `--nui-bg-surface`
- `--nui-border-default`
- `--nui-radius-lg`
- `--nui-fg-default`
- `--nui-fg-subtle`
- `--nui-space-*`
- `--nui-color-primary`

Elevation defined via layered shadow tokens.

---

## Accessibility

Implemented:

- `role="dialog"`
- `aria-modal="true"`
- `aria-labelledby` / `aria-describedby`
- Focus trap
- Initial focus management
- Focus restoration
- Background inerting
- Scroll locking
- ESC dismissal
- Overlay click dismissal
- Close button with accessible label

Strong compliance with WCAG modal dialog guidance.

Limitations:

- No alertdialog role variant
- No nested focus trap stacking
- No announcement for dynamic content updates
- No aria-live integration

---

## Animation

Lifecycle animation model:

- Overlay fade
- Dialog scale + fade
- Mount delay for entrance
- Exit delay for unmount
- GPU-accelerated transform animation
- Respects reduced motion preference

---

## Architectural notes

Key behaviors:

- Portal rendering avoids stacking context conflicts
- Two-phase state (mounted + visible) enables exit animation
- Focus trap lifecycle bound to visibility
- Inert background ensures screen reader isolation
- Click catcher prevents overlay bubbling conflicts
- Scroll lock prevents layout shift
- Ref preservation restores user context
- ID auto-generation ensures accessibility linkage

Tradeoffs:

- Fixed animation duration coupling with unmount timing
- No collision-aware viewport repositioning
- No scrollable overlay strategy for extremely tall dialogs
- Potential inert polyfill dependency in older browsers

---

## Best practices

### Do

- Use for blocking user decision flows
- Provide explicit close affordance
- Maintain concise content hierarchy
- Use initialFocusRef for form dialogs
- Override size for content-heavy dialogs
- Provide keyboard-accessible primary action

### Don’t

- Nest modals
- Use for persistent UI
- Overload with navigation content
- Disable dismissal without strong UX reason
- Place interactive content outside focus trap
- Rely solely on overlay click for close
