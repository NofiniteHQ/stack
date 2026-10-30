# Kbd

Accessible, NUICSS token-driven React component for `Kbd`.

---

## Usage

### Basic

```tsx
import { Kbd } from '@nofinite/nui';

<Kbd />;
```

---

## Props

| Prop        | Type        | Default | Description                     |
| :---------- | :---------- | :------ | :------------------------------ |
| `className` | `string`    | —       | Additional CSS superclass names |
| `children`  | `ReactNode` | —       | Child content                   |

---

## Design Tokens & Semantics

- **Styling:** Styled exclusively using semantic tokens and superclasses from `@nofinite/nuicss`.
- **Zero Downstream CSS:** Consumes shared ecosystem styles without independent CSS stylesheets.
- **Accessibility:** Adheres strictly to WAI-ARIA authoring practices.
