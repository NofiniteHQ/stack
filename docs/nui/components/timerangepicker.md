# TimeRangePicker

A **popover-based time range selector** supporting **12/24-hour clocks**, **minute stepping**, controlled/uncontrolled mode, scrollable hour/minute/AM-PM columns, and start/end part switching. Ideal for booking forms, scheduling interfaces, and time window selection in dashboards.

---

## Usage

### Basic usage

```tsx id="tr1a0c9"
import { TimeRangePicker } from '@nofinite/nui';

<TimeRangePicker />;
```

### Controlled usage

```tsx id="tr2c4b7"
const [range, setRange] = useState({ from: '09:00', to: '17:00' });

<TimeRangePicker value={range} onChange={setRange} />;
```

### 24-hour clock

```tsx id="tr3f9d1"
<TimeRangePicker clockType={24} />
```

### Minute stepping

```tsx id="tr4g0m2"
<TimeRangePicker minuteStep={15} />
```

### Form integration

```tsx id="tr5h2x0"
<TimeRangePicker nameFrom="startTime" nameTo="endTime" />
```

### Disabled state

```tsx id="tr6j1k7"
<TimeRangePicker disabled />
```

---

## Props

| Prop           | Type                     | Default             | Description                                      |
| -------------- | ------------------------ | ------------------- | ------------------------------------------------ |
| `value`        | `TimeRange             ` | —                   | Controlled time range `{from: HH:mm, to: HH:mm}` |
| `defaultValue` | `TimeRange             ` | —                   | Initial uncontrolled value                       |
| `onChange`     | `(v:TimeRange) => void ` | —                   | Change callback                                  |
| `clockType`    | `12 \| 24              ` | 12                  | Clock format                                     |
| `minuteStep`   | `number                ` | 1                   | Minute increment                                 |
| `placeholder`  | `string                ` | `Select time range` | Trigger placeholder                              |
| `nameFrom`     | `string                ` | —                   | Hidden input name for start time                 |
| `nameTo`       | `string                ` | —                   | Hidden input name for end time                   |
| `id`           | `string                ` | —                   | Trigger id                                       |
| `className`    | `string                ` | —                   | Styling override                                 |
| `disabled`     | `boolean               ` | false               | Disabled state                                   |

---

## Variants

### Clock variants

```tsx id="tr7k2d0"
<TimeRangePicker clockType={12} />
<TimeRangePicker clockType={24} />
```

### Minute precision variants

```tsx id="tr8l3r1"
<TimeRangePicker minuteStep={5} />
<TimeRangePicker minuteStep={30} />
```

### Control mode variants

```tsx id="tr9m4b0"
<TimeRangePicker defaultValue={{ from: "09:00", to: "17:00" }} />
<TimeRangePicker value={{ from: "10:30", to: "18:00" }} />
```

**Available variants**

- 12-hour range picker
- 24-hour range picker
- Stepped minute range picker
- Full precision minute range picker
- Controlled/uncontrolled range picker
- Disabled range picker
- Form-integrated range picker
- Start/End toggle UI

**Guidelines**

- Default `minuteStep ≥ 5` for faster selection
- Use 24-hour clock for international or enterprise apps
- Use 12-hour clock for consumer-friendly booking UX
- Always show placeholder until user selects both times
- Ensure popover width fits both `from → to` labels

---

## States

- Closed trigger
- Open popover
- Active part (Start/End)
- Selected hour/minute/AM-PM
- Hover item
- Disabled
- Placeholder
- Focus-visible trigger

---

## Keyboard Interaction

- Trigger opens popover via Enter / Space
- Tab navigates start/end buttons and scroll columns
- Arrow navigation scrolls hour/minute/AM-PM items
- Escape closes popover
- Focus restores to trigger on close
- Footer buttons are accessible via Tab/Enter

---

## Accessibility

- Trigger uses `aria-haspopup="dialog"`
- `aria-expanded` reflects popover state
- Hidden inputs enable form submission
- Focus restoration ensures keyboard continuity
- Selected items are visually highlighted
- Start/End part toggle is keyboard accessible
- Placeholder indicates empty range

---

## Design Tokens

| Token                  | Usage                                |
| ---------------------- | ------------------------------------ |
| --nui-bg-surface       | Panel background                     |
| --nui-bg-muted         | Disabled trigger                     |
| --nui-bg-subtle        | Hover item, footer button background |
| --nui-fg-default       | Text                                 |
| --nui-fg-subtle        | Placeholder, inactive part toggle    |
| --nui-fg-disabled      | Disabled text                        |
| --nui-border-default   | Column borders, panel borders        |
| --nui-border-hover     | Trigger hover border                 |
| --nui-color-primary    | Selected item                        |
| --nui-color-primary-fg | Selected text                        |
| --nui-brand-100        | Focus ring                           |
| --nui-radius-md/lg     | Border radius                        |
| --nui-space-\*         | Padding & gap                        |
| --nui-z-dropdown       | Popover layering                     |

---

## Best Practices

### Do

- Use stepped minutes for faster selection
- Switch `activePart` for proper Start/End selection
- Maintain focus restoration
- Use hidden inputs for form integration
- Use 24h clock in global apps
- Combine with date picker for scheduling workflows

### Don’t

- Allow very small minuteStep values that break UX
- Disable collision positioning
- Use extremely narrow triggers with long `from → to` labels
- Hide popover without focus restoration
- Mix uncontrolled and controlled values inconsistently
