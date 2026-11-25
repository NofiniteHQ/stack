/**
 * @nofinite/media - Universal Media Player Core
 * Built on W3C Custom Elements and native DOM standards.
 * Styled with @nofinite/nuicss design tokens.
 */

// Register Vidstack Custom Elements
import 'vidstack/player';
import 'vidstack/player/ui';
import 'vidstack/player/layouts/default';

export type MediaType = 'video' | 'audio';
export type MediaTheme = 'dark' | 'light' | 'auto';

export interface MediaTrack {
  src: string;
  label: string;
  language: string;
  kind?: 'subtitles' | 'captions' | 'chapters' | 'descriptions' | 'metadata';
  default?: boolean;
}

export interface MediaPlayerOptions {
  src: string;
  type?: MediaType;
  poster?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsinline?: boolean;
  controls?: boolean;
  className?: string;
  title?: string;
  artist?: string;
  artwork?: string;
  theme?: MediaTheme;
  aspectRatio?: string;
  tracks?: MediaTrack[];
  thumbnails?: string;
  playbackRates?: number[];
  seekStep?: number;
  crossOrigin?: 'anonymous' | 'use-credentials' | boolean;
  load?: 'eager' | 'idle' | 'visible' | 'play' | 'custom';
  preload?: 'none' | 'metadata' | 'auto';
  hlsEngine?: any | (() => Promise<any>);
  dashEngine?: any | (() => Promise<any>);
}

export interface MediaPlayerState {
  currentTime: number;
  duration: number;
  paused: boolean;
  playing: boolean;
  volume: number;
  muted: boolean;
  buffered: number;
  fullscreen: boolean;
  seeking: boolean;
}

export interface MediaPlayerInstance {
  element: HTMLElement;
  playerElement: HTMLElement;
  play: () => Promise<void>;
  pause: () => void;
  destroy: () => void;
  setSrc: (src: string) => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  setMuted: (muted: boolean) => void;
  enterFullscreen: () => Promise<void>;
  exitFullscreen: () => Promise<void>;
  enterPictureInPicture: () => Promise<void>;
  exitPictureInPicture: () => Promise<void>;
  setPlaybackRate: (rate: number) => void;
  getState: () => MediaPlayerState;
  on: (
    event: string,
    handler: EventListenerOrEventListenerObject
  ) => () => void;
  off: (event: string, handler: EventListenerOrEventListenerObject) => void;
}

interface CustomMediaPlayerElement extends HTMLElement {
  play?: () => Promise<void>;
  pause?: () => void;
  destroy?: () => void;
  enterFullscreen?: (target?: string) => Promise<void>;
  exitFullscreen?: (target?: string) => Promise<void>;
  enterPictureInPicture?: () => Promise<void>;
  exitPictureInPicture?: () => Promise<void>;
  currentTime?: number;
  volume?: number;
  muted?: boolean;
  playbackRate?: number;
  src?: any;
  state?: Record<string, any>;
}

export function isHlsSource(src: string): boolean {
  return (
    typeof src === 'string' && (src.includes('.m3u8') || src.includes('/hls/'))
  );
}

export function isDashSource(src: string): boolean {
  return (
    typeof src === 'string' && (src.includes('.mpd') || src.includes('/dash/'))
  );
}

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&#(\d+);?/g, (_, dec) => {
      try {
        return String.fromCharCode(parseInt(dec, 10));
      } catch {
        return '';
      }
    })
    .replace(/&#x([0-9a-f]+);?/gi, (_, hex) => {
      try {
        return String.fromCharCode(parseInt(hex, 16));
      } catch {
        return '';
      }
    })
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&apos;/gi, "'")
    .replace(/&amp;/gi, '&');
}

/**
 * Validates media source, artwork, poster, and track URLs against dangerous URI schemes.
 * Rejects javascript:, vbscript:, data:text/html, control characters, and dangerous payload vectors.
 * Permits http:, https:, blob:, safe data: image/audio/video schemes, and relative paths.
 */
const ALLOWED_MEDIA_PROTOCOLS = new Set(['http:', 'https:', 'blob:']);
const SAFE_MEDIA_DATA_URI_RE =
  /^data:(?:image\/(?:png|jpe?g|gif|webp)|video\/[a-z0-9.+-]+|audio\/[a-z0-9.+-]+)(?:;|,)/;

