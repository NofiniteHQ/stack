# Media Production Examples

Below are production-ready, copy-paste implementations of **Nofinite Media** showcasing adaptive HLS streaming, multi-language WebVTT captions, podcast players, and picture-in-picture widgets across pure Vanilla TypeScript and React architectures.

---

## Example 1: Pure Vanilla TypeScript Enterprise VOD Player (Core First)

A complete framework-agnostic video implementation featuring adaptive HLS streaming (`.m3u8`), WebVTT multi-language subtitles, interactive chapter markers, storyboard thumbnail scrubbing, and telemetry event logging:

```ts
import {
  createMediaPlayer,
  type MediaTrack,
  type MediaPlayerInstance,
} from '@nofinite/media';
import '@nofinite/nuicss/styles.css';

// 1. Setup Tracks Configuration
const vodTracks: MediaTrack[] = [
  {
    src: 'https://media.example.com/vod/subs-en.vtt',
    label: 'English [CC]',
    language: 'en',
    kind: 'subtitles',
    default: true,
  },
  {
    src: 'https://media.example.com/vod/subs-es.vtt',
    label: 'Español',
    language: 'es',
    kind: 'subtitles',
  },
  {
    src: 'https://media.example.com/vod/chapters.vtt',
    label: 'Chapters',
    language: 'en',
    kind: 'chapters',
    default: true,
  },
];

const container = document.getElementById('vod-player-container')!;

// 2. Initialize Framework-Agnostic VOD Player
const player: MediaPlayerInstance = createMediaPlayer({
  src: 'https://stream.mux.com/v69R127x00KSKGrGQgahP800ugny00JvlA.m3u8',
  type: 'video',
  poster:
    'https://image.mux.com/v69R127x00KSKGrGQgahP800ugny00JvlA/thumbnail.webp?time=12',
  thumbnails:
    'https://image.mux.com/v69R127x00KSKGrGQgahP800ugny00JvlA/storyboard.vtt',
  tracks: vodTracks,
  aspectRatio: '16/9',
  controls: true,
  autoplay: false,
  seekStep: 5,
});

// 3. Mount Player directly to DOM
container.appendChild(player.element);

// 4. Analytics & Telemetry Tracking
player.on('play', () => {
  console.log('Analytics: Playback started at', new Date().toISOString());
});

player.on('pause', () => {
  const state = player.getState();
  console.log('Analytics: Paused at second', state.currentTime);
});

// 5. Cleanup on route teardown
window.addEventListener('beforeunload', () => {
  player.destroy();
});
```

---

## Example 2: Pure Vanilla TypeScript Podcast Player with OS Lock-Screen Sync

A high-fidelity audio player with album artwork, chapter navigation, 15-second skip intervals, and hardware media key bindings:

```ts
import { createMediaPlayer, formatMediaTime } from '@nofinite/media';
import '@nofinite/nuicss/styles.css';

const mountEl = document.getElementById('podcast-player-mount')!;

const podcastPlayer = createMediaPlayer({
  src: 'https://media.example.com/podcasts/ep58.mp3',
  type: 'audio',
  title: 'Autonomous Systems & Edge Isolates',
  artist: 'Nofinite Deep Dive Podcast • Ep. 58',
  artwork: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=300',
  playbackRates: [0.75, 1, 1.25, 1.5, 2],
  seekStep: 15, // 15-second skip buttons
  tracks: [
    {
      src: 'https://media.example.com/podcasts/ep58-chapters.vtt',
      label: 'Chapters',
      language: 'en',
      kind: 'chapters',
      default: true,
    },
  ],
  controls: true,
});

mountEl.appendChild(podcastPlayer.element);
```

---

## Example 3: Enterprise VOD Player in React

Featuring adaptive HLS streaming (`.m3u8`), WebVTT multi-language subtitles, interactive chapter markers, and thumbnail frame scrubbing:

```tsx
'use client';

import React from 'react';
import { VideoPlayer, type MediaTrack } from '@nofinite/media/react';
import '@nofinite/nuicss/styles.css';

const vodTracks: MediaTrack[] = [
  {
    src: 'https://media.example.com/vod/subs-en.vtt',
    label: 'English [CC]',
    language: 'en',
    kind: 'subtitles',
    default: true,
  },
  {
    src: 'https://media.example.com/vod/chapters.vtt',
    label: 'Chapters',
    language: 'en',
    kind: 'chapters',
    default: true,
  },
];

export function EnterpriseVodPlayer() {
  return (
    <div className="w-full max-w-5xl mx-auto p-6 bg-surface">
      <div className="rounded-3xl overflow-hidden border border-default shadow-2xl bg-black">
        <VideoPlayer
          src="https://stream.mux.com/v69R127x00KSKGrGQgahP800ugny00JvlA.m3u8"
          poster="https://image.mux.com/v69R127x00KSKGrGQgahP800ugny00JvlA/thumbnail.webp?time=12"
          thumbnails="https://image.mux.com/v69R127x00KSKGrGQgahP800ugny00JvlA/storyboard.vtt"
          tracks={vodTracks}
          aspectRatio="16/9"
          controls={true}
        />
      </div>
    </div>
  );
}
```

---

## Example 4: Technical Podcast Show in React

A podcast player with album artwork, chapter navigation, 15-second skip buttons, speed selection, and OS lock-screen Media Session controls:

```tsx
'use client';

import React from 'react';
import { AudioPlayer } from '@nofinite/media/react';
import '@nofinite/nuicss/styles.css';

export function TechnicalPodcastPlayer() {
  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-surface border border-default rounded-3xl shadow-xl">
      <AudioPlayer
        src="https://media.example.com/podcasts/ep58.mp3"
        title="Autonomous Systems & Edge Isolates"
        artist="Nofinite Deep Dive Podcast"
        artwork="https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=300"
        playbackRates={[0.75, 1, 1.25, 1.5, 2]}
        seekStep={15}
      />
    </div>
  );
}
```
