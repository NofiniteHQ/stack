# LinkPreview

Accessible, NUICSS token-driven React component for `LinkPreview`.

---

## Usage

### Basic

```tsx
import { LinkPreview } from '@nofinite/nui';

<LinkPreview />;
```

---

## Props

| Prop          | Type      | Default | Description        |
| :------------ | :-------- | :------ | :----------------- |
| `url`         | `string`  | —       | Component property |
| `title`       | `string`  | —       | Component property |
| `description` | `string`  | —       | Component property |
| `image`       | `string`  | —       | Component property |
| `loading`     | `boolean` | —       | Component property |
| `error`       | `boolean` | —       | Component property |
| `fetcher`     | `(`       | —       | Component property |
| `url`         | `string`  | —       | Component property |

---

## Design Tokens & Semantics

- **Styling:** Styled exclusively using semantic tokens and superclasses from `@nofinite/nuicss`.
- **Zero Downstream CSS:** Consumes shared ecosystem styles without independent CSS stylesheets.
- **Accessibility:** Adheres strictly to WAI-ARIA authoring practices.
