# Checkbox

A **binary selection control** that allows users to toggle between checked, unchecked, and indeterminate states.
Supports **controlled and uncontrolled usage, labels, disabled state, and accessibility-friendly behavior**.

---

## Usage

### Basic Checkbox

```tsx
import { Checkbox } from '@nofinite/nui';

<Checkbox label="Accept terms" />

<Checkbox defaultChecked label="Subscribed" />

<Checkbox checked={true} label="Controlled checkbox" />
```

### Indeterminate Checkbox

```tsx
<Checkbox indeterminate label="Select all" />
```

### Controlled Checkbox

```tsx
const [checked, setChecked] = useState(false);

<Checkbox
  checked={checked}
  onChange={setChecked}
  label="Enable notifications"
/>;
```

### Disabled Checkbox

```tsx
<Checkbox disabled label="Disabled option" />
```

---

## Props

| Prop             | Type                                          | Default | Description                             |
| ---------------- | --------------------------------------------- | ------- | --------------------------------------- |
| `checked`        | `boolean`                                     | —       | Controlled checked state                |
| `defaultChecked` | `boolean`                                     | `false` | Initial value for uncontrolled checkbox |
| `indeterminate`  | `boolean`                                     | `false` | Displays mixed state indicator          |
| `onChange`       | `(checked: boolean) => void`                  | —       | Called when checked state changes       |
| `label`          | `React.ReactNode`                             | —       | Label displayed beside checkbox         |
| `disabled`       | `boolean`                                     | `false` | Disables interaction                    |
| `className`      | `string`                                      | `""`    | Additional CSS classes                  |
| `...rest`        | `React.InputHTMLAttributes<HTMLInputElement>` | —       | Native input props (except `onChange`)  |

---

## Variants

`Checkbox` supports state-based variants.

```tsx
<Checkbox />                    // Unchecked
<Checkbox defaultChecked />     // Checked
<Checkbox indeterminate />      // Indeterminate
<Checkbox disabled />           // Disabled
```

**Available variants:**

- `unchecked` – Default empty checkbox
- `checked` – Selected checkbox with checkmark
- `indeterminate` – Mixed state with dash indicator
- `disabled` – Non-interactive checkbox

**Guidelines:**

- Use `indeterminate` for parent selection logic (e.g., partial list selection).
- Use controlled mode (`checked`) when state is managed externally.
- Use disabled when interaction must be prevented but state remains visible.

---

## States

| State           | Description                        |
| --------------- | ---------------------------------- |
| `checked`       | Displays checkmark indicator       |
| `indeterminate` | Displays dash indicator            |
| `unchecked`     | Empty checkbox                     |
| `disabled`      | Reduced opacity and no interaction |

---

## Design Tokens / Theming

```css
:root {
  --nui-space-2: 8px;
  --nui-radius-sm: 4px;
  --nui-font-sans: 'Inter', sans-serif;
  --nui-text-sm: 14px;

  --nui-bg-surface: #ffffff;
  --nui-border-default: #e5e7eb;
  --nui-color-primary: #2563eb;
  --nui-color-primary-fg: #ffffff;
  --nui-fg-default: #111827;
}
```

---

## Accessibility

- Renders a native `<input type="checkbox">` for full semantic support
- Uses `aria-checked="mixed"` for indeterminate state
- Focus-visible ring improves keyboard navigation
- Label wrapping ensures large clickable target
- SVG indicators are `aria-hidden` to avoid redundancy

---

## Best Practices

### Do

- Use labels for clarity and accessibility
- Use controlled mode when checkbox state affects other UI
- Use indeterminate for hierarchical selections (e.g., tree views)

### Don’t

- Rely solely on visual state without labels
- Use indeterminate as a permanent state
- Disable checkbox without explaining why interaction is blocked
