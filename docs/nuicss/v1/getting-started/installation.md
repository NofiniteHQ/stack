---
title: Installation
sidebar_position: 1
---

# Installation

This guide explains how to install and start using **NUI CSS** in your project.

NUI CSS can be installed using a package manager or loaded directly through a CDN.

---

# Install via Package Manager

Install the package using your preferred package manager.

### npm

```bash
npm install @nofinite/nuicss
```

### yarn

```bash
yarn add @nofinite/nuicss
```

### pnpm

```bash
pnpm add @nofinite/nuicss
```

---

# Import the Stylesheet

After installing the package, import the stylesheet into your application entry point.

```js
import '@nofinite/nuicss';
```

Once imported, all NUI CSS utility classes become available globally.

Example utilities:

```
flex
items-center
justify-between
p-4
gap-4
w-full
```

---

# Using the Prefixed Utilities

NUI CSS also provides a **prefixed version of all utilities**.

Prefixed utilities help avoid class name conflicts when building reusable UI components or libraries.

```js
import '@nofinite/nuicss/prefixed';
```

Example prefixed utilities:

```
nui-flex
nui-items-center
nui-p-4
nui-gap-4
```

Both versions provide identical functionality.

---

# CDN Usage

If you prefer not to install the package, you can load NUI CSS directly using a CDN.

---

## Standard Utilities

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@nofinite/nuicss/dist/index.css"
/>
```

This provides the standard utility classes such as:

```
flex
items-center
justify-between
p-4
gap-4
w-full
```

---

## Prefixed Utilities

If you are building reusable UI components or libraries, you can load the prefixed utilities.

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@nofinite/nuicss/dist/prefixed.css"
/>
```

This exposes utilities such as:

```
nui-flex
nui-items-center
nui-p-4
nui-gap-4
```

The prefixed version prevents style collisions in shared environments.

---

# Basic Example

```html
<div class="flex items-center justify-between p-4">
  <span>Logo</span>

  <nav class="flex gap-4">
    <a>Home</a>
    <a>Docs</a>
  </nav>
</div>
```

This example creates a simple navigation layout using flex utilities.

---

# Next Step

Continue to the **Setup** guide to integrate NUI CSS into your project.
