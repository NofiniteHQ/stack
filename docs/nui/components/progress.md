# Progress

A **visual feedback component** used to represent task completion or loading state with support for **determinate and indeterminate modes, size scaling, semantic variants, and GPU-accelerated animations**.

Implements **ARIA progressbar semantics** ensuring accessibility for assistive technologies while maintaining smooth 60fps rendering via transform-based animation.

---

## Usage

### Basic Progress

```tsx
import { Progress } from '@nofinite/nui';

<Progress value={40} />;
```

---

### Indeterminate Loading

```tsx
<Progress indeterminate />
```

---

### Sizes

```tsx
<Progress size="sm" value={20} />
<Progress size="md" value={40} />
<Progress size="lg" value={70} />
```

---

### Semantic Variants

```tsx
<Progress value={70} variant="success" />
<Progress value={50} variant="warning" />
<Progress value={30} variant="danger" />
```

---

### Custom Max Value

```tsx
<Progress value={30} max={60} />
```

---

## Props

| Prop            | Type                                              | Default    | Description                |
| --------------- | ------------------------------------------------- | ---------- | -------------------------- |
| `value`         | `number`                                          | —          | Current progress value     |
| `max`           | `number`                                          | `100`      | Maximum value              |
| `indeterminate` | `boolean`                                         | `false`    | Infinite loading animation |
| `size`          | `'sm' \| 'md' \| 'lg'`                            | `md`       | Height scale               |
| `variant`       | `'default' \| 'success' \| 'warning' \| 'danger'` | `default`  | Semantic color             |
| `label`         | `string`                                          | `Progress` | Screen reader label        |
| `className`     | `string`                                          | —          | Custom styling             |

---

## Variants

```tsx
<Progress value={40} />                         // Default
<Progress variant="success" value={70} />       // Success
<Progress variant="warning" value={50} />       // Warning
<Progress variant="danger" value={30} />        // Danger
<Progress indeterminate />                      // Loading
```

**Available variants**

- `default` — Primary progress indicator
- `success` — Positive completion state
- `warning` — Partial or caution state
- `danger` — Error or critical state
- `loading` — Indeterminate animation

**Guidelines**

- Use determinate mode for measurable tasks
- Use indeterminate mode when duration is unknown
- Prefer semantic variants to communicate status
- Keep large sizes for prominent workflows

---

## States

| State            | Description              |
| ---------------- | ------------------------ |
| `idle`           | Zero or initial value    |
| `progressing`    | Value increasing         |
| `complete`       | Reached maximum          |
| `indeterminate`  | Infinite animation       |
| `reduced-motion` | Pulse animation fallback |

---

## Accessibility

- Implements `role="progressbar"`
- Supports `aria-valuemin`, `aria-valuemax`, and `aria-valuenow`
- Indeterminate mode omits `aria-valuenow`
- Hidden label via `aria-label`
- Motion reduction respects OS accessibility preferences

---

## Performance Characteristics

The component uses **transform-based progress animation** instead of width changes:

- GPU-accelerated rendering
- Avoids layout thrashing
- Ensures consistent 60fps transitions
- Safari overflow clipping workaround via `translateZ(0)`

---

## Design Tokens

```css
:root {
  --nui-radius-full: 9999px;

  --nui-bg-subtle: #e2e8f0;
  --nui-color-primary: #6366f1;
  --nui-color-success: #10b981;
  --nui-color-warning: #f59e0b;
  --nui-color-danger: #ef4444;
}
```

---

## Best Practices

### Do

- Clamp values within valid ranges
- Use indeterminate mode for unknown durations
- Apply semantic variants for status communication
- Respect reduced motion preferences
- Keep progress feedback consistent with task context

### Don’t

- Use indeterminate mode for long operations without context
- Animate via width causing layout reflow
- Rely solely on color for status indication
- Exceed max value without normalization
- Overuse large progress bars in dense layouts
