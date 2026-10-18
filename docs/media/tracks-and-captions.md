# Tracks, Captions, and Thumbnail Scrubbers

**Nofinite Media** provides comprehensive support for WebVTT text tracks, covering multi-language closed captions, subtitles, interactive chapter markers, and timeline thumbnail scrubbing.

```ts
// Framework-Agnostic Core (Zero React Dependency)
import { createMediaPlayer, type MediaTrack } from '@nofinite/media';

// React Adapter
import { VideoPlayer } from '@nofinite/media/react';
```

---

## 1. Usage in Vanilla TypeScript / DOM (Core First)

In pure JavaScript or TypeScript, pass an array of `MediaTrack` objects and a storyboard `.vtt` URL to `createMediaPlayer()`:

```ts
import { createMediaPlayer, type MediaTrack } from '@nofinite/media';
import '@nofinite/nuicss/styles.css';

const container = document.getElementById('player-root')!;

// 1. Define Subtitle, Caption & Chapter Tracks
const tracks: MediaTrack[] = [
  {
    src: 'https://media.example.com/subs/en.vtt',
    label: 'English',
    language: 'en',
    kind: 'subtitles',
    default: true,
  },
  {
    src: 'https://media.example.com/subs/es.vtt',
    label: 'Español',
    language: 'es',
    kind: 'subtitles',
  },
  {
    src: 'https://media.example.com/chapters/architecture.vtt',
    label: 'Chapters',
    language: 'en',
    kind: 'chapters',
    default: true,
  },
];

// 2. Initialize Media Player with WebVTT Tracks & Storyboard Thumbnails
const player = createMediaPlayer({
  src: 'https://stream.mux.com/v69R127x00KSKGrGQgahP800ugny00JvlA.m3u8',
  type: 'video',
  tracks,
  thumbnails:
    'https://image.mux.com/v69R127x00KSKGrGQgahP800ugny00JvlA/storyboard.vtt',
  aspectRatio: '16/9',
  controls: true,
});

// 3. Mount into DOM
container.appendChild(player.element);
```

---

## 2. Usage in React

In React applications, pass `tracks` and `thumbnails` directly to `<VideoPlayer />`:

```tsx
'use client';

import React from 'react';
import { VideoPlayer, type MediaTrack } from '@nofinite/media/react';
import '@nofinite/nuicss/styles.css';

const videoTracks: MediaTrack[] = [
  {
    src: 'https://media.example.com/subs/en.vtt',
    label: 'English',
    language: 'en',
    kind: 'subtitles',
    default: true,
  },
  {
    src: 'https://media.example.com/subs/es.vtt',
    label: 'Español',
    language: 'es',
    kind: 'subtitles',
  },
  {
    src: 'https://media.example.com/chapters/architecture.vtt',
    label: 'Chapters',
    language: 'en',
    kind: 'chapters',
    default: true,
  },
];

export function CaptionedVideoPlayer() {
  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-default bg-black">
      <VideoPlayer
        src="https://stream.mux.com/v69R127x00KSKGrGQgahP800ugny00JvlA.m3u8"
        tracks={videoTracks}
        thumbnails="https://image.mux.com/v69R127x00KSKGrGQgahP800ugny00JvlA/storyboard.vtt"
        aspectRatio="16/9"
        controls={true}
      />
    </div>
  );
}
```

---

## WebVTT Track Formats

### 1. Subtitles & Closed Captions (`subtitles.vtt`)

Standard WebVTT time-coded cues for dialog translation and accessibility:

```vtt
WEBVTT

00:00:01.000 --> 00:00:04.500
Welcome to the Nofinite Media architecture deep dive.

00:00:05.000 --> 00:00:09.000
In this session, we examine framework-agnostic video pipelines.
```

### 2. Interactive Chapter Notches (`chapters.vtt`)

Chapters generate interactive visual segments along the timeline scrubber with title tooltip callouts:

```vtt
WEBVTT

00:00:00.000 --> 00:02:15.000
1. Executive Summary & Overview

00:02:15.000 --> 00:07:45.000
2. Custom Element Video Pipelines

00:07:45.000 --> 00:15:30.000
3. ABR Manifest Demuxing (HLS/DASH)
```

### 3. Storyboard Thumbnails (`thumbnails.vtt`)

Thumbnail scrubbers allow viewers to preview video frames by hovering over the timeline scrubber before seeking. Coordinates reference a mosaic sprite sheet:

```vtt
WEBVTT

00:00:00.000 --> 00:00:05.000
/sprites/storyboard.webp#xywh=0,0,160,90

00:00:05.000 --> 00:00:10.000
/sprites/storyboard.webp#xywh=160,0,160,90

00:00:10.000 --> 00:00:15.000
/sprites/storyboard.webp#xywh=320,0,160,90
```

---

## `MediaTrack` Interface Reference

```ts
export interface MediaTrack {
  /** URL to the .vtt track file */
  src: string;
  /** Human-readable label displayed in the settings track picker */
  label: string;
  /** Two-letter BCP 47 language code (e.g. 'en', 'es', 'fr', 'ja') */
  language: string;
  /** Track role: 'subtitles' | 'captions' | 'chapters' | 'descriptions' | 'metadata' */
  kind?: 'subtitles' | 'captions' | 'chapters' | 'descriptions' | 'metadata';
  /** Set to true to activate track by default */
  default?: boolean;
}
```
