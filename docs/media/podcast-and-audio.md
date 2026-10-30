# Podcast and Audio Players

**Nofinite Media** provides a dedicated audio playback engine tailored for technical podcasts, audiobook narrations, music streaming, and interviews.

It incorporates high-resolution album artwork, artist bylines, chapter markers, speed presets, and automated **OS Lock-Screen Media Session** integration.

```ts
// Framework-Agnostic Core (Zero React Dependency)
import { createMediaPlayer, formatMediaTime } from '@nofinite/media';

// React Adapter
import { AudioPlayer } from '@nofinite/media/react';
```

---

## 1. Usage in Vanilla TypeScript / DOM (Core First)

In pure JavaScript or TypeScript, initialize the podcast player using `createMediaPlayer({ type: 'audio' })`:

```ts
import {
  createMediaPlayer,
  formatMediaTime,
  type MediaPlayerInstance,
} from '@nofinite/media';
import '@nofinite/nuicss/styles.css';

const container = document.getElementById('podcast-root')!;

// 1. Initialize Podcast Audio Player
const podcastPlayer: MediaPlayerInstance = createMediaPlayer({
  src: 'https://media.example.com/podcasts/episode-42.mp3',
  type: 'audio',
  title: 'Episode 42: The Future of Single-Engine CSS Invariants',
  artist: 'Nofinite Engineering Podcast • Hosted by Sarah Chen',
  artwork: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=300',
  seekStep: 15, // 15-second skip intervals tailored for podcast dialogue
  playbackRates: [0.75, 1, 1.25, 1.5, 2],
  tracks: [
    {
      src: 'https://media.example.com/podcasts/episode-42-chapters.vtt',
      label: 'Chapters',
      language: 'en',
      kind: 'chapters',
      default: true,
    },
  ],
  controls: true,
  autoplay: false,
});

// 2. Mount player element into DOM
container.appendChild(podcastPlayer.element);

// 3. Listen to playback telemetry
podcastPlayer.on('timeupdate', () => {
  const { currentTime, duration } = podcastPlayer.getState();
  console.log(
    `Episode progress: ${formatMediaTime(currentTime)} / ${formatMediaTime(
      duration
    )}`
  );
});

// 4. Imperative seek operations
// podcastPlayer.seek(180); // Jump directly to Chapter 2
```

---

## 2. Usage in React

In React applications, import `AudioPlayer` from `@nofinite/media/react`:

```tsx
'use client';

import React from 'react';
import { AudioPlayer } from '@nofinite/media/react';
import '@nofinite/nuicss/styles.css';

export function PodcastEpisodePlayer() {
  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-surface border border-default rounded-3xl shadow-lg">
      <AudioPlayer
        src="https://media.example.com/podcasts/episode-42.mp3"
        title="Episode 42: The Future of Single-Engine CSS Invariants"
        artist="Nofinite Engineering Podcast • Hosted by Sarah Chen"
        artwork="https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=300"
        playbackRates={[0.75, 1, 1.25, 1.5, 2]}
        seekStep={15}
        tracks={[
          {
            src: 'https://media.example.com/podcasts/episode-42-chapters.vtt',
            label: 'Chapters',
            language: 'en',
            kind: 'chapters',
            default: true,
          },
        ]}
      />
    </div>
  );
}
```

---

## OS Lock-Screen Media Session API Integration

When an audio track starts playing, the engine automatically registers with the browser's native `navigator.mediaSession` API:

- **Title & Artist:** Synced to `title` and `artist` metadata options.
- **Cover Artwork:** Provides responsive square artwork displayed on lock screens and system notification banners (iOS, Android, macOS Control Center, and Windows Media Overlay).
- **Hardware Multimedia Keys:** Automatically responds to system keyboard shortcuts:
  - Play / Pause (<Kbd>⏯</Kbd>)
  - Seek Backward 15s (<Kbd>⏮</Kbd>)
  - Seek Forward 15s (<Kbd>⏭</Kbd>)
- **Background Audio:** Seamlessly continues playing audio when mobile screens lock or when switching browser tabs.
