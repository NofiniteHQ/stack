# Implementation Plan: Root-Cause Remediation of Markon UI Flaws & Typography Architecture

## 1. Objective

Resolve the visual flaws and subtle styling bugs revealed in the user's forensic screenshots (`media_1790852807574.png` and `media_1790852833499.png`):

1. **Slash Command Menu Overlap & Bleeding (`media_1790852807574.png`):** Transparent container, missing solid card backdrop, unstyled browser scrollbar clipping items, overlapping editor footer.
2. **Bubble Menu Floating Detachment & Missing Background (`media_1790852833499.png`):** Buttons (`P H1 H2 H3 "`) floating detached on the far left page margin while mark buttons (`B I U S H </> 🔗`) float bare on the canvas with zero container pill, border, or glassmorphic background.
3. **Editor Typography Void:** Heading nodes (`h1`, `h2`, `h3`) rendered flat and unformatted inside `.ProseMirror` due to CSS resets wiping heading styles in the absence of a dedicated Markon stylesheet.
4. **Architectural Isolation:** Provide a self-contained, auto-injected Markon stylesheet and export a standalone `dist/markon.css` so Markon functions 100% reliably out of the box in ANY environment (Vanilla DOM, React, Next.js, Storybook) strictly consuming `@nofinite/nuicss` design tokens.

---

## 2. Root Cause Analysis: Why UI Flaws Emerged After Migrating From React to Framework-Agnostic

### A. The CSS Extraction Void (Runtime DOM vs. Build-Time Static Analysis)

- In the React era, components were styled with JSX classes and CSS Modules that Next.js or Vite scanned at build time.
- When migrating to framework-agnostic Vanilla DOM (`document.createElement('div')`, `innerHTML = '...'`), class names exist solely as dynamic JavaScript string literals (`'markon-bubble-menu dropdown-menu flex items-center select-none font-sans'`).
- Unless a compiler is specifically configured to scan those string literals, **no CSS rules are emitted for them**. In Storybook and standalone consumers, UnoCSS only scanned `packages/nui/src` and `packages/nui/.storybook`, leaving Markon's runtime classes completely uncompiled.

### B. The Missing Self-Contained Stylesheet Contract

- Industry-standard framework-agnostic editors (Monaco, TipTap, Quill, Lexical) NEVER rely on the host application to happen to have utility classes like `border-default`, `shadow-xl`, or `p-1`.
- Markon had zero `.css` files. It was naked DOM relying on optimistic utility classes that didn't exist at runtime.
- Because `menuEl` and `popupEl` lacked inline fallback tokens or an injected stylesheet:
  - `popupEl` in `slashCommand.ts` had no background color, border, or box-shadow, rendering 100% transparent.
  - `menuEl` in `bubbleMenu.ts` had no background color, border, or box-shadow.

### C. The Illusion of "Detached" Bubble Menu Buttons (Screenshot 2 Breakdown)

- In `media_1790852833499.png`, the user selected text inside a callout near the left edge.
- `menuEl` was positioned by Floating UI with `width: max-content` centered over the selection, placing its left edge at `x ≈ 25px` (outside the editor margin).
- Because `menuEl` had **zero background, zero border, and zero shadow**, the container pill was 100% invisible!
- The author only saw text glyphs: `P H1 H2 H3 "` on the page background outside the editor, and `B I U S H` inside the editor, creating the appearance of two broken, detached floating menus when it was actually a single invisible container.

### D. CSS Preflight / Reset Typography Elimination

- TipTap and ProseMirror intentionally do NOT style headings. They only emit semantic HTML: `<h1>...</h1>`, `<h2>...</h2>`.
- Modern web setups (Tailwind, UnoCSS, Preflight, modern-normalize) include:
  ```css
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-size: inherit;
    font-weight: inherit;
    margin: 0;
  }
  ```
- Without an explicit `.markon-editor .ProseMirror h1 { font-size: 2.25rem; font-weight: 800; ... }` stylesheet rule, all headings in `.ProseMirror` are stripped of size, weight, and spacing, rendering indistinguishable from body text.

