# Nofinite Utils

> Shared core TypeScript utilities, ref composition, DOM helpers, and runtime type guards for the Nofinite ecosystem.

---

## Overview

**Nofinite Utils** (`@nofinite/utils`) provides essential, zero-runtime helper functions used across **NUI**, **Nofinite Kanban**, and other domain libraries. It features:

- **Ref Composition (`composeRefs`):** Safely combine multiple React refs (forwarded refs, local refs, and hook refs) into a single callback ref.
- **Event Handler Chaining:** Merge consumer event listeners with internal component behavior without blocking `event.preventDefault()`.
- **Accessible DOM Helpers:** Focus-trapping calculations, keyboard code normalizations, and scroll lock managers.
- **Micro-Weight:** Fully tree-shakable with zero external dependencies.

---

## Quickstart

### 1. Installation

```bash
npm install @nofinite/utils
# or
pnpm add @nofinite/utils
```

### 2. Usage Example

```tsx
import React, { useRef, forwardRef } from 'react';
import { composeRefs } from '@nofinite/utils';

export const CustomInput = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>((props, forwardedRef) => {
  const internalRef = useRef<HTMLInputElement>(null);

  return (
    <input
      ref={composeRefs(forwardedRef, internalRef)}
      className="input"
      {...props}
    />
  );
});
CustomInput.displayName = 'CustomInput';
```

---

## Core Utilities Catalog

- `composeRefs(...refs)` — Composes multiple React refs into a unified callback ref.
- `callHandler(ourHandler, theirHandler)` — Executes an internal event handler unless the caller's event handler calls `event.defaultPrevented`.
- `clamp(value, min, max)` — Clamps a numeric value between bounds.
- `isBrowser()` — Safe boolean check for window/document presence in SSR environments.
- `mergeProps(defaultProps, userProps)` — Deep-merges props while smartly chaining event handlers and combining class names.
