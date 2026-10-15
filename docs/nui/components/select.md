# Select

A fully accessible dropdown component that allows users to choose a single option from a list. It supports controlled and uncontrolled modes, portal-based positioning, keyboard navigation with typeahead search, and error/disabled states.

---

## Usage

### Basic usage

```tsx id="1w3l5k"
import { Select } from '@nofinite/nui';

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'orange', label: 'Orange' },
];

<Select options={options} />;
```

### Controlled usage

```tsx id="n3f3a0"
const [value, setValue] = useState('apple');

<Select options={options} value={value} onChange={setValue} />;
```

### With placeholder

```tsx id="k8ldp2"
<Select options={options} placeholder="Choose fruit" />
```

### Disabled options

```tsx id="2smc9k"
<Select
  options={[
    { value: 'a', label: 'A' },
    { value: 'b', label: 'B', disabled: true },
  ]}
/>
```

### Error state

```tsx id="z6f0r9"
<Select options={options} error />
```

### Form integration

```tsx id="7qk4wx"
<Select options={options} name="fruit" />
```

---

## Props

| Prop           | Type                      | Default     | Description                           |
| -------------- | ------------------------- | ----------- | ------------------------------------- |
| `options`      | `SelectOption[]`          | —           | List of selectable options            |
| `value`        | `string`                  | —           | Controlled selected value             |
| `defaultValue` | `string`                  | —           | Initial uncontrolled value            |
| `onChange`     | `(value: string) => void` | —           | Fired when selection changes          |
| `placeholder`  | `string`                  | `Select...` | Placeholder when no value selected    |
| `name`         | `string`                  | —           | Hidden input name for form submission |
| `disabled`     | `boolean`                 | `false`     | Disables trigger interaction          |
| `error`        | `boolean`                 | `false`     | Displays error styling                |
| `id`           | `string`                  | `auto`      | Base id for accessibility             |
| `className`    | `string`                  | —           | Additional class names                |

Extends `HTMLButtonElement` attributes (excluding `value`, `defaultValue`, `onChange`).

---

## Variants

### Validation state

```tsx id="0qj8n5"
<Select error />
<Select disabled />
```

**Available variants**

- default
- error
- disabled

**Guidelines**

- Use **error** for validation feedback
- Use **disabled** when input is unavailable
- Avoid mixing disabled and error simultaneously

---

## States

- Default
- Open / closed
- Hover
- Focus visible
- Active option (keyboard)
- Selected option
- Disabled option
- Error
- Typeahead navigation

---

## Keyboard Interaction

| Key                      | Behavior                     |
| ------------------------ | ---------------------------- |
| ArrowDown / ArrowUp      | Navigate options             |
| Enter / Space            | Select active option         |
| Home                     | Jump to first enabled option |
| End                      | Jump to last enabled option  |
| Escape                   | Close dropdown               |
| Character typing         | Typeahead search             |
| Enter / Space on trigger | Open dropdown                |

---

## Accessibility

- Uses `button` trigger with `aria-haspopup="listbox"`
- `aria-expanded` and `aria-controls` reflect open state
- List uses `role="listbox"`
- Options use `role="option"`
- `aria-selected` and `aria-disabled` per option
- Focus restored to trigger after close
- Typeahead navigation for screen reader parity
- Hidden input ensures form compatibility

---

## Design Tokens

| Token                | Usage                        |
| -------------------- | ---------------------------- |
| --nui-bg-surface     | Trigger & listbox background |
| --nui-border-default | Input border                 |
| --nui-border-hover   | Hover border                 |
| --nui-color-primary  | Selected option & focus      |
| --nui-color-danger   | Error state                  |
| --nui-bg-subtle      | Active option background     |
| --nui-brand-50       | Selected active background   |
| --nui-z-dropdown     | Portal layering              |
| --nui-radius-md/lg   | Shape tokens                 |
| --nui-space-\*       | Padding & spacing            |

---

## Best Practices

### Do

- Use portal positioning for overflow-safe dropdowns
- Provide placeholder for clarity
- Keep option labels concise
- Disable unavailable options instead of removing them
- Use error state with supporting helper text

### Don’t

- Use extremely long option labels without truncation
- Nest interactive elements inside options
- Use dropdowns for very large datasets (prefer combobox)
- Disable typeahead in keyboard-heavy workflows
- Omit name prop when using in forms
