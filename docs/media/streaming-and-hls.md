# Adaptive Bitrate Streaming and HLS

**Nofinite Media** provides built-in, zero-configuration support for **HTTP Live Streaming (HLS)** (`.m3u8`) and **Dynamic Adaptive Streaming over HTTP (DASH)** (`.mpd`) video distribution.

The engine automatically detects streaming manifests, dynamically loads the lightweight MSE demuxing engine on Chromium and Firefox, and seamlessly utilizes native Apple AVFoundation hardware decoding on Safari and iOS WebKit.

```ts
// Framework-Agnostic Core (Zero React Dependency)
import { createMediaPlayer, isHlsSource, isDashSource } from '@nofinite/media';

// React Adapter
import { VideoPlayer } from '@nofinite/media/react';
```

---

## Manifest Detection Architecture

The core player evaluates source URLs using internal pattern matchers before requesting the stream:

```ts
import { isHlsSource, isDashSource } from '@nofinite/media';

console.log(isHlsSource('https://stream.mux.com/v69R127x.m3u8')); // true
console.log(isDashSource('https://dash.example.com/stream.mpd')); // true
console.log(isHlsSource('https://cdn.example.com/asset.mp4')); // false
```

When an `.m3u8` source is detected:

1. **Apple WebKit (macOS / iOS Safari):** The browser's native hardware decoder executes the stream with maximum power efficiency and FairPlay DRM support.
2. **Chromium & Firefox:** The engine automatically initializes an MSE (Media Source Extensions) worker, downloads the master manifest, and negotiates video/audio elementary streams.

---

## 1. Usage in Vanilla TypeScript / DOM (Core First)

In pure JavaScript or TypeScript, pass the `.m3u8` or `.mpd` URL directly to `createMediaPlayer()`:

```ts
import { createMediaPlayer, isHlsSource } from '@nofinite/media';
import '@nofinite/nuicss/styles.css';

const container = document.getElementById('streaming-mount')!;

const hlsStreamUrl =
  'https://stream.mux.com/v69R127x00KSKGrGQgahP800ugny00JvlA.m3u8';

// Verify manifest format
if (isHlsSource(hlsStreamUrl)) {
  console.log('Detected valid HLS manifest stream');
}

// 1. Initialize Adaptive Stream Player
const player = createMediaPlayer({
  src: hlsStreamUrl,
  type: 'video',
  poster:
    'https://image.mux.com/v69R127x00KSKGrGQgahP800ugny00JvlA/thumbnail.webp?time=2',
  title: 'Distributed Cloud Architecture Keynote',
  aspectRatio: '16/9',
  controls: true,
  autoplay: false,
});

// 2. Mount player into DOM
container.appendChild(player.element);

// 3. Listen for streaming lifecycle events
player.on('canplay', () => console.log('HLS manifest loaded; ready to stream'));
player.on('waiting', () => console.log('Buffering next segment chunks...'));
player.on('error', (err) => console.error('Streaming error detected:', err));
```

---

## 2. Usage in React

In React applications, import `VideoPlayer` from `@nofinite/media/react`:

```tsx
'use client';

import React from 'react';
import { VideoPlayer } from '@nofinite/media/react';
import '@nofinite/nuicss/styles.css';

export function HlsStreamPlayer() {
  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-default bg-black">
      <VideoPlayer
        src="https://stream.mux.com/v69R127x00KSKGrGQgahP800ugny00JvlA.m3u8"
        poster="https://image.mux.com/v69R127x00KSKGrGQgahP800ugny00JvlA/thumbnail.webp?time=2"
        title="High-Throughput Distributed Streaming Architecture"
        aspectRatio="16/9"
        controls={true}
      />
    </div>
  );
}
```

---

## Live Streaming with DVR Windows

For live broadcasts, the player supports real-time stream synchronization and live DVR timeline scrub navigation (jumping backward into live buffer cache and clicking "Live" to return to edge):

### Vanilla TypeScript Live Stream

```ts
const livePlayer = createMediaPlayer({
  src: 'https://live.example.com/broadcast/event.m3u8',
  type: 'video',
  title: 'Keynote Address (Live Broadcast)',
  controls: true,
  autoplay: true,
  muted: true, // Recommended for browser autoplay compliance
});

document.getElementById('live-mount')!.appendChild(livePlayer.element);
```

### React Live Stream

```tsx
<VideoPlayer
  src="https://live.example.com/broadcast/event.m3u8"
  title="Keynote Address (Live Broadcast)"
  controls={true}
  autoplay={true}
  muted={true}
/>
```

---

## Network Resiliency & Auto Quality Adaptation

The adaptive bitrate (ABR) engine measures network bandwidth in real time during chunk downloads:

- **Bandwidth Throttling:** If network throughput drops, the player seamlessly steps down resolution (e.g., `1080p` → `720p` → `480p`) to eliminate buffering pauses.
- **Bandwidth Recovery:** When connection stabilizes, the player automatically steps back up to higher bitrates without interrupting audio.
- **Manual Quality Override:** Users can click the settings gear in the player toolbar to lock playback to specific target resolutions (`1080p`, `720p`, `480p`, or `Auto`).
