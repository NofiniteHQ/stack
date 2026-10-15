# Component Superclasses

A comprehensive guide and reference to all pre-compiled component superclasses, semantic modifiers, and slot classes in **NUICSS**.

---

## The Single Source of Truth Philosophy

In modern web development, styling components with dozens of raw utility classes creates maintenance friction, inconsistency, and code bloat:

```html
<!-- âŒ Fragile Utility Cluster (14 classes to keep in sync everywhere) -->
<button
  class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md bg-blue-600 hover:bg-blue-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:pointer-events-none shadow-sm"
>
  Submit
</button>

<!-- âœ… NUICSS Component Superclass (Semantic, accessible, and token-driven) -->
<button class="btn btn-primary">Submit</button>
```

### Why Superclasses?

1. **Single Source of Truth:** `@nofinite/nuicss` defines your design tokens, OKLCH palettes, and component superclasses once. Both `@nofinite/nui` React components and raw HTML/CSS templates consume the exact same underlying CSS classes.
2. **Cascade Layer Safety (`@layer components`):** All superclasses are defined inside the CSS `@layer components` layer. You can override any style using atomic utility classes (`mt-4`, `w-full`, `opacity-75`) without requiring `!important`.
3. **Dual Syntax:** Every superclass supports two interchangeable naming conventions:
   - **Concise:** `btn`, `card`, `input`, `badge`, `modal`
   - **Namespace-Isolated:** `nui-btn`, `nui-card`, `nui-input`, `nui-badge`, `nui-modal`

---

## 1. Primitives

### Button (`btn`)

Interactive action elements with built-in active scaling, focus rings, and token-driven variants:

| Superclass    | Description                                            | Token Accent                                 |
| :------------ | :----------------------------------------------------- | :------------------------------------------- |
| `btn`         | Base button structure, transitions, flex alignment     | â€”                                          |
| `btn-primary` | High-emphasis primary call-to-action                   | `var(--color-primary)`                       |
| `btn-default` | Standard secondary action with surface fill and border | `var(--bg-surface)`, `var(--border-default)` |
| `btn-outline` | Bordered button with transparent background            | `var(--border-default)`                      |
| `btn-ghost`   | Low-emphasis borderless button with hover highlight    | `var(--bg-subtle)`                           |
| `btn-danger`  | Destructive action button                              | `var(--color-danger)`                        |
| `btn-link`    | Inline link styled button with text underline          | `var(--color-primary)`                       |

**Sizes:** `btn-sm` (compact), `btn-md` (default), `btn-lg` (prominent), `btn-icon` (square 1:1 aspect ratio).  
**States:** `btn-loading` (displays animated indeterminate spinner).

```html
<div class="flex flex-wrap gap-3">
  <button class="btn btn-primary">Primary</button>
  <button class="btn btn-default">Default</button>
  <button class="btn btn-outline">Outline</button>
  <button class="btn btn-ghost">Ghost</button>
  <button class="btn btn-danger">Danger</button>
  <button class="btn btn-primary btn-sm">Small</button>
  <button class="btn btn-primary btn-lg">Large</button>
</div>
```

---

### Badge (`badge`)

Compact status chips, counts, and category indicators:

| Superclass      | Semantic Role                               |
| :-------------- | :------------------------------------------ |
| `badge`         | Base pill container with font scaling       |
| `badge-primary` | Brand highlight badge                       |
| `badge-success` | Positive status (Active, Online, Completed) |
| `badge-warning` | Caution status (Pending, Review Required)   |
| `badge-danger`  | Critical status (Error, Failed, Terminated) |
| `badge-subtle`  | Low-contrast neutral badge                  |

**Sizes & Modifiers:** `badge-sm`, `badge-md`, `badge-lg`, `badge-pill` (fully rounded), `badge-dot` (includes status bullet).

```html
<div class="flex gap-2">
  <span class="badge badge-primary">Featured</span>
  <span class="badge badge-success badge-pill">Active</span>
  <span class="badge badge-warning">Pending</span>
  <span class="badge badge-danger">Failed</span>
</div>
```

---

### Card (`card`)

Surface container with automatic dark mode adaptation, subtle border, and rounded radius:

- Base: `card`
- Variants: `card-bordered` (accentuated border)
- Slots:
  - `card-header`: Top container with padding and flex alignment
  - `card-title`: Prominent card heading
  - `card-description`: Secondary supporting copy
  - `card-body`: Main content area
  - `card-footer`: Action or timestamp row with top border

```html
<div class="card max-w-sm">
  <div class="card-header">
    <h3 class="card-title">Project Overview</h3>
    <p class="card-description">Summary of system metrics</p>
  </div>
  <div class="card-body">
    <p class="text-sm text-muted">All microservices running smoothly.</p>
  </div>
  <div class="card-footer">
    <button class="btn btn-primary btn-sm">View Details</button>
  </div>
</div>
```

---

### Avatar (`avatar`)

Profile images with fallback monograms and presence indicators:

- Base: `avatar`
- Sizes: `avatar-sm`, `avatar-md`, `avatar-lg`, `avatar-xl`
- Shapes: `avatar-circle`, `avatar-square`
- Media: `avatar-image`
- Status Bullets: `avatar-online`, `avatar-busy`, `avatar-away`
- Stack: `avatar-group` (negative margin overlapping list)

---

### Kbd (`kbd`)

Keyboard shortcut key indicators with subtle bottom shadow and border:

- Base: `kbd`
- Sizes: `kbd-sm`, `kbd-md`, `kbd-lg`

