# RadioGroup

A **controlled/uncontrolled selection component** that enables users to choose a single option from a set while preserving **native radio behavior, accessibility semantics, keyboard navigation, and layout orientation control**.

Implements a **compound component architecture** with context-driven state synchronization between `RadioGroup` and `RadioGroup.Item`.

---

## Usage

### Basic Usage

```tsx
import { RadioGroup } from '@nofinite/nui';

<RadioGroup defaultValue="apple">
  <RadioGroup.Item value="apple" />
  <RadioGroup.Item value="banana" />
  <RadioGroup.Item value="orange" />
</RadioGroup>;
```

---

### Controlled Usage

```tsx
const [value, setValue] = useState('apple');

<RadioGroup value={value} onChange={setValue}>
  <RadioGroup.Item value="apple" />
  <RadioGroup.Item value="banana" />
</RadioGroup>;
```

---

### Horizontal Orientation

```tsx
<RadioGroup orientation="horizontal" defaultValue="a">
  <RadioGroup.Item value="a" />
  <RadioGroup.Item value="b" />
  <RadioGroup.Item value="c" />
</RadioGroup>
```

---

### Disabled Group

```tsx
<RadioGroup disabled defaultValue="a">
  <RadioGroup.Item value="a" />
  <RadioGroup.Item value="b" />
</RadioGroup>
```

---

## Props

### RadioGroup

| Prop           | Type                         | Default        | Description                |
| -------------- | ---------------------------- | -------------- | -------------------------- |
| `value`        | `string`                     | —              | Controlled selected value  |
| `defaultValue` | `string`                     | —              | Uncontrolled initial value |
| `onChange`     | `(value: string) => void`    | —              | Selection callback         |
| `name`         | `string`                     | auto-generated | Shared native input name   |
| `disabled`     | `boolean`                    | `false`        | Disables entire group      |
| `orientation`  | `'horizontal' \| 'vertical'` | `vertical`     | Layout direction           |
| `className`    | `string`                     | —              | Custom styling             |

---

### RadioGroup.Item

| Prop        | Type      | Default        | Description                |
| ----------- | --------- | -------------- | -------------------------- |
| `value`     | `string`  | —              | Unique option value        |
| `disabled`  | `boolean` | `false`        | Disable specific item      |
| `id`        | `string`  | auto-generated | Input id for label linking |
| `className` | `string`  | —              | Custom styling             |

---

## Variants

```tsx
<RadioGroup defaultValue="a" />                      // Vertical (default)
<RadioGroup orientation="horizontal" />              // Horizontal
<RadioGroup disabled />                              // Disabled
<RadioGroup value="a" />                             // Controlled
```

**Available variants**

- `vertical` — Stacked layout
- `horizontal` — Inline layout
- `disabled` — Non-interactive group
- `controlled` — External state management
- `uncontrolled` — Internal state management

**Guidelines**

- Use controlled mode for form libraries
- Prefer horizontal layout for small option sets
- Maintain consistent naming for grouping semantics
- Use disabled state to prevent invalid selections

---

## States

| State           | Description            |
| --------------- | ---------------------- |
| `unchecked`     | Default state          |
| `checked`       | Selected option        |
| `hover`         | Pointer hover feedback |
| `focus-visible` | Keyboard focus ring    |
| `disabled`      | Non-interactive state  |

---

## Keyboard Interaction

| Key          | Behavior                      |
| ------------ | ----------------------------- |
| `Arrow keys` | Navigate options within group |
| `Space`      | Select focused radio          |
| `Tab`        | Move focus into/out of group  |

Native browser radio semantics ensure **automatic roving focus and selection behavior**.

---

## Accessibility

- Implements `role="radiogroup"`
- Uses native `<input type="radio">` for full accessibility support
- Automatic shared `name` attribute for grouping semantics
- Supports `aria-orientation`
- Uses `aria-checked` state synchronization
- Focus-visible ring for keyboard navigation
- Compatible with `<label htmlFor>` associations

---

## Design Tokens

```css
:root {
  --nui-space-3: 0.75rem;
  --nui-space-6: 1.5rem;

  --nui-border-default: #cbd5e1;
  --nui-border-hover: #94a3b8;

  --nui-bg-surface: #ffffff;
  --nui-bg-subtle: #f1f5f9;
  --nui-bg-muted: #e2e8f0;

  --nui-color-primary: #6366f1;
}
```

---

## Best Practices

### Do

- Use consistent values across items
- Provide labels using `<label htmlFor>`
- Prefer controlled mode for form integration
- Group logically related options
- Use horizontal layout only for limited choices

### Don’t

- Use radios for multi-select scenarios
- Leave items without accessible labels
- Mix controlled and uncontrolled patterns
- Overcrowd horizontal layouts
- Disable individual items without context
