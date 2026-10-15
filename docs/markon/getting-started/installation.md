# Installation & Setup

Add **Nofinite Markon** (`@nofinite/markon`) to your project.

---

## 1. Package Installation

Install `@nofinite/markon` alongside `@nofinite/nuicss`:

```bash
# pnpm
pnpm add @nofinite/markon @nofinite/nuicss

# npm
npm install @nofinite/markon @nofinite/nuicss

# yarn
yarn add @nofinite/markon @nofinite/nuicss
```

---

## 2. Stylesheet Configuration

Markon toolbar buttons, floating bubble menu pills (`.markon-bubble-menu`), and typography classes are bundled directly in **NUICSS**.

Import the unified stylesheet at the root of your application (`app/layout.tsx`, `main.tsx`, or `src/index.css`):

```tsx
import '@nofinite/nuicss/styles.css';
```

> **Zero Downstream CSS Note:** You do **not** need to import `@nofinite/markon/styles.css`. NUICSS provides all necessary superclasses automatically.

### Optional: Modular Subpath Import

For modular tree-shaking:

```tsx
import '@nofinite/nuicss/markon.css';
```
