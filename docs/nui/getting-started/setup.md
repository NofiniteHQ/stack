---
title: Setup
sidebar_position: 2
---

# Setup

NUI requires a provider at the root of your application.

To keep your layout clean and maintainable, create a dedicated **providers file** and import it into your root layout.

---

## Create Providers File

Create `app/providers.tsx`

```tsx
'use client';

import { NUIProvider, ToastProvider, DialogProvider } from '@nofinite/nui';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NUIProvider defaultTheme="system">
      <ToastProvider>
        <DialogProvider />
        {children}
      </ToastProvider>
    </NUIProvider>
  );
}
```

---

## Next.js

Import the providers inside `app/layout.tsx`.

```tsx
import { Providers } from './providers';
import '@nofinite/nui/styles.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

---

## Other React Setups

Wrap your root component once.

```tsx
import { Providers } from './providers';
import '@nofinite/nui/styles.css';

function App({ children }: { children: React.ReactNode }) {
  return <Providers>{children}</Providers>;
}
```

---

### Fix: CSS import “module not found” TypeScript error

If importing NUI styles causes a TypeScript error:

```
Cannot find module '*.css'
```

create a global declaration file.

**1. Create a file inside app folder**

```
global.d.ts
```

**2. Add this line inside that file**

```ts
declare module '*.css';
```

**3. Ensure tsconfig includes `.d.ts` files**

```json
{
  "include": ["**/*.ts", "**/*.tsx", "**/*.d.ts"]
}
```

**Note:**
This is a TypeScript limitation — it does not understand CSS imports without a module declaration.

---

## Notes

- The provider must be rendered once at the application root
- All NUI components assume the provider is present
- `defaultTheme` accepts `light`, `dark`, or `system`
- The providers file must include `"use client"` when using Next.js App Router
