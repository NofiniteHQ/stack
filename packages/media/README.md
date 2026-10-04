# @nofinite/media

Universal, enterprise-grade audio and video streaming media player suite powered by Vidstack and styled with `@nofinite/nuicss` design tokens.

[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)
[![NPM Version](https://img.shields.io/npm/v/@nofinite/media.svg)](https://www.npmjs.com/package/@nofinite/media)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

---

## Highlights

- **Framework-Agnostic Core:** Native W3C Custom Element engine (`createMediaPlayer`) with zero React dependencies or bundle penalty.
- **Next.js App Router & RSC Ready:** React entrypoint preserves byte-0 `'use client';` directives across both ESM and CJS bundles.
- **Adaptive Streaming Built-In:** Native support for HLS (`.m3u8`), DASH (`.mpd`), MP4, WebM, MP3, WAV, AAC, and YouTube with lazy-loaded streaming decoders.
- **Glassmorphic OKLCH Theming:** Fully harmonized with `@nofinite/nuicss` design tokens (`--color-primary`, `--bg-surface`, `--bg-subtle`, `--fg-default`) supporting seamless light and dark mode cascading.
- **CDN CORS Resilience:** Default `crossOrigin="anonymous"` handling prevents browser CORS rejections on external WebVTT subtitles, storyboard thumbnails, and audio streams.
- **Zero Memory Leaks:** Automatic listener registry detachment and element teardown on `player.destroy()`, engineered for single-page applications.

---

## Installation

```bash
# pnpm
pnpm add @nofinite/media

# npm
npm install @nofinite/media

# yarn
yarn add @nofinite/media
```

---

## Styles Setup

Import the unified player stylesheet in your application's entrypoint or root layout:

```ts
// In your root layout (Next.js layout.tsx, Vite main.tsx, or index.ts)
import '@nofinite/media/styles';
```

Alternatively, you can import the raw CSS file directly:

```css
@import '@nofinite/media/styles.css';
```

---

## Usage

### 1. React Video Player

```tsx
import { VideoPlayer } from '@nofinite/media/react';

export function MoviePlayer() {
  return (
    <VideoPlayer
      title="Sprite Fight Keynote"
      src="https://files.vidstack.io/sprite-fight/hls/stream.m3u8"
      poster="https://files.vidstack.io/sprite-fight/poster.webp"
      thumbnails="https://files.vidstack.io/sprite-fight/thumbnails.vtt"
      playbackRates={[0.5, 0.75, 1, 1.25, 1.5, 2]}
      seekStep={10}
      crossOrigin="anonymous"
      tracks={[
        {
          src: 'https://files.vidstack.io/sprite-fight/subs/english.vtt',
          label: 'English',
          language: 'en-US',
          kind: 'subtitles',
          default: true,
        },
        {
          src: 'https://files.vidstack.io/sprite-fight/subs/spanish.vtt',
          label: 'Spanish',
          language: 'es-ES',
          kind: 'subtitles',
        },
      ]}
      onPlay={() => console.log('Playback started')}
      onTimeUpdate={({ currentTime, duration }) => {
        console.log(`Progress: ${currentTime}/${duration}`);
      }}
    />
  );
}
```

### 2. React Audio Player

```tsx
import { AudioPlayer } from '@nofinite/media/react';

export function PodcastPlayer() {
  return (
    <AudioPlayer
      title="Episode 42: Modern Web Architecture"
      artist="Nofinite Studio"
      artwork="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200"
      src="https://files.vidstack.io/audio/audio.mp3"
      playbackRates={[0.75, 1, 1.25, 1.5]}
      seekStep={15}
      theme="auto"
    />
  );
}
```

### 3. Vanilla JavaScript / Framework-Agnostic Core

```ts
import { createMediaPlayer } from '@nofinite/media';

const player = createMediaPlayer({
  src: 'https://files.vidstack.io/sprite-fight/720p.mp4',
  poster: 'https://files.vidstack.io/sprite-fight/poster.webp',
  title: 'Sprite Fight',
  autoplay: false,
  muted: false,
  controls: true,
  aspectRatio: '16/9',
  playbackRates: [0.5, 1, 1.5, 2],
  tracks: [
    {
      src: 'https://files.vidstack.io/sprite-fight/subs/english.vtt',
      label: 'English',
      language: 'en-US',
      kind: 'subtitles',
      default: true,
    },
  ],
});

// Append to DOM
document.getElementById('app')?.appendChild(player.element);

// Reactive event listeners
const unsubscribe = player.on('time-update', (detail) => {
  console.log('Current time:', detail.currentTime);
});

// Imperative controls
player.seek(45);
player.setVolume(0.8);
player.setPlaybackRate(1.25);

// Cleanup on unmount (SPA safe, detaches all listeners)
// player.destroy();
```

---

## API Reference

### `VideoPlayerProps`

| Prop            | Type                                          | Default                          | Description                                                          |
| :-------------- | :-------------------------------------------- | :------------------------------- | :------------------------------------------------------------------- |
| `src` / `url`   | `string`                                      | —                                | Media stream or file URL (HLS, DASH, MP4, WebM, YouTube).            |
| `poster`        | `string`                                      | —                                | Preview poster image URL displayed before playback starts.           |
| `title`         | `string`                                      | —                                | Title of the media asset.                                            |
| `aspectRatio`   | `string`                                      | `'16/9'`                         | Aspect ratio of the player container.                                |
| `autoPlay`      | `boolean`                                     | `false`                          | Automatically begin playback when loaded.                            |
| `muted`         | `boolean`                                     | `false`                          | Whether audio is muted.                                              |
| `loop`          | `boolean`                                     | `false`                          | Loop media once it reaches the end.                                  |
| `controls`      | `boolean`                                     | `true`                           | Display the default Vidstack video controls overlay.                 |
| `theme`         | `'auto' \| 'light' \| 'dark'`                 | `'auto'`                         | Force light or dark mode styling, or adapt automatically.            |
| `thumbnails`    | `string`                                      | —                                | WebVTT storyboard thumbnails file URL for scrubbing previews.        |
| `playbackRates` | `number[]`                                    | —                                | Available playback speed options in the settings menu.               |
| `seekStep`      | `number`                                      | `10`                             | Seconds to skip forward/backward on keyboard navigation.             |
| `crossOrigin`   | `'anonymous' \| 'use-credentials' \| boolean` | `'anonymous'`                    | CORS policy for media, subtitles, and thumbnails.                    |
| `load`          | `'eager' \| 'idle' \| 'visible' \| 'play'`    | `autoPlay ? 'eager' : 'visible'` | Strategy used to load the media player engine.                       |
| `preload`       | `'none' \| 'metadata' \| 'auto'`              | —                                | Media buffering preload strategy.                                    |
| `tracks`        | `MediaTrack[]`                                | —                                | Subtitle and caption tracks (`src`, `label`, `language`, `default`). |
| `slots`         | `Record<string, ReactNode>`                   | —                                | Custom slot overrides for video layout chrome.                       |

### `AudioPlayerProps`

| Prop            | Type                                          | Default       | Description                                            |
| :-------------- | :-------------------------------------------- | :------------ | :----------------------------------------------------- |
| `src` / `url`   | `string`                                      | —             | Audio stream or file URL (MP3, AAC, WAV, OGG, HLS).    |
| `title`         | `string`                                      | —             | Track title displayed in the audio metadata card.      |
| `artist`        | `string`                                      | —             | Artist or podcast author name.                         |
| `artwork`       | `string`                                      | —             | Album art or podcast thumbnail URL.                    |
| `theme`         | `'auto' \| 'light' \| 'dark'`                 | `'auto'`      | Theme scheme override (`'auto'`, `'light'`, `'dark'`). |
| `playbackRates` | `number[]`                                    | —             | Playback speed options in the audio settings menu.     |
| `seekStep`      | `number`                                      | `10`          | Seek duration step in seconds.                         |
| `crossOrigin`   | `'anonymous' \| 'use-credentials' \| boolean` | `'anonymous'` | Cross-origin resource sharing attribute.               |

### `MediaPlayerInstance` (Core Engine Methods)

The imperative instance returned by `createMediaPlayer` (and forwarded by `ref` on React components):

| Method                    | Signature                         | Description                                                                      |
| :------------------------ | :-------------------------------- | :------------------------------------------------------------------------------- |
| `play()`                  | `() => Promise<void>`             | Starts media playback.                                                           |
| `pause()`                 | `() => void`                      | Pauses media playback.                                                           |
| `seek(time)`              | `(time: number) => void`          | Seeks playback to the specified time in seconds.                                 |
| `setVolume(vol)`          | `(volume: number) => void`        | Sets audio volume (between `0` and `1`).                                         |
| `setMuted(muted)`         | `(muted: boolean) => void`        | Sets or removes mute state.                                                      |
| `setPlaybackRate(rate)`   | `(rate: number) => void`          | Sets playback speed rate (e.g. `1.25`).                                          |
| `setSrc(url)`             | `(newSrc: string) => void`        | Changes media source dynamically.                                                |
| `enterFullscreen()`       | `() => Promise<void>`             | Enters fullscreen mode with safe error rejection handling.                       |
| `exitFullscreen()`        | `() => Promise<void>`             | Exits fullscreen mode.                                                           |
| `enterPictureInPicture()` | `() => Promise<void>`             | Enters Picture-in-Picture mode (supported video).                                |
| `exitPictureInPicture()`  | `() => Promise<void>`             | Exits Picture-in-Picture mode.                                                   |
| `getState()`              | `() => MediaPlayerState`          | Retrieves current player snapshot (currentTime, duration, paused, volume, etc.). |
| `on(event, cb)`           | `(event, callback) => () => void` | Subscribes to player event; returns an unsubscription function.                  |
| `destroy()`               | `() => void`                      | Detaches all registered listeners and unmounts DOM elements cleanly.             |

---

## Re-exported Vidstack Primitives

For developers building bespoke media interfaces, `@nofinite/media/react` re-exports the foundational Vidstack state hooks and compound components:

```tsx
import {
  MediaPlayer,
  MediaProvider,
  Track,
  useMediaState,
  useMediaRemote,
  useActiveTextTrack,
  useVideoQualityOptions,
  useCaptionOptions,
  usePlaybackRateOptions,
  DefaultVideoLayout,
  DefaultAudioLayout,
} from '@nofinite/media/react';
```

---

## License

Apache-2.0 © [Nofinite HQ](https://nofinite.design)
