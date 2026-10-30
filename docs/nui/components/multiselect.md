# MultiSelect

Accessible, NUICSS token-driven React component for `MultiSelect`.

---

## Usage

### Basic

```tsx
import { MultiSelect } from '@nofinite/nui';

<MultiSelect />;
```

---

## Props

| Prop           | Type                        | Default | Description        |
| :------------- | :-------------------------- | :------ | :----------------- |
| `options`      | `MultiSelectOption[]`       | —       | Component property |
| `value`        | `string[]`                  | —       | Component property |
| `defaultValue` | `string[]`                  | —       | Component property |
| `onChange`     | `(value: string[]) => void` | —       | Component property |
| `placeholder`  | `string`                    | —       | Component property |
| `name`         | `string`                    | —       | Component property |
| `error`        | `boolean`                   | —       | Component property |
| `maxTags`      | `number`                    | —       | Component property |

---

## Design Tokens & Semantics

- **Styling:** Styled exclusively using semantic tokens and superclasses from `@nofinite/nuicss`.
- **Zero Downstream CSS:** Consumes shared ecosystem styles without independent CSS stylesheets.
- **Accessibility:** Adheres strictly to WAI-ARIA authoring practices.
