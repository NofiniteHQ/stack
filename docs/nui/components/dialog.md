# DialogProvider

Global infrastructure component responsible for orchestrating **imperative dialogs and toast bridging** across the application.

It subscribes to a centralized store and renders a modal dialog dynamically for:

- `alert` dialogs (informational acknowledgement)
- `confirm` dialogs (decision-based flows)
- destructive confirmation patterns
- toast bridge between vanilla JS API and React Toast system

This enables a **promise-driven UX pattern**, where application logic pauses until the user resolves a dialog.

---

## Usage

### Provider setup

Place once at application root.

```tsx id="0f0z8y"
import { DialogProvider } from '@nofinite/nui';

export default function RootLayout({ children }) {
  return (
    <>
      {children}
      <DialogProvider />
    </>
  );
}
```

---

### Confirm dialog (destructive flow)

```tsx id="l3o2xb"
'use client';
import { nui, Button } from '@nofinite/nui';

const handleDelete = async () => {
  const isConfirmed = await nui.confirm(
    'Are you absolutely sure? All data will be permanently removed.',
    {
      title: 'Delete Account',
      confirmText: 'Yes, Delete',
      isDanger: true,
    }
  );

  if (!isConfirmed) {
    nui.toast('Action cancelled.');
    return;
  }

  nui.success('Account deleted successfully.');
};

<Button variant="danger" onClick={handleDelete}>
  Delete Account
</Button>;
```

---

### Alert dialog

```tsx id="5x3a6r"
await nui.alert('You must accept the terms before proceeding.', {
  title: 'Terms of Service',
  confirmText: 'I Understand',
});
```

---

### Toast bridge usage

```tsx id="6k6n0m"
nui.warn('Saving changes...', { duration: 2000 });
nui.success('Settings saved successfully!');
nui.error('Operation failed');
```

---

## Behavior

- Uses **external store subscription** via `useSyncExternalStore`
- Dialog resolves promise through `resolve` callback
- Automatically renders `Modal`
- Bridges toast events from emitter to ToastProvider
- Confirm dialogs disable click-outside close
- Alert dialogs auto-resolve `true` on modal close
- Supports destructive styling via `isDanger`

---

## Props

This component is **provider-only** and accepts no public props.

---

## Dialog Types

| Type                | Description                                   |
| ------------------- | --------------------------------------------- |
| alert               | Informational dialog with single confirmation |
| confirm             | Decision dialog with confirm + cancel         |
| destructive confirm | Confirm dialog with danger styling            |

---

## States

- Closed
- Open (alert)
- Open (confirm)
- Resolving promise
- Toast dispatch state

---

## Keyboard Interaction

| Key         | Behavior                                             |
| ----------- | ---------------------------------------------------- |
| Tab         | Focus cycles within modal                            |
| Shift + Tab | Reverse focus trap                                   |
| Enter       | Activates primary action                             |
| Escape      | Closes alert dialog (confirm disabled click outside) |

---

## Accessibility

- Uses Modal focus trap for keyboard navigation
- Semantic dialog structure via Modal
- Prevents accidental dismissal for confirm flows
- Ensures destructive intent visibility via danger styling
- Toast announcements handled by ToastProvider
- Promise-based resolution prevents accidental state mismatch

---

## Architecture Notes

### External store pattern

The provider subscribes to a centralized store enabling:

- framework-agnostic API
- imperative dialog invocation
- decoupled rendering
- cross-tree dialog orchestration

---

### Promise resolution pattern

```ts
const result = await nui.confirm(...)
```

Benefits:

- Linear async control flow
- Eliminates callback nesting
- Simplifies destructive flow logic
- Enables transactional UX

---

### Toast bridge pattern

Flow:

1. Developer calls `nui.success()` in vanilla JS
2. `toastEmitter` publishes event
3. DialogProvider subscribes
4. Event forwarded to ToastProvider `show()`

This enables **headless toast invocation with React rendering**.

---

## Design Tokens

| Token             | Usage                |
| ----------------- | -------------------- |
| `--nui-fg-subtle` | Dialog message color |
| `--nui-text-sm`   | Message typography   |
| `--nui-space-6`   | Message spacing      |
| `--nui-space-3`   | Action gap           |

---

## Best Practices

### Do

- Mount provider once globally
- Use confirm dialogs for destructive operations
- Use alert dialogs for acknowledgement flows
- Use promise resolution for transactional actions
- Combine confirm + toast for robust feedback loops

---

### Don’t

- Mount multiple providers
- Use confirm dialogs for non-critical actions
- Bypass toast bridge for imperative notifications
- Trigger dialogs during render phase
- Depend on modal close for confirm resolution
