# React Media Hooks

**Nofinite Media** re-exports a comprehensive suite of high-performance React hooks for controlling playback, querying live player state, and managing tracks without unnecessary component re-renders.

---

## Core Hooks Summary

| Hook                         | Returns                       | Primary Purpose                                                                                      |
| :--------------------------- | :---------------------------- | :--------------------------------------------------------------------------------------------------- |
| **`useMediaRemote`**         | `MediaRemoteControl`          | Dispatches transport commands (`play`, `pause`, `seek`, `changeVolume`, `fullscreen`)                |
| **`useMediaState`**          | Reactive value                | Subscribes to fine-grained player state properties (`paused`, `currentTime`, `duration`, `buffered`) |
| **`useMediaPlayer`**         | `MediaPlayerInstance \| null` | Accesses the underlying DOM player instance and low-level methods                                    |
| **`useVideoQualityOptions`** | Array of quality options      | Lists adaptive HLS video resolutions with a `.select(quality)` method                                |
| **`useCaptionOptions`**      | Array of text tracks          | Lists available subtitle languages with a `.select(lang)` method                                     |
| **`usePlaybackRateOptions`** | Array of playback speeds      | Lists playback rates (`0.75x`–`2x`) with a `.select(rate)` method                                    |
| **`useActiveTextTrack`**     | Active track object           | Reactively monitors the active subtitles or chapters track                                           |

---

## Controlling Playback (`useMediaRemote`)

`useMediaRemote` provides a clean imperative controller to dispatch actions from anywhere inside a `<MediaPlayer>` tree:

```tsx
import React from 'react';
import { useMediaRemote } from '@nofinite/media/react';

export function CustomMediaControls() {
  const remote = useMediaRemote();

  return (
    <div className="flex items-center gap-2">
      <button onClick={() => remote.play()}>Play</button>
      <button onClick={() => remote.pause()}>Pause</button>
      <button onClick={() => remote.seek(30)}>Jump to 0:30</button>
      <button onClick={() => remote.changeVolume(0.5)}>Set 50% Volume</button>
      <button onClick={() => remote.toggleMuted()}>Toggle Mute</button>
      <button onClick={() => remote.enterPictureInPicture()}>
        Pop out (PiP)
      </button>
    </div>
  );
}
```

---

## Fine-Grained Reactive State (`useMediaState`)

Rather than subscribing to the entire player state object (which causes expensive re-renders on every animation frame), `useMediaState` listens **only to the specific property** your component needs:

```tsx
import React from 'react';
import { useMediaState } from '@nofinite/media/react';

// Re-renders ONLY when play/pause state flips (NOT during time updates)
export function PlayButtonIndicator() {
  const paused = useMediaState('paused');

  return <span>Current Status: {paused ? 'Paused' : 'Playing'}</span>;
}

// Re-renders ONLY when volume changes
export function VolumeIndicator() {
  const volume = useMediaState('volume');
  const muted = useMediaState('muted');

  return (
    <span>Volume: {muted ? 'Muted' : `${Math.round(volume * 100)}%`}</span>
  );
}
```

### Supported State Keys

- `'currentTime'` (seconds)
- `'duration'` (seconds)
- `'paused'` (boolean)
- `'playing'` (boolean)
- `'volume'` (0.0 to 1.0)
- `'muted'` (boolean)
- `'buffered'` (seconds)
- `'fullscreen'` (boolean)
- `'pictureInPicture'` (boolean)
- `'waiting'` (boolean - buffering)
- `'canPlay'` (boolean)

---

## Selecting Video Quality (`useVideoQualityOptions`)

Manage multi-bitrate HLS quality levels:

```tsx
import React from 'react';
import { useVideoQualityOptions } from '@nofinite/media/react';

export function QualityDropdown() {
  const qualities = useVideoQualityOptions();

  return (
    <select
      value={qualities.selectedValue}
      onChange={(e) => qualities.select(e.target.value)}
      className="text-xs bg-surface border border-default rounded px-2 py-1"
    >
      <option value="auto">Auto (Adaptive)</option>
      {qualities.map((q) => (
        <option key={q.value} value={q.value}>
          {q.label}
        </option>
      ))}
    </select>
  );
}
```

---

## Selecting Subtitles & Captions (`useCaptionOptions`)

Render a custom closed captions language selector:

```tsx
import React from 'react';
import { useCaptionOptions } from '@nofinite/media/react';

export function CaptionsPicker() {
  const captions = useCaptionOptions();

  return (
    <select
      value={captions.selectedValue}
      onChange={(e) => captions.select(e.target.value)}
      className="text-xs bg-surface border border-default rounded px-2 py-1"
    >
      <option value="off">Captions Off</option>
      {captions.map((track) => (
        <option key={track.value} value={track.value}>
          {track.label}
        </option>
      ))}
    </select>
  );
}
```
