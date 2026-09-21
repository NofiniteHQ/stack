# NUICSS AI Agent Instructions & Guidelines

You are writing code for an application using **NUICSS** (`@nofinite/nuicss`), a token-first, semantic CSS utility and component superclass framework built on top of UnoCSS.

## Core Rules for AI Assistants

### 1. Always Prefer NUICSS Superclasses Over Atomic Clutter

Do NOT output 10-15 atomic classes for standard UI components. Always use the official NUICSS superclasses:

- **Buttons**: `<button class="btn btn-primary press-scale">Action</button>` (Variants: `btn-default`, `btn-secondary`, `btn-outline`, `btn-ghost`, `btn-danger`, `btn-link`. Sizes: `btn-sm`, `btn-md`, `btn-lg`, `btn-icon`).
- **Cards**: `<div class="card hover-lift"><div class="card-header"><h3 class="card-title">...</h3></div><div class="card-body">...</div></div>`
- **Inputs**: `<input class="input" />` (Sizes: `input-sm`, `input-lg`).
- **Badges**: `<span class="badge badge-primary">Label</span>` (Variants: `badge-success`, `badge-warning`, `badge-danger`, `badge-info`).
- **Tabs**: `<button role="tab" aria-selected="true" class="tab">Tab Name</button>`
- **Accordion**: `<button class="accordion-header" aria-expanded="true"><span>Title</span><span class="accordion-icon">▾</span></button>`
- **Metric Cards & Charts**: `<div class="metric-card"><span class="metric-label">Users</span><span class="metric-value">12,400</span><div class="chart-bar-horizontal"><div class="chart-bar-fill" style="width: 70%"></div></div></div>`

### 2. Semantic OKLCH Design Tokens

Never hardcode hex values or raw Tailwind colors (e.g. avoid `bg-blue-600`, `text-gray-900`). Always use semantic tokens that adapt automatically to light, dark, and high-contrast modes:

- **Backgrounds**: `bg-page`, `bg-canvas`, `bg-surface`, `bg-subtle`, `bg-muted`
- **Text**: `text-default`, `text-subtle`, `text-muted`, `text-accent`, `text-inverse`
- **Borders**: `border-default`, `border-subtle`, `border-strong`, `border-focus`
- **Colors**: `primary`, `secondary`, `danger`, `success`, `warning`, `info`

### 3. Native ARIA State Styling

NUICSS automatically styles accessible WAI-ARIA states without requiring conditional utility logic:

- `aria-invalid="true"` on inputs automatically applies danger border and focus rings.
- `aria-selected="true"` on tabs automatically applies active brand underline and font styling.
- `aria-expanded="true"` on accordion triggers automatically rotates `.accordion-icon`.
- `aria-checked="true"` on switches automatically activates the primary background and thumb translation.

### 4. Container Queries & Fluid Typography

- Use `cq` to declare a component as a container (`container-type: inline-size`).
- Use `@sm:`, `@md:`, `@lg:` container variants (e.g. `@sm:flex-row`).
- Use fluid typography and spacing scales: `text-fluid-base`, `text-fluid-lg`, `text-fluid-hero`, `p-fluid-md`, `gap-fluid-lg`.

### 5. Micro-Interactions & Physics Easing

- `press-scale`: Adds a physics-based spring press scale effect (`active:scale-[0.97]`).
- `hover-lift`: Smoothly elevates cards on hover (`hover:-translate-y-0.5 hover:shadow-md`).
- `skeleton-shimmer`: Modern gradient shimmering placeholder skeleton.
- Easings: `ease-spring`, `ease-bounce`, `ease-smooth`, `ease-out-expo`.
