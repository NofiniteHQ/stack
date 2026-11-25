# Architecture & Styling Engine

Understand the inner workings of NUICSS and how its on-demand JIT compilation engine delivers instant styling.

---

## The NUICSS Engine Architecture

**NUICSS** is architected as an autonomous, high-performance styling engine and design token compiler:

- **Instant JIT Compilation**: Generates CSS on demand based on source code scanning, compiling in milliseconds.
- **Full Modern Syntax**: Supports arbitrary values (`w-[340px]`), variant groups (`hover:(text-primary font-bold)`), and media queries (`@screen md`).
- **Clean CSS Output**: Only emits classes that are actually used in your source code, guaranteeing minimal bundle footprints.
- **Universal Integration**: Integrates seamlessly with Vite, Next.js, PostCSS, or standalone via the native binary CLI.

---

## The `@nuicss` Directive

When `@nuicss;` is placed in your stylesheet, the compiler processes it into structured cascade layers:

```css
/* Input: */
@nuicss;

/* Emitted Output: */
/* Layer: preflights (resets & normalize) */
/* Layer: default (design tokens & CSS variables) */
/* Layer: shortcuts (reusable component superclasses) */
/* Layer: utilities (atomic utility class rules) */
```

### Specific Layer Injection

You can also inject specific layers if you need custom cascade ordering:

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

---

## Layer Organization

NUICSS automatically structures emitted CSS into distinct layers to guarantee predictable cascade priority:

1. **Preflights**: Baseline element resets, box-sizing, and typography normalization.
2. **Tokens**: Global CSS variables in OKLCH color space for light and dark themes.
3. **Shortcuts**: Semantic component superclasses (`btn`, `card`, `input`, `badge`, `modal`).
4. **Utilities**: Fine-grained atomic utility classes that override component base styles.
