# Headless Custom Player Layouts

While turnkey players provide complete interfaces out of the box, applications frequently require **custom, brand-specific media experiences** (e.g. minimalist floating video widgets, background ambient loopers, or bespoke podcast bars).

**Nofinite Media** is designed as a headless engine first: you can disable default controls (`controls: false`) and compose custom interfaces with standard HTML/DOM elements or declarative React components using **NUICSS** superclasses.

```ts
// Framework-Agnostic Core (Zero React Dependency)
import { createMediaPlayer, formatMediaTime } from '@nofinite/media';

// React Adapter (Headless Primitives & Hooks)
import {
  MediaPlayer,
  MediaProvider,
  useMediaState,
  useMediaRemote,
} from '@nofinite/media/react';
```

---

## 1. Usage in Vanilla TypeScript / DOM (Core First)

In pure JavaScript or TypeScript, pass `controls: false` to `createMediaPlayer()`. This initializes the video engine without default control bars, allowing you to attach your own bespoke control elements:

```ts
import { createMediaPlayer, formatMediaTime } from '@nofinite/media';
import '@nofinite/nuicss/styles.css';

const container = document.getElementById('headless-mount')!;

// 1. Initialize Headless Video Player (No Default Controls)
const player = createMediaPlayer({
  src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  type: 'video',
  aspectRatio: '16/9',
  controls: false, // Disables default Vidstack video layout
  autoplay: false,
});

// 2. Mount Player Container
container.appendChild(player.element);

// 3. Build Custom Control Overlay in Vanilla DOM
const overlay = document.createElement('div');
overlay.className =
  'absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between text-white text-xs z-10';

const playBtn = document.createElement('button');
playBtn.className =
  'w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center font-bold transition-colors';
playBtn.textContent = '▶';

const timeDisplay = document.createElement('span');
timeDisplay.className = 'font-mono text-xs opacity-90';
timeDisplay.textContent = '0:00 / 0:00';

overlay.appendChild(playBtn);
overlay.appendChild(timeDisplay);
player.element.appendChild(overlay);

// 4. Bind Control Logic to Player Instance
playBtn.addEventListener('click', () => {
  const state = player.getState();
  if (state.paused) {
    player.play();
  } else {
    player.pause();
  }
});

player.on('play', () => {
  playBtn.textContent = '❚❚';
});

player.on('pause', () => {
  playBtn.textContent = '▶';
});

player.on('timeupdate', () => {
  const { currentTime, duration } = player.getState();
  timeDisplay.textContent = `${formatMediaTime(
    currentTime
  )} / ${formatMediaTime(duration)}`;
});
```

---

## 2. Usage in React

In React, compose low-level headless primitives re-exported from `@nofinite/media/react`:

```tsx
'use client';

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

  return (
    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between text-white text-xs z-10">
      <button
        onClick={() => (paused ? remote.play() : remote.pause())}
        className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center font-bold transition-colors"
      >
        {paused ? '▶' : '❚❚'}
      </button>

      <span className="font-mono text-xs">
        {Math.floor(currentTime)}s / {Math.floor(duration || 0)}s
      </span>
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

## Recipe: Ambient Hero Background Video Looper

Zero-UI background video with muted autoplay and loop:

### Vanilla TypeScript

```ts
const backgroundLooper = createMediaPlayer({
  src: '/assets/ambient-aurora.mp4',
  type: 'video',
  controls: false,
  autoplay: true,
  muted: true,
  loop: true,
  playsinline: true,
  aspectRatio: '16/9',
  className: 'w-full h-full object-cover pointer-events-none opacity-40',
});

document
  .getElementById('hero-background')!
  .appendChild(backgroundLooper.element);
```

### React

```tsx
<div className="relative w-full h-[500px] overflow-hidden">
  <MediaPlayer
    src="/assets/ambient-aurora.mp4"
    autoplay={true}
    muted={true}
    loop={true}
    playsinline={true}
    className="w-full h-full object-cover pointer-events-none opacity-40"
  >
    <MediaProvider />
  </MediaPlayer>
</div>
```
