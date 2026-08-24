<div align="center">

# NUI

**A robust, accessible, and lightweight React component library designed for modern web applications.**

<p align="center">
  <a href="https://www.typescriptlang.org/">
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white">
  </a>

  <a href="https://opensource.nofinite.com/docs/nui">
    <img alt="Documentation" src="https://img.shields.io/badge/Docs-OpenSource-%23000133?style=for-the-badge&labelColor=slategray">
  </a>

  <a href="./LICENSE">
    <img alt="License" src="https://img.shields.io/badge/License-Apache%202.0-%23000133?style=for-the-badge&labelColor=slategray">
  </a>

  <a href="https://www.npmjs.com/package/@nofinite/nui">
    <img alt="NPM Version" src="https://img.shields.io/npm/v/%40nofinite%2Fnui?style=for-the-badge&logo=npm&logoColor=white&labelColor=slategray&color=%23000133">
  </a>
</p>

</div>

---

## Overview

NUI provides a set of accessible, production-ready components to help you build modern web applications faster. It handles the complex details—like focus management and accessibility—so you can focus on building your product.

* **Accessible:** WAI-ARIA compliant out of the box.
* **Type-Safe:** Built with TypeScript for a great developer experience.
* **Lightweight:** Modular design with zero heavy dependencies.

---

## Architecture

NUI follows a **decoupled styling architecture**:
1. **`@nofinite/nui`**: Contains purely the React logic, accessibility primitives, and component structures.
2. **`@nofinite/nuicss`**: The dedicated CSS engine (powered by UnoCSS/Tailwind) that handles all NUI component styling, tokens, and themes.

This separation allows you to integrate NUI into your existing CSS pipeline effortlessly, or use the pre-compiled NUI CSS via CDN.

---

## Installation

```bash
# pnpm
pnpm add @nofinite/nui @nofinite/nuicss

# npm
npm install @nofinite/nui @nofinite/nuicss

# yarn
yarn add @nofinite/nui @nofinite/nuicss
```

## Quick Start

### 1. Import CSS
Import the pre-compiled `nuicss` engine at the root of your application (e.g., `main.tsx`, `_app.tsx`, or `layout.tsx`):

```tsx
import '@nofinite/nuicss/dist/index.css';
```

*(Alternatively, you can load it via our CDN in your HTML `<head>`: `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@nofinite/nuicss@3/dist/index.css">`)*

### 2. Add the Provider
Wrap your application in the `<NUIProvider>` to automatically manage dark mode, theme toggling, and layout state.

```tsx
import { NUIProvider } from '@nofinite/nui';

function App({ children }) {
  return (
    <NUIProvider defaultTheme="system">
      {children}
    </NUIProvider>
  );
}
```

### 3. Use Components
```tsx
import { Button } from '@nofinite/nui';

export default function MyPage() {
  return <Button variant="primary">Click Me</Button>;
}
```

## Documentation

For full setup guides, component examples, and API references, [read documentation](https://opensource.nofinite.com/docs/nui).

## License

This project is licensed under the
[Apache License, Version 2.0](./LICENSE).

Feel free to use, modify, and share this project in your applications, products, and services. Attribution is welcome and appreciated, but never required.
