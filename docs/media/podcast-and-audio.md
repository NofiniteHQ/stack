# Podcast and Audio Players

**Nofinite Media** provides a dedicated `<AudioPlayer />` component tailored for technical podcasts, music streaming, audiobook narrations, and audio interviews.

It incorporates album artwork, artist bylines, chapter markers, speed presets, and automated **OS Lock-Screen Media Session** integration.

---

## Key Capabilities

- **Podcast Artwork & Metadata:** Displays high-resolution cover art, episode titles, and host bylines.
- **Playback Speed Selector:** Seamlessly switch between `0.75x`, `1x`, `1.25x`, `1.5x`, and `2x` rates without pitch distortion.
- **Fast Forward & Rewind:** Quick 15s skip buttons for rapid voice navigation.
- **Interactive Chapter Scrubbing:** WebVTT chapter markers for jumping directly to topic segments.
- **Lock-Screen Media Session Integration:** Displays track title, artist name, and transport controls on iOS Control Center, Android notification shades, and macOS media widgets.

---

## Quickstart

```tsx
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

## Media Session API Integration

When an audio file starts playing, `<AudioPlayer />` automatically initializes the browser's native `navigator.mediaSession`:

- **Title & Artist:** Synced to `props.title` and `props.artist`.
- **Cover Artwork:** Passes multi-resolution icons (`96x96`, `128x128`, `192x192`, `512x512`) derived from `props.artwork`.
- **Hardware Keys:** Responds to keyboard multimedia keys (Play, Pause, Previous Track, Next Track, Seek).
- **Position State:** Transmits `duration`, `playbackRate`, and `position` for smooth OS scrubbing.

---

## Playback Rates Configuration

Customize available playback speed options:

```tsx
<AudioPlayer
  src="https://media.example.com/audiobook.mp3"
  playbackRates={[0.8, 1.0, 1.2, 1.4, 1.6, 2.0]}
/>
```

---

## Minimal Audio Bar (Headless Sticky Player)

For sticky footer audio bars that stay visible across page navigation:

```tsx
import React from 'react';
import {
  MediaPlayer,
  MediaProvider,
  useMediaRemote,
  useMediaState,
} from '@nofinite/media/react';
import '@nofinite/nuicss/styles.css';

function StickyAudioBarControls({
  title,
  artist,
}: {
  title: string;
  artist: string;
}) {
  const remote = useMediaRemote();
  const paused = useMediaState('paused');
  const currentTime = useMediaState('currentTime');
  const duration = useMediaState('duration');

  return (
    <div className="fixed bottom-0 inset-x-0 bg-surface/90 backdrop-blur-xl border-t border-default p-3 flex items-center justify-between z-50">
      <div className="flex items-center gap-3">
        <button
          onClick={() => (paused ? remote.play() : remote.pause())}
          className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold"
        >
          {paused ? '▶' : '❚❚'}
        </button>
        <div>
          <div className="font-semibold text-xs text-default">{title}</div>
          <div className="text-[11px] text-muted">{artist}</div>
        </div>
      </div>

      <input
        type="range"
        min={0}
        max={duration || 100}
        value={currentTime}
        onChange={(e) => remote.seek(Number(e.target.value))}
        className="w-1/3 accent-primary cursor-pointer"
      />
    </div>
  );
}

export function GlobalAudioBar() {
  return (
    <MediaPlayer src="https://media.example.com/stream.mp3">
      <MediaProvider />
      <StickyAudioBarControls
        title="Live Keynote Audio Stream"
        artist="Nofinite Global Developer Conference"
      />
    </MediaPlayer>
  );
}
```
