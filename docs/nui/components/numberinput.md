# NumberInput

Accessible, NUICSS token-driven React component for `NumberInput`.

---

## Usage

### Basic

```tsx
import { NumberInput } from '@nofinite/nui';

<NumberInput />;
```

---

## Props

| Prop           | Type                            | Default | Description        |
| :------------- | :------------------------------ | :------ | :----------------- |
| `value`        | `number \| ''`                  | —       | Component property |
| `defaultValue` | `number \| ''`                  | —       | Component property |
| `onChange`     | `(value: number \| '') => void` | —       | Component property |
| `min`          | `number`                        | —       | Component property |
| `max`          | `number`                        | —       | Component property |
| `step`         | `number`                        | —       | Component property |
| `hideStepper`  | `boolean`                       | —       | Component property |

---

## Design Tokens & Semantics

- **Styling:** Styled exclusively using semantic tokens and superclasses from `@nofinite/nuicss`.
- **Zero Downstream CSS:** Consumes shared ecosystem styles without independent CSS stylesheets.
- **Accessibility:** Adheres strictly to WAI-ARIA authoring practices.
