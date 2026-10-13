# Nofinite Media

> Universal audio and video playback suite powered by W3C Custom Elements, Vidstack, and NUICSS design tokens.

---

## Overview

**Nofinite Media** (`@nofinite/media`) is a modern React streaming media player designed for high-fidelity audio and video delivery.

### Key Architectural Highlights

- **Adaptive Bitrate Streaming:** Native support for HLS streaming (`.m3u8`), DASH (`.mpd`), MP4, WebM, MP3, and WAV audio tracks with seamless resolution switching.
- **NUICSS OKLCH Token Bridge:** Scrubber timelines, volume bars, hover tooltips, and control buttons inherit directly from `--color-primary`, `--bg-surface`, and `--media-brand`.
- **Accessible Controls & Keyboard Shortcuts:** Standard hotkeys (Space for play/pause, M for mute, Left/Right for seeking, F for fullscreen).
- **Picture-in-Picture & Subtitles:** Built-in WebVTT caption parser and floating PiP support.

---

## Basic Example

```tsx
import React from 'react';
import { VideoPlayer } from '@nofinite/media/react';
import '@nofinite/nuicss/styles.css';
import '@nofinite/media/styles.css';

export function TutorialPlayer() {
  return (
    <div className="card overflow-hidden max-w-3xl mx-auto">
      <VideoPlayer
        title="Nofinite Walkthrough"
        src="https://stream.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqTtjhjhvwaQA1g.m3u8"
        poster="https://files.vidstack.io/poster.png"
      />
    </div>
  );
}
```

---

## Guides & Catalog

- [Installation & Setup](./installation.md) — Package installation, layout stylesheets, and requirements.
- [VideoPlayer](./video-player.md) — Adaptive video player with HLS streaming, captions, and poster setup.
- [AudioPlayer](./audio-player.md) — Audio streaming with track scrubber, volume control, and metadata cards.
