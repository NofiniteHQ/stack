import { forwardRef } from 'react';
import {
  MediaPlayer,
  MediaProvider,
  type MediaPlayerInstance,
} from '@vidstack/react';
import {
  defaultLayoutIcons,
  DefaultAudioLayout,
} from '@vidstack/react/player/layouts/default';
import clsx from 'clsx';

export interface AudioPlayerProps {
  src?: string;
  url?: string;
  title?: string;
  artist?: string;
  artwork?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  theme?: 'dark' | 'light' | 'auto';
  className?: string;
}

export const AudioPlayer = forwardRef<MediaPlayerInstance, AudioPlayerProps>(
  (
    {
      src,
      url,
      title,
      artist,
      artwork,
      autoPlay = false,
      loop = false,
      muted = false,
      controls = true,
      theme = 'dark',
      className,
    },
    ref
  ) => {
    const mediaSrc = src || url;
    if (!mediaSrc) return null;

    return (
      <div
        className={clsx(
          'w-full rounded-xl border border-[var(--border-default)] shadow-sm bg-[var(--bg-surface)] backdrop-blur-sm p-3 relative select-none',
          className
        )}
        contentEditable={false}
      >
        {(title || artist || artwork) && (
          <div className="flex items-center gap-3 mb-2 px-1">
            {artwork && (
              <img
                src={artwork}
                alt={title || 'Audio artwork'}
                className="w-10 h-10 rounded-lg object-cover border border-[var(--border-default)] flex-shrink-0"
              />
            )}
            <div className="min-w-0 flex-1">
              {title && (
                <div className="text-sm font-semibold text-[var(--color-primary)] truncate">
                  {title}
                </div>
              )}
              {artist && (
                <div className="text-xs text-[var(--text-muted)] truncate">
                  {artist}
                </div>
              )}
            </div>
          </div>
        )}

        <MediaPlayer
          ref={ref}
          src={mediaSrc}
          title={title}
          artist={artist}
          autoplay={autoPlay}
          loop={loop}
          muted={muted}
          viewType="audio"
          load="play"
          className={clsx(
            'w-full nui-vidstack-audio-player',
            theme === 'dark' ? 'dark' : theme === 'light' ? 'light' : ''
          )}
          data-color-scheme={theme}
        >
          <MediaProvider />
          {controls && <DefaultAudioLayout icons={defaultLayoutIcons} />}
        </MediaPlayer>
      </div>
    );
  }
);

AudioPlayer.displayName = 'AudioPlayer';
