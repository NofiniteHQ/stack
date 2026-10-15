# Tracks, Captions, and Thumbnail Scrubbers

**Nofinite Media** provides comprehensive support for WebVTT text tracks, covering multi-language closed captions, subtitles, interactive chapter markers, and timeline thumbnail scrubbing.

---

## Key Capabilities

- **Multi-Language Subtitles & Captions:** Add localized tracks with language tags and default activation flags.
- **Interactive Chapter Markers:** Segments the timeline into named chapters that display in a popover menu.
- **Thumbnail Preview Scrubbing:** Hovering or dragging across the timeline displays synchronized visual video frame previews.
- **Accessible Text Styling:** Complies with FCC and W3C caption standards with customizable typography and backgrounds.

---

## Configuring WebVTT Tracks

Pass an array of `MediaTrack` objects to `<VideoPlayer />` or `<AudioPlayer />`:

```tsx
import React from 'react';
import { VideoPlayer, type MediaTrack } from '@nofinite/media/react';
import '@nofinite/nuicss/styles.css';

const videoTracks: MediaTrack[] = [
  // Subtitles
  {
    src: 'https://media.example.com/subs/english.vtt',
    label: 'English',
    language: 'en',
    kind: 'subtitles',
    default: true,
  },
  {
    src: 'https://media.example.com/subs/spanish.vtt',
    label: 'Español',
    language: 'es',
    kind: 'subtitles',
  },
  {
    src: 'https://media.example.com/subs/japanese.vtt',
    label: '日本語',
    language: 'ja',
    kind: 'subtitles',
  },

  // Chapter Markers
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
    <VideoPlayer
      src="https://media.example.com/video/master.mp4"
      poster="https://media.example.com/video/poster.jpg"
      tracks={videoTracks}
      thumbnails="https://media.example.com/video/thumbnails.vtt"
      aspectRatio="16/9"
    />
  );
}
```

---

## Chapter Markers Structure (`chapters.vtt`)

WebVTT chapter files divide the timeline into distinct, named segments. Hovering over chapter boundaries displays the chapter title:

```vtt
WEBVTT

00:00.000 --> 01:15.000
Introduction & Distributed Architecture

01:15.000 --> 04:30.000
Vector Math Engine Benchmarks

04:30.000 --> 08:45.000
OKLCH Design Token Invariants

08:45.000 --> 12:00.000
Summary & Production Rollout
```

When chapter tracks are loaded:

- The progress bar visually renders subtle divider notches between chapters.
- The chapter title appears in the timeline tooltip during scrubbing.
- The settings menu reveals a **Chapters** drawer for jumping directly between sections.

---

## WebVTT Thumbnail Scrubbers (`thumbnails.vtt`)

Thumbnail scrubbers allow viewers to preview video frames by hovering over the timeline scrubber before seeking.

### WebVTT Format with Image Sprites

```vtt
WEBVTT

00:00.000 --> 00:05.000
sprite.webp#xywh=0,0,160,90

00:05.000 --> 00:10.000
sprite.webp#xywh=160,0,160,90

00:10.000 --> 00:15.000
sprite.webp#xywh=320,0,160,90
```

Simply pass the URL of the `.vtt` file to the `thumbnails` prop:

```tsx
<VideoPlayer
  src="https://stream.mux.com/v69R127x00KSKGrGQgahP800ugny00JvlA.m3u8"
  thumbnails="https://image.mux.com/v69R127x00KSKGrGQgahP800ugny00JvlA/storyboard.vtt"
/>
```

The player automatically loads the sprite image, extracts the coordinate slice for the hovered timestamp, and renders a frosted thumbnail card above the playhead.
