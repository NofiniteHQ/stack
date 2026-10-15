---
sidebar_position: 2
title: Installation
---

# Installation

NUI CSS v2.0 can be installed into almost any project. Choose the method that best fits your workflow.

## 1. Browser JIT CDN (Quick Start)

For rapid prototyping or zero-build projects, you can use our blazing fast Browser JIT CDN. This is a lightweight script that observes your DOM and generates styles on the fly!

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>NUI CSS v2.0</title>

    <!-- Optional: Configure NUI CSS -->
    <script>
      window.nuicssConfig = {
        theme: {
          colorsBg: { brand: '#ff0055' },
        },
      };
    </script>

    <!-- Load the JIT Compiler -->
    <script src="https://cdn.jsdelivr.net/npm/@nofinite/nuicss@2/browser"></script>
  </head>
  <body class="bg-surface text-default">
    <h1 class="text-3xl text-brand">Hello World!</h1>
  </body>
</html>
```

## 2. Vite Plugin

If you are using Vite, NUI CSS provides a first-class plugin for optimal performance.

```bash
npm install @nofinite/nuicss
```

Update your `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import { NuiVitePlugin } from '@nofinite/nuicss';

export default defineConfig({
  plugins: [NuiVitePlugin()],
});
```

Then, import the virtual CSS file in your main entry (e.g. `main.ts` or `App.tsx`):

```typescript
import 'virtual:nuicss.css';
```

## 3. PostCSS Plugin

For Next.js, Webpack, or any other setup that supports PostCSS, you can use the NUI CSS PostCSS plugin.

```bash
npm install @nofinite/nuicss
```

Create or update your `postcss.config.js`:

```javascript
module.exports = {
  plugins: [require('@nofinite/nuicss')],
};
```

In your main CSS file (e.g. `globals.css`), include the directives:

```css
@nuicss base;
@nuicss utilities;
```

---

## Configuration

For Vite and PostCSS setups, NUI CSS automatically looks for a `nuicss.config.ts` (or `.js`) at the root of your project.

```typescript
// nuicss.config.ts
export default {
  theme: {
    colorsBg: {
      brand: '#ff0055',
    },
  },
  components: {
    'btn-brand': ['bg-brand', 'text-white', 'px-6', 'py-3', 'rounded-full'],
  },
};
```
