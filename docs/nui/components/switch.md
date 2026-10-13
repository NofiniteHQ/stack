# Switch

A toggle control that allows users to switch between binary states (on/off). Supports controlled and uncontrolled usage, form integration, accessibility semantics, and optional label/description content.

---

## Usage

### Basic usage

```tsx id="sw1"
import { Switch } from '@nofinite/nui';

<Switch />;
```

### Controlled usage

```tsx id="sw2"
<Switch checked={enabled} onChange={setEnabled} />
```

### With label and description

```tsx id="sw3"
<Switch
  label="Enable notifications"
  description="Receive email updates"
  defaultChecked
/>
```

### Form integration

```tsx id="sw4"
<Switch name="notifications" value="enabled" defaultChecked />
```

---

## Props

| Prop               | Type                      | Default | Description                |
| ------------------ | ------------------------- | ------- | -------------------------- |
| `checked`          | `boolean`                 | —       | Controlled state           |
| `defaultChecked`   | `boolean`                 | false   | Uncontrolled initial state |
| `onChange`         | `(checked:boolean)=>void` | —       | Toggle callback            |
| `disabled`         | `boolean`                 | false   | Disables interaction       |
| `label`            | `ReactNode`               | —       | Primary label              |
| `description`      | `ReactNode`               | —       | Secondary helper text      |
| `name`             | `string`                  | —       | Form field name            |
| `value`            | `string`                  | —       | Submitted form value       |
| `size`             | `'sm' \| 'md'`            | md      | Switch size                |
| `className`        | `string`                  | —       | Track styling              |
| `wrapperClassName` | `string`                  | —       | Wrapper styling            |

---

## Variants

### Size variants

```tsx id="sw5"
<Switch size="sm" />
<Switch size="md" />
```

### Content variants

```tsx id="sw6"
<Switch label="Label only" />
<Switch label="Label" description="Description" />
```

### Interaction variants

```tsx id="sw7"
<Switch checked={value} onChange={setValue} />
<Switch disabled />
```

**Available variants**

- Controlled switch
- Uncontrolled switch
- Labelled switch
- Descriptive switch
- Disabled switch
- Small switch
- Medium switch
- Form-integrated switch

**Guidelines**

- Use switches for immediate state changes
- Prefer checkbox for multi-select scenarios
- Always include labels for clarity
- Add descriptions for complex implications
- Use disabled state for restricted actions

---

## States

- Default
- Checked
- Disabled
- Focus-visible
- Hover (checked)
- Form-submitted
- Label/description present

---

## Keyboard Interaction

- Tab → focuses switch
- Space / Enter → toggles state
- Focus-visible ring displayed
- Disabled removes interaction

---

## Accessibility

- Uses `role="switch"` with `aria-checked`
- Description linked via `aria-describedby`
- Keyboard operable via Space and Enter
- Focus-visible styling for WCAG compliance
- Hidden input enables native form submission
- Label linked using `htmlFor`
- Disabled exposed via `aria-disabled`

---

## Design Tokens

| Token                | Usage              |
| -------------------- | ------------------ |
| --nui-color-primary  | Focus ring         |
| --nui-brand-600      | Checked background |
| --nui-brand-700      | Checked hover      |
| --nui-border-default | Off state          |
| --nui-bg-page        | Focus ring offset  |
| --nui-radius-full    | Track shape        |
| --nui-space-3        | Layout spacing     |
| --nui-fg-default     | Label text         |
| --nui-fg-subtle      | Description text   |

---

## Best Practices

### Do

- Use switches for instant toggles
- Provide descriptive labels
- Pair with validation when required
- Use form integration for settings pages
- Maintain consistent size across UI

### Don’t

- Use switches for irreversible actions
- Replace checkboxes in multi-select lists
- Hide consequences of toggling
- Allow toggling when disabled state required
- Use long descriptions that distract from action
