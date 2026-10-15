# Headless Custom Player Layouts

While `<VideoPlayer />` and `<AudioPlayer />` provide complete turnkey interfaces out of the box, applications often require **fully customized, brand-specific media experiences** (e.g., minimalist floating video widgets, background ambient loopers, or bespoke podcast bars).

**Nofinite Media** re-exports low-level primitives (`MediaPlayer`, `MediaProvider`, `Track`) allowing you to compose completely custom UIs with standard HTML and **NUICSS** superclasses.

---

## Headless Architecture Overview

```
┌────────────────────────────────────────────────────────┐
│ <MediaPlayer>                                          │
│   ┌──────────────────────────────────────────────────┐ │
│   │ <MediaProvider /> (Renders native video/audio)   │ │
│   └──────────────────────────────────────────────────┘ │
│   ┌──────────────────────────────────────────────────┐ │
│   │ Custom UI Controls Layer (React + NUICSS)        │ │
│   │   - Play/Pause Button                            │ │
│   │   - Timeline Scrubber (useMediaState)            │ │
│   │   - Volume Popover                               │ │
│   │   - Picture-in-Picture Button (useMediaRemote)   │ │
│   └──────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘
```

---

## Complete Custom Player Implementation

Below is a complete, custom video player built using headless primitives:

```tsx
import React, { useRef } from 'react';
import {
  MediaPlayer,
  MediaProvider,
  useMediaState,
  useMediaRemote,
  type MediaPlayerInstance,
} from '@nofinite/media/react';
import '@nofinite/nuicss/styles.css';

function CustomVideoControls() {
  const remote = useMediaRemote();
  const paused = useMediaState('paused');
  const currentTime = useMediaState('currentTime');
  const duration = useMediaState('duration');
  const volume = useMediaState('volume');
  const isFullscreen = useMediaState('fullscreen');

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col gap-2 text-white">
      {/* Timeline Scrubber */}
      <input
        type="range"
        min={0}
        max={duration || 100}
        value={currentTime}
        onChange={(e) => remote.seek(Number(e.target.value))}
        className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-primary"
      />

      <div className="flex items-center justify-between text-xs">
        {/* Play/Pause & Time */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => (paused ? remote.play() : remote.pause())}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors font-bold"
          >
            {paused ? '▶' : '❚❚'}
          </button>
          <span className="font-mono">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>

        {/* Volume & Fullscreen */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => remote.changeVolume(volume === 0 ? 0.8 : 0)}
            className="hover:opacity-80 transition-opacity"
          >
            {volume === 0 ? '🔇' : '🔊'}
          </button>

          <button
            onClick={() =>
              isFullscreen ? remote.exitFullscreen() : remote.enterFullscreen()
            }
            className="hover:opacity-80 transition-opacity"
          >
            ⛶
          </button>
        </div>
      </div>
    </div>
  );
}

export function HeadlessVideoPlayer() {
  const playerRef = useRef<MediaPlayerInstance>(null);

  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl overflow-hidden border border-default bg-black relative group shadow-2xl">
      <MediaPlayer
        ref={playerRef}
        src="https://media.example.com/stream.mp4"
        aspectRatio="16/9"
        className="w-full h-full"
      >
        <MediaProvider />
        <CustomVideoControls />
      </MediaPlayer>
    </div>
  );
}
```

---

## Ambient Background Video Looper

Create silent, looping background hero videos with zero player chrome:

```tsx
export function HeroAmbientVideo() {
  return (
    <div className="relative w-full h-[480px] overflow-hidden rounded-3xl">
      <MediaPlayer
        src="https://media.example.com/ambient-loop.mp4"
        autoplay={true}
        loop={true}
        muted={true}
        playsinline={true}
        className="w-full h-full object-cover pointer-events-none"
      >
        <MediaProvider />
      </MediaPlayer>

      {/* Hero Headline Overlay */}
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-center p-6 text-white">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">
            Enterprise Infrastructure Scaled
          </h1>
          <p className="mt-2 text-sm text-white/80">
            Powering high-frequency global clusters with zero latency.
          </p>
        </div>
      </div>
    </div>
  );
}
```
