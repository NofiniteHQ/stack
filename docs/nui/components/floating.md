# FloatingArrow

Accessible, NUICSS token-driven React component for `FloatingArrow`.

---

## Usage

### Basic

```tsx
import { FloatingArrow } from '@nofinite/nui';

<FloatingArrow />;
```

---

## Props

| Prop          | Type             | Default | Description        |
| :------------ | :--------------- | :------ | :----------------- |
| `placement`   | `string`         | —       | Component property |
| `x`           | `number \| null` | —       | Component property |
| `y`           | `number \| null` | —       | Component property |
| `fill`        | `string`         | —       | Component property |
| `stroke`      | `string`         | —       | Component property |
| `strokeWidth` | `number`         | —       | Component property |

---

## Design Tokens & Semantics

- **Styling:** Styled exclusively using semantic tokens and superclasses from `@nofinite/nuicss`.
- **Zero Downstream CSS:** Consumes shared ecosystem styles without independent CSS stylesheets.
- **Accessibility:** Adheres strictly to WAI-ARIA authoring practices.
