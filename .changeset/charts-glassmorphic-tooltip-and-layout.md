---
'@nofinite/charts': patch
'@nofinite/nuicss': patch
---

Elevate charts styling to modern enterprise grade:

- Frosted glassmorphic tooltip card popovers (`bg-surface/80`, `backdrop-blur-xl`, `saturate-150`, specular hairline highlight, glowing series swatches, boundary guards preventing clipped headers).
- Zero-overflow legend layout with flex column container, `legendPosition="top" | "bottom"`, and adaptive plot height calculation (`plotHeight = height - 38`).
- Adaptive horizontal bar left margins (scaling dynamically up to 35% of chart width) with smart ellipsis truncation and full label `<title>` tooltips.
- Dynamic origin $(0, 0)$ and corner-clearing tick textAnchor alignment to eliminate overlapping text smudges.