---

## 3. Proposed Remediation Plan

### Step 1: Self-Contained Core Stylesheet & Auto-Injector

**Files:**

- Create `packages/markon/src/styles/markon.css`
- Edit `packages/markon/src/core/MarkonEditor.ts`
- Edit `packages/markon/src/index.ts`
- Edit `packages/markon/package.json`

**Changes:**

1. Define comprehensive, token-anchored CSS for:
   - `.markon-editor`: border, focus-within ring, surface styling.
   - `.markon-editor .ProseMirror`:
     - `h1`: `font-size: var(--text-3xl, 1.875rem); font-weight: var(--weight-bold, 700); line-height: 1.25; margin: 1.25rem 0 0.5rem; color: var(--fg-default);`
     - `h2`: `font-size: var(--text-2xl, 1.5rem); font-weight: var(--weight-bold, 700); line-height: 1.3; margin: 1rem 0 0.5rem; color: var(--fg-default);`
     - `h3`: `font-size: var(--text-xl, 1.25rem); font-weight: var(--weight-semibold, 600); line-height: 1.4; margin: 0.75rem 0 0.25rem; color: var(--fg-default);`
     - `p`: `font-size: var(--text-base, 1rem); line-height: 1.625; margin: 0.5rem 0; color: var(--fg-default);`
     - `blockquote`: `border-left: 3px solid var(--color-primary); padding-left: 1rem; margin: 0.75rem 0; font-style: italic; color: var(--fg-muted);`
     - `code`: `font-family: var(--font-mono); font-size: 0.875em; background: var(--bg-subtle); padding: 0.15em 0.35em; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);`
     - `pre`: `background: var(--bg-inset, #090d16); color: var(--fg-default); padding: 1rem; border-radius: var(--radius-lg); font-family: var(--font-mono);`
     - `table`: `border-collapse: collapse; width: 100%; margin: 1rem 0;`
     - `th, td`: `border: 1px solid var(--border-default); padding: 0.5rem 0.75rem;`
     - `th`: `background: var(--bg-subtle); font-weight: var(--weight-semibold, 600);`
   - `.markon-bubble-menu`:
     - Opaque glassmorphic pill: `background: var(--bg-surface); border: 1px solid var(--border-default); border-radius: var(--radius-xl, 0.75rem); box-shadow: var(--shadow-xl); backdrop-filter: blur(8px);`
     - Block switcher divider: `display: inline-flex; align-items: center; gap: 2px; padding-right: 4px; margin-right: 4px; border-right: 1px solid var(--border-default);`
     - Button sizing, ghost states, active states (`.btn-active: color: var(--color-primary); background: var(--color-primary-subtle);`).
   - `.markon-slash-menu`:
     - Opaque dropdown card: `background: var(--bg-surface); border: 1px solid var(--border-default); border-radius: var(--radius-xl, 0.75rem); box-shadow: var(--shadow-xl); backdrop-filter: blur(8px);`
     - High z-index (`z-index: 9999;`).
     - Sleek custom scrollbars:
       ```css
       .markon-slash-menu::-webkit-scrollbar {
         width: 4px;
       }
       .markon-slash-menu::-webkit-scrollbar-track {
         background: transparent;
       }
       .markon-slash-menu::-webkit-scrollbar-thumb {
         background: var(--border-strong, #94a3b8);
         border-radius: 9999px;
       }
       ```
     - Item selection & hover states: `background: var(--bg-subtle);`
2. Implement `ensureMarkonStyles()` in `MarkonEditor.ts`:
   - Checks if `#markon-core-styles` exists; if not, creates a `<style id="markon-core-styles">` and injects the core rules at runtime.
   - Automatically executed whenever `renderMarkonEditor()` or `new MarkonEditor()` is invoked.
3. Export `dist/markon.css` in Vite build config and `package.json` exports (`"./styles.css": "./dist/markon.css"`).

### Step 2: Bubble Menu Defensive Hardening & Viewport Clamping

**Files:**

- Edit `packages/markon/src/core/bubbleMenu.ts`

