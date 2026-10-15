# Spinner

A visual loading indicator that communicates ongoing asynchronous activity. Designed for inline usage, button loading states, and page-level placeholders. Supports multiple sizes, color variants, and accessible status semantics.

---

## Usage

### Basic usage

```tsx id="sp1"
import { Spinner } from '@nofinite/nui';

<Spinner />;
```

### Custom size

```tsx id="sp2"
<Spinner size="lg" />
```

### Variant usage

```tsx id="sp3"
<Spinner variant="muted" />
<Spinner variant="inverse" />
```

### Button loading pattern

```tsx id="sp4"
<button disabled>
  <Spinner size="sm" variant="inverse" />
</button>
```

---

## Props

| Prop        | Type                                | Default      | Description                         |
| ----------- | ----------------------------------- | ------------ | ----------------------------------- |
| `size`      | `'sm' \| 'md' \| 'lg' \| 'xl'`      | `md`         | Controls spinner dimensions         |
| `variant`   | `'primary' \| 'muted' \| 'inverse'` | `primary`    | Controls spinner color scheme       |
| `className` | `string`                            | —            | Additional styling                  |
| `label`     | `string`                            | `Loading...` | Accessible label for screen readers |

---

## Variants

### Size variants

```tsx id="sp5"
<Spinner size="sm" />
<Spinner size="md" />
<Spinner size="lg" />
<Spinner size="xl" />
```

### Color variants

```tsx id="sp6"
<Spinner variant="primary" />
<Spinner variant="muted" />
<Spinner variant="inverse" />
```

**Available variants**

- Primary
- Muted
- Inverse
- Small
- Medium
- Large
- Extra large

**Guidelines**

- Use `primary` for component-level loading
- Use `muted` for page-level or background loading
- Use `inverse` for dark surfaces and buttons
- Prefer smaller sizes for inline usage
- Avoid oversized spinners in dense layouts

---

## States

- Idle animation
- Reduced motion
- Button loading
- Inline loading
- Page loading

---

## Accessibility

- Uses `role="status"` for assistive announcement
- Hidden descriptive label ensures screen reader clarity
- Supports custom loading message via `label`
- Respects `prefers-reduced-motion`
- Color variants maintain sufficient contrast

---

## Design Tokens

| Token               | Usage                  |
| ------------------- | ---------------------- |
| --nui-color-primary | Primary spinner color  |
| --nui-fg-muted      | Muted spinner color    |
| currentColor        | Head + track rendering |
| opacity values      | Track visual depth     |

---

## Best Practices

### Do

- Pair spinner with contextual loading text for long operations
- Use inverse spinner inside buttons or dark surfaces
- Prefer skeleton loaders for complex layout loading
- Use spinner sparingly to avoid perceived latency
- Combine with optimistic UI where possible

### Don’t

- Show spinner for ultra-fast operations (less than 300ms)
- Stack multiple spinners in one region
- Use spinner as the only feedback for long processes
- Place spinner without context in large empty layouts
- Ignore reduced motion preferences
