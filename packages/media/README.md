# @nofinite/media

Universal, framework-agnostic audio and video streaming media player suite powered by Vidstack and styled with `@nofinite/nuicss` design tokens.

## Features

- **Universal & Framework-Agnostic:** Built on W3C Custom Elements and native DOM standards, works in vanilla HTML/JS, React, Vue, Svelte, and Solid.
- **Adaptive Bitrate Streaming:** Native support for HLS (`.m3u8`), DASH (`.mpd`), MP4, WebM, MP3, WAV, AAC, and YouTube.
- **Audio & Video Unification:** Single, cohesive architecture providing both `<VideoPlayer>` and `<AudioPlayer>`.
- **Glassmorphic Theming:** Native integration with `@nofinite/nuicss` tokens (`var(--bg-surface)`, `backdrop-blur-sm`, `var(--color-primary)`).
- **Featherweight Core:** Player engines (HLS.js / Dash.js) are lazily loaded only when streaming sources require them.

## Installation

```bash
pnpm add @nofinite/media
```

## Usage

### React

```tsx
import { VideoPlayer, AudioPlayer } from '@nofinite/media/react';

// Video Player
export function Movie() {
  return (
    <VideoPlayer
      src="https://stream.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqTtjhqNZNUdMm3Y.m3u8"
      poster="https://image.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqTtjhqNZNUdMm3Y/thumbnail.webp"
    />
  );
}

// Audio Player
export function Podcast() {
  return (
    <AudioPlayer
      src="https://media.acast.com/sample-podcast.mp3"
      title="Episode 42: Modern Web Architecture"
      artist="Nofinite Tech"
    />
  );
}
```

### Vanilla JavaScript / DOM

```ts
import { createMediaPlayer } from '@nofinite/media';

const player = createMediaPlayer({
  src: 'https://files.vidstack.io/sprite-fight/720p.mp4',
  type: 'video',
  autoplay: false,
});

document.getElementById('media-container').appendChild(player.element);
```
