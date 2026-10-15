# Textarea

A controlled/uncontrolled multiline input supporting **auto-growing height**, **character counting**, **error state**, and robust accessibility semantics. Designed for form-heavy interfaces with dynamic content entry.

---

## Usage

### Basic usage

```tsx id="r7f9c2"
import { Textarea } from '@nofinite/nui';

<Textarea placeholder="Write your message..." />;
```

### Controlled usage

```tsx id="1yd0ab"
const [value, setValue] = useState('');

<Textarea value={value} onChange={(e) => setValue(e.target.value)} />;
```

### Auto-grow textarea

```tsx id="q7p2v1"
<Textarea autoGrow placeholder="Auto resizing textarea" />
```

### Character counter with max length

```tsx id="3wx91j"
<Textarea maxLength={200} showCount />
```

### Error state

```tsx id="2i0z0c"
<Textarea error helperId="desc-error" />
<p id="desc-error">This field is required</p>
```

### Disabled and read-only

```tsx id="5tpp9x"
<Textarea disabled />
<Textarea readOnly value="Static content" />
```

---

## Props

| Prop         | Type               | Default | Description                  |
| ------------ | ------------------ | ------- | ---------------------------- |
| value        | string             | —       | Controlled value             |
| defaultValue | string             | ""      | Initial uncontrolled value   |
| onChange     | ChangeEventHandler | —       | Change handler               |
| showCount    | boolean            | false   | Displays character counter   |
| autoGrow     | boolean            | true    | Enables height auto-resize   |
| maxLength    | number             | —       | Character limit              |
| error        | boolean            | false   | Error styling + aria-invalid |
| helperId     | string             | —       | aria-describedby target      |
| disabled     | boolean            | false   | Disabled state               |
| readOnly     | boolean            | false   | Read-only state              |
| required     | boolean            | false   | Required input               |
| rows         | number             | 3       | Initial row count            |
| className    | string             | —       | Styling override             |

---

## Variants

### Growth variants

```tsx id="i2bc4l"
<Textarea autoGrow />
<Textarea autoGrow={false} />
```

### Counter variants

```tsx id="plz0d6"
<Textarea showCount />
<Textarea showCount maxLength={120} />
```

### Validation variants

```tsx id="c0xy7s"
<Textarea error />
<Textarea required />
```

### Control mode variants

```tsx id="9y5p4m"
<Textarea defaultValue="uncontrolled" />
<Textarea value="controlled" />
```

**Available variants**

- Auto-grow textarea
- Manual resize textarea
- Character counter textarea
- Max-length limited textarea
- Error state textarea
- Disabled textarea
- Read-only textarea
- Controlled textarea
- Uncontrolled textarea

**Guidelines**

- Use autoGrow for chat, comments, and message inputs
- Disable autoGrow for structured forms
- Pair error state with helper text
- Avoid large maxLength values with autoGrow
- Keep counter visible for strict character limits

---

## States

- Default
- Hover
- Focus-visible
- Disabled
- Read-only
- Error
- Auto-growing
- Counter visible

---

## Keyboard Interaction

- Standard textarea typing behavior
- Enter inserts newline
- Tab navigates form order
- Shift + Tab moves backward
- Screen readers announce error and helper text

---

## Accessibility

- Native textarea semantics
- `aria-invalid` when error
- `aria-describedby` links helper text
- Counter marked `aria-hidden`
- Preserves scroll position during auto-grow
- Supports required + disabled semantics

---

## Design Tokens

| Token                | Usage         |
| -------------------- | ------------- |
| --nui-bg-surface     | Background    |
| --nui-bg-muted       | Disabled bg   |
| --nui-bg-subtle      | Read-only bg  |
| --nui-fg-default     | Text          |
| --nui-fg-muted       | Counter       |
| --nui-fg-disabled    | Disabled text |
| --nui-border-default | Border        |
| --nui-border-hover   | Hover border  |
| --nui-color-primary  | Focus border  |
| --nui-color-danger   | Error border  |
| --nui-brand-100      | Focus ring    |
| --nui-radius-md      | Radius        |
| --nui-space-\*       | Spacing       |
| --nui-font-sans      | Typography    |

---

## Best Practices

### Do

- Use autoGrow for conversational UI
- Combine maxLength + counter for constrained inputs
- Attach helper text via helperId
- Keep textarea responsive for long content
- Validate on blur for better UX

### Don’t

- Use autoGrow for extremely large inputs
- Hide error messaging from screen readers
- Mount multiple counters for same input
- Force manual resize when autoGrow active
- Use placeholder as primary label
