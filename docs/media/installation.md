# Installation & Setup

Add `@nofinite/media` to your application. Built as a universal media player engine powered by W3C Custom Elements and styled strictly via **NUICSS** design tokens.

---

## 1. Install Package

Install `@nofinite/media` using your preferred package manager:

```bash
# pnpm
pnpm add @nofinite/media

# npm
npm install @nofinite/media

# yarn
yarn add @nofinite/media

# bun
bun add @nofinite/media
```

> [!NOTE] > **Optional Peer Dependencies:** `react` and `react-dom` (`>= 18.0.0`) are **strictly optional** peer dependencies (`peerDependenciesMeta.react.optional: true`). If you are building with pure Vanilla TypeScript, Vue, Svelte, or Astro, you do **not** need to install React.

---

## 2. Import Styles

Include `@nofinite/nuicss` in your application stylesheet or entry file:

```css
/* In your global stylesheet (e.g. globals.css, main.css) */
@import '@nofinite/nuicss';
```

Or in your JavaScript / TypeScript entry:

```ts
import '@nofinite/nuicss/styles.css';
```

> [!IMPORTANT] > **Zero Downstream CSS Invariant:** `@nofinite/nuicss` is the sole styling engine across the entire ecosystem. `@nofinite/media` does **not** compile or ship separate stylesheets. All player skins, control bars, scrubbers, volume sliders, and responsive aspect-ratio containers are defined in NUICSS superclasses (`.nui-media-container`, `.nui-vidstack-player`).

---

## 3. Verify Installation

### Option A: Framework-Agnostic / Core (Vanilla JS & TypeScript)

Mount the player directly into any DOM element without React:

```ts
import { createMediaPlayer } from '@nofinite/media';
import '@nofinite/nuicss/styles.css';

const mountTarget = document.getElementById('player')!;

const player = createMediaPlayer({
  src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  type: 'video',
  controls: true,
  aspectRatio: '16/9',
});

mountTarget.appendChild(player.element);

player.on('play', () => console.log('Player is running!'));
```

---

### Option B: React Application

In React 18 or 19 (including Next.js App Router Client Components):

```tsx
'use client';

import React from 'react';
import { VideoPlayer } from '@nofinite/media/react';
import '@nofinite/nuicss/styles.css';

export function PlayerVerification() {
  return (
    <div className="w-full max-w-xl mx-auto rounded-xl overflow-hidden shadow-lg">
      <VideoPlayer
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
        controls={true}
      />
    </div>
  );
}
```

---

## Direct HTML / CDN Usage (Zero-Build)

You can also load the media player directly in plain HTML via ES module CDN:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Nofinite Media CDN Demo</title>
    <!-- NUICSS Core Stylesheet -->
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/@nofinite/nuicss/dist/styles.css"
    />
  </head>
  <body class="p-8 bg-surface text-default">
    <div id="player-mount" class="max-w-2xl mx-auto"></div>

    <script type="module">
      import { createMediaPlayer } from 'https://esm.sh/@nofinite/media';

      const player = createMediaPlayer({
        src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
        type: 'video',
        controls: true,
      });

      document.getElementById('player-mount').appendChild(player.element);
    </script>
  </body>
</html>
```
