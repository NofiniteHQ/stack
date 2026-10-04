# Implementation Plan: Production-Grade Hardening & Deep Refactor of `@nofinite/media`

**Document:** `d:\stack\media_implementation_plan.md`  
**Package:** `@nofinite/media` (`packages/media`)  
**Status:** PROPOSED (Awaiting User Approval)

---

## 1. Objective

Elevate `@nofinite/media` to an enterprise, production-grade media player suite that is:

1. Fully framework-agnostic in core with full programmatic controls and zero memory leaks.
2. 100% compatible with Next.js App Router / React Server Components (`'use client';` directive preservation).
3. Resilient to cross-origin CDN media (CORS handling for WebVTT subtitles, chapters, and thumbnails).
4. Fully compliant with `@nofinite/nuicss` design tokens in both dark and light modes across all theme-switching strategies.
5. Self-contained with rich hook and component re-exports so consumers never need direct dependencies on Vidstack internals.

---

## 2. Deep Audit Findings & Current Problems

1. **Missing `'use client'` Directive in Compiled React Bundle:**
   - `dist/react/index.js` and `dist/react/index.cjs` lack the `"use client";` banner.
   - When imported in Next.js App Router (e.g., in `oss-docs` or modern Next.js apps), Next.js treats `@nofinite/media/react` as a Server Component, throwing a fatal runtime error.
2. **Ignored `playbackRates` Prop:**
   - `playbackRates?: number[]` is defined on `VideoPlayerProps` and destructured, but never passed to `<DefaultVideoLayout>` or `<MediaPlayer>`.
   - `AudioPlayer` lacks `playbackRates` entirely, despite speed controls being critical for podcasts and audiobooks.
3. **CORS Failures on External CDN Captions & Thumbnails:**
   - External WebVTT captions or storyboard thumbnail files from CDNs trigger browser CORS rejections unless `crossOrigin="anonymous"` is set on `<MediaPlayer>` and `<Track>`. Neither player component exposes or passes `crossOrigin`.
4. **Memory Leak in Core Vanilla Player (`createMediaPlayer`):**
   - Event listeners attached via `player.on(...)` are never removed when `player.destroy()` is called, leading to memory leaks in SPAs.
5. **Limited Imperative API on `MediaPlayerInstance`:**
   - Core vanilla player only exposes `play()`, `pause()`, and `setSrc()`. It lacks `seek()`, `setVolume()`, `setMuted()`, `enterFullscreen()`, `exitFullscreen()`, `enterPictureInPicture()`, `exitPictureInPicture()`, and `setPlaybackRate()`.
6. **Subpath Export Breakage for Extensionless Style Import:**
   - `vite.config.ts` builds `dist/styles.js`, but `"./styles"` is not exposed in `package.json` `exports` (only `"./styles.css"` is present), causing `import '@nofinite/media/styles'` to fail.
7. **Incomplete Theme Cascading Selector:**
   - `media.css` handles `:root:not(.dark)` and `.light`, but omits `[data-theme='light']`, causing dark styles to leak into nested light-themed containers.
8. **Missing Re-exports in `@nofinite/media/react`:**
   - Important Vidstack hooks (`useActiveTextTrack`, `useVideoQualityOptions`, `useAudioOptions`, `useCaptionOptions`, `usePlaybackRateOptions`) and subcomponents (`Track`, layout components) are not re-exported.

---

## 3. Phased Implementation Roadmap

_Execution Rule: Work is strictly executed one phase at a time. After completing each phase, work stops, commits locally, and waits for user approval ("next") before proceeding._

### Phase 1: Next.js / RSC Bundle Hardening & Subpath Exports

- Add `'use client';` directive to `packages/media/src/react/index.ts`, `VideoPlayer.tsx`, and `AudioPlayer.tsx`.
- Configure Rollup banner in `packages/media/vite.config.ts` for the `react/index` entry chunk to guarantee `"use client";` appears at byte 0 of both `dist/react/index.js` and `dist/react/index.cjs`.
- Add `"./styles"` to `package.json` `exports` mapping to `./dist/styles.js` and `./dist/styles.css`.
- Verification: Build `media` and verify `dist/react/index.js` header and test import in Node.js.
- **Gate:** STOP and wait for user approval.

### Phase 2: React Player Suite Feature Parity & CDN CORS Support

