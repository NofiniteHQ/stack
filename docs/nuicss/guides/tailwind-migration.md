# Tailwind CSS to NUICSS Migration Guide & Cheat Sheet

The authoritative guide for migrating web applications from **Tailwind CSS** to **NUICSS**. Learn how to eliminate utility class sprawl, embrace OKLCH perceptual design tokens, collapse dozens of fragile classes into semantic superclasses, and automate your migration workflow.

---

## 1. Executive Summary & Paradigm Shift

Both Tailwind CSS and NUICSS share the power of atomic utility classes and on-demand JIT compilation. However, they approach component architecture, design tokens, and developer ergonomics from fundamentally different paradigms:

| Architectural Dimension    | Tailwind CSS (v3 / v4)                                                                                                             | NUICSS                                                                                                                                          | The Engineering Advantage                                                                              |
| :------------------------- | :--------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------- |
| **Component Abstraction**  | Utility-first only. Requires 10–18 raw classes per button, input, or card. Class soup is repeated across every component instance. | **Semantic Superclasses** (`btn`, `card`, `input`, `badge`, `table-container`) defined in `@layer components`.                                  | **75% to 85% fewer classes in DOM**. Single source of truth across React, Vue, Svelte, and raw HTML.   |
| **Design Token Engine**    | Standard sRGB hex values (`slate-950`, `blue-600`). Perceptual brightness varies wildly across hues.                               | **Native OKLCH Color Space** (`oklch(0.55 0.25 260)`). Perceptually uniform lightness and wide-gamut display-P3 fidelity.                       | High contrast guarantees, predictable color manipulation, and zero muddy gradient dead zones.          |
| **Dark Mode Architecture** | Manual `dark:*` prefixes required on every single element (`dark:bg-slate-900 dark:text-white dark:border-slate-800`).             | **Token-First Semantic Surfaces** (`bg-surface`, `bg-page`, `text-default`, `border-default`) dynamically inverted via `[data-theme="dark"]`.   | **Zero `dark:` prefixes required** for 95% of standard UI elements. Dark mode works automatically.     |
| **Cascade Overrides**      | Utilities often collide or require `!important` when composing components.                                                         | Superclasses live strictly in `@layer components`; atomic utilities live in `@layer utilities`.                                                 | Any utility class (`p-8`, `bg-primary`, `opacity-75`) overrides superclasses **without `!important`**. |
| **Framework Agnosticism**  | Strongly coupled to Node.js build pipelines and PostCSS plugins.                                                                   | Dual-distribution: lightweight npm package AND **standalone native single-file binaries** (Windows, Linux, macOS) with zero Node.js dependency. | Native compilation in Go, Rust, Python, PHP, Ruby, and static HTML pipelines.                          |

---

## 2. Quick-Reference Cheat Sheet (The Rosetta Stone)

Use this lookup table to quickly map verbose Tailwind utility clusters into clean NUICSS superclasses and semantic tokens.

### 2.1 Buttons & Action Elements

