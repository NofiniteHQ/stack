// @vitest-environment happy-dom
import { describe, it, expect, vi } from 'vitest';
import {
  isHlsSource,
  isDashSource,
  formatMediaTime,
  createMediaPlayer,
} from './index';

describe('@nofinite/media core helpers', () => {
  it('correctly detects HLS streaming sources', () => {
    expect(isHlsSource('https://example.com/live/master.m3u8')).toBe(true);
    expect(isHlsSource('https://example.com/hls/stream')).toBe(true);
    expect(isHlsSource('https://example.com/video.mp4')).toBe(false);
  });

  it('correctly detects DASH streaming sources', () => {
    expect(isDashSource('https://example.com/manifest.mpd')).toBe(true);
    expect(isDashSource('https://example.com/dash/live')).toBe(true);
    expect(isDashSource('https://example.com/audio.mp3')).toBe(false);
  });

  it('formats media time durations correctly', () => {
    expect(formatMediaTime(0)).toBe('0:00');
    expect(formatMediaTime(5)).toBe('0:05');
    expect(formatMediaTime(65)).toBe('1:05');
    expect(formatMediaTime(360)).toBe('6:00');
    expect(formatMediaTime(3665)).toBe('61:05');
    expect(formatMediaTime(-1)).toBe('0:00');
    expect(formatMediaTime(NaN)).toBe('0:00');
  });
});

describe('@nofinite/media DOM player', () => {
  it('instantiates custom elements with correct attributes and controls layout', () => {
    const player = createMediaPlayer({
      src: 'https://example.com/video.mp4',
      type: 'video',
      poster: 'https://example.com/poster.jpg',
      title: 'Hero Video',
      autoplay: true,
      muted: true,
      controls: true,
      thumbnails: 'https://example.com/thumbnails.vtt',
      crossOrigin: 'anonymous',
      preload: 'metadata',
      seekStep: 10,
      tracks: [
        {
          src: 'https://example.com/subs.vtt',
          label: 'English',
          language: 'en',
          kind: 'subtitles',
          default: true,
        },
      ],
    });

    expect(player.element).toBeDefined();
    expect(player.element.className).toContain('nui-media-container');

    const mediaPlayer = player.element.querySelector('media-player');
    expect(mediaPlayer).toBeDefined();
    expect(mediaPlayer?.getAttribute('src')).toBe(
      'https://example.com/video.mp4'
    );
    expect(mediaPlayer?.getAttribute('view-type')).toBe('video');
    expect(mediaPlayer?.getAttribute('poster')).toBe(
      'https://example.com/poster.jpg'
    );
    expect(mediaPlayer?.getAttribute('title')).toBe('Hero Video');
    expect(mediaPlayer?.hasAttribute('autoplay')).toBe(true);
    expect(mediaPlayer?.hasAttribute('muted')).toBe(true);
    expect(mediaPlayer?.getAttribute('crossorigin')).toBe('anonymous');
    expect(mediaPlayer?.getAttribute('preload')).toBe('metadata');

    // Layout controls
    const layout = mediaPlayer?.querySelector('media-video-layout');
    expect(layout).toBeDefined();
    expect(layout?.getAttribute('thumbnails')).toBe(
      'https://example.com/thumbnails.vtt'
    );
    expect(layout?.getAttribute('seek-step')).toBe('10');

    // Track
    const track = mediaPlayer?.querySelector('track');
    expect(track).toBeDefined();
    expect(track?.getAttribute('src')).toBe('https://example.com/subs.vtt');
    expect(track?.getAttribute('label')).toBe('English');
    expect(track?.getAttribute('srclang')).toBe('en');

    // Dynamic src change
    player.setSrc('https://example.com/updated.mp4');
    expect(mediaPlayer?.getAttribute('src')).toBe(
      'https://example.com/updated.mp4'
    );

    // State inspection
    const state = player.getState();
    expect(state).toBeDefined();
    expect(state.paused).toBe(true);
    expect(state.volume).toBe(1);

    // Imperative controls
    player.seek(30);
    expect((mediaPlayer as any).currentTime).toBe(30);

    player.setVolume(0.5);
    expect((mediaPlayer as any).volume).toBe(0.5);

    player.setMuted(true);
    expect((mediaPlayer as any).muted).toBe(true);
    expect(mediaPlayer?.hasAttribute('muted')).toBe(true);

    player.setMuted(false);
    expect((mediaPlayer as any).muted).toBe(false);
    expect(mediaPlayer?.hasAttribute('muted')).toBe(false);

    player.setPlaybackRate(1.5);
    expect((mediaPlayer as any).playbackRate).toBe(1.5);

    // Event listeners & cleanup
    const handler = vi.fn();
    const unsub = player.on('play', handler);
    mediaPlayer?.dispatchEvent(new Event('play'));
    expect(handler).toHaveBeenCalledTimes(1);

    unsub();
    mediaPlayer?.dispatchEvent(new Event('play'));
    expect(handler).toHaveBeenCalledTimes(1);

    // Test destroy cleans up listeners
    const autoCleanHandler = vi.fn();
    player.on('pause', autoCleanHandler);
    player.destroy();
    mediaPlayer?.dispatchEvent(new Event('pause'));
    expect(autoCleanHandler).not.toHaveBeenCalled();
  });

  it('instantiates audio media player with metadata header and audio layout', () => {
    const player = createMediaPlayer({
      src: 'https://example.com/song.mp3',
      type: 'audio',
      title: 'Synthwave Dreams',
      artist: 'Retro Wave',
      artwork: 'https://example.com/art.jpg',
      controls: true,
      theme: 'light',
      seekStep: 15,
    });

    const mediaPlayer = player.element.querySelector('media-player');
    expect(mediaPlayer?.getAttribute('view-type')).toBe('audio');
    expect(mediaPlayer?.getAttribute('data-color-scheme')).toBe('light');

    // Header info card
    const header = player.element.querySelector('.flex.items-center');
    expect(header).toBeDefined();
    expect(header?.textContent).toContain('Synthwave Dreams');
    expect(header?.textContent).toContain('Retro Wave');

    const img = header?.querySelector('img');
    expect(img?.getAttribute('src')).toBe('https://example.com/art.jpg');

    // Audio layout
    const audioLayout = mediaPlayer?.querySelector('media-audio-layout');
    expect(audioLayout).toBeDefined();
    expect(audioLayout?.getAttribute('seek-step')).toBe('15');

    player.destroy();
  });
});
