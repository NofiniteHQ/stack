/**
 * @nofinite/media - Universal Media Player Core
 * Built on W3C Custom Elements and native DOM standards.
 * Styled with @nofinite/nuicss design tokens.
 */

// Register Vidstack Custom Elements
import 'vidstack/player';
import 'vidstack/player/ui';
import 'vidstack/player/layouts/default';
import 'vidstack/icons';

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
  player.setAttribute('load', 'play');

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
      trackEl.src = track.src;
      trackEl.label = track.label;
      trackEl.srclang = track.language;
      trackEl.kind = track.kind || 'subtitles';
      if (track.default) trackEl.default = true;
      provider.appendChild(trackEl);
    }
  }

  player.appendChild(provider);

  // Layout controls (when controls !== false)
  if (options.controls !== false) {
    if (isAudio) {
      const audioLayout = document.createElement('media-audio-layout');
      player.appendChild(audioLayout);
    } else {
      const videoLayout = document.createElement('media-video-layout');
      if (options.thumbnails) {
        videoLayout.setAttribute('thumbnails', options.thumbnails);
      }
      player.appendChild(videoLayout);
    }
  }

  container.appendChild(player);

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
      if (typeof player.destroy === 'function') {
        player.destroy();
      }
      container.remove();
    },
    setSrc: (newSrc: string) => {
      player.setAttribute('src', newSrc);
    },
    getState: (): MediaPlayerState => {
      const state = player.state || {};
      return {
        currentTime: state.currentTime ?? 0,
        duration: state.duration ?? 0,
        paused: state.paused ?? true,
        playing: state.playing ?? false,
        volume: state.volume ?? 1,
        muted: state.muted ?? false,
        buffered: state.bufferedEnd ?? 0,
        fullscreen: state.fullscreen ?? false,
        seeking: state.seeking ?? false,
      };
    },
    on: (event: string, handler: EventListenerOrEventListenerObject) => {
      player.addEventListener(event, handler);
      return () => player.removeEventListener(event, handler);
    },
    off: (event: string, handler: EventListenerOrEventListenerObject) => {
      player.removeEventListener(event, handler);
    },
  };
}
