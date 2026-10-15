---
title: ThemeSwitcher
sidebar_position: 4
---

# ThemeSwitcher

Provides access to the NUI theming system.  
Use the `useTheme` hook to read and update the active theme (`light`, `dark`, or `system`) within an application already wrapped with `NUIProvider`.

---

## Usage

### Theme switching

```tsx
'use client';
import React from 'react';
import { useTheme, Button } from '@nofinite/nui';

const ThemeSwitcher = () => {
  const { theme, resolved, setTheme } = useTheme();

  return (
    <div>
      <p>Current: {resolved}</p>

      <Button onClick={() => setTheme('light')}>Light</Button>
      <Button onClick={() => setTheme('dark')}>Dark</Button>
      <Button onClick={() => setTheme('system')}>System</Button>
    </div>
  );
};

export default ThemeSwitcher;
```

> `useTheme` must be used inside a component tree wrapped with `NUIProvider`.

---

## API

### useTheme

```ts
const { theme, resolved, setTheme } = useTheme();
```

| Property   | Type                                             | Description                       |
| ---------- | ------------------------------------------------ | --------------------------------- |
| `theme`    | `"light" \| "dark" \| "system"`                  | Selected theme preference         |
| `resolved` | `"light" \| "dark"`                              | Theme currently applied to the UI |
| `setTheme` | `(theme: 'light' \| 'dark' \| 'system') => void` | Updates the active theme          |

---

## Behavior Notes

- `theme` represents the user-selected preference.
- `resolved` represents the effective theme applied to the UI.
- When `theme` is set to `system`, the resolved value follows the OS theme.
- Theme updates propagate immediately to all NUI components.

---

## Accessibility

- Use semantic interactive elements for theme controls.
- Ensure buttons have visible text or accessible labels.
- Theme changes are visual; announce changes via `aria-live` if required by your application.

---

## Layout

- Theme switchers can be placed anywhere within the provider tree.
- No layout constraints are imposed by the theming system.

```tsx
<header>
  <ThemeSwitcher />
</header>
```

---

## Best Practices

### Do

- Use `useTheme` as the single source of truth for theming.
- Prefer `system` as the default theme.
- Keep theme controls simple and discoverable.

### Don’t

- Manage theme state manually.
- Hardcode theme-specific logic inside components.
- Use `useTheme` outside of `NUIProvider`.
