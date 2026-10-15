# Nofinite Media

> Accessible, customizable audio and video player primitives for React with seamless NUICSS OKLCH token theming.

---

## Overview

**Nofinite Media** (`@nofinite/media`) provides headless and styled audio/video playback components. It offers:

- **NUICSS Token Integration:** Player scrubber, volume sliders, and control buttons cascade seamlessly from `--color-primary`, `--bg-surface`, and `--media-brand`.
- **Adaptive Streaming:** Native HLS and DASH stream support with automatic quality level switching.
- **Accessible Controls:** Keyboard hotkeys (Space for play/pause, M for mute, Left/Right for seek, F for fullscreen).
- **Picture-in-Picture & Captions:** Native Web VTT subtitle rendering and PiP toggling out of the box.

---

## Quickstart

### 1. Installation

```bash
npm install @nofinite/media @nofinite/nuicss
# or
pnpm add @nofinite/media @nofinite/nuicss
```

### 2. Stylesheet Import

Import the unified NUICSS stylesheet:

```tsx
import '@nofinite/nuicss/styles.css';
```

> **Zero Downstream CSS Note:** Do **not** import `@nofinite/media/styles.css`. NUICSS provides all styling automatically.
>
> **Note:** For modular setups, NUICSS also exports a dedicated subpath: `@nofinite/nuicss/media.css`.

### 3. Usage Example

```tsx
import React from 'react';
import { MediaPlayer, MediaProvider, Video } from '@nofinite/media';

export function TutorialPlayer() {
  return (
    <div className="card overflow-hidden max-w-3xl mx-auto">
      <MediaPlayer
        title="Nofinite Ecosystem Walkthrough"
        src="https://stream.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqTtjhjhvwaQA1g.m3u8"
      >
        <MediaProvider>
          <Video poster="https://files.vidstack.io/poster.png" />
        </MediaProvider>
      </MediaPlayer>
    </div>
  );
}
```

---

## Theming & Design Tokens

Nofinite Media bridges seamlessly with NUICSS tokens. You can override colors globally or per player:

```css
.nui-vidstack-player {
  --media-brand: var(--color-primary);
  --media-focus-ring: var(--color-ring);
  --media-bg: var(--bg-surface);
}
```
