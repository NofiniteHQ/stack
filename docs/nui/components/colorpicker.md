# ColorPicker

Accessible, NUICSS token-driven React component for `ColorPicker`.

---

## Usage

### Basic

```tsx
import { ColorPicker } from '@nofinite/nui';

<ColorPicker />;
```

---

## Props

| Prop         | Type                      | Default | Description        |
| :----------- | :------------------------ | :------ | :----------------- |
| `value`      | `string`                  | —       | Component property |
| `onChange`   | `(color: string) => void` | —       | Component property |
| `presets`    | `string[]`                | —       | Component property |
| `showCustom` | `boolean`                 | —       | Component property |
| `disabled`   | `boolean`                 | —       | Component property |
| `icon`       | `LucideIcon`              | —       | Component property |
| `variant`    | `'default' \| 'icon'`     | —       | Component property |
| `showText`   | `boolean`                 | —       | Component property |
| `showSwatch` | `boolean`                 | —       | Component property |
| `showIcon`   | `boolean`                 | —       | Component property |

---

## Design Tokens & Semantics

- **Styling:** Styled exclusively using semantic tokens and superclasses from `@nofinite/nuicss`.
- **Zero Downstream CSS:** Consumes shared ecosystem styles without independent CSS stylesheets.
- **Accessibility:** Adheres strictly to WAI-ARIA authoring practices.
