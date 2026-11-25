# Collapsible

Accessible, NUICSS token-driven React component for `Collapsible`.

---

## Usage

### Basic

```tsx
import { Collapsible } from '@nofinite/nui';

<Collapsible />;
```

---

## Props

| Prop          | Type                        | Default | Description        |
| :------------ | :-------------------------- | :------ | :----------------- |
| `defaultOpen` | `boolean`                   | —       | Component property |
| `isOpen`      | `boolean`                   | —       | Component property |
| `onToggle`    | `(isOpen: boolean) => void` | —       | Component property |

---

## Design Tokens & Semantics

- **Styling:** Styled exclusively using semantic tokens and superclasses from `@nofinite/nuicss`.
- **Zero Downstream CSS:** Consumes shared ecosystem styles without independent CSS stylesheets.
- **Accessibility:** Adheres strictly to WAI-ARIA authoring practices.
