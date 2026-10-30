# AudioPlayer

**AudioPlayer** is a compact, accessible audio interface with high-resolution timeline scrubbing, volume controls, playback speed selector, and rich metadata display (artwork, title, and artist bylines).

```ts
// Framework-Agnostic Core (Zero React Dependency)
import { createMediaPlayer, formatMediaTime } from '@nofinite/media';

// React Adapter
import { AudioPlayer } from '@nofinite/media/react';
```

---

## Interactive Preview

---

## 1. Usage in Vanilla TypeScript / DOM (Core First)

In pure JavaScript or TypeScript, instantiate the audio player using `createMediaPlayer({ type: 'audio' })`:

```ts
import {
  createMediaPlayer,
  formatMediaTime,
  type MediaPlayerInstance,
} from '@nofinite/media';
import '@nofinite/nuicss/styles.css';

const container = document.getElementById('audio-container')!;

// 1. Initialize Framework-Agnostic Audio Player
const audioPlayer: MediaPlayerInstance = createMediaPlayer({
  src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3',
  type: 'audio',
  title: 'Episode 42: Modern Open-Source Frontend Architecture',
  artist: 'Dr. Elena Rostova & Marcus Brody',
  artwork: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200',
  controls: true,
  autoplay: false,
});

// 2. Mount into DOM
container.appendChild(audioPlayer.element);

// 3. Listen to player events
audioPlayer.on('timeupdate', () => {
  const { currentTime, duration } = audioPlayer.getState();
  console.log(
    `Progress: ${formatMediaTime(currentTime)} / ${formatMediaTime(duration)}`
  );
});

audioPlayer.on('play', () => console.log('Audio is playing'));
audioPlayer.on('pause', () => console.log('Audio paused'));

// 4. Imperative operations
// await audioPlayer.play();
// audioPlayer.setPlaybackRate(1.5);
// audioPlayer.setVolume(0.7);
// audioPlayer.seek(120);

// 5. Cleanup
// audioPlayer.destroy();
```

---

## 2. Usage in React

In React applications, import `AudioPlayer` from `@nofinite/media/react`:

```tsx
'use client';

import React from 'react';
import { AudioPlayer } from '@nofinite/media/react';
import '@nofinite/nuicss/styles.css';

export default function PodcastEpisode() {
  return (
    <div className="w-full max-w-md mx-auto p-4 rounded-xl border border-default bg-surface shadow-xs">
      <AudioPlayer
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3"
        title="Episode 42: Modern Open-Source Frontend Architecture"
        artist="Nofinite Engineering Podcast"
        artwork="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200"
      />
    </div>
  );
}
```

---

## Features

- **High-Resolution Scrubber:** Smooth, drag-to-seek timeline scrubber displaying elapsed and remaining duration formatted via `formatMediaTime()`.
- **Metadata Card:** Built-in thumbnail preview, bold title, and artist byline with graceful truncation.
- **Volume & Mute Slider:** Responsive volume slider with keyboard arrow increments and mute toggle.
- **Playback Rate Menu:** Instant 0.75×, 1×, 1.25×, 1.5×, and 2× playback speed adjustment.
- **Strict NUICSS Token Integration:** Completely styled using active NUICSS tokens (`.nui-media-container`, `.nui-vidstack-audio-player`).

---

## API Reference

### `createMediaPlayer(options)` Audio Options

| Option     | Type      | Default      | Description                                             |
| :--------- | :-------- | :----------- | :------------------------------------------------------ |
| `src`      | `string`  | **Required** | Audio source URL (MP3, WAV, OGG, AAC, HLS audio stream) |
| `type`     | `'audio'` | `'audio'`    | Sets player to audio layout mode                        |
| `title`    | `string`  | `undefined`  | Episode or track title                                  |
| `artist`   | `string`  | `undefined`  | Artist, podcast host, or author byline                  |
| `artwork`  | `string`  | `undefined`  | Album or episode cover art image URL                    |
| `controls` | `boolean` | `true`       | Whether to render the audio control layout              |
| `autoplay` | `boolean` | `false`      | Start audio playback automatically                      |
| `loop`     | `boolean` | `false`      | Loop track upon completion                              |
| `seekStep` | `number`  | `5`          | Arrow key seek interval in seconds                      |

---

### React `<AudioPlayer />` Props