- Pass `playbackRates` to `<DefaultVideoLayout playbackRates={playbackRates} />`.
- Add `playbackRates?: number[] | { min: number; max: number; step: number }` and `seekStep?: number` to `AudioPlayerProps` and pass to `<DefaultAudioLayout />`.
- Add `crossOrigin?: 'anonymous' | 'use-credentials' | boolean` to `VideoPlayerProps` and `AudioPlayerProps`, defaulting to `'anonymous'`.
- Add `load?: 'eager' | 'idle' | 'visible' | 'play' | 'custom'` (defaulting to `autoPlay ? 'eager' : 'visible'`) and `preload?: 'none' | 'metadata' | 'auto'` to optimize performance and prevent viewport lag.
- Add `slots?: any` and `style?: React.CSSProperties` to props.
- Re-export essential Vidstack hooks and components in `packages/media/src/react/index.ts` (`useActiveTextTrack`, `useVideoQualityOptions`, `useAudioOptions`, `useCaptionOptions`, `usePlaybackRateOptions`, `Track`, `DefaultVideoLayout`, `DefaultAudioLayout`, `defaultLayoutIcons`).
- **Gate:** STOP and wait for user approval.

### Phase 3: Core Framework-Agnostic Player Engine Enhancements

- Expand `MediaPlayerInstance` in `packages/media/src/core/player.ts` with complete programmatic controls:
  - `seek(time: number): void`
  - `setVolume(volume: number): void`
  - `setMuted(muted: boolean): void`
  - `enterFullscreen(): Promise<void>`
  - `exitFullscreen(): Promise<void>`
  - `enterPictureInPicture(): Promise<void>`
  - `exitPictureInPicture(): Promise<void>`
  - `setPlaybackRate(rate: number): void`
- Maintain internal listener registry in `createMediaPlayer` to automatically detach all listeners and clean references on `destroy()`.
- Synchronize both element attributes and DOM custom element properties when `setSrc()` is called.
- Update `packages/media/src/media.test.ts` to test all new imperative instance methods.
- **Gate:** STOP and wait for user approval.

### Phase 4: NUICSS Design Token & Theme Cascading Polish

- Add `[data-theme='light'] .nui-vidstack-player`, `[data-theme='light'] .nui-vidstack-audio-player`, and `[data-theme='light'] .nui-media-container media-player` to `packages/media/src/styles/media.css`.
- Ensure all token fallbacks use standard OKLCH formats matching `@nofinite/nuicss`.
- Verify computed styles and visual harmony in testbed with Playwright.
- **Gate:** STOP and wait for user approval.

### Phase 5: Component Tests, Storybook Showcase & Final Verification

- Add React component tests in `packages/media/src/react.test.tsx` verifying prop forwarding, `playbackRates`, `crossOrigin`, event callbacks, and ref methods.
- Update `packages/media/src/react/MediaPlayer.stories.tsx` showcasing playback speed rates, slots, and CORS subtitles.
- Run `npm pack --dry-run` to verify package contents.
- Capture final visual verification screenshots in `d:\stack\temp\screenshots/`.
- **Gate:** Final Review & Completion.

---

## 4. Affected Files & Modules

- `d:\stack\packages\media\package.json`
- `d:\stack\packages\media\vite.config.ts`
- `d:\stack\packages\media\src\react\index.ts`
- `d:\stack\packages\media\src\react\VideoPlayer.tsx`
- `d:\stack\packages\media\src\react\AudioPlayer.tsx`
- `d:\stack\packages\media\src\core\player.ts`
- `d:\stack\packages\media\src\styles\media.css`
- `d:\stack\packages\media\src\media.test.ts`
- `d:\stack\packages\media\src\react.test.tsx` (new)
- `d:\stack\packages\media\src\react\MediaPlayer.stories.tsx`

---

## 5. Verification Strategy

1. **Build & Package:** `pnpm nx run media:build` with zero TypeScript errors.
2. **NPM Output:** `npm pack --dry-run` to verify all entrypoints and styles are bundled.
3. **Unit Tests:** `pnpm nx run media:test` verifying core and React component functionality.
4. **Visual Audit:** Playwright testbed execution capturing light, dark, and core player screenshots in `d:\stack\temp\screenshots/`.
5. **RSC Verification:** Inspect `dist/react/index.js` to ensure `"use client";` is the first line.
