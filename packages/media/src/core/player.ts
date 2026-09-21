/**
 * @nofinite/media - Universal Media Player Core
 * Built on W3C Custom Elements and native DOM standards
 */

export type MediaType = 'video' | 'audio';

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
}

export interface MediaPlayerInstance {
  element: HTMLElement;
  play: () => Promise<void>;
  pause: () => void;
  destroy: () => void;
  setSrc: (src: string) => void;
}

interface CustomMediaPlayerElement extends HTMLElement {
  play?: () => Promise<void>;
  pause?: () => void;
  destroy?: () => void;
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

export function createMediaPlayer(
  options: MediaPlayerOptions
): MediaPlayerInstance {
  if (typeof document === 'undefined') {
    return {
      element: null as unknown as HTMLElement,
      play: asyncNoop,
      pause: noop,
      destroy: noop,
      setSrc: noop,
    };
  }

  const container = document.createElement('div');
  container.className = `nui-media-container ${options.className || ''}`;

  const player = document.createElement(
    'media-player'
  ) as CustomMediaPlayerElement;
  player.setAttribute('src', options.src);
  player.setAttribute('view-type', options.type || 'video');

  if (options.poster) player.setAttribute('poster', options.poster);
  if (options.autoplay) player.setAttribute('autoplay', '');
  if (options.loop) player.setAttribute('loop', '');
  if (options.muted) player.setAttribute('muted', '');
  if (options.playsinline !== false) player.setAttribute('playsinline', '');

  const provider = document.createElement('media-provider');
  player.appendChild(provider);
  container.appendChild(player);

  return {
    element: container,
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
  };
}
