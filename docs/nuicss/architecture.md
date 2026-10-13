# Architecture & UnoCSS Engine

Understand the inner workings of NUICSS and how its on-demand compilation engine delivers instant styling.

---

## Evolution to the UnoCSS Engine

In previous iterations:

- **v1** relied on static, monolithic utility stylesheets that bloated production bundles.
- **v2** introduced a custom JIT engine, but had limited variant support, lacked modern CSS feature coverage, and suffered from edge cases.

**NUICSS** is architected directly on top of **UnoCSS**, the industry standard instant atomic CSS engine:

- **Instant Compilation**: Up to 5x faster than traditional CSS compilers.
- **Full Modern Syntax**: Supports arbitrary values (`w-[340px]`), variant groups (`hover:(text-primary font-bold)`), and media queries (`@screen md`).
- **Clean CSS Output**: Only emits classes that are actually used in your source code.

---

## The `@nuicss` Directive

When `@nuicss;` is placed in your stylesheet, the PostCSS/Vite plugin processes it into structured layers:

```css
/* Input: */
@nuicss;

/* Emitted Output: */
/* Layer: preflights (resets & normalize) */
/* Layer: default (design tokens & variables) */
/* Layer: shortcuts (reusable component aliases) */
/* Layer: utilities (atomic class rules) */
```

### Specific Layer Injection

You can also inject specific layers if you need custom ordering:

```css
@nuicss preflights;
@nuicss default;

/* Custom CSS between resets and utilities */
.my-custom-class {
  margin: 0 auto;
}

@nuicss utilities;
```

---

## Directives Support

### 1. `@apply`

Inline atomic utility classes into custom CSS declarations:

```css
.hero-card {
  @apply p-8 bg-surface border border-default rounded-xl shadow-md;
}
```

### 2. `@screen`

Write clean media queries matching your configured breakpoints:

```css
.sidebar {
  display: none;

  @screen md {
    display: flex;
    width: 280px;
  }
}
```

### 3. `theme()` Function

Extract values from your NUICSS theme directly in CSS:

```css
.custom-border {
  border-color: theme('colors.primary');
}
```
