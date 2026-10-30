# Carousel

Accessible, NUICSS token-driven React component for `Carousel`.

---

## Usage

### Basic

```tsx
import { Carousel } from '@nofinite/nui';

<Carousel />;
```

---

## Props

| Prop         | Type                           | Default | Description        |
| :----------- | :----------------------------- | :------ | :----------------- |
| `children`   | `React.ReactNode[]`            | —       | Component property |
| `showArrows` | `boolean`                      | —       | Component property |
| `showDots`   | `boolean`                      | —       | Component property |
| `itemWidth`  | `string`                       | —       | Component property |
| `gap`        | `string`                       | —       | Component property |
| `align`      | `'start' \| 'center' \| 'end'` | —       | Component property |
| `autoPlay`   | `boolean`                      | —       | Component property |
| `interval`   | `number`                       | —       | Component property |
| `loop`       | `boolean`                      | —       | Component property |

---

## Design Tokens & Semantics

- **Styling:** Styled exclusively using semantic tokens and superclasses from `@nofinite/nuicss`.
- **Zero Downstream CSS:** Consumes shared ecosystem styles without independent CSS stylesheets.
- **Accessibility:** Adheres strictly to WAI-ARIA authoring practices.
