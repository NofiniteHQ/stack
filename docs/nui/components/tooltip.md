# Tooltip

A floating informational popup that appears when a user hovers or focuses on an element. Supports dynamic positioning, delay, offsets, accessibility semantics, and can wrap any React element.

---

## Usage

### Basic usage

```tsx id="tt1"
import { Tooltip } from '@nofinite/nui';

<Tooltip label="This is a tooltip">
  <button>Hover me</button>
</Tooltip>;
```

### With delay and offset

```tsx id="tt2"
<Tooltip label="Delayed tooltip" delay={500} offset={12}>
  <span>Hover here</span>
</Tooltip>
```

### Wrapping interactive content

```tsx id="tt3"
<Tooltip label="Tooltip for input">
  <input placeholder="Focus me" />
</Tooltip>
```

---

## Props

| Prop        | Type           | Default | Description                                |
| ----------- | -------------- | ------- | ------------------------------------------ |
| `label`     | `ReactNode`    | —       | Content to display inside the tooltip      |
| `children`  | `ReactElement` | —       | Element that triggers the tooltip          |
| `className` | `string`       | —       | Additional styling for tooltip container   |
| `delay`     | `number`       | 200     | Delay in ms before showing tooltip         |
| `offset`    | `number`       | 8       | Distance in px between trigger and tooltip |

---

## Variants

### Placement variants

```tsx id="tt4"
<Tooltip label="Top tooltip" offset={8}>Top</Tooltip>
<Tooltip label="Bottom tooltip" offset={8}>Bottom</Tooltip>
```

### Interaction variants

```tsx id="tt5"
<Tooltip label="Hover or focus me">
  <button>Interactive</button>
</Tooltip>
```

**Available variants**

- Top placement (default)
- Bottom placement (auto-flip if not enough space)
- Tooltip with delay
- Tooltip with offset
- Tooltip wrapping any interactive element

**Guidelines**

- Use for short, contextual information
- Prefer hover/focus triggers for non-critical info
- Avoid excessive or long tooltips
- Combine with focus for accessibility

---

## States

- Default (hidden)
- Visible (hover/focus)
- Focus-visible
- During scroll/resize
- Placement top
- Placement bottom

---

## Keyboard Interaction

- Tab → focuses trigger element
- Escape → hides tooltip
- Tooltip appears on focus (keyboard accessible)
- Pointer events disabled for tooltip itself

---

## Accessibility

- `role="tooltip"` on tooltip element
- Linked to trigger via `aria-describedby`
- Keyboard accessible via Tab + Escape
- Focus-visible styling handled on trigger element
- Screen readers announce content of tooltip
- Hidden from pointer events so underlying content remains interactive

---

## Design Tokens

| Token               | Usage                    |
| ------------------- | ------------------------ |
| --nui-fg-default    | Tooltip background color |
| --nui-bg-surface    | Tooltip text color       |
| --nui-radius-sm     | Tooltip border radius    |
| --nui-space-1       | Vertical padding         |
| --nui-space-3       | Horizontal padding       |
| --nui-font-sans     | Font family              |
| --nui-text-xs       | Font size                |
| --nui-weight-medium | Font weight              |

---

## Best Practices

### Do

- Use for short, contextual information
- Trigger on hover/focus for accessibility
- Keep tooltip content concise
- Use offsets for better visual alignment
- Automatically flip placement when space is insufficient

### Don’t

- Use for critical or permanent content
- Include interactive elements inside the tooltip
- Make tooltip content excessively long
- Block pointer events of underlying content
- Use tooltips for actions requiring confirmation
