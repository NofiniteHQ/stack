# SegmentedControl

Accessible, NUICSS token-driven React component for `SegmentedControl`.

---

## Usage

### Basic

```tsx
import { SegmentedControl } from '@nofinite/nui';

<SegmentedControl />;
```

---

## Props

| Prop           | Type                       | Default | Description        |
| :------------- | :------------------------- | :------ | :----------------- |
| `options`      | `SegmentedControlOption[]` | —       | Component property |
| `value`        | `string`                   | —       | Component property |
| `defaultValue` | `string`                   | —       | Component property |
| `onChange`     | `(value: string) => void`  | —       | Component property |
| `name`         | `string`                   | —       | Component property |
| `disabled`     | `boolean`                  | —       | Component property |
| `size`         | `'sm' \| 'md' \| 'lg'`     | —       | Component property |
| `fullWidth`    | `boolean`                  | —       | Component property |

---

## Design Tokens & Semantics

- **Styling:** Styled exclusively using semantic tokens and superclasses from `@nofinite/nuicss`.
- **Zero Downstream CSS:** Consumes shared ecosystem styles without independent CSS stylesheets.
- **Accessibility:** Adheres strictly to WAI-ARIA authoring practices.
