# Media Production Examples

Below are production-ready, copy-paste implementations of **Nofinite Media** showcasing adaptive HLS streaming, multi-language captioning, podcast players, and picture-in-picture widgets.

---

## Example 1: Enterprise Video-on-Demand (VOD) Player

A complete video player featuring adaptive HLS streaming (`.m3u8`), WebVTT multi-language subtitles, interactive chapter markers, and thumbnail frame scrubbing.

```tsx
import React from 'react';
import { VideoPlayer, type MediaTrack } from '@nofinite/media/react';
import '@nofinite/nuicss/styles.css';

const vodTracks: MediaTrack[] = [
  // Subtitles
  {
    src: 'https://media.example.com/vod/subs-en.vtt',
    label: 'English [CC]',
    language: 'en',
    kind: 'subtitles',
    default: true,
  },
  {
    src: 'https://media.example.com/vod/subs-es.vtt',
    label: 'Español',
    language: 'es',
    kind: 'subtitles',
  },
  {
    src: 'https://media.example.com/vod/subs-de.vtt',
    label: 'Deutsch',
    language: 'de',
    kind: 'subtitles',
  },

  // Chapter Markers
  {
    src: 'https://media.example.com/vod/chapters.vtt',
    label: 'Chapters',
    language: 'en',
    kind: 'chapters',
    default: true,
  },
];

export function EnterpriseVodPlayer() {
  return (
    <div className="w-full max-w-5xl mx-auto p-6 bg-surface">
      <div className="mb-4">
        <h1 className="text-xl font-bold text-default">
          Global Architecture Keynote 2026
        </h1>
        <p className="text-xs text-muted">
          Featuring adaptive 4K HLS streaming, multi-track audio, and
          interactive chapters
        </p>
      </div>

      <div className="rounded-3xl overflow-hidden border border-default shadow-2xl bg-black">
        <VideoPlayer
          src="https://stream.mux.com/v69R127x00KSKGrGQgahP800ugny00JvlA.m3u8"
          poster="https://image.mux.com/v69R127x00KSKGrGQgahP800ugny00JvlA/thumbnail.webp?time=12"
          thumbnails="https://image.mux.com/v69R127x00KSKGrGQgahP800ugny00JvlA/storyboard.vtt"
          tracks={vodTracks}
          aspectRatio="16/9"
          controls={true}
        />
      </div>
    </div>
  );
}
```

---

## Example 2: Technical Podcast Show with Chapter Scrubber

A podcast player with album artwork, chapter navigation, 15-second skip buttons, speed selection, and OS lock-screen Media Session controls.

```tsx
import React from 'react';
import { AudioPlayer } from '@nofinite/media/react';
import '@nofinite/nuicss/styles.css';

export function TechnicalPodcastPlayer() {
  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-surface border border-default rounded-3xl shadow-xl space-y-4">
      <div className="flex items-center gap-4">
        <img
          src="https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=200"
          alt="Podcast Art"
          className="w-20 h-20 rounded-2xl object-cover border border-default shadow-sm"
        />
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
            Episode 58
          </span>
          <h2 className="text-base font-bold text-default mt-1">
            Autonomous Systems & Edge Isolates
          </h2>
          <p className="text-xs text-muted">With Dr. Aris Thorne • 48 min</p>
        </div>
      </div>

      <AudioPlayer
        src="https://media.example.com/podcasts/ep58.mp3"
        title="Autonomous Systems & Edge Isolates"
        artist="Nofinite Deep Dive Podcast"
        artwork="https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=300"
        playbackRates={[0.75, 1, 1.25, 1.5, 2]}
        seekStep={15}
        tracks={[
          {
            src: 'https://media.example.com/podcasts/ep58-chapters.vtt',
            label: 'Chapters',
            language: 'en',
            kind: 'chapters',
            default: true,
          },
        ]}
      />
    </div>
  );
}
```

---

## Example 3: Floating Picture-in-Picture Video Widget

A custom headless player that supports seamless Picture-in-Picture (PiP) popout while users continue reading documentation:

```tsx
import React, { useRef } from 'react';
import {
  MediaPlayer,
  MediaProvider,
  useMediaRemote,
  useMediaState,
  type MediaPlayerInstance,
} from '@nofinite/media/react';
import '@nofinite/nuicss/styles.css';

function PipControlBar() {
  const remote = useMediaRemote();
  const paused = useMediaState('paused');
  const isPip = useMediaState('pictureInPicture');

  return (
    <div className="absolute top-3 right-3 flex items-center gap-2 z-20">
      <button
        onClick={() => (paused ? remote.play() : remote.pause())}
        className="px-2.5 py-1 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white rounded-lg text-xs font-medium"
      >
        {paused ? '▶ Play' : '❚❚ Pause'}
      </button>

      <button
        onClick={() =>
          isPip ? remote.exitPictureInPicture() : remote.enterPictureInPicture()
        }
        className="px-2.5 py-1 bg-primary text-white hover:bg-primary-hover rounded-lg text-xs font-semibold shadow"
      >
        {isPip ? 'Dock Video' : 'Pop out (PiP)'}
      </button>
    </div>
  );
}

export function FloatingPipPlayer() {
  const playerRef = useRef<MediaPlayerInstance>(null);

  return (
    <div className="w-full max-w-xl mx-auto rounded-2xl overflow-hidden border border-default bg-black relative group shadow-lg">
      <MediaPlayer
        ref={playerRef}
        src="https://media.example.com/tutorials/intro.mp4"
        aspectRatio="16/9"
        className="w-full h-full"
      >
        <MediaProvider />
        <PipControlBar />
      </MediaPlayer>
    </div>
  );
}
```
