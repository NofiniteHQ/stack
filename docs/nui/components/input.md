# Input

A composable text entry primitive supporting label association, validation messaging, icon affordances, and token-driven sizing.
Implements WCAG-compliant labeling, dynamic `aria-describedby` linkage, and visual state management for error and disabled conditions.

---

## Usage

### Basic

```tsx id="in1">
import { Input } from '@nofinite/nui';
<Input label="Email" placeholder="Enter email" />;
```

---

### With description

```tsx id="in2">
<Input label="Username" description="Must be unique" placeholder="johndoe" />
```

---

### Error state

```tsx id="in3">
<Input label="Password" error="Password is required" />
```

---

### With icons

```tsx id="in4">
<Input label="Search" leftIcon={<SearchIcon />} rightIcon={<kbd>⌘K</kbd>} />
```

---

### Sizes

```tsx id="in5">
<Input inputSize="sm" />
<Input inputSize="md" />
<Input inputSize="lg" />
```

---

## Props

| Prop               | Type                      | Default | Description                                |
| ------------------ | ------------------------- | ------- | ------------------------------------------ |
| `label`            | `ReactNode`               | —       | Associated label                           |
| `description`      | `ReactNode`               | —       | Helper text below input                    |
| `error`            | `ReactNode`               | —       | Validation message (overrides description) |
| `inputSize`        | `'sm' \| 'md'    \| 'lg'` | `md`    | Size variant                               |
| `leftIcon`         | `ReactNode`               | —       | Leading icon                               |
| `rightIcon`        | `ReactNode`               | —       | Trailing icon                              |
| `wrapperClassName` | `string`                  | —       | Wrapper override                           |
| `className`        | `string`                  | —       | Input override                             |
| `required`         | `boolean`                 | —       | Required attribute + indicator             |
| `disabled`         | `boolean`                 | —       | Disabled state                             |
| `id`               | `string`                  | `auto`  | DOM id for WCAG linkage                    |

Extends `React.InputHTMLAttributes<HTMLInputElement>`.

---

## Variants

```tsx
<Input />
<Input inputSize="sm" />
<Input inputSize="lg" />
<Input error="Invalid" />
<Input leftIcon={<Icon />} />
<Input rightIcon={<Icon />} />
```

**Available variants:**

- default
- sm
- md
- lg
- error
- with-left-icon
- with-right-icon
- disabled
- required

**Guidelines:**

- Prefer description for guidance, error for validation
- Avoid both description and error simultaneously
- Maintain icon visual balance across sizes

---

## Sizes

| Size | Height | Padding | Font |
| ---- | ------ | ------- | ---- |
| sm   | 32px   | space-2 | xs   |
| md   | 40px   | space-3 | sm   |
| lg   | 48px   | space-4 | base |

Icon padding dynamically adjusts via `--has-left` and `--has-right`.

---

## Shapes / Modes

**Interaction states**

- Default
- Hover
- Focus-visible
- Disabled
- Error
- Required
- With-left-icon
- With-right-icon

**Content states**

- Label present
- Description present
- Error present (description suppressed)

---

## Design tokens / theming

Primary tokens:

- `--nui-bg-surface`
- `--nui-bg-subtle`
- `--nui-fg-default`
- `--nui-fg-subtle`
- `--nui-fg-disabled`
- `--nui-border-default`
- `--nui-border-hover`
- `--nui-color-primary`
- `--nui-color-danger`
- `--nui-brand-100`
- `--nui-radius-md`
- `--nui-space-*`
- `--nui-font-sans`

Dark mode modifies focus ring opacity.

---

## Accessibility

Implemented:

- `label` → `htmlFor` association
- Auto-generated id via `useId`
- Dynamic `aria-describedby`
- `aria-invalid` on error
- `aria-live="polite"` error announcement
- Required indicator with `aria-hidden`
- Keyboard focus ring using `:focus-visible`
- Disabled semantic state

Limitations:

- No input masking semantics
- No explicit autocomplete guidance
- No validation role mapping beyond `aria-invalid`

---

## Animation model

- Border and shadow transitions (200ms)
- Focus ring expansion
- No layout animations
- Motion reduction inherits browser preference

---

## Architectural notes

Key behaviors:

- WCAG linkage via deterministic id generation
- Error precedence over description
- Absolute positioned icons with padding compensation
- Token-driven sizing architecture
- CSS-only icon alignment (no JS measurement)
- ForwardRef enables form library interoperability
- Minimal re-render footprint (pure render)

Potential caveat:

- Fixed icon width assumption (16px) may misalign with custom icon sets

---

## Best practices

### Do

- Use label for accessibility even if visually hidden
- Provide descriptive error messages
- Keep icon semantics decorative unless interactive
- Maintain consistent size usage within forms
- Use `required` only when validation enforced

### Don’t

- Replace labels with placeholders
- Place interactive elements inside icon slots
- Depend solely on color for validation signaling
- Render heavy nodes inside description/error
