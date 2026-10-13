# DateRangePicker

A popover-based dual-date calendar component for selecting a start and end date.
Supports drag selection, keyboard navigation, min/max constraints, month/year navigation, smart popover positioning, and controlled/uncontrolled state patterns.

---

## Usage

### Basic

```tsx
import { DateRangePicker, DateRange } from '@nofinite/nui'; // Update with your actual import path

const [cohortRange, setCohortRange] = useState<DateRange>({
  from: '2026-03-01',
  to: '2026-05-30',
});

<DateRangePicker onChange={(r) => console.log(r)} />;
```

### Controlled

```tsx
const [range, setRange] = useState({ from: '2026-10-01', to: '2026-10-10' });

<DateRangePicker value={range} onChange={setRange} />;
```

### With constraints

```tsx
<DateRangePicker
  minDate="2026-01-01"
  maxDate="2026-12-31"
  onChange={(r) => console.log(r)}
/>
```

### Custom display formatting

```tsx
<DateRangePicker
  formatDisplay={(d) => `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`}
/>
```

### Form integration

```tsx
<DateRangePicker nameFrom="startDate" nameTo="endDate" />
```

---

## Props

| Prop            | Type                     | Default      | Description                              |
| --------------- | ------------------------ | ------------ | ---------------------------------------- |
| `value`         | `DateRange`              | —            | Controlled selected range `{ from, to }` |
| `defaultValue`  | `DateRange`              | —            | Initial range for uncontrolled mode      |
| `onChange`      | `(r: DateRange) => void` | —            | Fires when range changes                 |
| `minDate`       | `string`                 | —            | Minimum selectable date                  |
| `maxDate`       | `string`                 | —            | Maximum selectable date                  |
| `placeholder`   | `string`                 | `Pick range` | Trigger placeholder                      |
| `locale`        | `string`                 | `en-US`      | Locale for labels and formatting         |
| `id`            | `string`                 | —            | Trigger id                               |
| `className`     | `string`                 | —            | Root override class                      |
| `nameFrom`      | `string`                 | —            | Hidden input name for start date         |
| `nameTo`        | `string`                 | —            | Hidden input name for end date           |
| `disabled`      | `boolean`                | `false`      | Disables trigger                         |
| `formatDisplay` | `(date: Date) => string` | —            | Custom display formatter                 |

---

## Subcomponents

None exposed.

---

## Variants

```tsx
<DateRangePicker />
<DateRangePicker disabled />
<DateRangePicker value={{ from: "2026-10-01", to: "2026-10-10" }} />
```

**Available variants**

- disabled
- controlled
- uncontrolled
- drag-selection

**Guidelines**

- Prefer controlled mode in complex forms
- Use constraints for booking / availability workflows
- Enable drag selection for analytics dashboards or scheduling

---

## Sizes

Single default size.
Trigger width defaults to **280px** (expanded to accommodate range label).

---

## Shapes / Modes

**Modes**

- Controlled
- Uncontrolled
- Month/year selector
- Calendar day selection
- Drag selection mode
- Partial selection (only start or end)

**States**

- Start date selected
- End date selected
- Range highlight
- Drag highlight
- Disabled date
- Min/max constrained
- Popover open/closed
- Active part selector (start vs end)

---

## Design tokens / theming

Uses NUI tokens:

- `--nui-bg-surface`
- `--nui-bg-subtle`
- `--nui-border-default`
- `--nui-border-hover`
- `--nui-color-primary`
- `--nui-color-primary-fg`
- `--nui-radius-md`
- `--nui-radius-lg`
- `--nui-font-sans`
- `--nui-z-dropdown`

---

## Accessibility

Implemented semantics:

- `aria-haspopup="dialog"`
- `aria-expanded`
- Keyboard navigation

  - Arrow keys grid navigation
  - Enter/Space day selection
  - PageUp/PageDown month navigation
  - Escape close

- Focus restoration after popover close
- Hidden inputs for form submission
- Disabled state propagation
- Click outside dismissal

---

## Best practices

### Do

- Use ISO date storage for backend compatibility
- Apply min/max constraints in booking flows
- Use controlled mode for complex validation
- Provide custom display formatter for domain-specific UX
- Leverage drag selection for quick range picking

### Don’t

- Store formatted display string as value
- Disable picker without explanation
- Use for single-date selection (use DatePicker)
- Override popover positioning manually
