# Timeline

Accessible, NUICSS token-driven React component for `Timeline`.

---

## Usage

### Basic

```tsx
import { Timeline } from '@nofinite/nui';

<Timeline />;
```

---

## Props

| Prop          | Type                         | Default | Description        |
| :------------ | :--------------------------- | :------ | :----------------- |
| `data`        | `TimelineItem[]`             | —       | Component property |
| `orientation` | `'vertical' \| 'horizontal'` | —       | Component property |
| `hideLine`    | `boolean`                    | —       | Component property |
| `children`    | `React.ReactNode`            | —       | Component property |

---

## Design Tokens & Semantics

- **Styling:** Styled exclusively using semantic tokens and superclasses from `@nofinite/nuicss`.
- **Zero Downstream CSS:** Consumes shared ecosystem styles without independent CSS stylesheets.
- **Accessibility:** Adheres strictly to WAI-ARIA authoring practices.
