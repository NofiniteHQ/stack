# Image

Accessible, NUICSS token-driven React component for `Image`.

---

## Usage

### Basic

```tsx
import { Image } from '@nofinite/nui';

<Image />;
```

---

## Props

| Prop          | Type              | Default | Description        |
| :------------ | :---------------- | :------ | :----------------- |
| `fallbackSrc` | `string`          | —       | Component property |
| `fallback`    | `React.ReactNode` | —       | Component property |

---

## Design Tokens & Semantics

- **Styling:** Styled exclusively using semantic tokens and superclasses from `@nofinite/nuicss`.
- **Zero Downstream CSS:** Consumes shared ecosystem styles without independent CSS stylesheets.
- **Accessibility:** Adheres strictly to WAI-ARIA authoring practices.
