# VideoPlayer

VideoPlayer provides full-featured video playback supporting MP4, WebM, and adaptive HLS (`.m3u8`) streaming with customizable UI controls.

---

## Import

```tsx
import { VideoPlayer } from '@nofinite/media/react';
```

---

## Usage Example

```tsx
import React from 'react';
import { VideoPlayer } from '@nofinite/media/react';

export function DemoVideo() {
  return (
    <div className="w-full max-w-4xl mx-auto rounded-xl overflow-hidden border border-default bg-surface">
      <VideoPlayer
        title="Nofinite Overview"
        src="https://stream.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqTtjhjhvwaQA1g.m3u8"
        poster="https://files.vidstack.io/poster.png"
        tracks={[
          {
            src: 'https://files.vidstack.io/subs/english.vtt',
            label: 'English',
            language: 'en-US',
            kind: 'subtitles',
            default: true,
          },
        ]}
      />
    </div>
  );
}
```

---

## Props Reference

| Prop        | Type                                             | Default     | Description                                                                            |
| :---------- | :----------------------------------------------- | :---------- | :------------------------------------------------------------------------------------- |
| `src`       | `string \| Array<{ src: string; type: string }>` | Required    | Direct video URL or HLS playlist endpoint (`.m3u8`).                                   |
| `title`     | `string`                                         | `undefined` | Video title displayed in top bar.                                                      |
| `poster`    | `string`                                         | `undefined` | High-resolution thumbnail image URL before playback.                                   |
| `tracks`    | `MediaTrack[]`                                   | `[]`        | Array of subtitle or caption WebVTT tracks.                                            |
| `autoPlay`  | `boolean`                                        | `false`     | Begins playback automatically when loaded (requires `muted: true` in modern browsers). |
| `muted`     | `boolean`                                        | `false`     | Initializes player in muted state.                                                     |
| `loop`      | `boolean`                                        | `false`     | Loops video continuously on completion.                                                |
| `className` | `string`                                         | `undefined` | Additional container class name.                                                       |
