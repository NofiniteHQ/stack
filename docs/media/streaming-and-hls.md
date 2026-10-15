# Adaptive Bitrate Streaming and HLS

**Nofinite Media** provides built-in, zero-configuration support for **HTTP Live Streaming (HLS)** (`.m3u8`) and **DASH** (`.mpd`) video distribution.

The player automatically detects streaming manifests, dynamically loads the lightweight `hls.js` engine on non-Safari platforms, and falls back to native AVFoundation HLS hardware decoding on Apple devices (macOS Safari, iOS).

---

## Key Capabilities

- **Automatic Protocol Detection:** Passing an `.m3u8` manifest to `src` automatically activates the adaptive streaming pipeline.
- **Adaptive Bitrate (ABR) Switching:** Continuously monitors bandwidth and frame drops to switch between 4K, 1080p, 720p, and 480p renditions without stuttering.
- **Manual Quality Selection:** Populates an accessible resolution picker in the player settings menu.
- **Live Stream DVR:** Supports live broadcasts with seekable time-shifted buffers (`streamType="live"`).
- **Zero Style Overhead:** Controlled entirely through **NUICSS** superclasses.

---

## Quickstart: Streaming an HLS Master Manifest

Pass an `.m3u8` manifest directly to `<VideoPlayer />`:

```tsx
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

## Cross-Platform HLS Engine Architecture

```
                       [Video Source (.m3u8)]
                                 │
                 ┌───────────────┴───────────────┐
                 ▼                               ▼
       [Safari / Apple iOS]             [Chromium / Firefox / Edge]
                 │                               │
                 ▼                               ▼
     Native Hardware Decoder            hls.js Managed Isolates
   (AVFoundation / WebKit)         (WebWorker Demuxing & MSE Buffers)
```

1. **Native Platform (Apple Safari & iOS WebKit):** The browser handles HLS natively. Nofinite Media hooks directly into `<video>` element events without third-party JavaScript overhead.
2. **Modern Browsers (Chrome, Brave, Edge, Firefox):** Automatically mounts `hls.js` inside Media Source Extensions (MSE), enabling multi-audio track switching, closed captions demuxing, and cryptographic AES-128 stream decryption.

---

## Quality Level Controls & Hooks

Access and manipulate available video qualities programmatically using `useVideoQualityOptions`:

```tsx
import React from 'react';
import { useVideoQualityOptions } from '@nofinite/media/react';

export function CustomQualitySelector() {
  const options = useVideoQualityOptions();

  if (options.length <= 1) {
    return null; // Single bitrate stream
  }

  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-muted">Quality:</span>
      <select
        value={options.selectedValue}
        onChange={(e) => options.select(e.target.value)}
        className="bg-surface border border-default rounded px-2 py-1 text-default"
      >
        <option value="auto">Auto (Adaptive)</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label} (
            {opt.bitrate ? `${(opt.bitrate / 1000000).toFixed(1)} Mbps` : ''})
          </option>
        ))}
      </select>
    </div>
  );
}
```

---

## Live DVR Streaming

For live events, webinar broadcasts, and continuous telemetry feeds, configure the player for live streaming:

```tsx
<VideoPlayer
  src="https://live.example.com/broadcast/event.m3u8"
  streamType="live"
  title="Keynote Address (Live)"
  poster="https://live.example.com/poster.jpg"
/>
```

When `streamType="live"`:

- The progress bar displays a red **LIVE** indicator badge.
- Clicking the badge seeks to the live broadcast edge.
- Scrubbing backward scrubs through the time-shifted DVR sliding window.