| UI Pattern              | Tailwind Utility Cluster (10–16 classes)                                                                                                                                                                             | NUICSS Superclass | Semantic Tokens Consumed                                          |
| :---------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------- | :---------------------------------------------------------------- |
| **Primary Action**      | `inline-flex items-center justify-center font-medium px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98] transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500` | `btn btn-primary` | `var(--color-primary)`, `var(--fg-inverse)`                       |
| **Default / Secondary** | `inline-flex items-center justify-center font-medium px-4 py-2 rounded-md bg-white border border-gray-300 text-gray-900 hover:bg-gray-50 active:scale-[0.98] transition-all shadow-sm`                               | `btn btn-default` | `var(--bg-surface)`, `var(--border-default)`, `var(--fg-default)` |
| **Outline Action**      | `inline-flex items-center justify-center font-medium px-4 py-2 rounded-md bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-100 transition-all`                                                      | `btn btn-outline` | `var(--border-default)`, `var(--fg-default)`                      |
| **Ghost / Flat Action** | `inline-flex items-center justify-center font-medium px-4 py-2 rounded-md bg-transparent text-gray-700 hover:bg-gray-100 transition-colors`                                                                          | `btn btn-ghost`   | `var(--bg-subtle)`, `var(--fg-default)`                           |
| **Destructive Action**  | `inline-flex items-center justify-center font-medium px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 active:scale-[0.98] transition-all shadow-sm`                                                       | `btn btn-danger`  | `var(--color-danger)`, `var(--fg-inverse)`                        |
| **Compact Action**      | `text-xs px-2.5 py-1.5 rounded`                                                                                                                                                                                      | `btn btn-sm`      | Uses modular size tokens                                          |
| **Large / Prominent**   | `text-base px-6 py-3 rounded-lg`                                                                                                                                                                                     | `btn btn-lg`      | Uses modular size tokens                                          |
| **Icon-Only Button**    | `p-2 aspect-square inline-flex items-center justify-center rounded-md`                                                                                                                                               | `btn btn-icon`    | Enforces 1:1 square aspect ratio                                  |
| **Loading Button**      | `relative text-transparent pointer-events-none ...` + spinner SVG                                                                                                                                                    | `btn btn-loading` | Indeterminate CSS spinner auto-injected                           |

### 2.2 Form Controls & Inputs

| UI Pattern           | Tailwind Utility Cluster                                                                                                                                                                                  | NUICSS Superclass   | Features Encapsulated                                                       |
| :------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------ | :-------------------------------------------------------------------------- |
| **Text Input**       | `w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors` | `input`             | Built-in focus glow, OKLCH border, placeholder styling, disabled states     |
| **Form Select**      | `w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm appearance-none pr-8 bg-no-repeat focus:outline-none focus:ring-2`                                                                   | `select`            | Custom SVG dropdown chevron, typography sync, clean mobile tap targets      |
| **Textarea**         | `w-full rounded-md border border-gray-300 bg-white p-3 text-sm focus:outline-none focus:ring-2 resize-y`                                                                                                  | `textarea`          | Proper line-height, vertical resizing handle, elastic focus ring            |
| **Checkbox**         | `h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-colors`                                                                                                                     | `checkbox`          | Perceptually uniform tick marks, keyboard focus ring, indeterminate support |
| **Toggle Switch**    | `relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none ...`                                                                                            | `toggle`            | Pure CSS animated toggle thumb with smooth spring transition                |
| **Validation Error** | `border-red-500 focus:ring-red-500 text-red-900 bg-red-50`                                                                                                                                                | `input input-error` | Semantic error glow (`var(--color-danger)`), accessible contrast            |

### 2.3 Containers, Cards & Layouts

| UI Pattern            | Tailwind Utility Cluster                                                                               | NUICSS Superclass | Features Encapsulated                                                      |
| :-------------------- | :----------------------------------------------------------------------------------------------------- | :---------------- | :------------------------------------------------------------------------- |
| **Elevated Card**     | `rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900` | `card card-body`  | Surface tokens, border radius scale, soft OKLCH ambient elevation          |
| **Card Header**       | `border-b border-gray-200 px-6 py-4 flex items-center justify-between font-semibold`                   | `card-header`     | Semantic cell division, horizontal flex alignment                          |
| **Card Footer**       | `border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3`                               | `card-footer`     | Action button alignment, boundary divider                                  |
| **Metric / KPI Tile** | `rounded-xl border border-gray-200 bg-white p-5 shadow-sm flex flex-col justify-between`               | `metric-card`     | Optimized for dashboards, statistics, and sparkline widgets                |
| **Scrollable Table**  | `w-full overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm`                          | `table-container` | Responsive horizontal scroll, pinned headers, crisp boundary borders       |
| **Data Table**        | `w-full text-left text-sm divide-y divide-gray-200`                                                    | `table`           | Tabular numeric alignment, auto-padding, striped row variants              |
| **Modal Backdrop**    | `fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4`                 | `modal-overlay`   | Modern glassmorphic blur, accessibility trap, smooth opacity fade          |
| **Modal Window**      | `relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-neutral-900`                     | `modal-box`       | Automatic viewport centering, exit button alignment, spring scale entrance |

