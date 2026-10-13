# AudioPlayer

AudioPlayer delivers an accessible, compact audio playback experience with track scrubber, volume adjustment, and playback rate selectors.

---

## Import

```tsx
import { AudioPlayer } from '@nofinite/media/react';
```

---

## Usage Example

```tsx
import React from 'react';
import { AudioPlayer } from '@nofinite/media/react';

export function PodcastEpisode() {
  return (
    <div className="card max-w-xl mx-auto p-4">
      <AudioPlayer
        title="Episode 42: Modern Monorepo Architecture"
        src="https://files.vidstack.io/audio/podcast-sample.mp3"
        artist="Nofinite Engineering"
      />
    </div>
  );
}
```

---

## Props Reference

| Prop        | Type      | Default     | Description                                    |
| :---------- | :-------- | :---------- | :--------------------------------------------- |
| `src`       | `string`  | Required    | Audio stream or file URL (MP3, WAV, AAC, OGG). |
| `title`     | `string`  | `undefined` | Episode or song title.                         |
| `artist`    | `string`  | `undefined` | Artist or author name.                         |
| `autoPlay`  | `boolean` | `false`     | Plays audio automatically upon mount.          |
| `className` | `string`  | `undefined` | Additional styling class name for container.   |
