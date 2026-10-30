# NUIProvider

Accessible, NUICSS token-driven React component for `NUIProvider`.

---

## Usage

### Basic

```tsx
import { NUIProvider } from '@nofinite/nui';

<NUIProvider />;
```

---

## Props

| Prop           | Type              | Default | Description        |
| :------------- | :---------------- | :------ | :----------------- |
| `children`     | `React.ReactNode` | —       | Component property |
| `defaultTheme` | `ThemeMode`       | —       | Component property |
| `storageKey`   | `string`          | —       | Component property |

---

## Design Tokens & Semantics

- **Styling:** Styled exclusively using semantic tokens and superclasses from `@nofinite/nuicss`.
- **Zero Downstream CSS:** Consumes shared ecosystem styles without independent CSS stylesheets.
- **Accessibility:** Adheres strictly to WAI-ARIA authoring practices.
