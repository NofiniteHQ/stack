# Popover

`Popover` is a versatile overlay component used to display contextual content or interactive elements anchored to a trigger. It supports portal rendering, automatic positioning, and accessibility features like ARIA compliance and focus management.

---

## Usage

### Basic Popover

```tsx
import { Popover } from '@nofinite/nui';

<Popover>
  <Popover.Trigger>
    <Button>Open</Button>
  </Popover.Trigger>

  <Popover.Content>Popover content</Popover.Content>
</Popover>;
```

---

### Placement Control

```tsx
<Popover>
  <Popover.Trigger>
    <Button>Open</Button>
  </Popover.Trigger>

  <Popover.Content placement="top">Top popover</Popover.Content>
</Popover>
```

---

### Close Action

```tsx
<Popover>
  <Popover.Trigger>
    <Button>Open</Button>
  </Popover.Trigger>

  <Popover.Content>
    <Popover.Close>
      <Button>Close</Button>
    </Popover.Close>
  </Popover.Content>
</Popover>
```

---

### Default Open State

```tsx
import { Popover } from '@nofinite/nui';
<Popover defaultOpen>
  <Popover.Trigger>
    <Button>Open</Button>
  </Popover.Trigger>

  <Popover.Content>Default open popover</Popover.Content>
</Popover>;
```

---

## Props

### Popover Root

| Prop          | Type      | Default | Description        |
| ------------- | --------- | ------- | ------------------ |
| `defaultOpen` | `boolean` | `false` | Initial open state |

---

### Popover Content

| Prop        | Type                                     | Default  | Description           |
| ----------- | ---------------------------------------- | -------- | --------------------- |
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right'` | `bottom` | Preferred placement   |
| `offset`    | `number`                                 | `8`      | Distance from trigger |
| `className` | `string`                                 | —        | Custom styling        |

---

## Compound API

| Component         | Responsibility                       |
| ----------------- | ------------------------------------ |
| `Popover`         | State container and context provider |
| `Popover.Trigger` | Toggle control with ARIA wiring      |
| `Popover.Content` | Positioned overlay surface           |
| `Popover.Close`   | Optional close action wrapper        |

---

## Variants

```tsx
<Popover>...</Popover>                                      // Default
<Popover defaultOpen>...</Popover>                          // Open
<Popover.Content placement="top" />                         // Top
<Popover.Content placement="left" />                        // Left
<Popover.Content placement="right" />                       // Right
```

**Available variants**

- `default` — Bottom placement
- `top` — Above trigger
- `left` — Left of trigger
- `right` — Right of trigger
- `open` — Default open state

**Guidelines**

- Use bottom placement for primary contextual content
- Prefer top for dropdown-like behaviors near viewport bottom
- Avoid horizontal placements on narrow screens
- Provide explicit close actions for interactive content

---

## States

| State       | Description                              |
| ----------- | ---------------------------------------- |
| `closed`    | Not rendered                             |
| `open`      | Visible overlay                          |
| `focused`   | Focus trapped within content             |
| `dismissed` | Closed via outside click or Escape       |
| `flipped`   | Placement auto-adjusted due to collision |

---

## Keyboard Interaction

| Key             | Behavior                                |
| --------------- | --------------------------------------- |
| `Enter / Space` | Toggle popover via trigger              |
| `Escape`        | Close popover                           |
| `Tab`           | Cycle focus inside popover (focus trap) |

---

## Accessibility

- ARIA dialog pattern (`role="dialog"`, `aria-modal`)
- Trigger uses `aria-haspopup`, `aria-expanded`, and `aria-controls`
- Focus restoration to trigger on close
- Keyboard dismissal via Escape
- Focus trap inside popover content
- Click outside detection for dismissal

---

## Positioning Behavior

The component implements **adaptive overlay positioning**:

- Viewport boundary collision detection
- Placement flipping when clipping occurs
- Arrow offset recalculation for accurate pointing
- Scroll and resize reflow updates
- Safe padding from viewport edges

---

## Design Tokens

```css
:root {
  --nui-radius-lg: 12px;
  --nui-space-4: 16px;

  --nui-bg-surface: #ffffff;
  --nui-border-default: #e5e7eb;
  --nui-fg-default: #111827;
}
```

---

## Best Practices

### Do

- Use compound API for composability
- Provide explicit close actions for complex popovers
- Keep content lightweight for performance
- Prefer portal rendering for layering safety
- Ensure trigger has clear affordance

### Don’t

- Use popovers for large modal workflows
- Nest multiple popovers without focus management
- Place destructive actions without visual separation
- Disable Escape dismissal
- Overuse horizontal placements in responsive layouts
