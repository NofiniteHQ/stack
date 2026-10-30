# Nofinite Media

> Universal audio and video streaming media player suite powered by W3C Custom Elements and NUICSS tokens.

---

## Interactive Preview

---

## Architectural Invariants

- **Framework-Agnostic Core First (`@nofinite/media`):** Universal DOM player engine powered by W3C Custom Elements (`<media-player>`, `<media-provider>`) and native browser APIs. Zero runtime dependencies on React.
- **Optional React Adapter (`@nofinite/media/react`):** Declarative `<VideoPlayer />` and `<AudioPlayer />` wrappers and reactive hooks (`useMediaState`, `useMediaRemote`). In `package.json`, `peerDependenciesMeta.react.optional` is strictly `true`.
- **Zero Downstream CSS Invariant:** All media controls, scrubber timelines, volume bars, and modal drawers are governed directly by **NUICSS** superclasses (`.nui-media-container`, `.nui-vidstack-player`). Never import secondary CSS files.
- **Adaptive Bitrate Streaming (HLS/DASH):** Native hardware playback on Apple WebKit and automated MSE `hls.js` demuxing on Chrome, Firefox, and Edge.

---

## Key Capabilities

- **Adaptive Bitrate Streaming:** Automatic `.m3u8` manifest detection, multi-resolution quality switching, and live stream DVR windows.
- **WebVTT Tracks & Subtitles:** Multi-language subtitles, closed captions, and chapter navigation notches.
- **Interactive Thumbnail Scrubbers:** Visual video frame previews on timeline hover via WebVTT sprite coordinates.
- **Podcast Audio Player:** High-resolution album artwork, artist bylines, 15s skip buttons, and OS Lock-Screen Media Session synchronization.
- **Headless Custom Layouts:** Low-level primitives (`<media-player>`, `<media-provider>`) for composing bespoke floating mini-players, background loopers, or sticky bars.
- **Deep React Hooks:** Fine-grained reactive state hooks (`useMediaState`, `useMediaRemote`, `useVideoQualityOptions`, `useCaptionOptions`).

---

## Quickstart

### 1. Usage in Vanilla TypeScript / DOM (Core First)

```ts
import { createMediaPlayer } from '@nofinite/media';
import '@nofinite/nuicss/styles.css';

const container = document.getElementById('media-container')!;

// 1. Initialize universal media player
const player = createMediaPlayer({
  src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  type: 'video',
  poster: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200',
  aspectRatio: '16/9',
  controls: true,
  autoplay: false,
});

// 2. Mount directly into the DOM
container.appendChild(player.element);

// 3. Listen to player lifecycle events
player.on('play', () => console.log('Playback started'));
player.on('timeupdate', () => {
  const state = player.getState();
  console.log(`Current position: ${state.currentTime} / ${state.duration}`);
});

// 4. Imperative controls
// player.seek(30);
// player.enterFullscreen();
// player.destroy();
```

---

### 2. Usage in React

```tsx
'use client';

import React from 'react';
import { VideoPlayer } from '@nofinite/media/react';
import '@nofinite/nuicss/styles.css';

export default function MediaDemo() {
  return (
    <div className="w-full max-w-2xl rounded-2xl overflow-hidden border border-default shadow-xl bg-black">
      <VideoPlayer
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
        poster="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200"
        aspectRatio="16/9"
        controls={true}
      />
    </div>
  );
}
```

---

## Framework Integration Recipes

### Vue 3 (Composition API)

```vue
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { createMediaPlayer, type MediaPlayerInstance } from '@nofinite/media';
import '@nofinite/nuicss/styles.css';

const containerEl = ref<HTMLElement | null>(null);
let player: MediaPlayerInstance | null = null;

onMounted(() => {
  if (containerEl.value) {
    player = createMediaPlayer({
      src: 'https://stream.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqTtjhqNZNUxMm300.m3u8',
      type: 'video',
      controls: true,
    });
    containerEl.value.appendChild(player.element);
  }
});

onBeforeUnmount(() => {
  player?.destroy();
});
</script>

<template>
  <div
    ref="containerEl"
    class="w-full max-w-3xl aspect-video rounded-xl overflow-hidden"
  />
</template>
```

### Svelte 5

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { createMediaPlayer, type MediaPlayerInstance } from '@nofinite/media';
  import '@nofinite/nuicss/styles.css';

  let mountEl: HTMLDivElement;
  let player: MediaPlayerInstance;

  onMount(() => {
    player = createMediaPlayer({
      src: 'https://stream.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqTtjhqNZNUxMm300.m3u8',
      type: 'video',
      controls: true,
    });
    mountEl.appendChild(player.element);

    return () => player.destroy();
  });
</script>

<div bind:this={mountEl} class="w-full max-w-3xl aspect-video rounded-xl overflow-hidden"></div>
```

---

## Documentation Directory

### Advanced Architecture & Deep Guides

- [Adaptive Bitrate Streaming & HLS](/media/streaming-and-hls) — Manifest detection, MSE buffer pipelines, quality selection, and live DVR streams.
- [Tracks, Captions & Scrubbers](/media/tracks-and-captions) — Multi-language WebVTT subtitles, chapter markers, and visual thumbnail scrubbing.
- [Headless Custom Layouts](/media/custom-layouts) — Composing bespoke player UIs with custom element layout or low-level primitives.
- [Podcast & Audio Players](/media/podcast-and-audio) — High-fidelity audio playback, artwork, chapters, and OS lock-screen Media Session API.
- [React Media Hooks](/media/react-hooks) — Fine-grained reactive state management with `useMediaState`, `useMediaRemote`, and track selectors.
- [Production Examples](/media/examples) — Enterprise VOD Player, Technical Podcast Player, and Floating Picture-in-Picture Widget.

### Components & Setup

- [VideoPlayer](/media/video-player) — Adaptive video player with HLS streaming, captions, and poster setup.
- [AudioPlayer](/media/audio-player) — Audio streaming with track scrubber, volume control, and metadata cards.
- [Installation & Setup](/media/installation) — Package installation, peer dependencies, and styling configuration.
