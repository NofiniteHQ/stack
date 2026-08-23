<div align="center">

# NUI v3

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
* **Lightweight:** Modular design powered by the high-performance `@nofinite/nuicss` utility engine.

---

## Installation

NUI relies on our utility CSS engine `@nofinite/nuicss`. You must install both packages.

```bash
# pnpm
pnpm add @nofinite/nui @nofinite/nuicss

# npm
npm install @nofinite/nui @nofinite/nuicss
```

Once installed, simply wrap your application in the `<NUIProvider>`:

```tsx
import { NUIProvider } from '@nofinite/nui';
import '@nofinite/nuicss/styles.css';
import '@nofinite/nuicss/virtual.css';

function App({ children }) {
  return (
    <NUIProvider>
      {children}
    </NUIProvider>
  );
}
```

## Documentation

For full setup guides, component examples, and API references, [read documentation](https://opensource.nofinite.com/docs/nui).

## License

This project is licensed under the
[Apache License, Version 2.0](./LICENSE).

Feel free to use, modify, and share this project in your applications, products, and services. Attribution is welcome and appreciated, but never required.
