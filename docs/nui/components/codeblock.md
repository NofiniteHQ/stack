# CodeBlock

Accessible, NUICSS token-driven React component for `CodeBlock`.

---

## Usage

### Basic

```tsx
import { CodeBlock } from '@nofinite/nui';

<CodeBlock />;
```

---

## Props

| Prop               | Type                     | Default | Description        |
| :----------------- | :----------------------- | :------ | :----------------- |
| `language`         | `string`                 | —       | Component property |
| `onLanguageChange` | `(lang: string) => void` | —       | Component property |
| `code`             | `string`                 | —       | Component property |
| `children`         | `React.ReactNode`        | —       | Component property |
| `className`        | `string`                 | —       | Component property |
| `readOnlyLanguage` | `boolean`                | —       | Component property |

---

## Design Tokens & Semantics

- **Styling:** Styled exclusively using semantic tokens and superclasses from `@nofinite/nuicss`.
- **Zero Downstream CSS:** Consumes shared ecosystem styles without independent CSS stylesheets.
- **Accessibility:** Adheres strictly to WAI-ARIA authoring practices.
