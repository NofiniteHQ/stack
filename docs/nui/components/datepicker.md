# DatePicker

A controlled/uncontrolled popover calendar component for selecting a single date.
Supports keyboard navigation, min/max constraints, localization, smart popover positioning, and year/month quick selection.

---

## Usage

### Basic

```tsx
import { DatePicker } from '@nofinite/nui';
<DatePicker onChange={(date) => console.log(date)} />;
```

### Controlled

```tsx
const [date, setDate] = useState('2026-10-24');

<DatePicker value={date} onChange={setDate} />;
```

### With constraints

```tsx
<DatePicker
  minDate="2026-01-01"
  maxDate="2026-12-31"
  onChange={(d) => console.log(d)}
/>
```

### Custom display formatting

```tsx
<DatePicker
  formatDisplay={(d) => `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`}
/>
```

---

## Props

| Prop            | Type                     | Default       | Description                                 |
| --------------- | ------------------------ | ------------- | ------------------------------------------- |
| `value`         | `string`                 | —             | Controlled selected date (ISO `YYYY-MM-DD`) |
| `defaultValue`  | `string`                 | —             | Initial date for uncontrolled mode          |
| `onChange`      | `(v: string) => void`    | —             | Fires when a date is selected               |
| `minDate`       | `string`                 | —             | Minimum selectable date                     |
| `maxDate`       | `string`                 | —             | Maximum selectable date                     |
| `placeholder`   | `string`                 | `Select date` | Trigger placeholder                         |
| `name`          | `string`                 | —             | Hidden input name for form submission       |
| `locale`        | `string`                 | `en-US`       | Locale used for display & weekday labels    |
| `id`            | `string`                 | —             | Trigger button id                           |
| `className`     | `string`                 | —             | Root class override                         |
| `disabled`      | `boolean`                | `false`       | Disables trigger                            |
| `formatDisplay` | `(date: Date) => string` | —             | Custom display formatter                    |

---

## Subcomponents

None exposed.

---

## Variants

DatePicker supports interaction-based variants.

```tsx
<DatePicker />
<DatePicker disabled />
<DatePicker value="2026-10-24" />
```

**Available variants:**

- disabled — non-interactive trigger
- controlled — external state manages value
- uncontrolled — internal state manages value

**Guidelines:**

- Prefer controlled mode in forms
- Use disabled variant for read-only workflows

---

## Sizes

Single default size.  
Width controlled via CSS (trigger defaults to 240px).

---

## Shapes / Modes

**Modes**

- Controlled
- Uncontrolled
- Month/year selector mode
- Calendar day selection mode

**States**

- Selected
- Today indicator
- Disabled date
- Min/max constrained
- Popover open/closed

---

## Design tokens / theming

Uses NUI tokens:

- `--nui-bg-surface`
- `--nui-bg-subtle`
- `--nui-border-default`
- `--nui-color-primary`
- `--nui-brand-50`
- `--nui-radius-md`
- `--nui-radius-lg`
- `--nui-font-sans`
- `--nui-z-dropdown`

---

## Accessibility

Implemented semantics:

- `aria-haspopup="dialog"`
- `aria-expanded`
- Calendar grid with `role="grid"`
- `aria-selected` on day buttons
- Keyboard navigation
  - Arrow keys day navigation
  - PageUp/PageDown month switching
  - Enter/Space selection
  - Escape close
- Focus restoration after popover close
- Click outside detection

---

## Best practices

### Do

- Use controlled mode in forms
- Provide `minDate` and `maxDate` for validation boundaries
- Use locale for internationalized apps
- Provide custom formatter for domain-specific display

### Don’t

- Store formatted display string as value (use ISO)
- Disable without visual explanation
- Use DatePicker for date ranges (create RangePicker)
- Override popover positioning with custom CSS