**Changes:**

1. Explicit defensive inline styles on `menuEl` for zero-CSS environments:
   ```ts
   menuEl.style.backgroundColor = 'var(--bg-surface)';
   menuEl.style.border = '1px solid var(--border-default)';
   menuEl.style.borderRadius = 'var(--radius-xl, 0.75rem)';
   menuEl.style.boxShadow =
     'var(--shadow-xl, 0 20px 25px -5px rgba(0,0,0,0.15))';
   menuEl.style.backdropFilter = 'blur(8px)';
   menuEl.style.alignItems = 'center';
   menuEl.style.whiteSpace = 'nowrap';
   menuEl.setAttribute('data-state', 'open');
   ```
2. Wrap block buttons in an explicit `<div class="markon-bubble-block-group" style="display: inline-flex; align-items: center; gap: 2px; padding-right: 4px; margin-right: 4px; border-right: 1px solid var(--border-default);">`.
3. In `computePosition`, add viewport shift and boundary constraints (`shift({ padding: 12 })`) so the menu cannot overhang outside the viewport or editor window.

### Step 3: Slash Command Dropdown Hardening

**Files:**

- Edit `packages/markon/src/core/slashCommand.ts`

**Changes:**

1. Explicit defensive inline styles on `popupEl`:
   ```ts
   popupEl.style.backgroundColor = 'var(--bg-surface)';
   popupEl.style.border = '1px solid var(--border-default)';
   popupEl.style.borderRadius = 'var(--radius-xl, 0.75rem)';
   popupEl.style.boxShadow =
     'var(--shadow-xl, 0 20px 25px -5px rgba(0,0,0,0.15))';
   popupEl.style.backdropFilter = 'blur(8px)';
   popupEl.style.scrollbarWidth = 'thin';
   ```
2. Prevent overlap with editor footer by computing max height dynamically relative to viewport bottom.
3. Enhance item styling with crisp contrast for titles (`var(--fg-default)`) and descriptions (`var(--fg-muted)`).

### Step 4: Storybook Content Configuration Update

**Files:**

- Edit `packages/nui/nuicss.config.ts`

**Changes:**

1. Expand UnoCSS scanner filesystem paths:
   ```ts
   filesystem: [
     'src/**/*.{js,ts,jsx,tsx}',
     '.storybook/**/*.{js,ts,jsx,tsx}',
     '../../markon/src/**/*.{js,ts,jsx,tsx}',
     '../../media/src/**/*.{js,ts,jsx,tsx}',
     '../../charts/src/**/*.{js,ts,jsx,tsx}',
     '../../kanban/src/**/*.{js,ts,jsx,tsx}',
   ];
   ```

---

## 4. Verification Strategy

1. **Vitest Unit & AST Tests:**
   - Run Vitest across `packages/markon` to verify all 37 tests continue to pass with zero regressions.
2. **Playwright Visual Verification (Mandatory Anti-"Green Test" Rule):**
   - Write a standalone Playwright visual test script in `temp/verify_markon_ui.ts`.
   - Mount `MarkonEditor`:
     - Type `# Heading 1` and `## Heading 2` to verify distinct font sizes and weights.
     - Type `/` to open Slash Command Menu. Capture screenshot into `temp/slash_command_opaque.png` to verify opaque background, border, shadow, and scrollbar.
     - Select text to open Bubble Menu. Capture screenshot into `temp/bubble_menu_pill.png` to verify unified glassmorphic pill container, inline block switcher, and zero detachment.
3. **Build & Package Verification:**
   - Execute `pnpm nx build markon`.
   - Run `npm pack --dry-run` in `packages/markon` to confirm compiled assets and declaration files.

---

## 5. Review & Git Commit Plan

- Verify `git diff` contains zero unintended changes, zero secrets, zero hardcoded hex colors.
- Commit cleanly in repository `d:\stack`:
  - `git -C d:\stack add <exact-files>`
  - `git -C d:\stack commit -m "fix(markon): root-cause self-contained styling, prose typography, and floating menu pill containers"`
