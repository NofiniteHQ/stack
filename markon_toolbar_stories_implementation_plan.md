# Implementation Plan: Markon Toolbar Icon Modernization & Comprehensive Storybook Variants

## 1. Objective

1. **Modernize and Unify Toolbar Icons:** Replace all text-based characters (`B`, `I`, `U`, `S`, `X₂`, `X²`, `</>`, `T⃠`, `Σ`, `A↕`, and `<text>`-rendered numbered lists) in `MarkonEditor` with clean, cohesive, 16x16 Lucide-style SVG vector icons and self-contained CSS rules, ensuring all toolbar buttons have consistent 30x30px dimensions, crisp strokes, and responsive active/hover states.
2. **Comprehensive Storybook Variant Expansion:** Greatly expand `packages/markon/src/react/MarkonEditor.stories.tsx` to showcase all supported features, modes, and publication layouts, logically categorized into Core Editor Modes, Feature Deep-Dives, Publication Layouts, and Dual-Surface Pipelines.

---

## 2. Current Problems & Root Causes

### A. Toolbar Icon Inconsistencies & Deficiencies (`packages/markon/src/core/MarkonEditor.ts`)

- **Mixed Glyph Fallbacks:** Basic formatting buttons (Bold, Italic, Underline, Strikethrough, Subscript, Superscript, Inline Code, Clear Formatting, Math Formula, Font Size) currently render as raw HTML `<span>` text elements (`B`, `I`, `U`, `S`, `X₂`, `X²`, `</>`, `T⃠`, `Σ`, `A↕`).
- **Broken / Glitchy Glyphs:** The clear formatting button uses `T⃠` (Unicode combining reverse solidus), which renders clipped, offset, or as a missing glyph box depending on host OS fonts.
- **Numbered List SVG `<text>` Tags:** The ordered list SVG embeds `<text x="2" y="7" font-size="7">1</text>`, causing blurred, clipped, and unaligned numbers across different browser rendering engines.
- **Missing Button & Icon CSS Sizing:** Neither `markon.css` nor `styleInjector.ts` defines explicit dimensions or layout constraints for `.editor-btn` or `.editor-btn svg`. As a result, text-based buttons and SVG-based buttons have inconsistent widths, heights, and vertical alignments.

### B. Storybook Coverage Gaps (`packages/markon/src/react/MarkonEditor.stories.tsx`)

- Current stories only display a few basic examples (`Default`, `ControlledState`, `EmptyWithPlaceholder`, `HookUsage`, `ReadOnly`, and basic publication layouts).
- Advanced capabilities are unrepresented or hidden:
  - Interactive table management (adding/removing rows, columns, headers, table menus).
  - Multi-language syntax-highlighted code blocks with language badges and copy actions.
  - All 5 callout variants (`info`, `warning`, `danger`, `success`, `tip`).
  - Math formula editing (LaTeX display & inline formulas, fractions, matrices).
  - Video embeds (YouTube, Vimeo, MP4), captioned images, and file attachment cards.
  - Interactive task lists with check/uncheck states.
  - Compact / Minimal editor mode (for comments, chat, or constrained containers).

---

## 3. Phase-Wise Implementation Roadmap

### Phase 1: Vector Icon Modernization (`packages/markon/src/core/MarkonEditor.ts`)

- Replace every text fallback with a precision Lucide-style SVG:
  - **Bold:** Clean dual-loop vector 'B' path.
  - **Italic:** Slanted vector 'I' line path.
  - **Underline:** Clean 'U' path with baseline underline.
  - **Strikethrough:** Vector 'S' path with horizontal strikethrough.
  - **Subscript:** Vector 'X' with crisp subscript '2' path.
  - **Superscript:** Vector 'X' with crisp superscript '2' path.
  - **Inline Code:** Clean `< />` brackets vector path.
  - **Clear Formatting:** Capital 'T' with eraser / diagonal strikethrough.
  - **Math (LaTeX):** Vector uppercase Greek Sigma `Σ` formula path.
  - **Font Size:** Dual-T / typography scale vector path.
  - **Numbered List:** Vector lines with clean path-based numerals (no `<text>` elements).
  - **Text Color & Highlight:** Clean pen / palette vector icons.

