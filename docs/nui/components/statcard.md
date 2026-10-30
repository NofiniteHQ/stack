# StatCard

Accessible, NUICSS token-driven React component for `StatCard`.

---

## Usage

### Basic

```tsx
import { StatCard } from '@nofinite/nui';

<StatCard />;
```

---

## Props

| Prop            | Type                                                         | Default | Description        |
| :-------------- | :----------------------------------------------------------- | :------ | :----------------- |
| `label`         | `React.ReactNode`                                            | —       | Component property |
| `value`         | `React.ReactNode`                                            | —       | Component property |
| `icon`          | `React.ReactNode`                                            | —       | Component property |
| `trend`         | `'up' \| 'down' \| 'neutral'`                                | —       | Component property |
| `trendValue`    | `React.ReactNode`                                            | —       | Component property |
| `trendLabel`    | `React.ReactNode`                                            | —       | Component property |
| `isLoading`     | `boolean`                                                    | —       | Component property |
| `info`          | `React.ReactNode`                                            | —       | Component property |
| `progressValue` | `number`                                                     | —       | Component property |
| `progressMax`   | `number`                                                     | —       | Component property |
| `accent`        | `'default' \| 'success' \| 'warning' \| 'danger' \| 'brand'` | —       | Component property |
| `sparklineData` | `number[]`                                                   | —       | Component property |

---

## Design Tokens & Semantics

- **Styling:** Styled exclusively using semantic tokens and superclasses from `@nofinite/nuicss`.
- **Zero Downstream CSS:** Consumes shared ecosystem styles without independent CSS stylesheets.
- **Accessibility:** Adheres strictly to WAI-ARIA authoring practices.
