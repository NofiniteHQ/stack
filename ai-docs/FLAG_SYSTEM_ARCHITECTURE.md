# NUICSS Country Flag System — Architecture Specification

**Programme:** Nofinite Engineering Quality Programme  
**Target Package:** `@nofinite/nuicss` (`dist/flags.css`, `dist/flags/`)  
**Status:** Certified Architecture & Implementation  
**Governing Standard:** EOR 1.0, NEAS 1.0, Zero Downstream CSS Invariant (Rule 14)  
**Author:** Antigravity Engineering Lead  
**Date:** November 8, 2026

---

## 1. Executive Summary

The **NUICSS Country Flag System** provides a framework-independent, vector-based country flag styling engine for web interfaces.

In historical versions (`@nofinite/locale@2.0.0`), country flags were bundled as uncompiled SVGs inside the locale package, compiling custom SCSS and leaking raw assets into production tarballs. In commit `0d655bb`, `@nofinite/locale` removed these assets to uphold the **Zero Downstream CSS Invariant** (which prohibits downstream packages from compiling or bundling independent `.css` files).

This architecture establishes `@nofinite/nuicss` as the single source of truth for all visual flag assets and styling rules, leaving `@nofinite/locale` focused strictly on country metadata, dial codes, currency formats, and translation catalogs.

---

## 2. Architectural Pillars

### 2.1 The Zero Downstream CSS Invariant

- **Rule:** Downstream packages (`@nofinite/locale`, `@nofinite/nui`, `@nofinite/charts`, etc.) author zero `.css` or `.scss` files.
- **Integration:** `@nofinite/nuicss` owns and packages `dist/flags.css`, `dist/flags.min.css`, and the underlying SVG assets in `dist/flags/4x3/` and `dist/flags/1x1/`.
- **Locale Shim:** `@nofinite/locale/dist/style.css` is an import shim that points to `@import '@nofinite/nuicss/flags.css';`, maintaining 100% backward compatibility for existing consumers.

### 2.2 On-Demand Micro-Downloads (Zero Bundle Bloat)

- Unlike inline base64 stylesheets (which would penalize every user with ~2.2 MB of render-blocking CSS), NUICSS country classes reference individual SVG files on disk:
  ```css
  .flag-in {
    background-image: url('./flags/4x3/in.svg');
  }
  ```
- Browsers evaluate DOM selectors and trigger network requests **only** for the flags actually rendered on the active page.
- Initial page payload for unused flags: **0 bytes**.
- A webpage rendering 2 flags (e.g. US and IN in a contact selector) fetches only ~2.5 kB of optimized vector data.

### 2.3 Standalone DX & Hybrid Selector Model

Developers can write standalone classes without mandatory wrapper scaffolding:

```html
<span class="flag-in" aria-hidden="true"></span>
<span class="flag-us" aria-hidden="true"></span>
<span class="flag-gb" aria-hidden="true"></span>
```

The CSS rule is scoped to `@layer components`:

```css
@layer components {
  .flag,
  .nui-flag,
  .nf-flag,
  [class^='flag-'],
  [class*=' flag-'],
  [class^='nui-flag-'],
  [class*=' nui-flag-'],
  [class^='nf-flag-'],
  [class*=' nf-flag-'] {
    display: inline-block;
    width: var(
      --nf-flag-width,
      calc(var(--nf-flag-height, 1em) * var(--nf-flag-ratio, 4 / 3))
    );
    height: var(--nf-flag-height, 1em);
    line-height: 1em;
    vertical-align: var(--nf-flag-vertical-align, -0.125em);
    background-size: var(--nf-flag-size, cover);
    background-position: center;
    background-repeat: no-repeat;
    border-radius: var(--nf-flag-radius, var(--radius-xs, 2px));
    box-shadow: var(--nf-flag-shadow);
    box-sizing: border-box;
    flex-shrink: 0;
    position: relative;
    overflow: hidden;
  }
}
```

---

## 3. Design Tokens & Sizing Contracts

| Token                      | Default Value                      | Purpose                                                                     |
| :------------------------- | :--------------------------------- | :-------------------------------------------------------------------------- |
| `--nf-flag-height`         | `1em`                              | Fluid scaling coupled to text font-size (`text-sm`, `text-lg`, `text-3xl`). |
| `--nf-flag-ratio`          | `calc(4 / 3)`                      | Natural aspect ratio of web flag iconography.                               |
| `--nf-flag-width`          | `calc(height * ratio)`             | Automatically computed horizontal dimension.                                |
| `--nf-flag-vertical-align` | `-0.125em`                         | Optical centering relative to font baseline (~2px descent at 16px).         |
| `--nf-flag-radius`         | `var(--radius-xs, 2px)`            | Subtle rounding for modern UI surfaces.                                     |
| `--nf-flag-shadow`         | `inset 0 0 0 1px rgba(0,0,0,0.08)` | Prevents white flag border bleed on light backgrounds.                      |

---

## 4. Aspect Ratio Modifiers

1. **Standard 4:3 (Default):**
   - Natural presentation preserving emblem proportions.
   - Triggered by default on `.flag-{code}` or explicitly via `.flag-4x3`.
2. **Square 1:1 (`.flag-square`, `.square`, `.flag-1x1`):**
   - Sets `--nf-flag-ratio: 1` and switches background to `./flags/1x1/{code}.svg`.
   - Uses pre-cropped SVGs where coats of arms and stars are optically centered rather than clipped.
3. **Circular Avatar (`.flag-circle`, `.circle`):**
   - Sets `--nf-flag-ratio: 1` and `--nf-flag-radius: var(--radius-full, 9999px)`.
   - Ideal for circular user profiles and navigation pills.

---

## 5. UnoCSS JIT Preset Integration

In `packages/nuicss/src/plugin/preset.ts`, an on-demand component rule is registered:

```typescript
[
  /^(?:nui-|nf-)?flag(?:-[a-z0-9-]+)?$/,
  () => flagsCss,
  { layer: 'components' },
];
```

When a consumer project processes markup containing any flag class, UnoCSS injects the complete flag component layer automatically without requiring manual stylesheet imports.
