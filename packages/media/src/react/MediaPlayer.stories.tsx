import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useRef } from 'react';
import '../styles/media.css';
import { VideoPlayer, AudioPlayer } from './index';
import { createMediaPlayer } from '../core';

const meta: Meta = {
  title: 'Media/Player',
  parameters: {
    layout: 'centered',
  },
};

export default meta;

export const VideoHls: StoryObj = {
  render: () => (
    <div className="w-[640px] max-w-full">
      <VideoPlayer
        title="Sprite Fight (HLS)"
        src="https://files.vidstack.io/sprite-fight/hls/stream.m3u8"
        poster="https://files.vidstack.io/sprite-fight/poster.webp"
        thumbnails="https://files.vidstack.io/sprite-fight/thumbnails.vtt"
        aspectRatio="16/9"
        tracks={[
          {
            src: 'https://files.vidstack.io/sprite-fight/subs/english.vtt',
            label: 'English',
            language: 'en-US',
            kind: 'subtitles',
            default: true,
          },
          {
            src: 'https://files.vidstack.io/sprite-fight/subs/spanish.vtt',
            label: 'Spanish',
            language: 'es-ES',
            kind: 'subtitles',
          },
        ]}
      />
    </div>
  ),
};

export const VideoMp4WithCaptions: StoryObj = {
  render: () => (
    <div className="w-[640px] max-w-full">
      <VideoPlayer
        title="Sprite Fight"
        src="https://files.vidstack.io/sprite-fight/720p.mp4"
        poster="https://files.vidstack.io/sprite-fight/poster.webp"
        thumbnails="https://files.vidstack.io/sprite-fight/thumbnails.vtt"
        aspectRatio="16/9"
        tracks={[
          {
            src: 'https://files.vidstack.io/sprite-fight/subs/english.vtt',
            label: 'English',
            language: 'en-US',
            kind: 'subtitles',
            default: true,
          },
        ]}
      />
    </div>
  ),
};

export const AudioCardThemeComparison: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-6 w-[520px] max-w-full">
      <div>
        <span className="text-xs uppercase tracking-wider font-semibold text-muted mb-2 block">
          Auto Theme (Adaptive)
        </span>
        <AudioPlayer
          title="Ambient Soundscape"
          artist="Nofinite Studio"
          src="https://files.vidstack.io/audio/audio.mp3"
          theme="auto"
        />
      </div>
      <div
        data-theme="dark"
        className="p-4 rounded-xl bg-surface border border-default"
      >
        <span className="text-xs uppercase tracking-wider font-semibold text-muted mb-2 block">
          Forced Dark Mode Canvas
        </span>
        <AudioPlayer
          title="Dark Soundscape"
          artist="Nofinite Studio"
          src="https://files.vidstack.io/audio/audio.mp3"
          theme="dark"
        />
      </div>
    </div>
  ),
};

export const VanillaPlayerBridge: StoryObj = {
  render: () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (!containerRef.current) return;
      const player = createMediaPlayer({
        src: 'https://files.vidstack.io/sprite-fight/720p.mp4',
        poster: 'https://files.vidstack.io/sprite-fight/poster.webp',
        title: 'Vanilla JS Player',
        aspectRatio: '16/9',
      });

      containerRef.current.appendChild(player.element);

      return () => {
        player.destroy();
      };
    }, []);

    return (
      <div className="w-[640px] max-w-full">
        <div ref={containerRef} />
      </div>
    );
  },
};
