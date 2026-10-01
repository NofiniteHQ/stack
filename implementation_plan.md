# Implementation Plan: `@nofinite/media` Complete Production-Grade & Framework-Agnostic Overhaul

## 1. Objective

Refactor and elevate `@nofinite/media` into an enterprise-grade, framework-agnostic audio/video streaming media suite powered by Vidstack and strictly adhering to `@nofinite/nuicss` design tokens and standards. Eliminate all regressions, phantom CSS exports, React bundle pollution on the main entrypoint, and unstyled DOM wireframes, while exposing a complete production-grade streaming feature set (HLS/DASH, tracks/captions, VTT scrubbing thumbnails, adaptive bitrate quality switching, event hooks, and light/dark theme synchronization).

---

## 2. Current Behavior & Verified Problems

From our forensic audit and Playwright headless inspection:

1. **Unstyled DOM Wireframe for Consumers:** `<VideoPlayer>` and `<AudioPlayer>` in React render unstyled raw SVG icons, uncontained text, and misaligned checkboxes when consumed in applications because the package does not bundle or export Vidstack layout styles.
2. **Phantom `./dist/styles.css` Export:** `package.json` points `./styles.css` to `./dist/styles.css`, but no CSS file is ever generated or packaged, causing `ERR_MODULE_NOT_FOUND` in production.
3. **Dead Framework-Agnostic Core (`createMediaPlayer`):** `createMediaPlayer` creates `<media-player>` and `<media-provider>` via `document.createElement` without ever importing or registering Vidstack custom elements. The browser treats them as inert `HTMLUnknownElement`s; no video plays, no layout is attached, and methods are no-ops.
4. **Bundle Pollution on Root Entrypoint:** `src/index.ts` re-exports React components (`VideoPlayer`, `AudioPlayer`), forcing non-React consumers (Vanilla JS, Svelte, Vue, Angular) to pull in `react` and `react/jsx-runtime`, throwing errors if React is not installed.
5. **Violation of `@nofinite/nuicss` Standards:** Components use arbitrary bracketed utilities (`border-[var(--border-default)]`, `bg-[var(--bg-surface)]`) rather than NUICSS tokens and superclasses. Player CSS custom properties are not bound to NUICSS OKLCH tokens, and hardcoded `theme="dark"` defaults cause jarring color clashes inside light-mode cards.
6. **Missing Production-Grade Media Features:** No event callbacks (`onPlay`, `onPause`, `onTimeUpdate`), no captions/subtitles support (`tracks`), no VTT thumbnail scrubber support (`thumbnails`), no playback speed controls, and no quality selection menus.
7. **Downstream Documentation Desync:** `oss-docs` still attempts to import `VideoPlayer` from `@nofinite/nui`, which was removed during the decoupling refactor.

---

## 3. Proposed Phase-Wise Architecture & Execution Plan

### Phase 1: Package Boundaries, Clean Exports & Build Pipeline

- **Decouple Entrypoints:**
  - `.` (`@nofinite/media`): Strictly framework-agnostic. Exports `createMediaPlayer`, streaming utilities (`isHlsSource`, `isDashSource`, `formatMediaTime`), types, and custom element auto-registration. **Zero React dependencies**.
  - `./react` (`@nofinite/media/react`): React adapters (`VideoPlayer`, `AudioPlayer`), React types, and re-exported Vidstack React hooks (`useMediaRemote`, `useMediaState`).
  - `./styles.css` (`@nofinite/media/styles.css`): Single comprehensive compiled stylesheet containing Vidstack base styles, default layouts, and NUICSS token mappings.
- **Build Pipeline (`vite.config.ts`):**
  - Add stylesheet build input or CSS bundling step to compile `src/styles/media.css` directly into `dist/styles.css`.
  - Maintain clean dual-format builds (ESM `.js` + CJS `.cjs`) and TypeScript `.d.ts` declaration maps.
- **Verification Gate 1:** Run `npm pack --dry-run` in `packages/media` to verify all expected artifacts (`dist/styles.css`, `dist/index.js`, `dist/react/index.js`, `dist/types/`) are present in the tarball.

---

### Phase 2: NUICSS Design System Integration & Theme Synchronization

