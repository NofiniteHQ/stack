# Card

A **flexible container component** used to group related content and actions. Supports **structured sections (Header, Body, Footer, Divider), hover elevation, and clickable behavior** with built-in accessibility.

---

## Usage

### Basic Card

```tsx
import { Card } from '@nofinite/nui';

<Card>
  <Card.Header>Card Title</Card.Header>
  <Card.Body>
    This is the card content area where you can place text or elements.
  </Card.Body>
</Card>;
```

### Card with Footer

```tsx
<Card>
  <Card.Header>Project</Card.Header>

  <Card.Body>Manage project details and tasks.</Card.Body>

  <Card.Footer>
    <Button size="sm">Edit</Button>
    <Button size="sm" variant="outline">
      View
    </Button>
  </Card.Footer>
</Card>
```

### Clickable Card

```tsx
<Card clickable onClick={() => console.log('Clicked')}>
  <Card.Header>Interactive Card</Card.Header>
  <Card.Body>Entire card behaves like a button.</Card.Body>
</Card>
```

### Hover Elevation Card

```tsx
<Card hover>
  <Card.Header>Hover Card</Card.Header>
  <Card.Body>Card elevates visually on hover.</Card.Body>
</Card>
```

### Card with Divider

```tsx
<Card>
  <Card.Header>Pricing</Card.Header>

  <Card.Body>Basic plan features</Card.Body>

  <Card.Divider />

  <Card.Footer>
    <Button variant="primary">Upgrade</Button>
  </Card.Footer>
</Card>
```

---

## Props

### Card

| Prop        | Type                                      | Default | Description                                        |
| ----------- | ----------------------------------------- | ------- | -------------------------------------------------- |
| `children`  | `React.ReactNode`                         | —       | Card content                                       |
| `clickable` | `boolean`                                 | `false` | Makes the card interactive and keyboard accessible |
| `hover`     | `boolean`                                 | `false` | Enables hover elevation effect                     |
| `className` | `string`                                  | `""`    | Additional CSS classes                             |
| `onClick`   | `React.MouseEventHandler<HTMLDivElement>` | —       | Click handler when clickable                       |
| `...rest`   | `React.HTMLAttributes<HTMLDivElement>`    | —       | Other native props                                 |

---

## Subcomponents

### Card.Header

Container for card titles or heading content.

| Prop        | Type              | Description       |
| ----------- | ----------------- | ----------------- |
| `children`  | `React.ReactNode` | Header content    |
| `className` | `string`          | Additional styles |

---

### Card.Body

Primary content area of the card.

| Prop        | Type              | Description       |
| ----------- | ----------------- | ----------------- |
| `children`  | `React.ReactNode` | Main content      |
| `className` | `string`          | Additional styles |

---

### Card.Footer

Action or metadata area typically placed at the bottom.

| Prop        | Type              | Description       |
| ----------- | ----------------- | ----------------- |
| `children`  | `React.ReactNode` | Footer content    |
| `className` | `string`          | Additional styles |

---

### Card.Divider

Full-width separator for visual grouping.

| Prop        | Type                                  | Description       |
| ----------- | ------------------------------------- | ----------------- |
| `className` | `string`                              | Additional styles |
| `...rest`   | `React.HTMLAttributes<HTMLHRElement>` | Native hr props   |

---

## States / Behavior

| State         | Description                                        |
| ------------- | -------------------------------------------------- |
| Default       | Subtle border and shadow container                 |
| Hover         | Elevates card with stronger shadow                 |
| Clickable     | Adds pointer cursor, hover border, and press scale |
| Focus-visible | Accessible focus ring for keyboard navigation      |

---

## Layout & Structure

| Section | Purpose                            |
| ------- | ---------------------------------- |
| Header  | Title or summary information       |
| Body    | Main content region                |
| Divider | Visual separation between sections |
| Footer  | Actions or metadata                |

---

## Design Tokens / Theming

```css
:root {
  --nui-space-3: 12px;
  --nui-space-4: 16px;
  --nui-space-5: 20px;

  --nui-radius-lg: 12px;

  --nui-font-sans: 'Inter', sans-serif;
  --nui-weight-bold: 700;
  --nui-text-sm: 14px;
  --nui-text-lg: 18px;

  --nui-bg-surface: #ffffff;
  --nui-bg-page: #ffffff;

  --nui-fg-default: #111827;
  --nui-fg-subtle: #6b7280;

  --nui-border-default: #e5e7eb;
  --nui-border-hover: #d1d5db;

  --nui-color-primary: #3b82f6;
}
```

---

## Accessibility

- Clickable cards expose **button semantics** using `role="button"` and `tabIndex=0`
- Keyboard interaction supported via **Enter and Space triggers**
- Focus-visible ring ensures keyboard discoverability
- Divider uses semantic `<hr>`
- Header, Body, and Footer preserve structural grouping

---

## Best Practices

### Do

- Use cards to group related content and actions
- Use clickable cards for dashboards, lists, or navigation surfaces
- Keep header concise and descriptive
- Use divider to separate logical sections

### Don’t

- Place critical interactive controls inside a clickable card without clear affordance
- Overload cards with excessive content
- Use clickable cards for destructive actions
- Nest too many cards creating visual clutter
