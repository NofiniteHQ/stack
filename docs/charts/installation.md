# Installation & Setup

Add **Nofinite Charts** (`@nofinite/charts`) to your React application.

---

## 1. Package Installation

Install the package alongside `@nofinite/nuicss`:

```bash
# pnpm
pnpm add @nofinite/charts @nofinite/nuicss

# npm
npm install @nofinite/charts @nofinite/nuicss

# yarn
yarn add @nofinite/charts @nofinite/nuicss
```

---

## 2. Stylesheet Configuration

Chart tooltip containers, SVG crosshairs, and animation keyframes are styled directly via **NUICSS**.

Import the single unified stylesheet at the root of your application (`app/layout.tsx`, `main.tsx`, or `src/index.css`):

```tsx
import '@nofinite/nuicss/styles.css';
```

> **Zero Downstream CSS Note:** Do **not** import `@nofinite/charts/styles.css`. NUICSS provides all necessary styling classes and OKLCH color variables automatically.

---

## 3. Basic Import

Import React chart components from `@nofinite/charts/react`:

```tsx
import { AreaChart, LineChart, BarChart } from '@nofinite/charts/react';
```
