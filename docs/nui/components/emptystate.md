# EmptyState

Accessible, NUICSS token-driven React component for `EmptyState`.

---

## Usage

### Basic

```tsx
import { EmptyState } from '@nofinite/nui';

<EmptyState />;
```

---

## Props

| Prop          | Type              | Default | Description        |
| :------------ | :---------------- | :------ | :----------------- |
| `icon`        | `React.ReactNode` | —       | Component property |
| `title`       | `string`          | —       | Component property |
| `description` | `React.ReactNode` | —       | Component property |
| `actions`     | `React.ReactNode` | —       | Component property |

---

## Design Tokens & Semantics

- **Styling:** Styled exclusively using semantic tokens and superclasses from `@nofinite/nuicss`.
- **Zero Downstream CSS:** Consumes shared ecosystem styles without independent CSS stylesheets.
- **Accessibility:** Adheres strictly to WAI-ARIA authoring practices.
