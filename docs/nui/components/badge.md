# Badge

A **compact status or indicator component** that can display numbers, icons, or small labels. Supports **variants, sizes, pill shapes, dot mode, and interactive behavior** (links or buttons).

---

## Usage

### Basic Badge

```tsx
import { Badge } from '@nofinite/nui';

<Badge>New</Badge>
<Badge variant="primary">Primary</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="danger">Danger</Badge>
<Badge variant="outline">Outline</Badge>
```

### Badge with Count

```tsx
<Badge count={5} />
<Badge count={120} max={99} />  {/* Displays 99+ */}
```

### Dot Badge

```tsx
<Badge dot variant="success" />
```

### Pill Badge

```tsx
<Badge pill variant="primary">
  Premium
</Badge>
```

### Interactive Badge

```tsx
<Badge onClick={() => alert('Clicked!')} variant="primary">
  Click Me
</Badge>

<Badge href="https://example.com" variant="primary">
  Go to Link
</Badge>
```

### Badge with Icons

```tsx
<Badge iconLeft={<Icon />} iconRight={<Icon />} variant="success">
  Messages
</Badge>
```

---

## Props

### Badge

| Prop        | Type                                                                        | Default     | Description                                                 |
| ----------- | --------------------------------------------------------------------------- | ----------- | ----------------------------------------------------------- |
| `children`  | `React.ReactNode`                                                           | —           | Text or JSX inside the badge                                |
| `count`     | `number`                                                                    | —           | Number to display inside the badge                          |
| `max`       | `number`                                                                    | `99`        | Maximum count to show; counts above `max` display as `max+` |
| `variant`   | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'outline'` | `'default'` | Visual style / color of the badge                           |
| `size`      | `'sm' \| 'md' \| 'lg'`                                                      | `'md'`      | Badge size                                                  |
| `pill`      | `boolean`                                                                   | `false`     | Makes badge fully rounded                                   |
| `dot`       | `boolean`                                                                   | `false`     | Renders a small circular indicator instead of content       |
| `href`      | `string`                                                                    | —           | Renders badge as a link                                     |
| `onClick`   | `React.MouseEventHandler<HTMLElement>`                                      | —           | Click handler for button-style badges                       |
| `iconLeft`  | `React.ReactNode`                                                           | —           | Icon shown before badge content                             |
| `iconRight` | `React.ReactNode`                                                           | —           | Icon shown after badge content                              |
| `className` | `string`                                                                    | `""`        | Additional CSS classes                                      |
| `...rest`   | `React.HTMLAttributes<HTMLElement>`                                         | —           | Other native props                                          |

---

## BadgeGroup

Groups multiple badges and optionally displays a `+n` overflow indicator.

### Usage

```tsx
import { Badge, BadgeGroup } from '@nofinite/nui';

<BadgeGroup max={3}>
  <Badge variant="success">Online</Badge>
  <Badge variant="warning">Away</Badge>
  <Badge variant="danger">Busy</Badge>
  <Badge variant="primary">Admin</Badge>
</BadgeGroup>;
```

---

### Props

| Prop        | Type                                   | Default | Description                                      |
| ----------- | -------------------------------------- | ------- | ------------------------------------------------ |
| `children`  | `React.ReactNode[]`                    | —       | Badge components to group                        |
| `max`       | `number`                               | `3`     | Maximum badges to show; excess displayed as `+n` |
| `className` | `string`                               | `""`    | Additional CSS classes for the group container   |
| `...rest`   | `React.HTMLAttributes<HTMLDivElement>` | —       | Other native props                               |

---

## Variants

| Variant   | Description                        |
| --------- | ---------------------------------- |
| `default` | Neutral / gray                     |
| `primary` | Brand / accent color               |
| `success` | Success / green                    |
| `warning` | Warning / amber                    |
| `danger`  | Error / red                        |
| `outline` | Transparent background with border |

---

## Sizes

| Size | Height | Font Size | Notes                           |
| ---- | ------ | --------- | ------------------------------- |
| `sm` | 20px   | 12px      | Compact badges for tight spaces |
| `md` | 24px   | 14px      | Default size                    |
| `lg` | 28px   | 14px      | Slightly larger for emphasis    |

---

## Shapes

- **Pill** – Fully rounded with `pill={true}`
- **Dot** – Small circular badge, hides content with `dot={true}`

---

## Design Tokens / Theming

```css
:root {
  --nui-space-1: 4px;
  --nui-space-2: 8px;
  --nui-space-3: 12px;
  --nui-radius-sm: 4px;
  --nui-radius-full: 9999px;
  --nui-font-sans: 'Inter', sans-serif;
  --nui-weight-medium: 500;
  --nui-text-xs: 12px;
  --nui-text-sm: 14px;

  /* Colors */
  --nui-bg-subtle: #f3f4f6;
  --nui-fg-default: #111827;
  --nui-border-default: #e5e7eb;
  --nui-brand-100: #dbeafe;
  --nui-brand-200: #bfdbfe;
  --nui-brand-700: #1d4ed8;
  --nui-color-success: #22c55e;
  --nui-color-danger: #ef4444;
}
```

---

## Accessibility

- **Role and interactive elements**

  - Non-interactive badges render as `<span>`.
  - `href` badges render as `<a>` (link role).
  - `onClick` badges render as `<button>` (button role).

- Icons and counts are visible to screen readers.
- Dot badges are visual-only; use `aria-label` via `...rest` if necessary.

---

## Best Practices

### Do

- Use badges to indicate status, counts, or labels.
- Keep badge text short (1–2 words).
- Use `max` in groups to prevent overflow.
- Use `dot` for subtle notifications or status.

### Don’t

- Place essential information only inside dot badges.
- Overload groups with too many badges; use `max` for overflow.
- Use badges for primary navigation.