```html
<div class="flex items-center gap-1.5 text-sm text-muted">
  <span>Quick search:</span>
  <kbd class="kbd">âŒ˜</kbd>
  <kbd class="kbd">K</kbd>
</div>
```

---

### Spinner & Skeleton

Asynchronous loading state indicators:

- **Spinner:** `spinner`, `spinner-sm`, `spinner-md`, `spinner-lg`, `spinner-primary`
- **Skeleton:** `skeleton`, `skeleton-text`, `skeleton-circle`, `skeleton-rect`

---

## 2. Form Superclasses

### Input & Textarea (`input`, `textarea`)

Form fields with focus rings, placeholder styling, and error states:

| Superclass                               | Purpose                                                        |
| :--------------------------------------- | :------------------------------------------------------------- |
| `input`                                  | Base single-line input field                                   |
| `input-sm` / `input-lg`                  | Size scale adjustments                                         |
| `input-error`                            | Validation error styling (border token: `var(--color-danger)`) |
| `input-group`                            | Container for attaching prefix/suffix addons                   |
| `input-addon-left` / `input-addon-right` | Attached addon icons or currency badges                        |
| `textarea`                               | Multi-line text input                                          |
| `textarea-error`                         | Validation error styling for textareas                         |

```html
<div class="space-y-4 max-w-sm">
  <input class="input" type="text" placeholder="Standard input" />
  <input class="input input-error" type="text" value="invalid@domain" />
  <textarea
    class="textarea"
    rows="3"
    placeholder="Additional notes..."
  ></textarea>
</div>
```

---

### Checkbox, Radio, and Switch

Selection controls built with accessible contrast and native interaction:

- **Checkbox:** `checkbox`, `checkbox-sm`, `checkbox-md`, `checkbox-lg`, `checkbox-label`
- **Radio:** `radio`, `radio-group`, `radio-group-horizontal`, `radio-label`
- **Switch:** `switch`, `switch-thumb`, `switch-label`

---

## 3. Overlay Superclasses

### Modal & Dialog (`modal`, `dialog`)

Backdrop overlays, centered boxes, and animated dialogs:

- Modal Base: `modal` (backdrop overlay with blur)
- Content Box: `modal-box`, `modal-sm`, `modal-md`, `modal-lg`, `modal-xl`, `modal-full`
- Slots: `modal-header`, `modal-title`, `modal-description`, `modal-body`, `modal-footer`, `modal-close`
- Dialog Variants: `dialog`, `dialog-box`, `dialog-icon`, `dialog-icon-danger`, `dialog-icon-warning`, `dialog-icon-success`

---

### Drawer (`drawer`)

Off-canvas sheets sliding from screen boundaries:

- Base: `drawer`
- Placements: `drawer-right`, `drawer-left`, `drawer-top`, `drawer-bottom`
- Content: `drawer-box`, `drawer-header`, `drawer-title`, `drawer-body`, `drawer-footer`, `drawer-close`

---

### Tooltip & Popover (`tooltip`, `popover`)

Descriptive popups with automatic boundary safety:

- **Tooltip:** `tooltip`, `tooltip-top`, `tooltip-bottom`, `tooltip-left`, `tooltip-right`, `tooltip-arrow`
- **Popover:** `popover-wrapper`, `popover-content`, `popover-header`, `popover-body`, `popover-close`

---

## 4. Widget Superclasses

### Table (`table-container`, `table`)

Responsive data table wrapper with zebra striping and sticky headers:

- `table-container`: Horizontal scrolling wrapper with border and radius
- `table`: Base table layout
- `table-head`, `table-header`, `table-th`: Header rows and cells
- `table-body`, `table-row`, `table-cell`: Body rows and data cells
- `table-sortable`: Interactive sortable column header styling

```html
<div class="table-container">
  <table class="table">
    <thead class="table-head">
      <tr class="table-header">
        <th class="table-th">Name</th>
        <th class="table-th">Role</th>
        <th class="table-th">Status</th>
      </tr>
    </thead>
    <tbody class="table-body">
      <tr class="table-row">
        <td class="table-cell font-medium">Alex Rivera</td>
        <td class="table-cell">Product Lead</td>
        <td class="table-cell">
          <span class="badge badge-success">Active</span>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

---

### Tabs & Stepper

- **Tabs:** `tabs`, `tab-list`, `tab-list-pills`, `tab`, `tab-pill`, `tab-panel`
- **Stepper:** `stepper`, `step`, `step-indicator`, `step-content`, `step-title`, `step-connector`

---

## 5. Media & Navigation

- **Breadcrumbs:** `breadcrumbs`, `breadcrumb-list`, `breadcrumb-item`, `breadcrumb-separator`, `breadcrumb-active`
- **Pagination:** `pagination`, `pagination-item`, `pagination-prev`, `pagination-next`, `pagination-ellipsis`
- **MegaMenu:** `mega-menu`, `mega-menu-trigger`, `mega-menu-content`, `mega-menu-column`, `mega-menu-link`
- **Code Block:** `code-block`, `code-header`, `code-lang`, `code-copy-btn`, `code-pre`

---

## Best Practices

### Do

- Always use `btn`, `card`, `input`, `badge`, etc. as your starting base styles rather than composing raw utility clusters.
- Apply utility classes on top of superclasses for contextual spacing (`mt-6`, `gap-4`, `w-full`).
- Rely on semantic variants (`btn-primary`, `badge-success`, `input-error`) so themes adapt automatically in dark mode.

### Don't

- Do not write hardcoded hex color values (`bg-[#1d4ed8]`); use semantic classes (`btn-primary` or `bg-primary`).
- Never use `!important` to override superclass padding or borders; since superclasses reside in `@layer components`, utilities will naturally take precedence.
