# Calendar

Accessible, NUICSS token-driven React component for `Calendar`.

---

## Usage

### Basic

```tsx
import { Calendar } from '@nofinite/nui';

<Calendar />;
```

---

## Props

| Prop           | Type                  | Default | Description        |
| :------------- | :-------------------- | :------ | :----------------- |
| `mode`         | `'single'`            | —       | Component property |
| `value`        | `string`              | —       | Component property |
| `defaultValue` | `string`              | —       | Component property |
| `onChange`     | `(v: string) => void` | —       | Component property |

---

## Design Tokens & Semantics

- **Styling:** Styled exclusively using semantic tokens and superclasses from `@nofinite/nuicss`.
- **Zero Downstream CSS:** Consumes shared ecosystem styles without independent CSS stylesheets.
- **Accessibility:** Adheres strictly to WAI-ARIA authoring practices.
