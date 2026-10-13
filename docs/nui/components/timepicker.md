# TimePicker

A popover-based time selection component supporting **12/24-hour clocks**, **minute stepping**, controlled/uncontrolled usage, collision-aware positioning, and scrollable column selection UI. Designed for scheduling, booking flows, and enterprise form workflows.

---

## Usage

### Basic usage

```tsx id="t1a0c9"
import { TimePicker } from '@nofinite/nui';

<TimePicker />;
```

### Controlled usage

```tsx id="7s0l2x"
const [time, setTime] = useState('13:30');

<TimePicker value={time} onChange={setTime} />;
```

### 24-hour clock

```tsx id="q7l9z2"
<TimePicker clockType={24} />
```

### Minute stepping

```tsx id="1g0a8m"
<TimePicker minuteStep={15} />
```

### Form integration

```tsx id="5c9pf0"
<TimePicker name="appointmentTime" />
```

### Disabled state

```tsx id="p0d3j7"
<TimePicker disabled />
```

---

## Props

| Prop         | Type               | Default     | Description                 |
| ------------ | ------------------ | ----------- | --------------------------- |
| value        | string             | —           | Controlled value (HH:mm)    |
| defaultValue | string             | —           | Initial uncontrolled value  |
| onChange     | (v:string) => void | —           | Change callback             |
| clockType    | 12 \| 24           | 12          | Clock format                |
| minuteStep   | number             | 1           | Minute increment            |
| placeholder  | string             | Select time | Trigger placeholder         |
| name         | string             | —           | Hidden input name for forms |
| id           | string             | —           | Trigger id                  |
| className    | string             | —           | Styling override            |
| disabled     | boolean            | false       | Disabled state              |

---

## Variants

### Clock variants

```tsx id="f3w9pd"
<TimePicker clockType={12} />
<TimePicker clockType={24} />
```

### Minute precision variants

```tsx id="v4o0r1"
<TimePicker minuteStep={5} />
<TimePicker minuteStep={30} />
```

### Control mode variants

```tsx id="7y6mp0"
<TimePicker defaultValue="09:00" />
<TimePicker value="10:30" />
```

**Available variants**

- 12-hour timepicker
- 24-hour timepicker
- Stepped minute picker
- Full precision minute picker
- Controlled timepicker
- Uncontrolled timepicker
- Disabled timepicker
- Form-integrated timepicker

**Guidelines**

- Use minuteStep ≥ 5 for booking interfaces
- Prefer 24h clock in enterprise or international contexts
- Use 12h clock for consumer scheduling UX
- Keep placeholder visible until selection
- Avoid extremely fine minuteStep with mobile touch targets

---

## States

- Closed trigger
- Open popover
- Selected item
- Hover item
- Disabled
- Placeholder state
- Focus-visible trigger

---

## Keyboard Interaction

- Trigger opens popover via Enter / Space
- Tab navigates interactive elements
- Arrow navigation handled by scroll columns
- Escape closes popover via outside click handling
- Focus restored to trigger on close

---

## Accessibility

- Trigger uses `aria-haspopup="dialog"`
- `aria-expanded` reflects popover state
- Hidden input enables native form submission
- Focus restoration improves keyboard continuity
- Scroll columns keep selected item centered
- Visual selection conveys active value
- Placeholder styling distinguishes empty state

---

## Design Tokens

| Token                  | Usage            |
| ---------------------- | ---------------- |
| --nui-bg-surface       | Panel background |
| --nui-bg-muted         | Disabled trigger |
| --nui-bg-subtle        | Hover item       |
| --nui-fg-default       | Text             |
| --nui-fg-subtle        | Placeholder      |
| --nui-fg-disabled      | Disabled text    |
| --nui-border-default   | Borders          |
| --nui-border-hover     | Hover border     |
| --nui-color-primary    | Selected item    |
| --nui-color-primary-fg | Selected text    |
| --nui-brand-100        | Focus ring       |
| --nui-radius-md/lg     | Radius           |
| --nui-space-\*         | Spacing          |
| --nui-z-dropdown       | Popover layering |

---

## Best Practices

### Do

- Use stepped minutes for faster selection
- Maintain focus restoration for accessibility
- Use hidden input for non-JS form compatibility
- Prefer 24h clock for timezone-heavy apps
- Combine with date picker for scheduling workflows

### Don’t

- Allow minuteStep values that break UX consistency
- Disable collision positioning for overlays
- Use extremely narrow triggers with long formatted values
- Hide popover without restoring focus
- Use timepicker for duration selection
