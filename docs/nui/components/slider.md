# Slider

An interactive input control that allows users to select a numeric value within a defined range using pointer dragging, track clicking, or keyboard navigation. Supports controlled and uncontrolled usage, step snapping, and full accessibility semantics.

---

## Usage

### Basic usage

```tsx id="a1s2d3"
import { Slider } from '@nofinite/nui';

<Slider />;
```

### Controlled slider

```tsx id="f4g5h6"
const [value, setValue] = useState(50);

<Slider value={value} onChange={setValue} />;
```

### Custom range and step

```tsx id="j7k8l9"
<Slider min={0} max={10} step={0.5} defaultValue={5} />
```

### Disabled slider

```tsx id="m1n2o3"
<Slider disabled defaultValue={40} />
```

---

## Props

| Prop         | Type                   | Default | Description                 |
| ------------ | ---------------------- | ------- | --------------------------- |
| min          | number                 | 0       | Minimum value               |
| max          | number                 | 100     | Maximum value               |
| step         | number                 | 1       | Step increment              |
| value        | number                 | —       | Controlled value            |
| defaultValue | number                 | min     | Initial uncontrolled value  |
| onChange     | (value: number) → void | —       | Callback when value changes |
| disabled     | boolean                | false   | Disables interaction        |
| className    | string                 | —       | Additional styling          |

---

## Variants

### Range configuration

```tsx id="p4q5r6"
<Slider min={0} max={100} />
<Slider min={0} max={10} step={0.1} />
```

### Controlled vs uncontrolled

```tsx id="s7t8u9"
<Slider defaultValue={20} />
<Slider value={value} onChange={setValue} />
```

### Disabled

```tsx id="v1w2x3"
<Slider disabled />
```

**Available variants**

- Default range
- Custom range
- Controlled
- Uncontrolled
- Disabled

**Guidelines**

- Use controlled mode when value must sync with external state
- Use uncontrolled mode for simple forms
- Prefer smaller step values for precision inputs
- Avoid extremely small steps causing excessive updates

---

## States

- Idle
- Hover thumb
- Dragging
- Focus-visible
- Keyboard interaction
- Disabled
- Reduced motion

---

## Keyboard Interaction

| Key                   | Behavior              |
| --------------------- | --------------------- |
| ArrowRight / ArrowUp  | Increase by step      |
| ArrowLeft / ArrowDown | Decrease by step      |
| PageUp                | Increase by step × 10 |
| PageDown              | Decrease by step × 10 |
| Home                  | Jump to min           |
| End                   | Jump to max           |

---

## Accessibility

- Uses `role="slider"`
- Provides `aria-valuemin`, `aria-valuemax`, `aria-valuenow`
- Keyboard operable with full navigation semantics
- Focus is programmatically applied on pointer interaction
- Disabled state exposed via `aria-disabled`
- Respects `prefers-reduced-motion`
- Large invisible hit target improves touch usability

---

## Design Tokens

| Token                      | Usage                     |
| -------------------------- | ------------------------- |
| --nui-bg-subtle            | Track background          |
| --nui-color-primary        | Fill color + thumb border |
| --nui-bg-surface           | Thumb background          |
| --nui-brand-50 / 100 / 600 | Hover + focus states      |
| --nui-fg-muted             | Disabled styling          |

---

## Best Practices

### Do

- Match slider range with meaningful domain values
- Use stepping for predictable snapping behavior
- Provide visible labels or value indicators in forms
- Use controlled mode when slider drives UI changes
- Ensure adequate width for precise interaction

### Don’t

- Use extremely small step sizes for long ranges
- Hide numeric meaning of slider value
- Rely solely on slider for critical precision input
- Disable keyboard navigation
- Use sliders for binary choices (prefer toggle)
