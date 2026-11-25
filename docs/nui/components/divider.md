# Divider

Accessible, NUICSS token-driven React component for `Divider`.

---

## Usage

### Basic

```tsx
import { Divider } from '@nofinite/nui';

<Divider />;
```

---

## Props

| Prop          | Type                         | Default | Description        |
| :------------ | :--------------------------- | :------ | :----------------- |
| `orientation` | `'horizontal' \| 'vertical'` | —       | Component property |
| `children`    | `React.ReactNode`            | —       | Component property |

---

## Design Tokens & Semantics

- **Styling:** Styled exclusively using semantic tokens and superclasses from `@nofinite/nuicss`.
- **Zero Downstream CSS:** Consumes shared ecosystem styles without independent CSS stylesheets.
- **Accessibility:** Adheres strictly to WAI-ARIA authoring practices.
