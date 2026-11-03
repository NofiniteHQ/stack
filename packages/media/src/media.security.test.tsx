// @vitest-environment happy-dom
import { renderToString } from 'react-dom/server';
import { describe, it, expect, vi } from 'vitest';
import { isValidMediaUrl, createMediaPlayer } from './core/player';
import { VideoPlayer } from './react/VideoPlayer';
import { AudioPlayer } from './react/AudioPlayer';

describe('Media Security & Resilience Remediation', () => {
  describe('isValidMediaUrl (MEDIA-M1-02)', () => {
    it('accepts safe http, https, and blob URLs', () => {
      expect(isValidMediaUrl('https://example.com/video.mp4')).toBe(true);
      expect(isValidMediaUrl('http://example.com/stream.m3u8')).toBe(true);
      expect(isValidMediaUrl('blob:https://example.com/d9a3b6')).toBe(true);
    });

    it('accepts relative URLs and paths', () => {
      expect(isValidMediaUrl('/media/video.mp4')).toBe(true);
      expect(isValidMediaUrl('./media/clip.webm')).toBe(true);
      expect(isValidMediaUrl('../media/sound.mp3')).toBe(true);
      expect(isValidMediaUrl('media/stream.mpd')).toBe(true);
    });

    it('accepts safe media data URIs', () => {
      expect(
        isValidMediaUrl('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA')
      ).toBe(true);
      expect(isValidMediaUrl('data:video/mp4;base64,AAAA')).toBe(true);
      expect(isValidMediaUrl('data:audio/mp3;base64,SUQzBA')).toBe(true);
    });

    it('rejects javascript: and obfuscated javascript: URLs', () => {
      expect(isValidMediaUrl('javascript:alert(1)')).toBe(false);
      expect(isValidMediaUrl('JAVASCRIPT:alert(1)')).toBe(false);
      expect(isValidMediaUrl('  javascript:void(0) ')).toBe(false);
      expect(isValidMediaUrl('jav&#97;script:alert(1)')).toBe(false);
      expect(isValidMediaUrl('jav&#x61;script:alert(1)')).toBe(false);
    });

    it('rejects vbscript: and data:text/html URLs', () => {
      expect(isValidMediaUrl('vbscript:msgbox(1)')).toBe(false);
      expect(isValidMediaUrl('data:text/html,<script>alert(1)</script>')).toBe(
        false
      );
      expect(isValidMediaUrl('data:text/javascript,alert(1)')).toBe(false);
      expect(isValidMediaUrl('data:application/javascript,alert(1)')).toBe(
        false
      );
    });

    it('rejects URLs containing control characters', () => {
      expect(isValidMediaUrl('https://example.com/\x00evil')).toBe(false);
      expect(isValidMediaUrl('https://example.com/\x1fevil')).toBe(false);
    });

    it('rejects null, undefined, empty, or non-string values', () => {
      expect(isValidMediaUrl('')).toBe(false);
      expect(isValidMediaUrl('   ')).toBe(false);
      expect(isValidMediaUrl(null)).toBe(false);
      expect(isValidMediaUrl(undefined)).toBe(false);
      expect(isValidMediaUrl(12345)).toBe(false);
    });
  });

  describe('createMediaPlayer URI Sanitization (MEDIA-M1-02, MEDIA-M1-03)', () => {
    it('sanitizes src attribute against javascript: protocol', () => {
      const player = createMediaPlayer({
        src: 'javascript:alert("xss")',
        type: 'video',
      });
      expect(player.playerElement.getAttribute('src')).toBe('');
      player.destroy();
    });

    it('filters out malicious track URLs and handles track errors (MEDIA-M1-03)', () => {
      const player = createMediaPlayer({
        src: 'https://example.com/video.mp4',
        type: 'video',
        tracks: [
          {
            src: 'javascript:alert("xss")',
            label: 'Malicious Track',
            language: 'en',
          },
          {
            src: 'https://example.com/subtitles.vtt',
            label: 'English Subtitles',
            language: 'en',
          },
        ],
      });

      const trackElements = player.playerElement.querySelectorAll('track');
      expect(trackElements.length).toBe(1);
      expect(trackElements[0].getAttribute('src')).toBe(
        'https://example.com/subtitles.vtt'
      );

      // Test trackerror custom event dispatch
      const errorHandler = vi.fn();
      player.on('trackerror', errorHandler);

      const errorEvent = new Event('error');
      trackElements[0].dispatchEvent(errorEvent);

      expect(errorHandler).toHaveBeenCalledTimes(1);
      player.destroy();
    });

    it('sanitizes artwork URL in audio header', () => {
      const player = createMediaPlayer({
        src: 'https://example.com/audio.mp3',
        type: 'audio',
        title: 'Safe Track',
        artwork: 'javascript:alert("xss")',
      });

      const img = player.element.querySelector('img');
      expect(img).toBeNull();
      player.destroy();
    });
  });

  describe('React SSR & Input Rejection (renderToString)', () => {
    it('renders VideoPlayer to static markup without error', () => {
      const html = renderToString(
        <VideoPlayer
          src="https://example.com/movie.mp4"
          title="SSR Movie"
          poster="https://example.com/poster.jpg"
        />
      );
      expect(typeof html).toBe('string');
      expect(html).toContain('nui-vidstack-player');
    });

    it('renders AudioPlayer to static markup without error', () => {
      const html = renderToString(
        <AudioPlayer
          src="https://example.com/song.mp3"
          title="SSR Song"
          artist="SSR Artist"
        />
      );
      expect(typeof html).toBe('string');
      expect(html).toContain('nui-vidstack-audio-player');
      expect(html).toContain('SSR Song');
    });

    it('rejects malicious src in React VideoPlayer by returning null', () => {
      const html = renderToString(
        <VideoPlayer src="javascript:alert('xss')" />
      );
      expect(html).toBe('');
    });

    it('rejects malicious src in React AudioPlayer by returning null', () => {
      const html = renderToString(
        <AudioPlayer src="javascript:alert('xss')" />
      );
      expect(html).toBe('');
    });
  });
});
