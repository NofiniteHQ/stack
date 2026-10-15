# Implementation Plan: Phased Documentation & Limelight Showcase Suite

## 1. Objective

Deliver a comprehensive, production-grade documentation expansion across the four core domain packages (**Nofinite Markon**, **Nofinite Kanban**, **Nofinite Charts**, and **Nofinite Media**). The work is structured into **four distinct sequential phases**, executed one by one with extreme depth, zero rush, and rigorous verification at each milestone.

### Core Architectural Invariants

1. **The Pure Markdown Invariant:** 100% valid GitHub-Flavored Markdown (`.md`). Absolutely ZERO live JSX component tags (no `<Preview />`, `<ComponentPreview />`, or `<PackageHero />`).
2. **The Zero Downstream CSS Invariant:** All code examples strictly import only the unified styling engine: `import '@nofinite/nuicss/styles.css'`.
3. **Official Brand Taxonomy:** Strictly use official brand names: **NUICSS**, **NUI**, **Nofinite Charts**, **Nofinite Kanban**, **Nofinite Markon**, and **Nofinite Media**.
4. **Cross-Repo Docs Parity:** Canonical documentation created in `d:\stack\docs/` and mirrored identically to `d:\oss-docs\docs/`.
5. **Two-Tier Safety Protocol:** Dedicated verification and local git commits at the conclusion of each phase.

---

## 2. Phased Execution Roadmap

```
PHASE 1: Nofinite Markon & The Renderer Limelight (8 files + index)
   ↓ (Verify & Commit)
PHASE 2: Nofinite Kanban Advanced Suite (5 files + index)
   ↓ (Verify & Commit)
PHASE 3: Nofinite Charts Multi-Series & Theming (6 files + index)
   ↓ (Verify & Commit)
PHASE 4: Nofinite Media Streaming & Headless Suite (6 files + index)
   ↓ (Verify & Final Parity Check)
```

---

## 3. Phase Breakdown & Scope

### Phase 1: Nofinite Markon & The Renderer Limelight (Immediate Focus)

**Goal:** Put Markon's publication renderer (`MarkonRender` and core `renderMarkon`) in the limelight, and document all advanced editor capabilities with complete API references and enterprise examples.

1. **`docs/markon/renderer.md` (The Premier Publication Showcase):**
   - **Architectural Overview:** Isomorphic AST-to-HTML publication engine. Zero DOM dependencies, enabling execution in Next.js Server Components (SSR), Edge workers, or Node.js scripts.
   - **The 4 Built-In Layout Modes:**
     - `'article'`: Magazine/editorial layout with responsive hero cover image, author byline (avatar, title, URL), reading time badge, tags, and sticky auto-scrolling Table of Contents.
     - `'document'`: Technical documentation layout with breadcrumbs, last-modified timestamp, and sidebar TOC with active scrollspy.
     - `'newsroom'`: Press release layout with bold kicker badge, headline, and dateline.
     - `'minimal'`: Bare prose container for comments, modals, and embeds.
   - **Format Agnosticism:** Automatic format detection and parsing for TipTap `JSONContent`, HTML strings, and Markdown strings.
   - **Metadata Schema:** Complete reference for `MarkonMetadata` (`title`, `subtitle`, `description`, `cover`, `author`, `publishedAt`, `readingTime`, `tags`, `category`, `badge`).
   - **Pre-rendered KaTeX:** Server-side math formula rendering with zero client-side KaTeX JS overhead.
   - **Code Highlighting & Copy Buttons:** Lowlight syntax highlighting across 16 languages with built-in clipboard copy handlers.
   - **Client Hydration:** `MarkonRenderer.mount(container)` for zero-framework copy buttons and smooth anchor scrolling.
   - **React Component `<MarkonRender />`:** Full TypeScript props table, callbacks (`onRendered` returning `{ html, toc, readingTimeMinutes, wordCount }`), and SSR integration.
2. **`docs/markon/slash-commands.md`:** Command menu keyboard triggers (`/`), item registration, custom command items.
3. **`docs/markon/block-handles.md`:** Drag handle grips, block reordering, and hover controls.
4. **`docs/markon/tables-and-grids.md`:** Interactive table editing, row/column insertion, cell merging, context menus.
5. **`docs/markon/callouts-and-details.md`:** Alert callouts in 4 semantic variants (`info`, `success`, `warning`, `danger`) and collapsible `<details>` accordions.
6. **`docs/markon/media-and-uploads.md`:** Image resizing, captions, video embeds, and file upload handlers.
7. **`docs/markon/draft-management.md`:** Autosaving with `DraftManager`, localStorage/IndexedDB persistence, and conflict recovery.
8. **`docs/markon/examples.md`:** 4 copy-paste production implementations (Engineering Blog with Hero & TOC, Technical API Handbook, Editorial Press Release, Next.js App Router Server Component post).
9. **Update `docs/markon/index.md`:** Comprehensive table of contents and documentation map.
10. **Parity Sync & Commit:** Mirror to `d:\oss-docs\docs/markon/` and create Phase 1 git commits in both repos.

---

### Phase 2: Nofinite Kanban Advanced Suite