### 2.4 Status Indicators & Badges

| UI Pattern        | Tailwind Utility Cluster                                                                                                                        | NUICSS Superclass     | OKLCH Token Role                                          |
| :---------------- | :---------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------- | :-------------------------------------------------------- |
| **Primary Badge** | `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300`       | `badge badge-primary` | Perceptual brand blue tint with guaranteed 4.5:1 contrast |
| **Success Badge** | `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300`   | `badge badge-success` | High-contrast confirmation emerald green                  |
| **Warning Badge** | `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300`   | `badge badge-warning` | Non-glaring amber with dark warning text                  |
| **Danger Badge**  | `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300`           | `badge badge-danger`  | Perceptually distinct danger red                          |
| **Neutral Badge** | `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 dark:bg-neutral-800 dark:text-neutral-200` | `badge badge-neutral` | Subtle surface-matching neutral tone                      |

### 2.5 Micro-Interactions & Elevation

| UI Interaction         | Tailwind Utility Sequence                                                                                 | NUICSS Modifier Class | Behavior                                              |
| :--------------------- | :-------------------------------------------------------------------------------------------------------- | :-------------------- | :---------------------------------------------------- |
| **Button Press Scale** | `active:scale-[0.98] transition-transform duration-100 ease-out`                                          | `press-scale`         | Tactile 2% compression on mouse click or touch tap    |
| **Card Hover Lift**    | `hover:-translate-y-1 hover:shadow-lg transition-all duration-200`                                        | `hover-lift`          | Subtle -2px Y-translation and expanded ambient shadow |
| **Skeleton Loading**   | `animate-pulse bg-gray-200 dark:bg-neutral-800 rounded`                                                   | `skeleton-shimmer`    | Smooth OKLCH gradient shimmer animation               |
| **Focus Ring**         | `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2` | `focus-ring`          | High-visibility WCAG AA compliant focus outline       |

---

## 3. Design Token Migration (sRGB to OKLCH)

Tailwind projects typically sprinkle arbitrary hex-based color utilities (`bg-slate-100`, `text-slate-900`, `border-gray-200`) across markup. When adding dark mode, developers must duplicate every color rule with `dark:*` prefixes.

NUICSS replaces this with **perceptual semantic tokens** that invert automatically based on the active theme:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        NUICSS DESIGN TOKEN MAP                         │
├──────────────────────┬──────────────────────┬──────────────────────────┤
│ Tailwind (Light/Dark)│ NUICSS Token Class   │ CSS Custom Property      │
├──────────────────────┼──────────────────────┼──────────────────────────┤
│ bg-slate-50 / 950    │ bg-page              │ var(--bg-page)           │
│ bg-white / 900       │ bg-surface           │ var(--bg-surface)        │
│ bg-slate-100 / 800   │ bg-subtle            │ var(--bg-subtle)         │
│ bg-slate-200 / 700   │ bg-muted             │ var(--bg-muted)          │
│ text-slate-900 / 50  │ text-default         │ var(--fg-default)        │
│ text-slate-500 / 400 │ text-muted           │ var(--fg-muted)          │
│ border-slate-200/800 │ border-default       │ var(--border-default)    │
│ border-slate-100/700 │ border-subtle        │ var(--border-subtle)     │
│ bg-blue-600 / 500    │ bg-primary           │ var(--color-primary)     │
│ bg-emerald-600 / 500 │ bg-success           │ var(--color-success)     │
│ bg-amber-500 / 400   │ bg-warning           │ var(--color-warning)     │
│ bg-rose-600 / 500    │ bg-danger            │ var(--color-danger)      │
└──────────────────────┴──────────────────────┴──────────────────────────┘
```

### The Dark Mode Difference

#### In Tailwind (High Friction & Error Prone):

```html
<div
  class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm"
