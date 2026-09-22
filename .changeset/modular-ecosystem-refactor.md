---
'@nofinite/nui': major
'@nofinite/markon': major
'@nofinite/charts': minor
'@nofinite/media': minor
'@nofinite/kanban': minor
---

### Architecture & Decoupled Packages

Extracted heavy, domain-specific enterprise modules out of `@nofinite/nui` into dedicated, framework-agnostic packages to achieve a featherweight core UI baseline.

- **`@nofinite/markon@2.0.0`:**

  - Complete universal rich text editing suite powered by TipTap 2, lowlight, and KaTeX math formulas.
  - Framework-agnostic DOM engine (`MarkonEditor`) and React adapter (`@nofinite/markon/react`).
  - Completely decouples 28 `@tiptap/*` packages, `katex`, and `tippy.js` from the core `@nofinite/nui` package.

- **`@nofinite/charts@1.0.0`:**

  - Universal vector data visualization suite powered by fine-grained D3 math algorithms (`d3-shape`, `d3-scale`, `d3-array`).
  - Native SVG path rendering with `curveMonotoneX` smoothing and 0ms CSS dark mode reactivity via `@nofinite/nuicss` tokens.
  - Framework-agnostic DOM class (`Chart`) and React adapters (`AreaChart`, `LineChart`, `BarChart`, `PieChart`, `DonutChart`, `ScatterChart`, `Sparkline`).
  - Decouples all 11 `@visx/*` packages from `@nofinite/nui`.

- **`@nofinite/media@1.0.0`:**

  - Universal audio and video streaming suite powered by W3C Custom Elements and Vidstack.
  - Support for HLS streaming (`.m3u8`), DASH (`.mpd`), MP4, WebM, MP3, WAV, and audio tracks.
  - Framework-agnostic DOM player factory (`createMediaPlayer`) and React adapters (`VideoPlayer`, `AudioPlayer`).
  - Decouples `@vidstack/react` and `vidstack` from `@nofinite/nui`.

- **`@nofinite/kanban@1.0.0`:**
  - Universal task board suite powered by Atlassian's Pragmatic Drag and Drop (`@atlaskit/pragmatic-drag-and-drop`).
  - Featherweight ~4.5 kB footprint with native pointer events, bi-directional card dragging across columns, and column reordering.
  - Framework-agnostic DOM binder (`createKanbanBoard`) and React adapter (`<Kanban>`).
  - Decouples `@hello-pangea/dnd` from `@nofinite/nui`.

### Core Bundle Reductions (`@nofinite/nui`)

- **Full Package Payload:** Reduced from 2,842.65 kB down to 558.30 kB minified (172.41 kB gzipped), an **80.4% reduction**.
- **Simple Application Footprint (Button, Badge, Card):** 32.99 kB minified / 10.70 kB gzipped.
- **Hoisted devDependencies:** Centralized monorepo build tools (`vitest-axe`, `@storybook/test-runner`, `valibot`, etc.) to root Nx workspace configuration.
- **Runtime Dependencies:** Streamlined from over 45 external dependencies down to 7 core primitives.
