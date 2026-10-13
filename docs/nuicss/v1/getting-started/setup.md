---
title: Setup
sidebar_position: 2
---

# Setup

NUI CSS requires **no configuration**.

After installing the package or loading it through a CDN, utility classes are immediately available.

---

# Basic Setup

Import the stylesheet in your application entry point.

```js
import '@nofinite/nuicss';
```

Once imported, all utilities can be used directly in your markup.

---

# Example Layout

The following example demonstrates a simple page layout.

```html
<div class="flex flex-col gap-4 p-4">
  <header class="flex justify-between items-center">
    <h1>Dashboard</h1>
    <button>Logout</button>
  </header>

  <main class="grid gap-4">
    <section class="p-4">Analytics</section>
    <section class="p-4">Reports</section>
  </main>
</div>
```

This layout uses:

```
flex
grid
gap
padding
alignment utilities
```

---

# Using with React

Import NUI CSS in your application entry file.

```jsx
import '@nofinite/nuicss';

export default function Page() {
  return (
    <div className="flex items-center justify-center h-screen">
      <h1>Hello NUI CSS</h1>
    </div>
  );
}
```

---

# Using with Next.js

In Next.js (App Router), import the stylesheet in `layout.tsx`.

```tsx
import '@nofinite/nuicss';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
```

---

# Using with Static HTML

If you are using plain HTML, include the CDN stylesheet.

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@nofinite/nuicss/dist/style.css"
/>
```

You can now use NUI CSS utilities directly in your HTML.

---

# Next Step

Explore the **Utilities** documentation to learn about layout, spacing, and sizing utilities.
