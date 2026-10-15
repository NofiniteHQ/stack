# Tailwind & Legacy CSS Migration Guide

NUICSS includes an automated migration codemod that scans your HTML, JSX, TSX, Vue, Svelte, and Astro codebases and automatically refactors repetitive utility strings into elegant, maintainable NUICSS superclasses.

---

## Why Migrate to NUICSS Superclasses?

In standard utility-first CSS frameworks like Tailwind, components often suffer from **class name soup**:

```html
<!-- Messy Tailwind Utility Clutter -->
<button
  class="inline-flex items-center justify-center whitespace-nowrap gap-2 font-sans font-medium px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98] transition-all text-sm disabled:opacity-50"
>
  Submit Payment
</button>
```

With NUICSS, the exact same visual design, OKLCH color accuracy, and micro-interactions collapse into two clean words:

```html
<!-- Clean, Maintainable NUICSS Superclass -->
<button class="btn btn-primary">Submit Payment</button>
```

---

## 1. Automated CLI Migration

Run the NUICSS migration codemod directly in any project root using `npx`:

```bash
# Run interactive migration across your project
npx @nofinite/nuicss migrate

# Or run in dry-run mode to inspect changes without writing files
npx @nofinite/nuicss migrate --dry-run
```

The codemod scans your files (`src/**/*.{tsx,jsx,vue,svelte,astro,html}`) and performs pattern-matching replacements:

| Existing Utility Pattern                                                      | Automated NUICSS Superclass |
| ----------------------------------------------------------------------------- | --------------------------- |
| `px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700`               | `btn btn-primary`           |
| `px-3 py-1 bg-gray-100 text-gray-900 border border-gray-200`                  | `btn btn-secondary`         |
| `border border-gray-200 rounded-xl p-6 bg-white shadow-sm`                    | `card card-body`            |
| `@container flex flex-col @sm:flex-row @sm:items-center`                      | `card-responsive`           |
| `px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700`  | `badge badge-primary`       |
| `h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm`     | `input`                     |
| `p-5 rounded-xl border border-gray-200 bg-white shadow-sm`                    | `metric-card`               |
| `active:scale-[0.98] transition-transform duration-150 ease-out`              | `press-scale`               |
| `hover:-translate-y-1 hover:shadow-lg transition-all`                         | `hover-lift`                |
| `animate-pulse bg-slate-200 rounded`                                          | `skeleton-shimmer rounded`  |
| `w-full overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm` | `table-container`           |

---

## 2. Drop-In Tailwind CDN Replacement

If you are prototyping or using Tailwind via CDN, you can replace the Tailwind script with NUICSS's one-link CDN:

```html
<!-- Before: Tailwind CDN -->
<script src="https://cdn.tailwindcss.com"></script>

<!-- After: NUICSS High-Performance CDN (All Tailwind utilities + 50+ superclasses) -->
<script src="https://cdn.jsdelivr.net/npm/@nofinite/nuicss@latest/dist/index.global.js"></script>
```

All Tailwind utilities (`flex`, `grid`, `gap-4`, `p-6`, `text-sm`) continue to work seamlessly, while superclasses (`btn`, `card`, `badge`, `metric-card`, `cq`) become immediately available with zero configuration.

---

## 3. Programmatic Migration API

You can also use the migration codemod programmatically in your build scripts:

```ts
import { migrateMarkupToNuicss } from '@nofinite/nuicss/migrate';

const legacyHtml =
  '<button class="px-4 py-2 bg-blue-600 text-white rounded-md">Save</button>';
const { result: modernHtml, replacementsCount } =
  migrateMarkupToNuicss(legacyHtml);
console.log(`Made ${replacementsCount} replacements:`, modernHtml);
// Output: Made 1 replacements: <button class="btn btn-primary">Save</button>
```