- **Single Source of Truth Stylesheet (`src/styles/media.css`):**
  - Import Vidstack core theme and default layouts:
    - `@vidstack/react/player/styles/default/theme.css`
    - `@vidstack/react/player/styles/default/layouts/video.css`
    - `@vidstack/react/player/styles/default/layouts/audio.css`
  - Bridge Vidstack CSS custom properties directly to `@nofinite/nuicss` OKLCH tokens:
    ```css
    .nui-vidstack-player,
    .nui-vidstack-audio-player {
      --media-brand: var(--color-primary);
      --media-focus-ring: var(--color-primary);
      --media-font-family: var(--font-sans, system-ui, sans-serif);
      --media-border-radius: var(--radius-lg, 0.75rem);
      --media-slider-track-bg: var(--border-default);
      --media-slider-track-fill-bg: var(--color-primary);
      --media-menu-bg: var(--bg-surface);
      --media-menu-border: var(--border-default);
      --media-menu-color: var(--text-default);
    }
    ```
- **Refactor React Superclasses & Token Usage:**
  - Replace all arbitrary Tailwind bracketed classes in `VideoPlayer.tsx` and `AudioPlayer.tsx` with clean semantic tokens (`border border-default`, `bg-surface`, `text-primary`, `text-muted`).
  - Remove hardcoded `theme = 'dark'` default. Introduce dynamic theme resolution (`theme?: 'light' | 'dark' | 'auto'`) that harmonizes the inner player with outer card containers and responds to `data-theme` and `prefers-color-scheme`.
- **Verification Gate 2:** Validate that light mode renders a harmonious light surface card with matching player controls, and dark mode renders a dark surface card with OKLCH primary accents.

---

### Phase 3: True Framework-Agnostic Core (`createMediaPlayer`) Engine

- **Custom Elements Lifecycle & Registration:**
  - Safely import and register Vidstack custom elements (`vidstack/player`, `vidstack/player/ui`, `vidstack/player/layouts/default`, `vidstack/icons`) when running in the browser (`typeof window !== 'undefined'`).
- **Comprehensive Declarative Options (`MediaPlayerOptions`):**
  - Implement options for: `src`, `type`, `poster`, `title`, `artist`, `artwork`, `controls`, `tracks` (subtitles/VTT), `thumbnails` (scrubber storyboard), `playbackRates`, `theme`, `autoplay`, `loop`, `muted`, `playsinline`, `aspectRatio`, `className`.
- **Layout Construction:**
  - When `controls: true`, construct and append `<media-video-layout>` or `<media-audio-layout>` with full player controls.
  - Append `<track>` elements dynamically when `tracks` are provided.
- **Rich Observable Instance API (`MediaPlayerInstance`):**
  - Methods: `play()`, `pause()`, `setSrc(src)`, `destroy()`, `on(event, handler)`, `off(event, handler)`, `getState()`.
  - Expose state observables: `currentTime`, `duration`, `paused`, `volume`, `muted`, `buffered`, `fullscreen`.
- **Verification Gate 3:** Run Playwright headless DOM tests verifying `<media-player>` upgrades to an active custom element with functional `<video>`/`<audio>` tags, working `play()`/`pause()`, and layout controls.

---

### Phase 4: Production-Grade React Suite (`VideoPlayer` & `AudioPlayer`)

- **Event Callbacks:**
  - Expose standard playback event callbacks on `VideoPlayerProps` and `AudioPlayerProps`: `onPlay`, `onPause`, `onEnded`, `onTimeUpdate`, `onVolumeChange`, `onError`, `onSeeked`, `onLoadedMetadata`, `onFullscreenChange`.
- **Subtitles & Captions (`tracks`):**
  - Support `tracks` prop: `Array<{ src: string; label: string; language: string; kind?: 'subtitles' | 'captions' | 'chapters'; default?: boolean }>`.
  - Render `<track>` elements inside `<MediaProvider>`.
- **Storyboard Scrubbing (`thumbnails`):**
  - Pass `thumbnails` (VTT URL) to `DefaultVideoLayout` for live thumbnail preview scrubbers.
- **Adaptive Bitrate Quality & Speed Controls:**
  - Support `playbackRates` (e.g. `[0.5, 0.75, 1, 1.25, 1.5, 2]`).
  - Configure quality selection menu for HLS/DASH streams.
- **Re-exported React Hooks:**
  - Export `useMediaRemote`, `useMediaState`, and `MediaPlayerInstance` from `@nofinite/media/react` so developers can build custom controls or query player state easily.
- **Verification Gate 4:** Typecheck with `tsc -p tsconfig.lib.json` and run unit/component test suite.

---

