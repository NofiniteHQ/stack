# HoverCard

`HoverCard` is a floating content container that appears when a user hovers over or focuses on a trigger element. It is useful for previews, tooltips with rich content, user cards, and contextual details.

---

## Usage

### Basic usage

```tsx
import { HoverCard } from '@nofinite/nui';

<HoverCard>
  <HoverCard.Trigger>
    <button>User</button>
  </HoverCard.Trigger>

  <HoverCard.Content>User preview</HoverCard.Content>
</HoverCard>;
```

---

### Top placement

```tsx id="hc2">
<HoverCard>
  <HoverCard.Trigger>
    <button>Hover</button>
  </HoverCard.Trigger>

  <HoverCard.Content placement="top">Top card</HoverCard.Content>
</HoverCard>
```

---

### Custom delays

```tsx id="hc3">
<HoverCard openDelay={400} closeDelay={200}>
  <HoverCard.Trigger>
    <button>Hover</button>
  </HoverCard.Trigger>

  <HoverCard.Content>Delayed card</HoverCard.Content>
</HoverCard>
```

---

## Props

### Root

| Prop       | Type      | Default | Description            |
| ---------- | --------- | ------- | ---------------------- |
| children   | ReactNode | —       | Compound structure     |
| openDelay  | number    | 200     | Hover open delay (ms)  |
| closeDelay | number    | 300     | Hover close delay (ms) |

---

### Content

| Prop      | Type                    | Default  | Description                  |
| --------- | ----------------------- | -------- | ---------------------------- |
| placement | `'top'     \| 'bottom'` | `bottom` | Preferred vertical placement |
| offset    | number                  | 8        | Distance from trigger        |
| className | string                  | —        | Style override               |
| children  | ReactNode               | —        | Content body                 |

Extends `React.HTMLAttributes<HTMLDivElement>`.

---

## Subcomponents

- HoverCard.Trigger
- HoverCard.Content

---

## Variants

```tsx
<HoverCard />
<HoverCard openDelay={400} />
<HoverCard closeDelay={100} />
<HoverCard.Content placement="top" />
<HoverCard.Content placement="bottom" />
```

**Available variants:**

- default-delay
- custom-delay
- top
- bottom
- auto-flip

**Guidelines:**

- Use hovercard for previews or metadata
- Avoid embedding critical actions
- Maintain short dwell open delays

---

## Sizes

| Element | Behavior              |
| ------- | --------------------- |
| Content | min 240px / max 360px |
| Padding | token-based spacing   |
| Width   | intrinsic with clamp  |

Sizing should be customized via tokens or class overrides.

---

## Shapes / Modes

**Interaction states**

- Closed
- Scheduled-open
- Visible
- Scheduled-close
- Hover-persistent
- Escape-dismissed
- Outside-click dismissed

**Placement states**

- Bottom
- Top
- Collision-flipped

---

## Design tokens / theming

Uses NUI tokens:

- `--nui-bg-surface`
- `--nui-fg-default`
- `--nui-border-default`
- `--nui-radius-lg`
- `--nui-space-4`
- `--nui-font-sans`
- `--nui-z-dropdown`

Shadow uses soft dual-layer elevation.

---

## Accessibility

Implemented:

- Trigger
  - `aria-haspopup="dialog"`
  - `aria-expanded`
  - `aria-controls`
  - focus-triggered open
- Content
  - `role="dialog"`
  - ESC dismiss
  - click-outside dismiss
- Hover persistence prevents premature close
- Portal avoids stacking context clipping

Limitations:

- No focus trap (intentional for hover semantics)
- No aria-live announcements
- Screen reader discovery relies on focus
- Keyboard navigation inside card not enforced

---

## Animation model

- Entry animation: scale + translate + fade
- Duration: 150ms cubic-bezier easing
- Placement-aware transform origin
- Motion disabled via `prefers-reduced-motion`

No exit animation (timer-based unmount).

---

## Architectural notes

Key behaviors:

- Timer orchestration prevents hover jitter
- Portal rendering solves overflow clipping
- Collision-aware vertical flipping
- Horizontal clamp with viewport padding
- Scroll + resize reactive positioning
- Hover-safe bridging between trigger and card
- Layout-safe positioning via `useLayoutEffect`
- Compound component architecture with shared context

Potential caveat:

- Position recalculation may be expensive under heavy scroll containers

---

## Best practices

### Do

- Use for previews, metadata, secondary info
- Keep content lightweight
- Maintain open delay to avoid accidental triggers
- Provide keyboard focusable content if interactive

### Don’t

- Use as replacement for tooltip or modal
- Put destructive actions inside
- Depend on hovercard for critical information
- Render large trees inside portal