>
  <h2 class="text-slate-900 dark:text-slate-100 text-lg font-bold">
    Account Overview
  </h2>
  <p class="text-slate-500 dark:text-slate-400 text-sm mt-1">
    Manage your team subscriptions.
  </p>
  <button
    class="mt-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-md"
  >
    Update Plan
  </button>
</div>
```

#### In NUICSS (Zero `dark:` Prefixes Needed):

```html
<div class="card p-6">
  <h2 class="text-lg font-bold">Account Overview</h2>
  <p class="text-muted text-sm mt-1">Manage your team subscriptions.</p>
  <button class="btn btn-primary mt-4">Update Plan</button>
</div>
```

When switching themes, simply toggle `data-theme="dark"` on `<html>` or `<body>`. Every semantic token (`--bg-surface`, `--fg-default`, `--border-default`, `--color-primary`) dynamically recalculates its OKLCH color coordinates instantaneously!

---

## 4. Side-by-Side Component Transformations

Here are practical before-and-after examples of common UI patterns.

### 4.1 SaaS Dashboard Metric Card

#### Tailwind CSS (24 classes, high cognitive load):

```tsx
export function MetricCard({ title, value, change }) {
  return (
    <div className="flex flex-col justify-between p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
          {change}
        </span>
      </div>
      <div className="text-2xl font-bold text-slate-900 dark:text-white mt-4">
        {value}
      </div>
    </div>
  );
}
```

#### NUICSS (Clean superclasses, 8 classes total):

```tsx
export function MetricCard({ title, value, change }) {
  return (
    <div className="metric-card hover-lift">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted">{title}</span>
        <span className="badge badge-success">{change}</span>
      </div>
      <div className="text-2xl font-bold mt-4">{value}</div>
    </div>
  );
}
```

### 4.2 Data Table with Actions

#### Tailwind CSS (48 classes):

```html
<div
  class="w-full overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
>
  <table class="w-full text-left text-sm text-slate-700 dark:text-slate-200">
    <thead
      class="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400"
    >
      <tr>
        <th class="px-4 py-3">Customer</th>
        <th class="px-4 py-3">Status</th>
        <th class="px-4 py-3 text-right">Actions</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-slate-200 dark:divide-slate-800">
      <tr
        class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
      >
        <td class="px-4 py-3 font-medium text-slate-900 dark:text-white">
          Acme Corp
        </td>
        <td class="px-4 py-3">
          <span
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
            >Active</span
          >
        </td>
        <td class="px-4 py-3 text-right">
          <button
            class="inline-flex items-center justify-center font-medium px-3 py-1.5 rounded-md bg-transparent border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs"
          >
            Edit
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

#### NUICSS (12 classes):

```html
<div class="table-container">
  <table class="table">
    <thead>
      <tr>
        <th>Customer</th>
        <th>Status</th>
        <th class="text-right">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="font-medium">Acme Corp</td>
        <td><span class="badge badge-success">Active</span></td>
        <td class="text-right">
          <button class="btn btn-outline btn-sm">Edit</button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

### 4.3 Interactive Modal Dialog

#### Tailwind CSS:

```html
<!-- Backdrop -->
<div
  class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
>
  <!-- Dialog Window -->
  <div
    class="relative w-full max-w-lg rounded-2xl bg-white dark:bg-neutral-900 p-6 shadow-2xl border border-slate-200 dark:border-neutral-800"
  >
    <h3 class="text-lg font-bold text-slate-900 dark:text-white">
      Deactivate Account
    </h3>
    <p class="text-sm text-slate-500 dark:text-slate-400 mt-2">
      Are you sure you want to proceed? This operation cannot be undone.
    </p>
    <div class="mt-6 flex justify-end gap-3">
      <button
        class="inline-flex items-center justify-center font-medium px-4 py-2 rounded-md bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
      >
        Cancel
      </button>
      <button
        class="inline-flex items-center justify-center font-medium px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
      >
        Confirm Deactivation
      </button>
    </div>
  </div>