### Phase 5: Storybook Showcase, Documentation & Compulsory Visual Validation

- **Unified Storybook Stories (`packages/media/src/react/MediaPlayer.stories.tsx`):**
  - Story 1: Video HLS with multi-quality stream and poster.
  - Story 2: Video MP4 with VTT storyboard thumbnails, captions, and playback speed menu.
  - Story 3: Audio Player with title, artist, artwork, and full scrubbing controls.
  - Story 4: Light Mode vs Dark Mode comparison showcase.
  - Story 5: Vanilla DOM Player mounted dynamically.
- **Documentation Sync:**
  - Update `d:\oss-docs\src\registry\video.tsx` and `index.ts` to import `VideoPlayer` from `@nofinite/media/react` and import `@nofinite/media/styles.css`.
- **Compulsory Visual Verification:**
  - Execute Playwright test script in `/temp/` capturing screenshots in `/temp/screenshots/` across light mode, dark mode, player hover, scrubber interaction, and mobile viewports.
  - Confirm spatial harmony, border contrast, and 100% OKLCH token conformance.

---

## 4. Affected Files & Repositories

| Repository    | Path                                               | Role                                                           |
| :------------ | :------------------------------------------------- | :------------------------------------------------------------- |
| `d:\stack`    | `packages/media/package.json`                      | Package exports, peerDeps, sideEffects                         |
| `d:\stack`    | `packages/media/vite.config.ts`                    | CSS bundle generation & build config                           |
| `d:\stack`    | `packages/media/src/index.ts`                      | Clean framework-agnostic entrypoint                            |
| `d:\stack`    | `packages/media/src/core/player.ts`                | Core DOM player engine & custom elements registration          |
| `d:\stack`    | `packages/media/src/core/index.ts`                 | Core exports & types                                           |
| `d:\stack`    | `packages/media/src/styles/media.css`              | **New** single-source stylesheet with NUICSS tokens            |
| `d:\stack`    | `packages/media/src/react/VideoPlayer.tsx`         | Production-grade React VideoPlayer with event hooks & captions |
| `d:\stack`    | `packages/media/src/react/AudioPlayer.tsx`         | Harmonized React AudioPlayer with NUICSS tokens & artwork      |
| `d:\stack`    | `packages/media/src/react/index.ts`                | React entrypoint & hooks re-export                             |
| `d:\stack`    | `packages/media/src/react/MediaPlayer.stories.tsx` | Monorepo Storybook stories                                     |
| `d:\stack`    | `packages/media/src/media.test.ts`                 | Comprehensive unit & integration tests                         |
| `d:\oss-docs` | `src/registry/video.tsx`                           | Fix outdated `@nofinite/nui` import                            |
| `d:\oss-docs` | `src/registry/index.ts`                            | Fix code preview string                                        |

---

## 5. Dependencies & Tools

- `vidstack` (v1.15.6) & `@vidstack/react` (v1.15.6): Underlying robust media player primitives.
- `@nofinite/nuicss`: Design tokens and semantic superclasses.
- `@playwright/test`: Compulsory visual regression validation in `/temp/`.
- `vitest`: Unit test executor via `@nx/vitest`.

---

## 6. Risks & Mitigation

- **Risk:** Custom elements SSR errors in frameworks like Next.js.
  - _Mitigation:_ Guard all custom element definitions with `typeof window !== 'undefined'` and `typeof customElements !== 'undefined'`.
- **Risk:** CSS specificity clashes with application styles.
  - _Mitigation:_ Scope player styles with `.nui-vidstack-player` and `.nui-vidstack-audio-player` wrapper classes and utilize CSS variables.
- **Risk:** Breaking changes for early users who imported `VideoPlayer` from `@nofinite/media`.
  - _Mitigation:_ Document migration clearly: `import { VideoPlayer } from '@nofinite/media/react';` and `import '@nofinite/media/styles.css';`.

---

## 7. Rollback Considerations

Each phase will be committed locally to git immediately upon successful verification. If any unexpected regression occurs, git provides instant rollback to the preceding clean commit.

---

## 8. Verification Strategy

1. **Packaging Verification:** `npm pack --dry-run` to inspect tarball output.
2. **Type Checking:** `pnpm nx run media:typecheck` or `tsc -p packages/media/tsconfig.lib.json`.
3. **Unit Tests:** `pnpm nx run media:test`.
4. **Visual Playwright Verification:** Screenshots rendered in `/temp/screenshots/` inspected and confirmed.
