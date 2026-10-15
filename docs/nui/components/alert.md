# Alert

A flexible and **accessible alert component** for displaying contextual messages, notifications, or warnings. Supports multiple variants (`info`, `success`, `warning`, `error`), optional closable behavior, and clear accessibility cues.

---

## Usage

### Basic Alert

```tsx
import { Alert } from '@nofinite/nui';

<Alert>This is an informational message.</Alert>;
```

### Alert with a title

```tsx
<Alert title="Network Error">
  Unable to connect to the server. Please try again.
</Alert>
```

### Variants

```tsx
<Alert variant="success" title="Success">
  Your data has been saved successfully.
</Alert>

<Alert variant="warning" title="Warning">
  Your subscription will expire in 3 days.
</Alert>

<Alert variant="error" title="Error">
  Failed to process your request.
</Alert>
```

### Closable Alert

```tsx
<Alert
  variant="info"
  title="Reminder"
  closable
  onClose={() => console.log('Alert closed')}
>
  Don’t forget to check your inbox.
</Alert>
```

---

## Props

| Prop        | Type                                          | Default  | Description                              |
| ----------- | --------------------------------------------- | -------- | ---------------------------------------- |
| `variant`   | `'info' \| 'success' \| 'warning' \| 'error'` | `'info'` | Contextual style of the alert            |
| `title`     | `React.ReactNode`                             | —        | Optional heading for the alert           |
| `children`  | `React.ReactNode`                             | —        | Main content of the alert                |
| `closable`  | `boolean`                                     | `false`  | Adds a close button to dismiss the alert |
| `onClose`   | `() => void`                                  | —        | Callback fired when the alert is closed  |
| `className` | `string`                                      | `""`     | Additional CSS class                     |
| `...rest`   | `React.HTMLAttributes<HTMLDivElement>`        | —        | Other native div props                   |

---

## Variants

| Variant   | Background            | Border                 | Text Color                 | Description                         |
| --------- | --------------------- | ---------------------- | -------------------------- | ----------------------------------- |
| `info`    | `var(--nui-brand-50)` | `var(--nui-brand-100)` | `var(--nui-brand-700)`     | Informational message               |
| `success` | `#f0fdf4`             | `#dcfce7`              | `var(--nui-color-success)` | Positive feedback / success message |
| `warning` | `#fffbeb`             | `#fef3c7`              | `#b45309`                  | Warning or caution                  |
| `error`   | `#fef2f2`             | `#fee2e2`              | `var(--nui-color-danger)`  | Error / critical alert              |

> Colors can be overridden with design tokens for theming.

---

## Accessibility

- Uses semantic roles:

  - `role="alert"` for `error` and `warning` (automatically announced by screen readers)
  - `role="status"` for `info` and `success`

- Headers are optional but recommended.
- Close button is keyboard accessible (`Enter` / `Space` triggers `onClose`).
- Focus styles visible via `:focus-visible` on the close button.

---

## Behavior

- Alerts are **controlled/uncontrolled**: content always renders; visibility is handled via parent component logic.
- `closable` triggers `onClose` callback but does not remove alert automatically — parent should handle removal.
- Alerts are visually distinct per variant for immediate recognition.
- Close button shows hover and focus states for better UX.

---

## Design Tokens / Theming

You can override CSS variables to adjust the appearance:

```css
:root {
  /* Colors */
  --nui-brand-50: #eff6ff;
  --nui-brand-100: #dbeafe;
  --nui-brand-700: #1d4ed8;
  --nui-color-success: #22c55e;
  --nui-color-danger: #ef4444;

  /* Typography */
  --nui-font-sans: 'Inter', sans-serif;
  --nui-text-sm: 0.875rem;
  --nui-weight-bold: 700;

  /* Spacing & Radius */
  --nui-space-4: 16px;
  --nui-radius-md: 8px;
}
```

---

## Best Practices

### Do

- Provide a **title** for clarity, especially for `error` or `warning` alerts.
- Keep messages concise.
- Use `closable` for temporary notifications.

### Don’t

- Overload with too much text — keep alerts scannable.
- Use only color to convey status; combine with icons or text.
- Nest alerts inside other alerts — avoid confusion.