### Phase 2: Self-Contained Toolbar Styling (`markon.css` & `styleInjector.ts`)

- Add comprehensive styling for `.markon-editor .editor-toolbar`:
  - Uniform `.editor-btn`: `width: 30px; height: 30px; min-width: 30px; min-height: 30px; display: inline-flex; align-items: center; justify-content: center; padding: 0; border-radius: var(--radius-md, 0.375rem);`.
  - Strict SVG sizing: `width: 15px; height: 15px; stroke: currentColor; stroke-width: 2; fill: none; flex-shrink: 0;`.
  - Typography dropdown: `height: 30px; padding: 0 8px; gap: 6px; font-size: 0.75rem;`.
  - Divider lines: `width: 1px; height: 18px; background-color: var(--border-default); margin: 0 4px;`.
  - Active button states: Semantic accent color tint `color-mix(in oklab, var(--color-primary) 15%, transparent)` with `var(--color-primary)` text.
  - Mirror all styles in both `packages/markon/src/styles/markon.css` and `packages/markon/src/core/styleInjector.ts`.

### Phase 3: Comprehensive Storybook Stories (`MarkonEditor.stories.tsx`)

Expand and organize stories into 4 intuitive categories:

- **Category 1: Core Editor Modes**
  - `FullFeatured`: Full document editing surface with complete toolset.
  - `CompactMinimal`: Streamlined editor for comments, notes, or chat inputs.
  - `ControlledState`: Real-time reactive two-way binding demo with parent state inspector.
  - `ReadOnly`: Non-editable canvas with disabled toolbar.
  - `EmptyPlaceholder`: Clean initial state with slash-command discoverability hints.
- **Category 2: Specialized Feature Deep-Dives**
  - `TablesAndDataGrid`: Pre-populated multi-column data table demonstrating table bubble menus and column/row manipulation.
  - `MathAndFormulas`: LaTeX math formulas showing fractions, integrals, and matrices.
  - `CodeAndSyntax`: Multi-language code snippets (TypeScript, Python, Rust, SQL, Bash) with copy functionality.
  - `CalloutsAndAlerts`: All 5 alert variants (`info`, `warning`, `danger`, `success`, `tip`).
  - `MediaAndEmbeds`: Responsive YouTube/Vimeo video embeds, captioned images, and file attachments.
  - `ListsAndTaskManagement`: Bullet lists, numbered lists, and interactive task check-lists.
- **Category 3: Publication Engine (`MarkonRender`)**
  - `PublicationArticle`: Article layout with cover image, author byline, sticky TOC, reading time.
  - `PublicationDocument`: Technical documentation layout with category kicker and TOC.
  - `PublicationNewsroom`: Press release layout with bold headline and dateline.
  - `PublicationStandalone`: Clean content-only layout without headers.
- **Category 4: Interactive Workflows**
  - `LiveDualSurfacePipeline`: Side-by-side split screen (Editor on left, Live Render on right).
  - `HeadlessHookAPI`: Headless integration using `useMarkon()`.

### Phase 4: Visual Validation & Regression Verification

- Capture high-resolution Playwright screenshots of the modernized toolbar in Light and Dark modes.
- Verify visual aesthetics via `view_file`.
- Run full Vitest suite (`pnpm --filter @nofinite/markon test`).
- Run package build (`pnpm --filter @nofinite/markon build`).

### Phase 5: Atomic Git Commit & Sign-Off

- Stage only `@nofinite/markon` files and this implementation plan.
- Create an atomic commit following conventional commits.

---

## 4. Affected Files

- [`packages/markon/src/core/MarkonEditor.ts`](file:///d:/stack/packages/markon/src/core/MarkonEditor.ts)
- [`packages/markon/src/styles/markon.css`](file:///d:/stack/packages/markon/src/styles/markon.css)
- [`packages/markon/src/core/styleInjector.ts`](file:///d:/stack/packages/markon/src/core/styleInjector.ts)
- [`packages/markon/src/react/MarkonEditor.stories.tsx`](file:///d:/stack/packages/markon/src/react/MarkonEditor.stories.tsx)
