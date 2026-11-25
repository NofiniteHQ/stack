// @vitest-environment happy-dom
import { renderToString } from 'react-dom/server';
import { describe, it, expect, vi } from 'vitest';
import {
  isValidMediaUrl,
  createMediaPlayer,
  sanitizeVttCue,
  renderVttCue,
  formatTrackLabel,
  CDN_STREAMING_ENGINES,
  loadStreamingCdnScript,
} from './core/player';
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

describe('Phase 3 Milestone 3 (Specialist S2) Media Security Suite (MEDIA-M3-01 to MEDIA-M3-05)', () => {
  describe('MEDIA-M3-01: WebVTT Caption Parser Voice Tag Breakout & Stored XSS Neutralization', () => {
    it('neutralizes HTML entity-encoded payloads and voice tag breakout in cue text', () => {
      const dirtyCue = '&lt;img src=x onerror=alert(1)&gt;';
      const sanitized = sanitizeVttCue(dirtyCue);
      expect(sanitized).not.toContain('<img');
      expect(sanitized).not.toContain('onerror=');

      // Voice tag with injection
      const voiceCue =
        '<v Roger Bingham>Hello <img src=x onerror=alert(1)></v>';
      const sanitizedVoice = sanitizeVttCue(voiceCue);
      expect(sanitizedVoice).toContain('[Roger Bingham]: Hello');
      expect(sanitizedVoice).not.toContain('<img');
      expect(sanitizedVoice).not.toContain('onerror=');
    });

    it('renderVttCue safely renders plain text into DOM with zero active elements', () => {
      const dirtyCue = '<v Speaker>&lt;script&gt;alert(1)&lt;/script&gt;</v>';
      const el = renderVttCue(dirtyCue);
      expect(el.tagName.toLowerCase()).toBe('div');
      expect(el.querySelector('script')).toBeNull();
      expect(el.querySelector('img')).toBeNull();
      expect(el.textContent).toBe('Speaker: <script>alert(1)</script>');
    });
  });

  describe('MEDIA-M3-02: SVG Data URI Execution Bypass in isValidMediaUrl', () => {
    it('explicitly rejects SVG data URIs to prevent embedded script execution', () => {
      expect(isValidMediaUrl('data:image/svg+xml,<svg onload=alert(1)>')).toBe(
        false
      );
      expect(
        isValidMediaUrl(
          'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"></svg>'
        )
      ).toBe(false);
      expect(
        isValidMediaUrl(
          'data:image/svg+xml;base64,PHN2ZyBvbmxvYWQ9YWxlcnQoMSk+PC9zdmc+'
        )
      ).toBe(false);
      expect(isValidMediaUrl('DATA:IMAGE/SVG+XML;base64,PHN2Zz4=')).toBe(false);
    });

    it('permits safe raster image and media data URIs', () => {
      expect(
        isValidMediaUrl(
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
        )
      ).toBe(true);
      expect(
        isValidMediaUrl(
          'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA='
        )
      ).toBe(true);
      expect(
        isValidMediaUrl(
          'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA='
        )
      ).toBe(true);
      expect(isValidMediaUrl('data:video/mp4;base64,AAAA')).toBe(true);
      expect(isValidMediaUrl('data:audio/mp3;base64,SUQzBA')).toBe(true);
    });
  });

  describe('MEDIA-M3-03: Subresource Integrity (SRI) on CDN Dynamic Streaming Loaders', () => {
    it('defines authoritative, bit-for-bit verified SRI hashes for pinned CDN streaming libraries', () => {
      // Pinned exact version CDN assets
      expect(CDN_STREAMING_ENGINES.hls.src).toBe(
        'https://cdn.jsdelivr.net/npm/hls.js@1.5.8/dist/hls.min.js'
      );
      expect(CDN_STREAMING_ENGINES.hls.integrity).toBe(
        'sha384-xLhS5rbIdhv65H3GLX+caQgMSiEK/Hkw8Z6HITolgRxvXs0omcbeYD639tkJ2Wu6'
      );
      expect(CDN_STREAMING_ENGINES.hls.crossOrigin).toBe('anonymous');

      expect(CDN_STREAMING_ENGINES.dash.src).toBe(
        'https://cdn.jsdelivr.net/npm/dashjs@4.7.4/dist/dash.all.min.js'
      );
      expect(CDN_STREAMING_ENGINES.dash.integrity).toBe(
        'sha384-fl7i8WZxcPlF9b1503+Gm+izr/2hpilydj0i/DlQTIafROZ1NP4rAWjyl6p3s1ev'
      );
      expect(CDN_STREAMING_ENGINES.dash.crossOrigin).toBe('anonymous');
    });

    it('attaches consumer dynamic import loaders (Tier 1 primary) to media player instance', () => {
      const mockHlsLoader = vi
        .fn()
        .mockResolvedValue({ default: class MockHls {} });
      const mockDashLoader = vi
        .fn()
        .mockResolvedValue({ default: class MockDash {} });

      const player = createMediaPlayer({
        src: 'https://example.com/live/stream.m3u8',
        type: 'video',
        hlsEngine: mockHlsLoader,
        dashEngine: mockDashLoader,
      });

      expect((player.playerElement as any).hlsLibrary).toBe(mockHlsLoader);
      expect((player.playerElement as any).dashLibrary).toBe(mockDashLoader);
      player.destroy();
    });

    it('injects script tag with verified SRI integrity and crossorigin attributes on loadStreamingCdnScript', async () => {
      const script = await loadStreamingCdnScript('hls');
      expect(script).toBeDefined();
      expect(script?.getAttribute('integrity')).toBe(
        'sha384-xLhS5rbIdhv65H3GLX+caQgMSiEK/Hkw8Z6HITolgRxvXs0omcbeYD639tkJ2Wu6'
      );
      expect(script?.getAttribute('crossorigin')).toBe('anonymous');
      script?.remove();
    });
  });

  describe('MEDIA-M3-04: Relative Media URL Parsing Flaw on Query Colons', () => {
    it('accepts relative URLs containing colons in query parameters or fragments', () => {
      expect(isValidMediaUrl('/video.mp4?time=10:00')).toBe(true);
      expect(isValidMediaUrl('video.mp4?time=10:00')).toBe(true);
      expect(isValidMediaUrl('media/stream.m3u8?session=token:abc:123')).toBe(
        true
      );
      expect(isValidMediaUrl('./clips/video.mp4#t=10:20,10:40')).toBe(true);
      expect(isValidMediaUrl('../assets/video.webm?resolution=1920:1080')).toBe(
        true
      );
    });

    it('continues to strictly reject dangerous protocol schemes with colons', () => {
      expect(isValidMediaUrl('javascript:alert(1)')).toBe(false);
      expect(isValidMediaUrl('javascript:void(0)?time=10:00')).toBe(false);
      expect(isValidMediaUrl('vbscript:msgbox(1)')).toBe(false);
      expect(isValidMediaUrl('file:///etc/passwd')).toBe(false);
      expect(isValidMediaUrl('//evil.com/video.mp4?time=10:00')).toBe(false);
    });
  });

  describe('MEDIA-M3-05: Unguarded track.label Runtime Crash Protection', () => {
    it('formatTrackLabel safely returns fallback for undefined or null track labels', () => {
      expect(formatTrackLabel({ src: 'sub.vtt', label: undefined })).toBe(
        'unknown'
      );
      expect(formatTrackLabel({ src: 'sub.vtt', label: null as any })).toBe(
        'unknown'
      );
      expect(formatTrackLabel(null)).toBe('unknown');
      expect(formatTrackLabel(undefined)).toBe('unknown');
      expect(formatTrackLabel({ src: 'sub.vtt', label: 'English' })).toBe(
        'english'
      );
      expect(formatTrackLabel({ src: 'sub.vtt', label: 'Español' })).toBe(
        'español'
      );
    });

    it('createMediaPlayer instantiates without exception on tracks with missing or undefined labels', () => {
      expect(() => {
        const player = createMediaPlayer({
          src: 'https://example.com/video.mp4',
          type: 'video',
          tracks: [
            {
              src: 'https://example.com/subs.vtt',
              label: undefined as any,
              language: 'en',
            },
            {
              src: 'https://example.com/chapters.vtt',
              label: null as any,
              language: 'en',
              kind: 'chapters',
            },
          ],
        });
        const trackElements = player.playerElement.querySelectorAll('track');
        expect(trackElements.length).toBe(2);
        expect(trackElements[0].getAttribute('label')).toBe('unknown');
        expect(trackElements[1].getAttribute('label')).toBe('unknown');
        player.destroy();
      }).not.toThrow();
    });
  });

  describe('CODEQL URL & VTT ReDoS Remediation', () => {
    it('CODEQL-04: rejects data:text/html and data:application/javascript URLs strictly via allowlist', () => {
      expect(isValidMediaUrl('data:text/html,<script>alert(1)</script>')).toBe(
        false
      );
      expect(
        isValidMediaUrl('data:application/javascript,alert(document.domain)')
      ).toBe(false);
      expect(
        isValidMediaUrl('  &#100;ata:application/javascript,alert(1) ')
      ).toBe(false);
    });

    it('CODEQL-05/06: sanitizeVttCue and renderVttCue resist <v whitespace ReDoS in linear O(n) time', () => {
      const stressCue = '<v ' + ' '.repeat(20000);
      const t0 = performance.now();
      expect(sanitizeVttCue(stressCue)).toBe('&lt;v ' + ' '.repeat(20000));
      const el = renderVttCue(stressCue);
      expect(el.textContent).toBe(stressCue);
      const elapsed = performance.now() - t0;
      expect(elapsed).toBeLessThan(50);
    });

    it('CODEQL-09: sanitizeVttCue and renderVttCue resist repeated < ReDoS in linear O(n) time', () => {
      const stressLt = '<'.repeat(30000);
      const t0 = performance.now();
      expect(sanitizeVttCue(stressLt)).toBe('&lt;'.repeat(30000));
      const el = renderVttCue(stressLt);
      expect(el.textContent).toBe(stressLt);
      const elapsed = performance.now() - t0;
      expect(elapsed).toBeLessThan(50);
    });
  });
});
