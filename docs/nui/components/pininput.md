# PinInput

Accessible, NUICSS token-driven React component for `PinInput`.

---

## Usage

### Basic

```tsx
import { PinInput } from '@nofinite/nui';

<PinInput />;
```

---

## Props

| Prop           | Type                                          | Default | Description        |
| :------------- | :-------------------------------------------- | :------ | :----------------- |
| `length`       | `number`                                      | —       | Component property |
| `value`        | `string`                                      | —       | Component property |
| `defaultValue` | `string`                                      | —       | Component property |
| `onChange`     | `(value: string) => void`                     | —       | Component property |
| `onComplete`   | `(value: string) => void`                     | —       | Component property |
| `mask`         | `boolean`                                     | —       | Component property |
| `disabled`     | `boolean`                                     | —       | Component property |
| `autoFocus`    | `boolean`                                     | —       | Component property |
| `placeholder`  | `string`                                      | —       | Component property |
| `type`         | `'numeric' \| 'alphanumeric' \| 'alphabetic'` | —       | Component property |
| `otp`          | `boolean`                                     | —       | Component property |
| `size`         | `'sm' \| 'md' \| 'lg'`                        | —       | Component property |
| `name`         | `string`                                      | —       | Component property |

---

## Design Tokens & Semantics

- **Styling:** Styled exclusively using semantic tokens and superclasses from `@nofinite/nuicss`.
- **Zero Downstream CSS:** Consumes shared ecosystem styles without independent CSS stylesheets.
- **Accessibility:** Adheres strictly to WAI-ARIA authoring practices.