export function isValidMediaUrl(url: unknown): boolean {
  if (typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (!trimmed) return false;

  // Reject ASCII control characters
  for (let i = 0; i < trimmed.length; i++) {
    const code = trimmed.charCodeAt(i);
    if ((code >= 0 && code <= 31) || code === 127) {
      return false;
    }
  }

  // Decode potential HTML entities and strip whitespace before allowlist validation
  const decoded = decodeHtmlEntities(trimmed);
  const sanitized = decoded.replace(/\s+/g, '').toLowerCase();

  // Reject protocol-relative URLs (check both raw and decoded)
  if (trimmed.startsWith('//') || sanitized.startsWith('//')) {
    return false;
  }

  // Strictly allowlist only safe raster image, audio, and video data URIs; reject all other data: schemes
  if (sanitized.startsWith('data:')) {
    return SAFE_MEDIA_DATA_URI_RE.test(sanitized);
  }

  // Strictly allowlist protocol schemes on entity-decoded input (rejects javascript:, vbscript:, file:, etc.)
  const schemeMatch = sanitized.match(/^([a-z][a-z0-9+.-]*:)/);
  if (schemeMatch) {
    return ALLOWED_MEDIA_PROTOCOLS.has(schemeMatch[1]);
  }

  // Relative paths (with or without leading slash, including query colons like ?t=10:00) (MEDIA-M3-04)
  try {
    const parsed = new URL(trimmed, 'https://nofinite.internal');
    return ALLOWED_MEDIA_PROTOCOLS.has(parsed.protocol);
  } catch {
    return false;
  }
}

export const CDN_STREAMING_ENGINES = {
  hls: {
    src: 'https://cdn.jsdelivr.net/npm/hls.js@1.5.8/dist/hls.min.js',
    integrity:
      'sha384-xLhS5rbIdhv65H3GLX+caQgMSiEK/Hkw8Z6HITolgRxvXs0omcbeYD639tkJ2Wu6',
    crossOrigin: 'anonymous',
  },
  dash: {
    src: 'https://cdn.jsdelivr.net/npm/dashjs@4.7.4/dist/dash.all.min.js',
    integrity:
      'sha384-fl7i8WZxcPlF9b1503+Gm+izr/2hpilydj0i/DlQTIafROZ1NP4rAWjyl6p3s1ev',
    crossOrigin: 'anonymous',
  },
} as const;

export function loadStreamingCdnScript(
  type: 'hls' | 'dash'
): Promise<HTMLScriptElement | null> {
  if (typeof document === 'undefined') return Promise.resolve(null);

  const config = CDN_STREAMING_ENGINES[type];
  const existing = document.querySelector(
    `script[src="${config.src}"]`
  ) as HTMLScriptElement;
  if (existing) {
    return Promise.resolve(existing);
  }

  const script = document.createElement('script');
  script.src = config.src;
  script.integrity = config.integrity;
  script.crossOrigin = config.crossOrigin;
  script.async = true;

  if (
    typeof window !== 'undefined' &&
    ((window as any).__happy_dom__ ||
      (window as any).happyDOM ||
      (typeof process !== 'undefined' &&
        (Boolean(process.env?.VITEST) || Boolean(process.versions?.node))))
  ) {
    return Promise.resolve(script);
  }

  return new Promise((resolve, reject) => {
    script.onload = () => resolve(script);
    script.onerror = (e) =>
      reject(new Error(`Failed to load ${type} from CDN with SRI: ${e}`));
    document.head.appendChild(script);
  });
}

function stripUntilFixedPoint(input: string, pattern: RegExp): string {
  let current = input;
  let prev: string;
  do {
    prev = current;
    current = current.replace(pattern, '');
  } while (current !== prev);
  return current;
}

/**
 * Linear O(n) parser for WebVTT voice tags (<v[.class] Speaker>...) without
 * polynomial regex backtracking on repeated whitespace.
 */
function formatVttVoiceTags(input: string, bracketed: boolean): string {
  const lower = input.toLowerCase();
  let out = '';
  let cursor = 0;

  while (cursor < input.length) {
    const start = lower.indexOf('<v', cursor);
    if (start === -1) {
      out += input.slice(cursor);
      break;
    }

    let pos = start + 2;
    // Skip optional dotted class annotations (.class1.class2)
    while (pos < input.length && input[pos] === '.') {
      pos++;
      const clsStart = pos;
      while (pos < input.length && /[a-z0-9_-]/i.test(input[pos])) {
        pos++;
      }
      if (pos === clsStart) {
        pos = start + 2;
        break;
      }
    }

    // Must have at least one whitespace separator before voice label
    const wsStart = pos;
    while (pos < input.length && /\s/.test(input[pos])) {
      pos++;
    }
    if (pos === wsStart) {
      out += input.slice(cursor, start + 2);
      cursor = start + 2;
      continue;
    }

    const closeIdx = input.indexOf('>', pos);
    if (closeIdx === -1) {
      out += input.slice(cursor);
      break;
    }

    out += input.slice(cursor, start);
    const speaker = input.slice(pos, closeIdx);
    out += bracketed ? `[${speaker}]: ` : `${speaker}: `;
    cursor = closeIdx + 1;
  }

  return out;
}

export function sanitizeVttCue(rawCue: string): string {
  if (!rawCue) return '';
  let text = formatVttVoiceTags(rawCue, true);
  text = stripUntilFixedPoint(text, /<\/v\s*>/gi);
  text = text.replace(/<\d{2}:\d{2}(?::\d{2})?(?:\.\d{1,3})?>/g, '');
  text = stripUntilFixedPoint(
    text,
    /<\/?(?:script|img|iframe|object|embed|style|svg)\b[^>]*>/gi
  );
  text = stripUntilFixedPoint(
    text,
    /\bon[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi
  );
  let decoded = decodeHtmlEntities(text);
  decoded = stripUntilFixedPoint(
    decoded,
    /<\/?(?:script|img|iframe|object|embed|style|svg)\b[^>]*>/gi
  );
  decoded = stripUntilFixedPoint(
    decoded,
    /\bon[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi
  );
  return decoded
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function renderVttCue(
  cueText: string,
  targetEl?: HTMLElement
): HTMLElement {
  const el =
    targetEl ||
    (typeof document !== 'undefined'
      ? document.createElement('div')
      : ({} as HTMLElement));
  if (typeof (el as any).setAttribute === 'function') {
    el.className = 'nui-vtt-cue-text';
  }
  let plain = formatVttVoiceTags(cueText, false);
  plain = stripUntilFixedPoint(plain, /<\/v\s*>/gi);
  plain = stripUntilFixedPoint(plain, /<[^>]+>/g);
  plain = decodeHtmlEntities(plain);
  el.textContent = plain;
  return el;
}

export function formatTrackLabel(
  track: Partial<MediaTrack> | null | undefined
): string {
  return track?.label?.toLowerCase() ?? 'unknown';
}

export function formatMediaTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

const noop = (): void => {
  // no-op for SSR
};

const asyncNoop = async (): Promise<void> => {
  // no-op for SSR
};

const emptyState: MediaPlayerState = {
  currentTime: 0,
  duration: 0,
  paused: true,
  playing: false,
  volume: 1,
  muted: false,
  buffered: 0,
  fullscreen: false,
  seeking: false,
};

export function createMediaPlayer(
  options: MediaPlayerOptions
): MediaPlayerInstance {
  if (typeof document === 'undefined') {
    return {
      element: null as unknown as HTMLElement,
      playerElement: null as unknown as HTMLElement,
      play: asyncNoop,
      pause: noop,
      destroy: noop,
      setSrc: noop,
      seek: noop,
      setVolume: noop,
      setMuted: noop,
      enterFullscreen: asyncNoop,
      exitFullscreen: asyncNoop,
      enterPictureInPicture: asyncNoop,
      exitPictureInPicture: asyncNoop,
      setPlaybackRate: noop,
      getState: () => emptyState,
      on: () => noop,
      off: noop,
    };
  }

  const isAudio = options.type === 'audio';
  const colorScheme =
    options.theme && options.theme !== 'auto' ? options.theme : undefined;

  // Outer container adhering to NUICSS superclasses
  const container = document.createElement('div');
  if (isAudio) {
    container.className = `nui-media-container rounded-xl border border-default shadow-sm bg-surface backdrop-blur-sm p-3 relative select-none ${
      options.className || ''
    }`;
  } else {
    container.className = `nui-media-container aspect-video rounded-xl overflow-hidden border border-default shadow-sm bg-black relative select-none ${
      options.className || ''
    }`;
    if (options.aspectRatio) {
      container.style.aspectRatio = options.aspectRatio;
    }
  }

  // Audio header info card if metadata present
  if (isAudio && (options.title || options.artist || options.artwork)) {
    const header = document.createElement('div');
    header.className = 'flex items-center gap-3 mb-2 px-1';

    if (options.artwork && isValidMediaUrl(options.artwork)) {
      const img = document.createElement('img');
      img.src = options.artwork;
      img.alt = options.title || 'Audio artwork';
      img.className =
        'w-10 h-10 rounded-lg object-cover border border-default flex-shrink-0';
      header.appendChild(img);
    }

    const meta = document.createElement('div');
    meta.className = 'min-w-0 flex-1';

    if (options.title) {
      const titleEl = document.createElement('div');
      titleEl.className = 'text-sm font-semibold text-primary truncate';
      titleEl.textContent = options.title;
      meta.appendChild(titleEl);
    }

    if (options.artist) {
      const artistEl = document.createElement('div');
      artistEl.className = 'text-xs text-muted truncate';
      artistEl.textContent = options.artist;
      meta.appendChild(artistEl);
    }

    header.appendChild(meta);
    container.appendChild(header);
  }

  // Create <media-player> custom element
  const player = document.createElement(
    'media-player'
  ) as CustomMediaPlayerElement;
  const safeSrc = isValidMediaUrl(options.src) ? options.src : '';
  player.setAttribute('src', safeSrc);
  player.setAttribute('view-type', isAudio ? 'audio' : 'video');
  player.setAttribute(
    'load',
    options.load ?? (options.autoplay ? 'eager' : 'play')
  );

  const resolvedCrossOrigin =
    options.crossOrigin === false
      ? undefined
      : options.crossOrigin === true
      ? 'anonymous'
      : options.crossOrigin ?? 'anonymous';

  if (resolvedCrossOrigin) {
    player.setAttribute('crossorigin', resolvedCrossOrigin);
  }
  if (options.preload) {
    player.setAttribute('preload', options.preload);
  }

  if (options.poster && isValidMediaUrl(options.poster)) {
    player.setAttribute('poster', options.poster);
  }
  if (options.title) player.setAttribute('title', options.title);
  if (options.artist) player.setAttribute('artist', options.artist);
  if (options.autoplay) player.setAttribute('autoplay', '');
  if (options.loop) player.setAttribute('loop', '');
  if (options.muted) player.setAttribute('muted', '');
  if (options.playsinline !== false) player.setAttribute('playsinline', '');

  player.className = isAudio
    ? `w-full nui-vidstack-audio-player ${colorScheme || ''}`
    : `w-full h-full nui-vidstack-player ${colorScheme || ''}`;

  if (colorScheme) {
    player.setAttribute('data-color-scheme', colorScheme);
  }

  // Create <media-provider>
  const provider = document.createElement('media-provider');

  // Connect consumer dynamic streaming engines (Tier 1 primary)
  if (options.hlsEngine) {
    (player as any).hlsLibrary = options.hlsEngine;
  }
  if (options.dashEngine) {
    (player as any).dashLibrary = options.dashEngine;
  }

  // Subtitles / Captions tracks with resilience error handling
  if (Array.isArray(options.tracks)) {
    for (const track of options.tracks) {
      if (!isValidMediaUrl(track.src)) continue;
      const trackEl = document.createElement('track');
      trackEl.setAttribute('src', track.src);
      const safeLabel = track.label?.toLowerCase() ?? 'unknown';
      trackEl.setAttribute('label', track.label ?? safeLabel);
      trackEl.setAttribute('srclang', track.language || 'en');
      trackEl.setAttribute('kind', track.kind || 'subtitles');
      if (track.default) {
        trackEl.setAttribute('default', '');
        trackEl.default = true;
      }
      trackEl.addEventListener('error', (event) => {
        player.dispatchEvent(
          new CustomEvent('trackerror', {
            detail: { track, error: event },
            bubbles: true,
          })
        );
      });
      provider.appendChild(trackEl);
    }
  }

  player.appendChild(provider);

  // Layout controls (when controls !== false)
  if (options.controls !== false) {
    if (isAudio) {
      const audioLayout = document.createElement('media-audio-layout');
      if (options.seekStep) {
        audioLayout.setAttribute('seek-step', String(options.seekStep));
      }
      player.appendChild(audioLayout);
    } else {
      const videoLayout = document.createElement('media-video-layout');
      if (options.thumbnails && isValidMediaUrl(options.thumbnails)) {
        videoLayout.setAttribute('thumbnails', options.thumbnails);
      }
      if (options.seekStep) {
        videoLayout.setAttribute('seek-step', String(options.seekStep));
      }
      player.appendChild(videoLayout);
    }
  }

  container.appendChild(player);

  // Listener registry to guarantee clean disposal without memory leaks
  const listeners: Array<{
    event: string;
    handler: EventListenerOrEventListenerObject;
  }> = [];

  const on = (
    event: string,
    handler: EventListenerOrEventListenerObject
  ): (() => void) => {
    player.addEventListener(event, handler);
    listeners.push({ event, handler });
    return () => off(event, handler);
  };

  const off = (
    event: string,
    handler: EventListenerOrEventListenerObject
  ): void => {
    player.removeEventListener(event, handler);
    const index = listeners.findIndex(
      (l) => l.event === event && l.handler === handler
    );
    if (index !== -1) {
      listeners.splice(index, 1);
    }
  };

  return {
    element: container,
    playerElement: player,
    play: async () => {
      if (typeof player.play === 'function') {
        return player.play();
      }
    },
    pause: () => {
      if (typeof player.pause === 'function') {
        player.pause();
      }
    },
    destroy: () => {
      // Detach all listeners to prevent memory leaks in single-page apps
      for (const { event, handler } of listeners) {
        player.removeEventListener(event, handler);
      }
      listeners.length = 0;

      if (typeof player.destroy === 'function') {
        player.destroy();
      }
      container.remove();
    },
    setSrc: (newSrc: string) => {
      const safe = isValidMediaUrl(newSrc) ? newSrc : '';
      player.src = safe;
      player.setAttribute('src', safe);
    },
    seek: (time: number) => {
      if (typeof time === 'number' && !isNaN(time)) {
        player.currentTime = time;
      }
    },
    setVolume: (volume: number) => {
      if (typeof volume === 'number' && !isNaN(volume)) {
        player.volume = Math.max(0, Math.min(1, volume));
      }
    },
    setMuted: (muted: boolean) => {
      player.muted = Boolean(muted);
      if (muted) {
        player.setAttribute('muted', '');
      } else {
        player.removeAttribute('muted');
      }
    },
    enterFullscreen: async () => {
      try {
        if (typeof player.enterFullscreen === 'function') {
          return await player.enterFullscreen();
        } else if (typeof container.requestFullscreen === 'function') {
          return await container.requestFullscreen();
        }
      } catch {
        // Handled: Browser permissions or unsupported fullscreen
      }
    },
    exitFullscreen: async () => {
      try {
        if (typeof player.exitFullscreen === 'function') {
          return await player.exitFullscreen();
        } else if (
          typeof document.exitFullscreen === 'function' &&
          document.fullscreenElement
        ) {
          return await document.exitFullscreen();
        }
      } catch {
        // Handled: Active fullscreen state mismatch
      }
    },
    enterPictureInPicture: async () => {
      try {
        if (typeof player.enterPictureInPicture === 'function') {
          return await player.enterPictureInPicture();
        }
      } catch {
        // Handled: Browser permissions or unsupported PiP
      }
    },
    exitPictureInPicture: async () => {
      try {
        if (typeof player.exitPictureInPicture === 'function') {
          return await player.exitPictureInPicture();
        }
      } catch {
        // Handled: Active PiP state mismatch
      }
    },
    setPlaybackRate: (rate: number) => {
      if (typeof rate === 'number' && rate > 0) {
        player.playbackRate = rate;
      }
    },
    getState: (): MediaPlayerState => {
      const state = player.state || {};
      return {
        currentTime: state.currentTime ?? player.currentTime ?? 0,
        duration: state.duration ?? 0,
        paused: state.paused ?? true,
        playing: state.playing ?? false,
        volume: state.volume ?? player.volume ?? 1,
        muted: state.muted ?? player.muted ?? false,
        buffered: state.bufferedEnd ?? 0,
        fullscreen: state.fullscreen ?? false,
        seeking: state.seeking ?? false,
      };
    },
    on,
    off,
  };
}
