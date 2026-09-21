// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
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
  it('instantiates custom elements with correct attributes', () => {
    const player = createMediaPlayer({
      src: 'https://example.com/video.mp4',
      type: 'video',
      poster: 'https://example.com/poster.jpg',
      autoplay: true,
      muted: true,
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
    expect(mediaPlayer?.hasAttribute('autoplay')).toBe(true);
    expect(mediaPlayer?.hasAttribute('muted')).toBe(true);

    player.setSrc('https://example.com/updated.mp4');
    expect(mediaPlayer?.getAttribute('src')).toBe(
      'https://example.com/updated.mp4'
    );

    player.destroy();
  });

  it('instantiates audio media player', () => {
    const player = createMediaPlayer({
      src: 'https://example.com/song.mp3',
      type: 'audio',
    });

    const mediaPlayer = player.element.querySelector('media-player');
    expect(mediaPlayer?.getAttribute('view-type')).toBe('audio');
    player.destroy();
  });
});
