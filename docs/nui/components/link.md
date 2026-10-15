# Link

Typographic navigation element designed for inline navigation inside paragraphs, lists, and breadcrumbs.
For action-oriented links that require button affordance (padding/background), use **Button with `asChild`** instead.

---

## Usage

### Basic usage

```tsx
import { Link } from '@nofinite/nui';

<Link href="/docs">Documentation</Link>;
```

---

### Variants

```tsx
<Link variant="default">Default</Link>
<Link variant="primary">Primary</Link>
<Link variant="muted">Muted</Link>
<Link variant="danger">Danger</Link>
```

---

### Underline control

```tsx
<Link underline="hover">Hover underline</Link>
<Link underline="always">Always underline</Link>
<Link underline="none">No underline</Link>
```

---

### External link

Automatically applies secure routing attributes.

```tsx
<Link href="https://example.com" isExternal>
  External resource
</Link>
```

---

### Framework routing (polymorphic)

```tsx
'use client';
import NextLink from 'next/link';
import { Link } from '@nofinite/nui';

<Link asChild>
  <NextLink href="/card">Go to card</NextLink>
</Link>;
```

---

### Button as link (CTA pattern)

```tsx
'use client';
import NextLink from 'next/link';
import { Button } from '@nofinite/nui';

<Button asChild variant="primary">
  <NextLink href="/dashboard">Go to Dashboard</NextLink>
</Button>;
```

---

## Props

| Prop       | Type                                            | Default     | Description                                                   |
| ---------- | ----------------------------------------------- | ----------- | ------------------------------------------------------------- |
| variant    | `"default" \| "primary" \| "muted" \| "danger"` | `"default"` | Visual color style                                            |
| underline  | `"none" \| "hover" \| "always"`                 | `"hover"`   | Underline behavior                                            |
| isExternal | `boolean`                                       | `false`     | Adds `target="_blank"` and `rel="noopener noreferrer"`        |
| asChild    | `boolean`                                       | `false`     | Enables polymorphic rendering via Slot for router integration |
| className  | `string`                                        | —           | Custom styles                                                 |
| children   | `ReactNode`                                     | —           | Link content                                                  |
| ...props   | `AnchorHTMLAttributes`                          | —           | Native anchor props                                           |

---

## Variants

### Color variants

- **default** — neutral text color
- **primary** — accent navigation link
- **muted** — low emphasis navigation
- **danger** — destructive navigation

### Underline variants

- **none** — removes underline
- **hover** — underline appears on hover
- **always** — persistent underline

**Guidelines**

- Use **primary** for contextual navigation emphasis
- Use **muted** for secondary inline links
- Use **danger** only for destructive navigation contexts
- Prefer **hover underline** for body text readability

---

## States

- Default
- Hover
- Focus visible
- Active (browser native)
- Disabled (via native anchor behavior)
- External link state

---

## Keyboard Interaction

| Key         | Behavior             |
| ----------- | -------------------- |
| Tab         | Moves focus to link  |
| Enter       | Activates navigation |
| Shift + Tab | Moves focus backward |

---

## Accessibility

- Uses semantic `<a>` element by default
- Preserves accessibility when `asChild` is used
- `focus-visible` outline ensures keyboard focus visibility
- External links include security attributes preventing tabnabbing
- Underline ensures link affordance in text contexts
- Compatible with screen readers via native anchor semantics

---

## Design Tokens

| Token                 | Usage              |
| --------------------- | ------------------ |
| `--nui-space-1`       | Inline gap spacing |
| `--nui-font-sans`     | Font family        |
| `--nui-weight-medium` | Text weight        |
| `--nui-radius-sm`     | Focus radius       |
| `--nui-fg-default`    | Default text color |
| `--nui-color-primary` | Primary link color |
| `--nui-fg-subtle`     | Muted color        |
| `--nui-color-danger`  | Danger color       |

---

## Best Practices

### Do

- Use for inline navigation inside text
- Use `asChild` for framework router integration
- Use `isExternal` for outbound links
- Maintain underline in long-form content

### Don’t

- Use for button-like CTAs with backgrounds
- Remove underline in dense paragraph navigation without other affordance
- Use danger variant for non-destructive navigation
