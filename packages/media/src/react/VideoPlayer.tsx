import { forwardRef } from 'react';
import {
  MediaPlayer,
  MediaProvider,
  type MediaPlayerInstance,
} from '@vidstack/react';
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from '@vidstack/react/player/layouts/default';
import clsx from 'clsx';

export interface VideoPlayerProps {
  src?: string;
  url?: string;
  poster?: string;
  title?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  controls?: boolean;
  theme?: 'dark' | 'light' | 'auto';
  aspectRatio?: string;
  className?: string;
}

export const VideoPlayer = forwardRef<MediaPlayerInstance, VideoPlayerProps>(
  (
    {
      src,
      url,
      poster,
      title,
      autoPlay = false,
      loop = false,
      muted = false,
      playsInline = true,
      controls = true,
      theme = 'dark',
      aspectRatio = '16/9',
      className,
    },
    ref
  ) => {
    const mediaSrc = src || url;
    if (!mediaSrc) return null;

    return (
      <div
        className={clsx(
          'w-full aspect-video rounded-xl overflow-hidden border border-[var(--border-default)] shadow-sm bg-black group relative select-none',
          className
        )}
        style={{ aspectRatio }}
        contentEditable={false}
      >
        <MediaPlayer
          ref={ref}
          src={mediaSrc}
          poster={poster}
          title={title}
          autoplay={autoPlay}
          loop={loop}
          muted={muted}
          playsinline={playsInline}
          load="play"
          className={clsx(
            'w-full h-full nui-vidstack-player',
            theme === 'dark' ? 'dark' : theme === 'light' ? 'light' : ''
          )}
          data-color-scheme={theme}
        >
          <MediaProvider />
          {controls && <DefaultVideoLayout icons={defaultLayoutIcons} />}
        </MediaPlayer>
      </div>
    );
  }
);

VideoPlayer.displayName = 'VideoPlayer';
