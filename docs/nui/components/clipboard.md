# Clipboard

Accessible, NUICSS token-driven React component for `Clipboard`.

---

## Usage

### Basic

```tsx
import { Clipboard } from '@nofinite/nui';

<Clipboard />;
```

---

## Props

| Prop       | Type      | Default | Description        |
| :--------- | :-------- | :------ | :----------------- |
| `value`    | `string`  | —       | Component property |
| `timeout`  | `number`  | —       | Component property |
| `hideIcon` | `boolean` | —       | Component property |

---

## Design Tokens & Semantics

- **Styling:** Styled exclusively using semantic tokens and superclasses from `@nofinite/nuicss`.
- **Zero Downstream CSS:** Consumes shared ecosystem styles without independent CSS stylesheets.
- **Accessibility:** Adheres strictly to WAI-ARIA authoring practices.
