# Watermark

Accessible, NUICSS token-driven React component for `Watermark`.

---

## Usage

### Basic

```tsx
import { Watermark } from '@nofinite/nui';

<Watermark />;
```

---

## Props

| Prop       | Type                 | Default | Description        |
| :--------- | :------------------- | :------ | :----------------- |
| `text`     | `string \| string[]` | —       | Component property |
| `opacity`  | `number`             | —       | Component property |
| `rotate`   | `number`             | —       | Component property |
| `gap`      | `number`             | —       | Component property |
| `fontSize` | `number`             | —       | Component property |
| `color`    | `string`             | —       | Component property |
| `zIndex`   | `number`             | —       | Component property |

---

## Design Tokens & Semantics

- **Styling:** Styled exclusively using semantic tokens and superclasses from `@nofinite/nuicss`.
- **Zero Downstream CSS:** Consumes shared ecosystem styles without independent CSS stylesheets.
- **Accessibility:** Adheres strictly to WAI-ARIA authoring practices.
