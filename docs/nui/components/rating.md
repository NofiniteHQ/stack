# Rating

A visual input component that allows users to select a rating value using icons (typically stars). It supports controlled and uncontrolled modes, fractional selection, keyboard interaction, and custom icon rendering.

---

## Usage

### Basic usage

```tsx
import { Rating } from '@nofinite/nui';
export function Example() {
  return <Rating defaultValue={3} />;
}
```

### Controlled usage

```tsx
const [value, setValue] = useState(4);

<Rating value={value} onChange={setValue} />;
```

### Half rating

```tsx
<Rating defaultValue={3.5} allowHalf />
```

### Read-only display

```tsx
<Rating value={4.2} readOnly />
```

### Custom icons

```tsx
<Rating icon={<HeartOutline />} iconFilled={<HeartFilled />} />
```

---

## Props

| Prop           | Type                      | Default        | Description                            |
| -------------- | ------------------------- | -------------- | -------------------------------------- |
| `value`        | `number                 ` | —              | Controlled rating value                |
| `defaultValue` | `number                 ` | `0`            | Initial uncontrolled value             |
| `max`          | `number                 ` | `5`            | Maximum rating items                   |
| `onChange`     | `(value: number) => void` | —              | Called when value changes              |
| `icon`         | `ReactNode              ` | `star outline` | Empty icon                             |
| `iconFilled`   | `ReactNode              ` | `filled star`  | Filled icon                            |
| `size`         | `'sm' \| 'md' \| 'lg'   ` | `md`           | Component size                         |
| `readOnly`     | `boolean                ` | `false`        | Prevent interaction but show value     |
| `disabled`     | `boolean                ` | `false`        | Disable interaction and reduce opacity |
| `allowHalf`    | `boolean                ` | `false`        | Enable half-step selection             |
| `className`    | `string                 ` | —              | Additional class names                 |

Extends `HTMLDivElement` attributes (excluding `onChange`).

---

## Variants

### Sizes

```tsx
<Rating size="sm" />
<Rating size="md" />
<Rating size="lg" />
```

**Available variants**

- sm
- md
- lg

**Guidelines**

- Use **sm** inside dense layouts (tables, cards)
- Use **md** as default
- Use **lg** for emphasis or hero sections

---

## States

- Default
- Hover preview (temporary fill during pointer move)
- Focus visible (keyboard focus ring)
- Read-only
- Disabled
- Fractional display
- Controlled vs uncontrolled value

---

## Keyboard Interaction

| Key                   | Behavior                          |
| --------------------- | --------------------------------- |
| ArrowRight / ArrowUp  | Increase rating (step = 1 or 0.5) |
| ArrowLeft / ArrowDown | Decrease rating                   |
| Home                  | Set to minimum (0)                |
| End                   | Set to maximum                    |

Component uses `role="slider"` semantics.

---

## Accessibility

- Uses **slider pattern** with:

  - `aria-valuemin`
  - `aria-valuemax`
  - `aria-valuenow`
  - `aria-disabled`
  - `aria-readonly`

- Keyboard operable
- Focus visible outline
- Tab navigation disabled when readOnly or disabled

---

## Design Tokens

| Token                | Usage                |
| -------------------- | -------------------- |
| --nui-space-1        | Gap between icons    |
| --nui-font-sans      | Typography           |
| --nui-color-primary  | Focus ring           |
| --nui-border-default | Empty icon color     |
| --nui-color-warning  | Filled icon color    |
| --nui-radius-sm      | Focus outline radius |

---

## Best Practices

### Do

- Use half rating when precision matters (reviews)
- Use readOnly for aggregated scores
- Keep max ≤ 10 to avoid cognitive overload
- Use custom icons for domain-specific ratings

### Don’t

- Use rating as the only feedback control for critical flows
- Combine disabled and readOnly simultaneously unless intentional
- Allow fractional ratings without clear visual affordance
- Overuse large size in dense UI contexts
