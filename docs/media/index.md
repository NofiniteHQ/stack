# Nofinite Media

> Universal audio and video playback suite powered by W3C Custom Elements, Vidstack, and NUICSS design tokens.

---

## Overview

**Nofinite Media** (`@nofinite/media`) is an enterprise-grade streaming media suite designed for high-fidelity audio, video-on-demand (VOD), live broadcasts, and podcast shows.

### Architectural Invariants

- **Zero Downstream CSS Invariant:** All media controls, scrubber timelines, volume bars, and modal drawers are governed directly by **NUICSS** superclasses. You only ever need `import '@nofinite/nuicss/styles.css'`.
- **Adaptive Bitrate Streaming (HLS/DASH):** Native hardware playback on Apple WebKit and automated MSE `hls.js` demuxing on Chrome, Firefox, and Edge.
- **Isomorphic Core:** Built on W3C Custom Elements with full headless React hooks (`useMediaState`, `useMediaRemote`).

---

## Key Capabilities

- **Adaptive Bitrate Streaming:** Automatic `.m3u8` manifest detection, multi-resolution quality switching, and live stream DVR windows.
- **WebVTT Tracks & Subtitles:** Multi-language subtitles, closed captions, and chapter navigation notches.
- **Interactive Thumbnail Scrubbers:** Visual video frame previews on timeline hover via WebVTT sprite coordinates.
- **Podcast Audio Player:** High-resolution album artwork, artist bylines, 15s skip buttons, and OS Lock-Screen Media Session synchronization.
- **Headless Custom Layouts:** Low-level primitives (`MediaPlayer`, `MediaProvider`) for composing bespoke floating mini-players, background loopers, or sticky bars.
- **Deep React Hooks:** Fine-grained reactive state hooks (`useMediaState`, `useMediaRemote`, `useVideoQualityOptions`, `useCaptionOptions`).

---

## Quickstart

```tsx
import React from 'react';
import { VideoPlayer } from '@nofinite/media/react';
import '@nofinite/nuicss/styles.css';

export function TutorialPlayer() {
  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl overflow-hidden border border-default bg-black shadow-xl">
      <VideoPlayer
        title="High-Throughput Distributed Streaming Architecture"
        src="https://stream.mux.com/v69R127x00KSKGrGQgahP800ugny00JvlA.m3u8"
        poster="https://image.mux.com/v69R127x00KSKGrGQgahP800ugny00JvlA/thumbnail.webp?time=2"
        aspectRatio="16/9"
        controls={true}
      />
    </div>
  );
}
```

---

## Documentation Directory

### Advanced Architecture & Deep Guides

- **[Adaptive Bitrate Streaming & HLS](./streaming-and-hls.md)** — Manifest detection, MSE buffer pipelines, quality selection, and live DVR streams.
- **[Tracks, Captions & Scrubbers](./tracks-and-captions.md)** — Multi-language WebVTT subtitles, chapter markers, and visual thumbnail scrubbing.
- **[Headless Custom Layouts](./custom-layouts.md)** — Composing bespoke player UIs with `MediaPlayer`, `MediaProvider`, and custom control layers.
- **[Podcast & Audio Players](./podcast-and-audio.md)** — Standalone `<AudioPlayer />`, artwork, chapters, and OS lock-screen Media Session API.
- **[React Media Hooks](./react-hooks.md)** — Fine-grained reactive state management with `useMediaState`, `useMediaRemote`, and track selectors.
- **[Production Examples](./examples.md)** — Enterprise VOD Player, Technical Podcast Player, and Floating Picture-in-Picture Widget.

### Components & Setup

- **[VideoPlayer](./video-player.md)** — Adaptive video player with HLS streaming, captions, and poster setup.
- **[AudioPlayer](./audio-player.md)** — Audio streaming with track scrubber, volume control, and metadata cards.
- **[Installation & Setup](./installation.md)** — Package installation, peer dependencies, and styling configuration.
