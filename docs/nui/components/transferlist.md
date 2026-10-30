# TransferList

Accessible, NUICSS token-driven React component for `TransferList`.

---

## Usage

### Basic

```tsx
import { TransferList } from '@nofinite/nui';

<TransferList />;
```

---

## Props

| Prop           | Type                        | Default | Description        |
| :------------- | :-------------------------- | :------ | :----------------- |
| `options`      | `TransferListOption[]`      | —       | Component property |
| `value`        | `string[]`                  | —       | Component property |
| `defaultValue` | `string[]`                  | —       | Component property |
| `onChange`     | `(value: string[]) => void` | —       | Component property |
| `leftTitle`    | `React.ReactNode`           | —       | Component property |
| `rightTitle`   | `React.ReactNode`           | —       | Component property |
| `className`    | `string`                    | —       | Component property |

---

## Design Tokens & Semantics

- **Styling:** Styled exclusively using semantic tokens and superclasses from `@nofinite/nuicss`.
- **Zero Downstream CSS:** Consumes shared ecosystem styles without independent CSS stylesheets.
- **Accessibility:** Adheres strictly to WAI-ARIA authoring practices.
