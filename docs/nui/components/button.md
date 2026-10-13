# Button

A polymorphic, accessible, and composable action component designed for primary interactions. Supports visual variants, sizes, loading states, icons, and router integration via slot-based polymorphism.

---

## Usage

### Basic usage

```tsx id="btn1"
import { Button } from '@nofinite/nui';

<Button>Click me</Button>;
```

### Variants

```tsx id="btn2"
<Button variant="default">Default</Button>
<Button variant="primary">Primary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>
```

### Sizes

```tsx id="btn3"
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
<Button size="icon">⭐</Button>
```

### With icons

```tsx id="btn4"
<Button iconLeft={<FaPlus />}>Create</Button>
<Button iconRight={<FaArrowRight />} variant="primary">Continue</Button>
```

### Loading state

```tsx id="btn5"
<Button isLoading>Processing</Button>
```

### Polymorphic usage (Next.js Link)

```tsx id="btn6"
<Button asChild variant="primary">
  <NextLink href="/dashboard">Go to Dashboard</NextLink>
</Button>
```

---

## Props

| Prop      | Type                                                                   | Default | Description                            |
| --------- | ---------------------------------------------------------------------- | ------- | -------------------------------------- |
| variant   | `'default' \| 'primary' \| 'outline' \| 'ghost' \| 'danger' \| 'link'` | default | Visual style                           |
| size      | `'sm' \| 'md' \| 'lg' \| 'icon'`                                       | md      | Dimensional size                       |
| isLoading | `boolean`                                                              | false   | Shows spinner and disables interaction |
| iconLeft  | `ReactNode`                                                            | —       | Icon before content                    |
| iconRight | `ReactNode`                                                            | —       | Icon after content                     |
| asChild   | `boolean`                                                              | false   | Enables polymorphic rendering          |
| disabled  | `boolean`                                                              | —       | Disables interaction                   |
| className | `string`                                                               | —       | Custom styles                          |
| ...props  | `ButtonHTMLAttributes`                                                 | —       | Native button attributes               |

---

## Variants

### Visual variants

- Default (secondary surface)
- Primary (brand emphasis)
- Outline (border only)
- Ghost (minimal UI)
- Danger (destructive action)
- Link (text-like action)

### Size variants

- Small (compact UI)
- Medium (default)
- Large (emphasis)
- Icon (square button)

**Guidelines**

- Use primary for main CTA
- Use danger only for destructive actions
- Use ghost for dense UI toolbars
- Use outline for secondary emphasis
- Use icon size for icon-only actions

---

## States

- Default
- Hover
- Focus-visible
- Disabled
- Loading (spinner replaces left icon)

---

## Keyboard Interaction

| Key       | Behavior           |
| --------- | ------------------ |
| Enter     | Activates button   |
| Space     | Activates button   |
| Tab       | Focus navigation   |
| Shift+Tab | Reverse navigation |

---

## Accessibility

- Native button semantics preserved
- Automatic disabled state when loading
- `aria-hidden` spinner prevents duplicate announcements
- Focus-visible ring for keyboard navigation
- Supports polymorphic rendering while preserving semantics
- Compatible with screen readers

---

## Design Tokens

| Token                | Usage                |
| -------------------- | -------------------- |
| --nui-bg-surface     | Default background   |
| --nui-bg-subtle      | Hover background     |
| --nui-border-default | Outline border       |
| --nui-border-hover   | Outline hover border |
| --nui-brand-600      | Primary background   |
| --nui-brand-700      | Primary hover        |
| --nui-color-danger   | Danger background    |
| --nui-radius-md      | Border radius        |
| --nui-font-sans      | Typography           |
| --nui-text-xs        | Small size text      |
| --nui-text-sm        | Medium size text     |
| --nui-text-base      | Large size text      |
| --nui-space-2        | Icon spacing         |
| --nui-space-3        | Small padding        |
| --nui-space-4        | Medium padding       |
| --nui-space-6        | Large padding        |

---

## Best Practices

### Do

- Use loading state for async actions
- Provide accessible labels for icon-only buttons
- Use asChild for router links
- Keep icon alignment consistent
- Use primary variant sparingly for emphasis

### Don’t

- Use danger variant for non-destructive actions
- Place multiple primary buttons in the same section
- Use icon-only buttons without aria-label
- Override disabled state during loading
- Nest interactive elements inside button content
