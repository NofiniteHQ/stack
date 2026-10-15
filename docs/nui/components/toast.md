# Toast

A **fully accessible, animated toast notification system** built with React + TypeScript. Supports **multiple variants**, **auto-dismiss with pause-on-hover**, **manual dismissal**, **stacked layout**, and **SSR-friendly portal rendering**.

---

## Usage

### Basic usage

```tsx id="toast-basic"
import { ToastProvider, useToast } from '@nofinite/nui';

function App() {
  return (
    <ToastProvider>
      <MainApp />
    </ToastProvider>
  );
}

function MainApp() {
  const toast = useToast();

  return (
    <button onClick={() => toast.show('Hello, World!')}>Show Toast</button>
  );
}
```

### Variant usage

```tsx id="toast-variants"
toast.show('Success!', { variant: 'success' });
toast.show('Error occurred', { variant: 'error', duration: 6000 });
toast.show('Warning message', {
  variant: 'warning',
  description: 'This is important!',
});
```

### Manual dismissal

```tsx id="toast-dismiss"
const id = toast.show('This will auto-dismiss in 4s');
toast.dismiss(id); // triggers exit animation immediately
```

---

## Props / Options

| Prop        | Type                                             | Default     | Description                                                    |
| ----------- | ------------------------------------------------ | ----------- | -------------------------------------------------------------- |
| message     | ReactNode                                        | —           | Primary message text or component                              |
| duration    | number                                           | 4000        | Time in ms before auto-dismiss. `Infinity` disables auto-close |
| variant     | `'default' \| 'success' \| 'error' \| 'warning'` | `'default'` | Toast type (affects left border color)                         |
| description | ReactNode                                        | —           | Optional subtext or details                                    |

---

## Context API

### `useToast()`

Returns:

```ts
interface ToastContextValue {
  show: (message: React.ReactNode, options?: ToastOptions) => string;
  dismiss: (id: string) => void;
}
```

- **show(message, options?)** → Displays a toast and returns its `id`.
- **dismiss(id)** → Triggers the exit animation and removes the toast.

**Notes:**

- Must be called within a `<ToastProvider>`.

---

## Variants / Semantic Styling

| Variant   | Left Border Color     | Usage                         |
| --------- | --------------------- | ----------------------------- |
| `default` | `--nui-color-primary` | Generic info or neutral toast |
| `success` | `--nui-color-success` | Positive confirmation         |
| `error`   | `--nui-color-danger`  | Error / failure               |
| `warning` | `--nui-color-warning` | Warning / caution             |

---

## States

- `open` – Toast is visible
- `closed` – Exit animation triggered
- `isClosing` – Internal flag used to coordinate dismissal
- Hover – pauses auto-dismiss timer
- Focus-visible – accessible close button

---

## Animations

- **Slide in:** `nui-toast-slide-in` – slides from right + scale up
- **Slide out:** `nui-toast-slide-out` – slides to right + scale down
- **Reduced motion** – disables animation, fades out with opacity

```css
.nui-toast[data-state='closed'] {
  animation: nui-toast-slide-out 0.2s ease-in forwards;
}
```

---

## Accessibility

- `role="status"` on each toast ensures screen readers announce it
- `aria-live="polite"` and `aria-atomic="true"` on the container
- Close button with `aria-label="Close notification"`
- Pointer-events managed so that toasts don’t block underlying UI except on hover

---

## Layout / Styling

- Stack vertically, right-aligned: `.nui-toast-region`
- Min-width: `300px`, Max-width: `380px`
- Border-radius: `var(--nui-radius-lg)`
- Shadow: subtle layered box-shadow
- Variants use **left border highlights** for quick visual recognition
- Hovering toast pauses timer
- Close button is focusable & hoverable

---

## Provider Notes

- Handles **multiple toasts** with independent timers
- SSR-friendly via `isMounted` before rendering Portal
- Generates **secure unique IDs** (`crypto.randomUUID()` or fallback)
- Dismiss triggers **exit animation** before removal
- Auto-dismiss timer can be overridden per toast
- Uses `Portal` to avoid stacking context issues

---

## Best Practices

### Do

- Wrap your app with `<ToastProvider>` at top level
- Use semantic variants for clarity
- Use `description` for longer details
- Pause on hover ensures users can read long messages
- Combine with forms or async actions for success/error feedback

### Don’t

- Trigger too many toasts at once (UI clutter)
- Rely solely on color to convey message (combine with text)
- Ignore accessibility (focus, role, aria attributes are built-in)
