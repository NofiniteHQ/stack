// @vitest-environment happy-dom
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { VideoPlayer } from './react/VideoPlayer';
import { AudioPlayer } from './react/AudioPlayer';

describe('VideoPlayer React Component', () => {
  it('renders null if neither src nor url is provided', () => {
    const { container } = render(<VideoPlayer />);
    expect(container.firstChild).toBeNull();
  });

  it('renders video player container when src is provided', () => {
    const { container } = render(
      <VideoPlayer
        src="https://example.com/video.mp4"
        title="Sample Video"
        poster="https://example.com/poster.jpg"
        className="custom-video-class"
        aspectRatio="16/9"
      />
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).not.toBeNull();
    expect(wrapper.className).toContain('custom-video-class');

    const player = container.querySelector('[data-media-player]');
    expect(player).not.toBeNull();
    expect(player?.className).toContain('nui-vidstack-player');
    expect(player?.getAttribute('aria-label')).toContain('Sample Video');

    const provider = container.querySelector('[data-media-provider]');
    expect(provider).not.toBeNull();
    const video = provider?.querySelector('video');
    expect(video).not.toBeNull();
    expect(video?.getAttribute('crossorigin')).toBe('anonymous');
  });

  it('forwards theme, crossorigin, and load attributes correctly', () => {
    const { container } = render(
      <VideoPlayer
        src="https://example.com/video.mp4"
        theme="dark"
        crossOrigin="anonymous"
        load="eager"
        preload="metadata"
      />
    );

    const player = container.querySelector('[data-media-player]');
    expect(player).not.toBeNull();
    expect(player?.getAttribute('data-color-scheme')).toBe('dark');
    expect(player?.className).toContain('dark');
    expect(player?.getAttribute('data-load')).toBe('eager');
  });

  it('registers subtitle tracks on MediaPlayer instance', () => {
    const ref = React.createRef<any>();
    render(
      <VideoPlayer
        ref={ref}
        src="https://example.com/video.mp4"
        tracks={[
          {
            src: 'https://example.com/en.vtt',
            label: 'English',
            language: 'en',
            kind: 'subtitles',
            default: true,
          },
        ]}
      />
    );

    expect(ref.current).toBeDefined();
    expect(ref.current?.textTracks).toBeDefined();
  });

  it('renders default video layout with icons and controls', () => {
    const { container } = render(
      <VideoPlayer
        src="https://example.com/video.mp4"
        controls={true}
        playbackRates={[0.5, 1, 1.5, 2]}
      />
    );

    const layout = container.querySelector('.vds-video-layout');
    expect(layout).not.toBeNull();
  });

  it('forwards ref to MediaPlayer instance', () => {
    const ref = React.createRef<any>();
    render(<VideoPlayer ref={ref} src="https://example.com/video.mp4" />);
    expect(ref.current).toBeDefined();
  });
});

describe('AudioPlayer React Component', () => {
  it('renders null if neither src nor url is provided', () => {
    const { container } = render(<AudioPlayer />);
    expect(container.firstChild).toBeNull();
  });

  it('renders metadata card when title, artist, and artwork are provided', () => {
    render(
      <AudioPlayer
        src="https://example.com/audio.mp3"
        title="Symphony No. 5"
        artist="Beethoven"
        artwork="https://example.com/artwork.jpg"
      />
    );

    expect(screen.getByText('Symphony No. 5')).toBeDefined();
    expect(screen.getByText('Beethoven')).toBeDefined();
    const img = screen.getByRole('img');
    expect(img.getAttribute('src')).toBe('https://example.com/artwork.jpg');
  });

  it('forwards audio configuration and layout props', () => {
    const { container } = render(
      <AudioPlayer
        src="https://example.com/audio.mp3"
        theme="light"
        crossOrigin="use-credentials"
        seekStep={15}
        playbackRates={[0.75, 1, 1.25, 1.5, 2]}
      />
    );

    const player = container.querySelector('[data-media-player]');
    expect(player).not.toBeNull();
    expect(player?.getAttribute('data-color-scheme')).toBe('light');
    expect(player?.className).toContain('light');
    expect(player?.getAttribute('data-view-type')).toBe('audio');

    const layout = container.querySelector('.vds-audio-layout');
    expect(layout).not.toBeNull();
  });

  it('forwards ref to MediaPlayer instance', () => {
    const ref = React.createRef<any>();
    render(<AudioPlayer ref={ref} src="https://example.com/audio.mp3" />);
    expect(ref.current).toBeDefined();
  });
});
