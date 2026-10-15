# Combobox

A **searchable dropdown input component** that allows users to filter and select options from a list.
Supports **controlled/uncontrolled usage, keyboard navigation, icons, custom rendering, filtering, and accessibility-compliant listbox behavior**.

---

## Usage

### Basic Combobox

```tsx
import { Combobox } from '@nofinite/nui';

<Combobox
  options={[
    { label: 'React', value: 'react' },
    { label: 'Vue', value: 'vue' },
    { label: 'Angular', value: 'angular' },
  ]}
/>;
```

### Controlled Combobox

```tsx
const [value, setValue] = useState('');

<Combobox value={value} onChange={setValue} options={options} />;
```

### Combobox with Icons

```tsx
<Combobox leftIcon={<Icon />} rightIcon={<Icon />} options={options} />
```

### Custom Option Rendering

```tsx
<Combobox
  options={options}
  renderOption={(opt, active) => (
    <span style={{ fontWeight: active ? 600 : 400 }}>{opt.label}</span>
  )}
/>
```

### Custom Filter

```tsx
<Combobox
  options={options}
  filter={(input, option) =>
    option.label.toLowerCase().startsWith(input.toLowerCase())
  }
/>
```

---

## Props

| Prop               | Type                                   | Default              | Description                    |
| ------------------ | -------------------------------------- | -------------------- | ------------------------------ |
| `options`          | `ComboboxOption[]`                     | —                    | Options displayed in dropdown  |
| `value`            | `string`                               | —                    | Controlled selected value      |
| `defaultValue`     | `string`                               | —                    | Initial uncontrolled value     |
| `onChange`         | `(value: string) => void`              | —                    | Triggered when option selected |
| `placeholder`      | `string`                               | `"Select..."`        | Input placeholder              |
| `disabled`         | `boolean`                              | `false`              | Disables input                 |
| `emptyMessage`     | `string`                               | `"No results found"` | Message when no options match  |
| `filter`           | `(input, option) => boolean`           | —                    | Custom filter logic            |
| `leftIcon`         | `React.ReactNode`                      | —                    | Icon inside input (left)       |
| `rightIcon`        | `React.ReactNode`                      | —                    | Icon inside input (right)      |
| `renderOption`     | `(option, active) => React.ReactNode`  | —                    | Custom option renderer         |
| `renderOptionIcon` | `(option) => React.ReactNode`          | —                    | Custom option icon renderer    |
| `className`        | `string`                               | `""`                 | Additional CSS classes         |
| `...rest`          | `React.HTMLAttributes<HTMLDivElement>` | —                    | Native props                   |

---

## Variants

`Combobox` supports interaction-based variants.

```tsx
<Combobox options={options} />              // Default combobox
<Combobox disabled options={options} />     // Disabled combobox
<Combobox leftIcon={<Icon />} />            // With icons
<Combobox renderOption={() => {}} />        // Custom rendered options
```

**Available variants:**

- `default` – Standard searchable combobox
- `disabled` – Non-interactive combobox
- `icon` – Combobox with input icons
- `custom-render` – Combobox with custom option rendering

**Guidelines:**

- Use `default` for general dropdown selection.
- Use `disabled` to prevent interaction when unavailable.
- Use `icon` for contextual affordances.
- Use `custom-render` for complex option UI.

---

## States

| State      | Description                 |
| ---------- | --------------------------- |
| `default`  | Closed combobox             |
| `open`     | Dropdown visible            |
| `active`   | Keyboard-highlighted option |
| `selected` | Currently selected option   |
| `empty`    | No results state            |

---

## Design Tokens / Theming

```css
:root {
  --nui-space-2: 8px;
  --nui-space-3: 12px;
  --nui-radius-sm: 4px;
  --nui-radius-md: 8px;
  --nui-font-sans: 'Inter', sans-serif;
  --nui-weight-medium: 500;
  --nui-text-sm: 14px;

  --nui-bg-surface: #ffffff;
  --nui-bg-subtle: #f3f4f6;
  --nui-border-default: #e5e7eb;
  --nui-brand-50: #eff6ff;
  --nui-brand-100: #dbeafe;
  --nui-brand-700: #1d4ed8;
  --nui-color-primary: #3b82f6;
  --nui-fg-default: #111827;
  --nui-fg-disabled: #9ca3af;
  --nui-fg-subtle: #6b7280;
}
```

---

## Accessibility

- Uses **ARIA combobox + listbox pattern**
- Supports full keyboard navigation

  - Arrow keys for navigation
  - Enter for selection
  - Escape to close

- `aria-expanded`, `aria-controls`, and `aria-activedescendant` ensure screen reader support
- Click-outside handling prevents accidental focus loss
- Option selection correctly updates `aria-selected`

---

## Best Practices

### Do

- Use combobox for searchable selections
- Provide meaningful empty state message
- Use custom filter for large datasets
- Keep option labels concise
- Use icons for recognition

### Don’t

- Use combobox for very small lists without search need
- Hide essential information inside custom renderers
- Disable keyboard navigation
- Overload options with long content
