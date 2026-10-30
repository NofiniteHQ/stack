# React Media Hooks & Core Event Architecture

**Nofinite Media** provides a dual-model state architecture:

1. **Core Event & State API (`@nofinite/media`):** Universal, zero-framework DOM event listeners and synchronous `player.getState()` queries.
2. **React Hooks Suite (`@nofinite/media/react`):** Granular reactive hooks that subscribe to media states without triggering unnecessary component re-renders.

---

## 1. Core Event & State API in Vanilla TypeScript (Core First)

In pure JavaScript/TypeScript, reactive UI updates are implemented via `player.on()` and `player.getState()`:

```ts
import { createMediaPlayer, type MediaPlayerState } from '@nofinite/media';
import '@nofinite/nuicss/styles.css';

const player = createMediaPlayer({
  src: 'https://media.example.com/stream.mp4',
  type: 'video',
});

// 1. Synchronous State Inspection
const state: MediaPlayerState = player.getState();
console.log({
  paused: state.paused,
  currentTime: state.currentTime,
  duration: state.duration,
  volume: state.volume,
  buffered: state.buffered,
});

// 2. Lifecycle Event Subscriptions
const unsubscribePlay = player.on('play', () => {
  console.log('Playback commenced');
});

const unsubscribeTime = player.on('timeupdate', () => {
  const current = player.getState().currentTime;
  console.log(`Current time: ${current}s`);
});

// 3. Clean up listeners when done
// unsubscribePlay();
// unsubscribeTime();
```

---

## 2. React Hooks Suite (`@nofinite/media/react`)

When building inside React component hierarchies under `<MediaPlayer>`, hooks re-exported from `@nofinite/media/react` provide declarative bindings:

| Hook                         | Returns                       | Primary Purpose                                                                                      |
| :--------------------------- | :---------------------------- | :--------------------------------------------------------------------------------------------------- |
| **`useMediaRemote`**         | `MediaRemoteControl`          | Dispatches transport commands (`play`, `pause`, `seek`, `changeVolume`, `fullscreen`)                |
| **`useMediaState`**          | Reactive value                | Subscribes to fine-grained player state properties (`paused`, `currentTime`, `duration`, `buffered`) |
| **`useMediaPlayer`**         | `MediaPlayerInstance \| null` | Accesses the underlying DOM player instance and low-level methods                                    |
| **`useVideoQualityOptions`** | Array of quality options      | Lists adaptive HLS video resolutions with a `.select(quality)` method                                |
| **`useCaptionOptions`**      | Array of text tracks          | Lists available subtitle languages with a `.select(lang)` method                                     |
| **`usePlaybackRateOptions`** | Array of playback speeds      | Lists playback rates (`0.75x`–`2x`) with a `.select(rate)` method                                    |

---

### React Transport Controls Example

```tsx
'use client';

import React from 'react';
import { useMediaRemote, useMediaState } from '@nofinite/media/react';

export function CustomTransportControls() {
  const remote = useMediaRemote();
  const paused = useMediaState('paused');
  const currentTime = useMediaState('currentTime');
  const duration = useMediaState('duration');

  return (
    <div className="flex items-center gap-3 p-3 bg-surface border border-default rounded-xl shadow-xs">
      <button
        onClick={() => (paused ? remote.play() : remote.pause())}
        className="btn btn-primary btn-sm"
      >
        {paused ? '▶ Play' : '❚❚ Pause'}
      </button>

      <span className="font-mono text-xs text-muted">
        {Math.floor(currentTime)}s / {Math.floor(duration || 0)}s
      </span>
    </div>
  );
}
```

---

### React Adaptive Quality Selector Example

```tsx
'use client';

import React from 'react';
import { useVideoQualityOptions } from '@nofinite/media/react';

export function QualitySelector() {
  const options = useVideoQualityOptions();

  if (!options || options.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted">Resolution:</span>
      <select
        className="select select-sm bg-surface border border-default rounded-md text-xs"
        onChange={(e) => {
          const selected = options.find((opt) => opt.id === e.target.value);
          selected?.select();
        }}
      >
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.height ? `${opt.height}p` : 'Auto'}
          </option>
        ))}
      </select>
    </div>
  );
}
```
