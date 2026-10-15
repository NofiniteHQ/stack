# Accordion

An **accessible, WAI-ARIA–compliant accordion component** for showing and hiding sections of related content. Supports **single or multiple open panels** with smooth CSS animations, keyboard navigation, and focus management.

---

## Usage

### Basic Accordion

```tsx
import { Accordion } from '@nofinite/nui';

<Accordion
  items={[
    {
      id: 'faq1',
      title: 'Do you offer refunds?',
      content: 'Yes, refunds are available within 30 days.',
    },
    {
      id: 'faq2',
      title: 'Do you provide customer support?',
      content: 'Absolutely! Support is 24/7.',
    },
  ]}
/>;
```

### With default open item

```tsx
<Accordion
  defaultOpenId="faq1"
  items={[
    {
      id: 'faq1',
      title: 'Do you offer refunds?',
      content: 'Yes, refunds are available within 30 days.',
    },
    {
      id: 'faq2',
      title: 'Do you provide customer support?',
      content: 'Absolutely! Support is 24/7.',
    },
  ]}
/>
```

### Multiple open items

```tsx
<Accordion
  multiple
  items={[
    {
      id: 'faq1',
      title: 'Do you offer refunds?',
      content: 'Yes, refunds are available within 30 days.',
    },
    {
      id: 'faq2',
      title: 'Do you provide customer support?',
      content: 'Absolutely! Support is 24/7.',
    },
  ]}
/>
```

---

## Props

### Accordion

| Prop            | Type                                   | Default | Description                                         |
| --------------- | -------------------------------------- | ------- | --------------------------------------------------- |
| `items`         | `AccordionItem[]`                      | —       | List of accordion sections                          |
| `defaultOpenId` | `string`                               | —       | ID of the item to open initially                    |
| `multiple`      | `boolean`                              | `false` | Allow multiple panels to be expanded simultaneously |
| `className`     | `string`                               | `""`    | Additional CSS classes for the accordion root       |
| `...rest`       | `React.HTMLAttributes<HTMLDivElement>` | —       | Other native props                                  |

### AccordionItem

```ts
interface AccordionItem {
  id: string;
  title: React.ReactNode;
  content: React.ReactNode;
}
```

---

## Variants

Accordion does not provide visual variants via props. **Styling is controlled via CSS classes and design tokens**:

- `.nui-accordion`
- `.nui-accordion__item`
- `.nui-accordion__header`
- `.nui-accordion__title`
- `.nui-accordion__icon`
- `.nui-accordion__panel`
- `.nui-accordion__content`

> Use `className` for custom overrides or `data-state` attributes (`open` / `closed`) for custom styling.

---

## States

- **Collapsed** – Panel content is hidden (default).
- **Expanded** – Panel content is visible.
- **Single open mode** – Only one panel can be open (`multiple=false`).
- **Multiple open mode** – Multiple panels can be expanded (`multiple=true`).

---

## Accessibility

- **Header buttons**:

  - Render as `<button>`.
  - Use `aria-expanded` to indicate open/closed state.
  - Linked to panels via `aria-controls`.

- **Panels**:

  - Render as `<div role="region">`.
  - Linked back to headers via `aria-labelledby`.

- Keyboard support:

  - `Enter` or `Space` toggles panel expansion.
  - `Tab` moves focus between headers.

---

## Layout & Behavior

- Block-level, full-width by default.
- Smooth height animation using `grid-template-rows`.
- Chevron icon rotates when the panel is open.
- Panel content is **always rendered**, hidden via CSS for animation.

---

## Design Tokens / Theming

```css
:root {
  /* Spacing & radius */
  --nui-space-4: 16px;
  --nui-radius-sm: 4px;

  /* Typography */
  --nui-font-sans: 'Inter', sans-serif;
  --nui-text-base: 1rem;
  --nui-weight-medium: 500;

  /* Colors */
  --nui-fg-default: #111827;
  --nui-fg-subtle: #6b7280;
  --nui-color-primary: #3b82f6;

  /* Borders */
  --nui-border-default: #e5e7eb;
}
```

**Token Table:**

| Token                  | Description                                    |
| ---------------------- | ---------------------------------------------- |
| `--nui-space-4`        | Padding for accordion headers                  |
| `--nui-radius-sm`      | Border radius for header focus outline         |
| `--nui-font-sans`      | Font family for title and content              |
| `--nui-text-base`      | Font size for header and panel content         |
| `--nui-weight-medium`  | Header font weight                             |
| `--nui-fg-default`     | Default text color                             |
| `--nui-fg-subtle`      | Subtle text color (icons, hover, content)      |
| `--nui-color-primary`  | Focus outline color                            |
| `--nui-border-default` | Border color for items and accordion container |

---

## Best Practices

### Do

- Use clear, concise titles for each section.
- Keep related content together.
- Use `multiple` only when needed for comparison.

### Don’t

- Nest accordions excessively.
- Hide critical information inside collapsed panels.
- Rely on accordion state for essential navigation.