</div>
```

#### NUICSS:

```html
<div class="modal-overlay">
  <div class="modal-box">
    <h3 class="text-lg font-bold">Deactivate Account</h3>
    <p class="text-muted text-sm mt-2">
      Are you sure you want to proceed? This operation cannot be undone.
    </p>
    <div class="modal-actions">
      <button class="btn btn-outline">Cancel</button>
      <button class="btn btn-danger">Confirm Deactivation</button>
    </div>
  </div>
</div>
```

---

## 5. Automated Migration Tooling

NUICSS includes automated tooling to make migration frictionless.

### 5.1 The AST Codemod CLI

Run the migration codemod directly against your codebase:

```bash
# Preview changes without modifying files (Dry Run)
npx nuicss migrate --dry-run

# Execute automated migration across source files
npx nuicss migrate src/

# Target specific components or directories
npx nuicss migrate "src/components/**/*.{tsx,jsx,vue,svelte}"
```

The codemod analyzes your JSX/TSX/HTML AST, collapses known utility clusters into superclasses, and preserves your custom spacing and responsive utilities (`mt-4`, `w-full`, `hidden md:block`).

### 5.2 Migrating `tailwind.config.js` to `nuicss.config.ts`

If you have custom colors or fonts in your Tailwind config, transfer them cleanly to `nuicss.config.ts`:

#### Before (`tailwind.config.js`):

```js
module.exports = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          500: '#2563eb',
          600: '#1d4ed8',
        },
      },
    },
  },
};
```

#### After (`nuicss.config.ts`):

```ts
import { defineConfig, nuicssPreset } from '@nofinite/nuicss';

export default defineConfig({
  presets: [
    nuicssPreset({
      theme: {
        colors: {
          brand: 'oklch(0.55 0.25 260)',
        },
      },
    }),
  ],
  content: {
    pipeline: {
      include: ['src/**/*.{js,ts,jsx,tsx,html,vue,svelte}'],
    },
  },
});
```

### 5.3 CSS Directives Migration

Replace Tailwind CSS entrypoints in your global stylesheet:

#### Before (`globals.css` in Tailwind):

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

#### After (`globals.css` in NUICSS):

```css
/* All-in-one unified directive */
@nuicss;

/* Or granular layer directives if custom overrides are needed */
@nuicss tokens;
@nuicss components;
@nuicss utilities;
```

---

## 6. Zero-Downtime Migration Strategy (Phased Rollout)

For large enterprise applications, we recommend a 4-phase rollout strategy:

```
┌────────────────────────────────────────────────────────────────────────┐
│                      4-PHASE MIGRATION TIMELINE                        │
├──────────────┬─────────────────────────────────────────────────────────┤
│ Phase 1      │ Coexistence: Install @nofinite/nuicss alongside Tailwind│
│ Phase 2      │ Low-Hanging Fruit: Replace buttons, badges, and inputs  │
│ Phase 3      │ Layout & Cards: Convert tables, cards, modals, & tokens │
│ Phase 4      │ Deprecation: Remove Tailwind CSS from package.json      │
└──────────────┴─────────────────────────────────────────────────────────┘
```

### Step 1: Install NUICSS alongside Tailwind

NUICSS does not conflict with Tailwind when running simultaneously. Because NUICSS prefixes are optional, you can use `nui-btn`, `nui-card`, `nui-badge` if you prefer complete class isolation, or standard `btn` and `card`.

```bash
pnpm add @nofinite/nuicss
```

### Step 2: Convert Primitives

Migrate standard elements first. Replace buttons with `btn btn-primary`, badges with `badge badge-success`, and text fields with `input`.

### Step 3: Switch Design Tokens

Replace hardcoded Tailwind colors (`text-slate-500`, `bg-slate-100`) with semantic tokens (`text-muted`, `bg-subtle`). Strip away manual `dark:*` prefixes.

### Step 4: Remove Tailwind

Once all components have been migrated, uninstall Tailwind dependencies:

```bash
pnpm remove tailwindcss @tailwindcss/vite @tailwindcss/postcss
```

Your build times will drop by 18% or more, and your bundle will enjoy cleaner semantic styling with zero class sprawl!
