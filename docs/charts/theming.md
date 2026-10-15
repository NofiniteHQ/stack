# Theming and Glassmorphic Popovers

**Nofinite Charts** strictly adheres to the **Zero Downstream CSS Invariant**: it bundles no independent stylesheets. All colors, frosted glass surfaces, hairline reflections, and micro-typography are governed by **NUICSS** design tokens and superclasses.

This guarantees that every chart visual element automatically respects application theme switches, high-contrast settings, and OKLCH perceptual color palettes.

---

## The OKLCH Color Palette

Traditional sRGB color values suffer from non-uniform perceived brightness, causing yellow or cyan data series to overpower darker blues or violets.

In **NUICSS**, chart series map directly to perceptually uniform OKLCH design tokens:

```css
:root {
  /* Primary Series */
  --color-primary: oklch(0.62 0.24 255);
  /* Secondary Series */
  --color-info: oklch(0.65 0.18 220);
  /* Success / Positive Metric */
  --color-success: oklch(0.64 0.2 145);
  /* Warning / Caution */
  --color-warning: oklch(0.72 0.18 75);
  /* Danger / Deficit Metric */
  --color-danger: oklch(0.6 0.24 25);
}
```

When passing series colors in React, reference CSS variables directly:

```tsx
<LineChart
  data={data}
  xKey="date"
  series={[
    { key: 'primaryMetric', label: 'Primary', color: 'var(--color-primary)' },
    { key: 'benchmarkMetric', label: 'Benchmark', color: 'var(--color-muted)' },
  ]}
/>
```

---

## Frosted Glass Popover Card (`.chart-tooltip`)

Tooltips in **Nofinite Charts** render as modern, frosted glass popovers matching macOS / visionOS standards.

### Micro-Architecture

```
┌──────────────────────────────────────────────┐
│  OCTOBER 2026                      [Header]  │
├──────────────────────────────────────────────┤  ◄── Subtle Hairline Separator
│  ● US East (N. Virginia)         42,890 req  │
│  ● EU Central (Frankfurt)        31,240 req  │  ◄── font-mono tabular-nums
│  ● AP South (Mumbai)             18,120 req  │
└──────────────────────────────────────────────┘
  ▲
  └── Inset Specular Hairline (1px) + Layered Ambient Shadow
```

### NUICSS Superclasses Behind the Tooltip

- **`.chart-tooltip`:** `absolute pointer-events-none bg-surface/75 backdrop-blur-xl saturate-150 border border-white/10 dark:border-white/10 rounded-xl shadow-2xl px-3.5 py-2.5 text-xs text-default z-50`
- **`.chart-tooltip-title`:** `text-[11px] font-semibold text-muted tracking-wider uppercase pb-1.5 mb-1.5 border-b border-default/20 opacity-80`
- **`.chart-tooltip-swatch`:** `w-2 h-2 rounded-full ring-2 ring-current/25 shrink-0`
- **`.chart-tooltip-value`:** `font-semibold font-mono text-default tabular-nums ml-auto`

### Specular Hairline & Ambient Shadows

To create glass depth without flat opacity mud, **NUICSS** defines layered box shadows and specular highlights:

```css
/* Dark Mode */
.chart-tooltip {
  box-shadow: 0 16px 36px -6px oklch(0 0 0 / 0.35), inset 0 1px 0 0 oklch(1 0
          0 / 0.15);
}

/* Light Mode */
[data-theme='light'] .chart-tooltip,
.light .chart-tooltip {
  box-shadow: 0 12px 30px -4px oklch(0 0 0 / 0.12), inset 0 1px 0 0 oklch(1 0
          0 / 0.6);
}
```

---

## Area Chart Gradient Fills

Area charts render smooth vertical gradient fills that fade cleanly into the background surface:

```tsx
<AreaChart
  data={telemetryData}
  xKey="timestamp"
  yKey="bandwidth"
  color="var(--color-primary)"
  fillOpacity={0.25} // Smooth gradient fade
/>
```

Under the hood, SVG gradients use `color-mix(in oklab, ...)` to guarantee that translucent stops do not shift in hue as they approach zero opacity:

```xml
<linearGradient id="chart-area-grad" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0%" stop-color="var(--color-primary)" stop-opacity="0.3" />
  <stop offset="95%" stop-color="var(--color-primary)" stop-opacity="0.0" />
</linearGradient>
```

---

## Dark & Light Theme Switching

Because all visual elements utilize CSS variables, charts require **zero JavaScript re-renders or canvas redraws** when toggling dark mode:

```tsx
export function ThemeToggleButton() {
  const toggleTheme = () => {
    const isDark =
      document.documentElement.getAttribute('data-theme') === 'dark';
    document.documentElement.setAttribute(
      'data-theme',
      isDark ? 'light' : 'dark'
    );
  };

  return <button onClick={toggleTheme}>Toggle Theme</button>;
}
```

The moment `data-theme` changes, chart axes, grid lines, gradient fills, and frosted glass popovers immediately re-render at 60 FPS through the GPU compositor.
