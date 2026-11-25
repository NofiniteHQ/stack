# Attachment

Accessible, NUICSS token-driven React component for `Attachment`.

---

## Usage

### Basic

```tsx
import { Attachment } from '@nofinite/nui';

<Attachment />;
```

---

## Props

| Prop        | Type      | Default | Description        |
| :---------- | :-------- | :------ | :----------------- |
| `filename`  | `string`  | —       | Component property |
| `filesize`  | `number`  | —       | Component property |
| `filetype`  | `string`  | —       | Component property |
| `src`       | `string`  | —       | Component property |
| `isLoading` | `boolean` | —       | Component property |
| `className` | `string`  | —       | Component property |

---

## Design Tokens & Semantics

- **Styling:** Styled exclusively using semantic tokens and superclasses from `@nofinite/nuicss`.
- **Zero Downstream CSS:** Consumes shared ecosystem styles without independent CSS stylesheets.
- **Accessibility:** Adheres strictly to WAI-ARIA authoring practices.
