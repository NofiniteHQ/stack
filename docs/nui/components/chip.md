# Chip

A **compact pill-shaped component** used to represent selections, filters, or small entities.
Supports **selection state, removability, icons, sizes, and keyboard-accessible interaction**.

---

## Usage

### Basic Chip

```tsx id="n2o0v1"
import { Chip } from '@nofinite/nui';

<Chip>React</Chip>

<Chip size="sm">Small chip</Chip>
```

### Selectable Chip

```tsx id="wd0o2m"
<Chip selected onSelect={() => console.log('Selected')}>
  Selected Chip
</Chip>
```

### Removable Chip

```tsx id="5pj6c6"
<Chip removable onRemove={() => console.log('Removed')}>
  Removable
</Chip>
```

### Chip with Icons

```tsx id="70b0ie"
<Chip iconLeft={<Icon />} iconRight={<Icon />}>
  Messages
</Chip>
```

### Interactive Chip

```tsx id="5y5ksd"
<Chip onSelect={() => console.log('Clicked')}>Clickable Chip</Chip>
```

---

## Props

| Prop        | Type                                   | Default | Description                       |
| ----------- | -------------------------------------- | ------- | --------------------------------- |
| `children`  | `React.ReactNode`                      | —       | Content displayed inside chip     |
| `removable` | `boolean`                              | `false` | Shows remove button               |
| `selected`  | `boolean`                              | `false` | Selected visual state             |
| `iconLeft`  | `React.ReactNode`                      | —       | Icon displayed before label       |
| `iconRight` | `React.ReactNode`                      | —       | Icon displayed after label        |
| `size`      | `'sm' \| 'md'`                         | `'md'`  | Chip size                         |
| `onRemove`  | `() => void`                           | —       | Called when remove button clicked |
| `onSelect`  | `() => void`                           | —       | Called when chip is selected      |
| `className` | `string`                               | `""`    | Additional CSS classes            |
| `...rest`   | `React.HTMLAttributes<HTMLDivElement>` | —       | Native div props                  |

---

## Variants

`Chip` supports interaction-based variants.

```tsx id="nh0yb9"
<Chip />                       // Default chip
<Chip selected />              // Selected chip
<Chip onSelect={() => {}} />   // Interactive chip
<Chip removable />             // Removable chip
```

**Available variants:**

- `default` – Static chip
- `selected` – Active chip with highlighted background
- `interactive` – Chip that responds to click and keyboard interaction
- `removable` – Chip with remove action

**Guidelines:**

- Use `selected` for filter or tag selection states.
- Use `interactive` when chip triggers an action.
- Use `removable` for dynamic lists like tags or recipients.

---

## Sizes

| Size | Height | Font Size | Notes                      |
| ---- | ------ | --------- | -------------------------- |
| `sm` | 24px   | 12px      | Compact chips for dense UI |
| `md` | 32px   | 14px      | Default size               |

---

## States

| State         | Description              |
| ------------- | ------------------------ |
| `default`     | Neutral chip appearance  |
| `selected`    | Highlighted active state |
| `interactive` | Hover + active feedback  |
| `removable`   | Displays remove control  |

---

## Design Tokens / Theming

```css id="1xjnt3"
:root {
  --nui-space-1: 4px;
  --nui-space-2: 8px;
  --nui-space-3: 12px;
  --nui-radius-full: 9999px;
  --nui-font-sans: 'Inter', sans-serif;
  --nui-weight-medium: 500;
  --nui-text-xs: 12px;
  --nui-text-sm: 14px;

  --nui-bg-surface: #ffffff;
  --nui-bg-subtle: #f3f4f6;
  --nui-border-default: #e5e7eb;
  --nui-border-hover: #d1d5db;
  --nui-brand-600: #2563eb;
  --nui-brand-700: #1d4ed8;
  --nui-fg-default: #111827;
}
```

---

## Accessibility

- Interactive chips receive `role="button"`
- Keyboard interaction via **Enter** and **Space**
- `aria-pressed` reflects selected state
- Remove button is separately focusable and accessible
- Focus-visible ring improves keyboard navigation

---

## Best Practices

### Do

- Use chips for filters, tags, or selected items
- Provide remove action for user-generated tags
- Use selected state to show active filters
- Keep chip text short

### Don’t

- Use chips for primary navigation
- Overload chips with long content
- Hide remove actions behind complex gestures
