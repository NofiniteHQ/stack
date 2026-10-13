# Implementation Plan: Full Documentation Synchronization (Reflecting `oss-docs` into `stack/docs`)

## Executive Summary

This plan replaces the placeholder single `README.md` files in `d:\stack\docs/` with the **complete, comprehensive documentation tree** reflecting the entire documentation suite from `d:\oss-docs`.

---

## 1. Problem Statement

Previously, `d:\stack\docs/` only contained high-level starter `README.md` files for each package. However, `d:\oss-docs` contains over 120 detailed markdown guides, API references, and component pages across:

- **NUI:** Full component catalog (Button, Modal, Dialog, Accordion, Table, CodeBlock, etc.) and getting-started guides.
- **NUICSS:** Architecture, theming, OKLCH tokens, superclasses, and utility references.
- **Nofinite Kanban:** Board architecture, event flows, WIP limits, search & filter engine, imperative handles, and keyboard navigation.
- **Nofinite Charts:** Installation, AreaChart, BarChart, LineChart, PieChart, ScatterChart, Legend, and Export guides.
- **Nofinite Media:** Installation, VideoPlayer, and AudioPlayer streaming guides.
- **Nofinite Markon:** Installation, editor setup, TipTap syntax, and bubble menu guides.
- **Nofinite Locale:** Installation, country lookup, and flag primitives.
- **Nofinite Utils:** Installation, JWT, OTP, password hashing, UUID, env, and Zeptomail utilities.

To satisfy the **Single Source of Truth** contract, `d:\stack\docs/` must contain the complete, authoritative documentation mirroring every route and topic in `d:\oss-docs`.

### Key Constraints & Rules:

1. **The Pure Markdown Invariant (Zero Live Components):**  
   All documentation in `d:\stack\docs/` must be 100% pure, clean GitHub-flavored Markdown (`.md`). Never include React JSX tags, `<Preview />`, `<ComponentPreview />`, or `<PackageHero />`. Only include markdown headings, explanations, code blocks (` ```tsx ... ``` `), tables, and lists.
2. **Current Implementation First (Upgrade Over Old Docs):**  
   Use `oss-docs` as a reference for structure and topics, but **upgrade every document to reflect the current, latest implementation in `packages/*`**:
   - Single `@nofinite/nuicss/styles.css` stylesheet setup (no obsolete secondary package stylesheets).
   - 16 standardized codeblock languages with categorized optgroups in Nofinite Markon and NUI.
   - Symmetrical typography selector in Nofinite Markon.
   - Pragmatic drag-and-drop architecture in Nofinite Kanban.
   - Clean D3 vector math and zero redundant stylesheets in Nofinite Charts.
   - NUICSS OKLCH token bridges in Nofinite Media.
   - Strict use of official brand names (**NUICSS**, **NUI**, **Nofinite Charts**, **Nofinite Kanban**, **Nofinite Markon**, **Nofinite Media**, **Nofinite Locale**, **Nofinite Utils**).

---

## 2. Proposed Architecture & Directory Structure

