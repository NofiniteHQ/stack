# Skeleton

A placeholder component used to indicate loading content while preserving layout structure. It supports multiple sizes, shimmer animation, shape variants, and composable helpers for common UI patterns.

---

## Usage

### Basic usage

```tsx id="b6t0p2"
import { Skeleton } from '@nofinite/nui';

<Skeleton />;
```

### Custom width and height

```tsx id="h4y9m1"
<Skeleton width={200} height={20} />
```

### Circle skeleton

```tsx id="g1u6v8"
<Skeleton circle width={48} />
```

### Disable animation

```tsx id="q9r2c5"
<Skeleton animated={false} />
```

---

## Helper Components

### Text

```tsx id="v3k8x0"
<Skeleton.Text width="60%" />
```

### Paragraph

```tsx id="e5f0d3"
<Skeleton.Paragraph lines={3} />
```

### Avatar

```tsx id="w7p6s9"
<Skeleton.Avatar size={40} />
```

### Button

```tsx id="z0l4y2"
<Skeleton.Button width={120} height={40} />
```

### Card

```tsx id="c3b7t6"
<Skeleton.Card />
```

---

## Props

| Prop         | Type                                   | Default | Description                        |
| ------------ | -------------------------------------- | ------- | ---------------------------------- |
| `size`       | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'`  | Default height size                |
| `width`      | `number \| string`                     | —       | Explicit width override            |
| `height`     | `number \| string`                     | —       | Explicit height override           |
| `animated`   | `boolean`                              | `true`  | Enables shimmer animation          |
| `circle`     | `boolean`                              | `false` | Circular skeleton shape            |
| `ariaHidden` | `boolean`                              | `true`  | Hides skeleton from assistive tech |
| `className`  | `string`                               | —       | Additional styles                  |
| `style`      | `CSSProperties`                        | —       | Inline style overrides             |

Extends `HTMLSpanElement` attributes.

---

## Variants

### Size variants

```tsx id="m5r1o9"
<Skeleton size="xs" />
<Skeleton size="sm" />
<Skeleton size="md" />
<Skeleton size="lg" />
<Skeleton size="xl" />
```

**Available variants**

- xs
- sm
- md
- lg
- xl

**Guidelines**

- xs/sm → dense UI or metadata lines
- md → default text placeholders
- lg/xl → headings or large elements

---

## States

- Animated shimmer
- Static (animation disabled)
- Circle shape
- Explicit size override
- Dark mode
- Reduced motion (respects OS preference)

---

## Accessibility

- Uses `role="presentation"`
- Hidden from assistive technologies by default (`aria-hidden`)
- Respects `prefers-reduced-motion`
- Prevents pointer interaction
- Preserves layout to avoid CLS (Cumulative Layout Shift)

---

## Design Tokens

| Token                | Usage                     |
| -------------------- | ------------------------- |
| --nui-bg-subtle      | Skeleton base background  |
| --nui-radius-sm      | Default radius            |
| --nui-space-\*       | Layout spacing in helpers |
| --nui-border-default | Card helper border        |
| --nui-radius-md/lg   | Helper shapes             |

---

## Best Practices

### Do

- Match skeleton layout with real content
- Disable animation for long-loading screens if performance sensitive
- Use circle skeleton for avatars and icons
- Use paragraph helper for text-heavy layouts
- Combine helpers to mirror complex UI

### Don’t

- Use skeleton for extremely short loading durations
- Animate excessively in data-dense views
- Display skeleton after content is partially loaded
- Replace error states with skeleton
- Use mismatched skeleton sizes causing layout shift
