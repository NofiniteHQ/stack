# Theming & Design Tokens

NUICSS features a modern, token-first design system built on **OKLCH perceptual color palettes** and CSS custom properties. It functions as the single source of truth for `@nofinite/nui` and `@nofinite/nuicss`.

---

## Why OKLCH?

Unlike legacy sRGB or HSL color spaces, **OKLCH (Oklab Lightness Chroma Hue)** is perceptually uniform. This means:

1. **Predictable Contrast:** A lightness value of `0.6` in green has the exact same perceived brightness as `0.6` in blue or red, preventing contrast violations when customizing brand palettes.
2. **Smooth Gradients:** Color interpolations stay vibrant and never pass through muddy grayish dead zones.
3. **Wide Gamut:** Supports display-P3 screens natively while providing safe fallbacks for legacy browsers.

---

## Semantic Color Tokens

NUICSS components and utility classes consume semantic variables that invert seamlessly between light and dark modes:

| Semantic Class   | CSS Variable            | Light Mode Role                         | Dark Mode Role                      |
| :--------------- | :---------------------- | :-------------------------------------- | :---------------------------------- |
| `bg-page`        | `var(--bg-page)`        | Canvas background (neutral-50)          | Dark canvas (neutral-950)           |
| `bg-surface`     | `var(--bg-surface)`     | Card and modal container (white)        | Elevated dark surface (neutral-900) |
| `bg-subtle`      | `var(--bg-subtle)`      | Hover highlights and secondary tiles    | Subtle dark tile (neutral-800)      |
| `bg-muted`       | `var(--bg-muted)`       | Inactive pills, disabled fills          | Muted dark background (neutral-800) |
| `text-default`   | `var(--fg-default)`     | High-contrast primary headings and body | Crisp white / light gray text       |
| `text-muted`     | `var(--fg-muted)`       | Secondary captions and helper notes     | Medium contrast text                |
| `border-default` | `var(--border-default)` | Structural boundaries and cards         | Subtle dark borders                 |
| `border-subtle`  | `var(--border-subtle)`  | Table cell dividers, secondary rules    | Low-contrast dark dividers          |

---

## Brand & Feedback Tokens

| Role        | Background   | Text Utility   | Border Utility   | Purpose                                  |
| :---------- | :----------- | :------------- | :--------------- | :--------------------------------------- |
| **Primary** | `bg-primary` | `text-primary` | `border-primary` | Main brand action and active states      |
| **Success** | `bg-success` | `text-success` | `border-success` | Confirmed operations, positive trends    |
| **Warning** | `bg-warning` | `text-warning` | `border-warning` | Non-blocking alerts, cautionary statuses |
| **Danger**  | `bg-danger`  | `text-danger`  | `border-danger`  | Destructive actions, system errors       |

---

## Data Visualization & Chart Tokens

All charts in `@nofinite/nui` automatically read these 5 sequential theme tokens for multi-series graphs:

| Token   | Variable         | Purpose                            |
| :------ | :--------------- | :--------------------------------- |
| Chart 1 | `var(--chart-1)` | Primary data series / brand stroke |
| Chart 2 | `var(--chart-2)` | Secondary series comparison        |
| Chart 3 | `var(--chart-3)` | Tertiary series                    |
| Chart 4 | `var(--chart-4)` | Fourth series metric               |
| Chart 5 | `var(--chart-5)` | Fifth series / auxiliary data      |

---

## Border Radius Scale

NUICSS standardizes curvature using geometric radius tokens:

| Utility Class  | CSS Variable         | Computed Value | Recommended Use                       |
| :------------- | :------------------- | :------------- | :------------------------------------ |
| `rounded-sm`   | `var(--radius-sm)`   | `4px`          | Small badges, tooltips, tags          |
| `rounded-md`   | `var(--radius-md)`   | `8px`          | Buttons, inputs, small cards          |
| `rounded-lg`   | `var(--radius-lg)`   | `12px`         | Standard cards, modal dialogs, menus  |
| `rounded-xl`   | `var(--radius-xl)`   | `16px`         | Hero feature sections, large callouts |
| `rounded-full` | `var(--radius-full)` | `9999px`       | Avatar circles, pill badges           |

---

## Dark Mode Implementation

NUICSS applies dark mode styles by toggling the `.dark` class on the root `<html>` element:

```html
<!-- Light Mode -->
<html class="light">
  <body class="bg-page text-default">
    ...
  </body>
</html>

<!-- Dark Mode -->
<html class="dark">
  <body class="bg-page text-default">
    ...
  </body>
</html>
```

Because all component superclasses (`btn`, `card`, `input`, `table`) use CSS variables for their fills and borders, toggling the root class instantly switches themes without requiring utility class duplication (e.g. `bg-white dark:bg-slate-900`).

---

## Customizing Your Theme

To override any token globally, simply redefine the CSS variable in your stylesheet:

```css
/* app/globals.css */
:root {
  /* Customize brand primary to a custom violet OKLCH color */
  --brand-primary: oklch(0.55 0.22 280);
  --color-primary: var(--brand-primary);

  /* Make standard card corners sharper */
  --radius-lg: 6px;
}
```

> [!TIP]
> Use the [**Theme Studio**](/nuicss/theme-studio) to visually customize palettes, test contrast ratios, and export ready-to-use CSS configurations.