```
d:\stack\docs/
├── architecture/
│   ├── 001-unified-nuicss-engine.md
│   └── 002-package-boundaries-and-subpaths.md
│
├── kanban/
│   ├── index.md             <-- Overview, interactive concepts, why Kanban
│   ├── installation.md      <-- Package installation & NUICSS import
│   ├── board.md             <-- Column data model, drag events, reordering
│   └── features.md          <-- WIP limits, search/filter, imperative handle
│
├── charts/
│   ├── index.md             <-- Overview & D3 vector engine concepts
│   ├── installation.md      <-- Installation & theme setup
│   ├── area-chart.md        <-- Interpolated spline & stepped area
│   ├── bar-chart.md         <-- Single & stacked bars
│   ├── line-chart.md        <-- Multi-series line charts
│   ├── pie-chart.md         <-- Pie & donut charts
│   ├── scatter-chart.md     <-- Scatter plot coordinate rendering
│   ├── legend.md            <-- Interactive series legends & toggles
│   └── export.md            <-- PNG / SVG canvas export
│
├── media/
│   ├── index.md             <-- Overview & W3C Custom Element engine
│   ├── installation.md      <-- Installation & player setup
│   ├── video-player.md      <-- HLS/DASH streaming video player
│   └── audio-player.md      <-- Audio track playback & waveform
│
├── markon/
│   ├── index.md             <-- Overview & TipTap architecture
│   ├── getting-started/
│   │   ├── installation.md  <-- npm / pnpm install
│   │   ├── setup.md         <-- Editor provider setup
│   │   └── cdn.md           <-- Standalone script setup
│   └── usage/
│       └── markon-syntax.md <-- Rich text, codeblocks & tables
│
├── locale/
│   ├── index.md             <-- Overview & native Intl runtime
│   ├── getting-started/
│   │   ├── installation.md  <-- Package install
│   │   └── cdn.md           <-- CDN quickstart
│   └── usage/
│       ├── country-lookup.md<-- ISO country code resolver
│       └── flags.md         <-- Localized emoji & SVG flags
│
├── utils/
│   ├── index.md             <-- Overview & micro-weight utilities
│   ├── getting-started/
│   │   └── installation.md
│   └── components/
│       ├── env.md           <-- Type-safe env validation
│       ├── jwt.md           <-- HMAC-SHA256 JWT tokens
│       ├── otp.md           <-- TOTP / HOTP generator
│       ├── password.md      <-- Scrypt password hashing
│       ├── uuid.md          <-- Fast v4 / v7 UUID generation
│       └── zeptomail.md     <-- Transactional email client
│
├── nuicss/
│   ├── index.md             <-- Styling engine overview
│   ├── architecture.md      <-- Token layers & zero-runtime compilation
│   ├── installation.md      <-- CLI & package install
│   ├── theming.md           <-- OKLCH color palettes & dark mode
│   ├── superclasses.md      <-- Pre-engineered component superclasses
│   ├── ide-setup.md         <-- VS Code / Cursor customData autocomplete
│   └── migration.md         <-- Tailwind-to-NUICSS migration guide
│
└── nui/
    ├── index.md             <-- Core component overview & polymorphic design
    ├── getting-started/
    │   ├── installation.md
    │   ├── setup.md
    │   ├── themetokens.md
    │   └── customtheme.md
    └── components/          <-- Full component library (40+ components)
        ├── accordion.md, alert.md, avatar.md, badge.md, breadcrumbs.md
        ├── button.md, card.md, checkbox.md, chip.md, combobox.md
        ├── commandpalette.md, contextmenu.md, datagrid.md, datepicker.md
        ├── dialog.md, drawer.md, dropdown.md, fileuploader.md, hovercard.md
        ├── input.md, modal.md, pagination.md, popover.md, progress.md
        ├── radiogroup.md, select.md, skeleton.md, slider.md, spinner.md
        ├── switch.md, table.md, tabs.md, textarea.md, toast.md, tooltip.md
        └── ...
```

---

## 3. Phased Execution Steps

### Phase 1: Mirror `kanban`, `charts`, and `media` Documentation

1. Migrate the complete documentation pages from `d:\oss-docs\src\app\kanban/**/*.mdx` into clean, standard Markdown in `d:\stack\docs\kanban/` (`index.md`, `installation.md`, `board.md`, `features.md`).
2. Migrate all 9 chart documentation pages from `d:\oss-docs\src\app\charts/**/*.mdx` into `d:\stack\docs\charts/` (`index.md`, `installation.md`, `area-chart.md`, `bar-chart.md`, `line-chart.md`, `pie-chart.md`, `scatter-chart.md`, `legend.md`, `export.md`).
3. Migrate all media player documentation pages from `d:\oss-docs\src\app\media/**/*.mdx` into `d:\stack\docs\media/` (`index.md`, `installation.md`, `video-player.md`, `audio-player.md`).

### Phase 2: Mirror `markon`, `locale`, `utils`, and `nuicss`

1. Replicate full guides and references from `d:\oss-docs\docs/` into `d:\stack\docs/`:
   - `d:\stack\docs\markon/` (getting-started, usage guides)
   - `d:\stack\docs\locale/` (country-lookup, flags, usage)
   - `d:\stack\docs\utils/` (crypto, auth, tokens, env)
   - `d:\stack\docs\nuicss/` (architecture, theming, superclasses, ide-setup, migration)

### Phase 3: Mirror the Complete `nui` Component Library

1. Replicate the full 40+ component docs and getting-started guides from `d:\oss-docs\docs\nui/` into `d:\stack\docs\nui/`.

### Phase 4: Sync into `d:\oss-docs\docs/`

1. Ensure `d:\oss-docs\docs/` also contains the clean Markdown mirrors of `kanban`, `charts`, and `media` so both repositories share identical ground truth documentation.

---

## 4. Verification & Review Strategy

1. Verify that `d:\stack\docs/` contains the full directory tree and non-empty documentation files.
2. Verify that all Markdown files use clean GitHub-flavored Markdown without breaking build errors.
3. Create a local safety commit in `d:\stack` and `d:\oss-docs`.
