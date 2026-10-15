# Breadcrumbs

A **navigation aid component** that displays the user’s current location within a hierarchical structure.
Supports **interactive links, custom separators, responsive collapsing, and accessibility-friendly navigation semantics**.

---

## Usage

### Basic Breadcrumbs

```tsx
import { Breadcrumbs } from '@nofinite/nui';

<Breadcrumbs
  items={[
    { label: 'Home', href: '/' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Settings' },
  ]}
/>;
```

### Breadcrumbs with Click Handlers

```tsx
<Breadcrumbs
  items={[
    { label: 'Home', onClick: () => console.log('Home') },
    { label: 'Profile', onClick: () => console.log('Profile') },
    { label: 'Edit Profile' },
  ]}
/>
```

### Collapsed Breadcrumbs

```tsx
<Breadcrumbs
  maxItems={4}
  items={[
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Electronics', href: '/electronics' },
    { label: 'Mobiles', href: '/mobiles' },
    { label: 'iPhone 15' },
  ]}
/>
```

### Custom Separator

```tsx
<Breadcrumbs
  separator="/"
  items={[
    { label: 'Home', href: '/' },
    { label: 'Docs', href: '/docs' },
    { label: 'Breadcrumbs' },
  ]}
/>
```

---

## Props

### Breadcrumbs

| Prop        | Type                                | Default | Description                                     |
| ----------- | ----------------------------------- | ------- | ----------------------------------------------- |
| `items`     | `BreadcrumbItem[]`                  | —       | List of breadcrumb items                        |
| `maxItems`  | `number`                            | `5`     | Maximum items before collapsing with ellipsis   |
| `separator` | `React.ReactNode`                   | `'›'`   | Separator element between breadcrumb items      |
| `className` | `string`                            | `""`    | Additional CSS classes                          |
| `...rest`   | `React.HTMLAttributes<HTMLElement>` | —       | Other native props applied to the nav container |

---

## BreadcrumbItem

| Prop      | Type                            | Default | Description                              |
| --------- | ------------------------------- | ------- | ---------------------------------------- |
| `label`   | `React.ReactNode`               | —       | Visible breadcrumb content               |
| `href`    | `string`                        | —       | Link destination                         |
| `onClick` | `(e: React.MouseEvent) => void` | —       | Click handler for interactive breadcrumb |

---

## Collapse Behavior

When `items.length > maxItems`:

- First item is always visible (typically **Home**)
- Last two items remain visible (parent + current)
- Middle items collapse into an ellipsis

Example:

```
Home › … › Parent › Current
```

---

## Design Tokens / Theming

```css
:root {
  --nui-font-sans: 'Inter', sans-serif;
  --nui-text-sm: 14px;
  --nui-space-2: 8px;

  --nui-fg-subtle: #6b7280;
  --nui-fg-default: #111827;
  --nui-fg-disabled: #9ca3af;
  --nui-border-default: #e5e7eb;
  --nui-weight-medium: 500;
}
```

---

## Accessibility

- Uses semantic `<nav>` with `aria-label="Breadcrumb"`
- Ordered list `<ol>` conveys hierarchy
- Current page uses `aria-current="page"`
- Ellipsis is hidden from screen readers (`aria-hidden="true"`)
- Interactive items render as `<a>` links
- Current item is non-interactive with pointer events disabled
- Separator is hidden from assistive technologies

---

## Best Practices

### Do

- Use breadcrumbs for hierarchical navigation
- Keep labels short and meaningful
- Place breadcrumbs near the top of page content
- Use collapsing for deep navigation structures
- Provide clear separators for readability

### Don’t

- Use breadcrumbs as primary navigation
- Include excessive hierarchy levels without collapsing
- Make the current page clickable
- Hide critical navigation only inside ellipsis
