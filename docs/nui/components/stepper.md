# Stepper

A horizontal progress navigation component that visualizes multi-step workflows such as onboarding, checkout, and forms. Supports interactive navigation, optional steps, validation locking, and completed state indicators.

---

## Usage

### Basic usage

```tsx id="st1"
import { Stepper } from '@nofinite/nui';

<Stepper steps={['Account', 'Profile', 'Confirm']} active={1} />;
```

### Interactive navigation

```tsx id="st2"
<Stepper
  steps={['Account', 'Profile', 'Confirm']}
  active={active}
  onChange={setActive}
/>
```

### Rich step data

```tsx id="st3"
<Stepper
  active={1}
  steps={[
    { label: 'Account', description: 'Create credentials' },
    { label: 'Profile', description: 'Personal details' },
    { label: 'Confirm', optional: true },
  ]}
/>
```

### Validation lock (disable future steps)

```tsx id="st4"
<Stepper steps={steps} active={active} disableFuture />
```

---

## Props

| Prop          | Type                   | Default | Description                         |
| ------------- | ---------------------- | ------- | ----------------------------------- |
| steps         | (string \| StepItem)[] | —       | Steps configuration                 |
| active        | number                 | —       | Active step index (0-based)         |
| onChange      | (index:number)=>void   | —       | Step navigation callback            |
| disableFuture | boolean                | false   | Prevents navigation to future steps |
| className     | string                 | —       | Additional styling                  |

---

## Sub-definitions

### StepItem

| Field       | Type      | Description                |
| ----------- | --------- | -------------------------- |
| label       | ReactNode | Step title                 |
| description | ReactNode | Secondary step information |
| optional    | boolean   | Indicates optional step    |

---

## Variants

### Step data variants

```tsx id="st5"
<Stepper steps={['A','B','C']} active={0} />
<Stepper steps={[{ label:'A', description:'Info' }]} active={0} />
```

### Interaction variants

```tsx id="st6"
<Stepper steps={steps} active={active} onChange={setActive} />
<Stepper steps={steps} active={active} disableFuture />
```

**Available variants**

- Static stepper
- Interactive stepper
- Validation locked stepper
- Optional step flow
- Rich description stepper

**Guidelines**

- Use interactive mode for editable workflows
- Use disableFuture for validation-driven flows
- Keep step labels concise
- Prefer descriptions only for complex flows
- Mark non-critical steps as optional

---

## States

- Default
- Active
- Completed
- Disabled future step
- Focus-visible
- Optional step

---

## Keyboard Interaction

- Tab → moves focus between step buttons
- Enter / Space → activates focused step (if enabled)
- Focus ring visible for accessibility
- Disabled steps removed from tab order

---

## Accessibility

- Uses semantic `<nav>` with `aria-label="Progress Steps"`
- Active step exposed via `aria-current="step"`
- Disabled steps use button disabled semantics
- Focus-visible styling for keyboard users
- Step numbers replaced with checkmark when completed
- Optional indicator clearly announced

---

## Design Tokens

| Token                | Usage                          |
| -------------------- | ------------------------------ |
| --nui-color-primary  | Active and completed indicator |
| --nui-border-default | Connector line                 |
| --nui-bg-surface     | Step circle background         |
| --nui-fg-subtle      | Default text                   |
| --nui-fg-muted       | Optional + description text    |
| --nui-brand-50       | Active glow                    |
| --nui-space-2        | Step spacing                   |

---

## Best Practices

### Do

- Keep steps under 6–7 for cognitive clarity
- Use disableFuture for validation-driven workflows
- Provide clear labels describing user action
- Combine with form validation states
- Use optional steps for progressive completion

### Don’t

- Overload steps with long descriptions
- Allow navigation to invalid steps without validation
- Use stepper for non-linear navigation patterns
- Mix unrelated workflows in one stepper
- Hide step progression context