**Goal:** Expand Kanban documentation beyond basic setup to cover custom slots, enterprise validation rules, imperative control, and vanilla DOM usage.

1. **`docs/kanban/customization.md`:** Custom card rendering via `renderCard(item, columnId)` slot, custom column header via `renderHeader(column)` slot, priority badges, assignees, subtask progress.
2. **`docs/kanban/permissions-and-validation.md`:** WIP limits enforcement (`enforceWipLimit: true`), movement validation rules (`canMoveCard: (event) => boolean`), role-based drag-and-drop restrictions.
3. **`docs/kanban/imperative-api.md`:** Controlling the board programmatically via `ref={kanbanRef}` (`KanbanHandle`: `moveCard`, `addCard`, `updateCard`, `removeCard`, `addColumn`, `removeColumn`, `clearColumn`, `focusCard`, `setFilter`, `getFilter`, `getColumns`).
4. **`docs/kanban/vanilla-core.md`:** Using the framework-agnostic `KanbanBoard` class with vanilla JavaScript/TypeScript and DOM containers.
5. **`docs/kanban/examples.md`:** 3 enterprise copy-paste examples: Agile Sprint Board with WIP Limits, Support Ticket Triage Board with validation, Live Search & Multi-Filter board.
6. **Update `docs/kanban/index.md`:** Refresh navigation links.
7. **Parity Sync & Commit:** Mirror to `d:\oss-docs\docs/kanban/` and commit Phase 2.

---

### Phase 3: Nofinite Charts Multi-Series & Theming

**Goal:** Provide deep architectural documentation on multi-series charts, sparklines, frosted glass theming, screen reader accessibility, and high-frequency algorithms.

1. **`docs/charts/multi-series.md`:** Multi-series area charts with overlapping gradients, grouped/stacked bar charts, and multi-scatter plots on shared scales.
2. **`docs/charts/sparklines.md`:** Standalone `<Sparkline />` component for KPI cards, table rows, and metrics summaries.
3. **`docs/charts/theming.md`:** NUICSS OKLCH design token integration, frosted glass popovers (`backdrop-blur-xl`, specular hairline reflections, tabular numbers), dark/light mode switching.
4. **`docs/charts/accessibility.md`:** Accessible SVG markup, automated W3C data table generation (`generateA11yTable`), and keyboard navigation.
5. **`docs/charts/vanilla-core.md`:** Direct D3 vector math (`calculateAreaPath`, `calculateBarLayout`), and Largest Triangle Three Buckets (`downsampleLTTB`) downsampling for 100k+ points.
6. **`docs/charts/examples.md`:** Executive SaaS Revenue & Churn Dashboard, Financial KPI Summary Grid, High-Density Telemetry Monitor.
7. **Update `docs/charts/index.md`:** Refresh navigation links.
8. **Parity Sync & Commit:** Mirror to `d:\oss-docs\docs/charts/` and commit Phase 3.

---

### Phase 4: Nofinite Media Streaming & Headless Suite

**Goal:** Document advanced adaptive streaming (HLS/DASH), multi-language captions, interactive scrubbers, custom headless layouts, and reactive hooks.

1. **`docs/media/streaming-and-hls.md`:** Adaptive Bitrate Streaming with HLS (`.m3u8`), auto-detection, quality level switching, live DVR streams.
2. **`docs/media/tracks-and-captions.md`:** Multi-language WebVTT subtitles, closed captions, chapters, and thumbnail scrubbers (`thumbnails="thumbnails.vtt"`).
3. **`docs/media/custom-layouts.md`:** Headless player architecture using `MediaPlayer`, `MediaProvider`, and custom UI controls.
4. **`docs/media/podcast-and-audio.md`:** Standalone `<AudioPlayer />` with podcast artwork, chapters, playback speeds, and Media Session API.
5. **`docs/media/react-hooks.md`:** Reactive state hooks: `useMediaState`, `useMediaRemote`, `useMediaPlayer`, `useActiveTextTrack`, `useVideoQualityOptions`, `useCaptionOptions`.
6. **`docs/media/examples.md`:** Production VOD Player with HLS & Scrubbing, Episode-Based Podcast Show, Floating PiP Widget.
7. **Update `docs/media/index.md`:** Refresh navigation links.
8. **Parity Sync & Commit:** Mirror to `d:\oss-docs\docs/media/` and commit Phase 4.

---

## 4. Verification Protocol (Run After Each Phase)

1. **Pure Markdown Invariant:** Execute regex scan confirming zero unescaped `<Preview />` or `<ComponentPreview />` JSX elements.
2. **Zero Downstream CSS Invariant:** Verify all code examples import exclusively `import '@nofinite/nuicss/styles.css'`.
3. **Brand Taxonomy Invariant:** Verify official brand names (**NUICSS**, **NUI**, **Nofinite Charts**, **Nofinite Kanban**, **Nofinite Markon**, **Nofinite Media**).
4. **Cross-Repo Parity:** Automated diff between `d:\stack\docs/<pkg>/` and `d:\oss-docs\docs/<pkg>/` confirming exact file and content match.
5. **Git Safety Checkpoint:** Local git commit in both `d:\stack` and `d:\oss-docs`.
