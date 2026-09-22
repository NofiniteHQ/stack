import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import '@vidstack/react/player/styles/default/layouts/audio.css';
import { VideoPlayer, AudioPlayer } from './index';

const meta: Meta = {
  title: 'Media/StreamingPlayer',
  parameters: {
    layout: 'centered',
  },
};

export default meta;

export const VideoHls: StoryObj = {
  render: () => (
    <div className="w-[640px] max-w-full">
      <VideoPlayer
        title="Sprite Fight"
        src="https://files.vidstack.io/sprite-fight/hls/stream.m3u8"
        poster="https://files.vidstack.io/sprite-fight/poster.webp"
        aspectRatio="16/9"
      />
    </div>
  ),
};

export const VideoMp4: StoryObj = {
  render: () => (
    <div className="w-[640px] max-w-full">
      <VideoPlayer
        title="Big Buck Bunny"
        src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        aspectRatio="16/9"
      />
    </div>
  ),
};

export const Audio: StoryObj = {
  render: () => (
    <div className="w-[500px] max-w-full">
      <AudioPlayer
        title="Ambient Soundscape"
        src="https://files.vidstack.io/audio/audio.mp3"
      />
    </div>
  ),
};
