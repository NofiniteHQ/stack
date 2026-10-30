# VideoPlayer

**Nofinite Media** provides a universal, responsive video playback engine supporting MP4, WebM, HLS, and DASH streaming with keyboard shortcuts, picture-in-picture, multi-language WebVTT subtitles, and hardware-accelerated playback.

```ts
// Framework-Agnostic Core (Zero React Dependency)
import { createMediaPlayer, isHlsSource } from '@nofinite/media';

// React Adapter
import { VideoPlayer } from '@nofinite/media/react';
```

---

## Interactive Preview

---

## 1. Usage in Vanilla TypeScript / DOM (Core First)

In pure JavaScript or TypeScript, instantiate the video player using `createMediaPlayer()`. It returns a lifecycle-managed instance that mounts directly to any DOM element:

```ts
import { createMediaPlayer, type MediaPlayerInstance } from '@nofinite/media';
import '@nofinite/nuicss/styles.css';

const container = document.getElementById('player-root')!;

// 1. Initialize Video Player
const player: MediaPlayerInstance = createMediaPlayer({
  src: 'https://stream.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqTtjhqNZNUxMm300.m3u8',
  type: 'video',
  poster: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200',
  aspectRatio: '16/9',
  controls: true,
  autoplay: false,
  seekStep: 5,
  tracks: [
    {
      src: '/captions/en.vtt',
      kind: 'subtitles',
      label: 'English',
      language: 'en',
      default: true,
    },
    {
      src: '/captions/es.vtt',
      kind: 'subtitles',
      label: 'Español',
      language: 'es',
    },
  ],
});

// 2. Mount player into document DOM
container.appendChild(player.element);

// 3. Attach event listeners
player.on('play', () => console.log('Playback started'));
player.on('pause', () => console.log('Playback paused'));
player.on('timeupdate', () => {
  const state = player.getState();
  console.log(`Playback time: ${state.currentTime}s of ${state.duration}s`);
});

// 4. Imperative API operations
// await player.play();
// player.seek(45);
// player.setVolume(0.8);
// await player.enterPictureInPicture();
// await player.enterFullscreen();

// 5. Cleanup when disposing
// player.destroy();
```

---

## 2. Usage in React

In React applications, import `VideoPlayer` from `@nofinite/media/react`:

```tsx
'use client';

import React from 'react';
import { VideoPlayer } from '@nofinite/media/react';
import '@nofinite/nuicss/styles.css';

export function ReactVideoDemo() {
  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl overflow-hidden border border-default shadow-xl bg-black">
      <VideoPlayer
        src="https://stream.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqTtjhqNZNUxMm300.m3u8"
        poster="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200"
        aspectRatio="16/9"
        controls={true}
        tracks={[
          {
            src: '/captions/en.vtt',
            kind: 'subtitles',
            label: 'English',
            language: 'en',
            default: true,
          },
          {
            src: '/captions/es.vtt',
            kind: 'subtitles',
            label: 'Español',
            language: 'es',
          },
        ]}
      />
    </div>
  );
}
```

---

## Features

### 1. MP4 and Adaptive Streaming (HLS & DASH)

Accepts local or remote video URLs. HLS streams (`.m3u8`) and DASH streams (`.mpd`) are automatically detected and decoded via MSE pipelines:

```ts
// 1. Standard MP4
const mp4Player = createMediaPlayer({
  src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  type: 'video',
});

// 2. HLS Adaptive Stream (.m3u8)
const hlsPlayer = createMediaPlayer({
  src: 'https://stream.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqTtjhqNZNUxMm300.m3u8',
  type: 'video',
});
```

### 2. Captions & Subtitles

Pass subtitle tracks using standard HTML track definitions:

```ts
const player = createMediaPlayer({
  src: '/videos/keynote.mp4',
  tracks: [
    {
      src: '/captions/en.vtt',
      kind: 'subtitles',
      label: 'English',
      language: 'en',
      default: true,
    },
    {
      src: '/captions/de.vtt',
      kind: 'subtitles',
      label: 'Deutsch',
      language: 'de',
    },
  ],
});
```

---

## Keyboard Shortcuts

Both vanilla and React players support standard accessible keyboard shortcuts out of the box:

| Shortcut                        | Action                            |
| :------------------------------ | :-------------------------------- |
| <Kbd>Space</Kbd> / <Kbd>K</Kbd> | Toggle Play / Pause               |
| <Kbd>→</Kbd> / <Kbd>←</Kbd>     | Seek forward / backward 5 seconds |
| <Kbd>↑</Kbd> / <Kbd>↓</Kbd>     | Increase / decrease volume 5%     |
| <Kbd>M</Kbd>                    | Toggle Mute                       |
| <Kbd>F</Kbd>                    | Toggle Fullscreen                 |
| <Kbd>P</Kbd>                    | Toggle Picture-in-Picture         |
| <Kbd>C</Kbd>                    | Toggle Closed Captions            |

---

## API Reference

### `createMediaPlayer(options)` Options

| Option        | Type                 | Default      | Description                                                    |
| :------------ | :------------------- | :----------- | :------------------------------------------------------------- |
| `src`         | `string`             | **Required** | Video source URL (MP4, WebM, HLS `.m3u8`, DASH `.mpd`)         |
| `type`        | `'video' \| 'audio'` | `'video'`    | Media view type                                                |
| `poster`      | `string`             | `undefined`  | Preview image URL displayed prior to playback                  |
| `aspectRatio` | `string`             | `'16/9'`     | Container aspect ratio (e.g. `'16/9'`, `'4/3'`, `'1/1'`)       |
| `controls`    | `boolean`            | `true`       | Whether to render the default UI control layout                |
| `autoplay`    | `boolean`            | `false`      | Whether to begin playback immediately                          |
| `loop`        | `boolean`            | `false`      | Whether to loop the video upon reaching the end                |
| `muted`       | `boolean`            | `false`      | Start muted                                                    |
| `playsinline` | `boolean`            | `true`       | Prevent mobile browser from forcing native fullscreen          |
| `tracks`      | `MediaTrack[]`       | `[]`         | Array of subtitle, caption, or chapter track definitions       |
| `thumbnails`  | `string`             | `undefined`  | WebVTT sprite storyboard URL for timeline hover scrub previews |
| `seekStep`    | `number`             | `5`          | Number of seconds to jump during arrow key seeks               |

---

### React `<VideoPlayer />` Props
