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

    if (options.artwork) {
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
  player.setAttribute('src', options.src);
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

  if (options.poster) player.setAttribute('poster', options.poster);
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

  // Subtitles / Captions tracks
  if (Array.isArray(options.tracks)) {
    for (const track of options.tracks) {
      const trackEl = document.createElement('track');
      trackEl.setAttribute('src', track.src);
      trackEl.setAttribute('label', track.label);
      trackEl.setAttribute('srclang', track.language);
      trackEl.setAttribute('kind', track.kind || 'subtitles');
      if (track.default) {
        trackEl.setAttribute('default', '');
        trackEl.default = true;
      }
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
      if (options.thumbnails) {
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
      player.src = newSrc;
      player.setAttribute('src', typeof newSrc === 'string' ? newSrc : '');
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
