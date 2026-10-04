'use client';

import { forwardRef } from 'react';
import {
  MediaPlayer,
  MediaProvider,
  Track,
  type MediaPlayerInstance,
} from '@vidstack/react';
import {
  defaultLayoutIcons,
  DefaultAudioLayout,
} from '@vidstack/react/player/layouts/default';
import clsx from 'clsx';
import type { MediaTrack, MediaTheme } from '../core';

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
  theme?: MediaTheme;
  className?: string;
  tracks?: MediaTrack[];
  // Event Callbacks
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (detail: { currentTime: number; duration: number }) => void;
  onVolumeChange?: (detail: { volume: number; muted: boolean }) => void;
  onError?: (error: any) => void;
  onSeeked?: (time: number) => void;
  onLoadedMetadata?: (detail: { duration: number }) => void;
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
      theme = 'auto',
      className,
      tracks,
      onPlay,
      onPause,
      onEnded,
      onTimeUpdate,
      onVolumeChange,
      onError,
      onSeeked,
      onLoadedMetadata,
    },
    ref
  ) => {
    const mediaSrc = src || url;
    if (!mediaSrc) return null;

    const colorScheme = theme === 'auto' ? undefined : theme;

    return (
      <div
        className={clsx(
          'w-full rounded-xl border border-default shadow-sm bg-surface backdrop-blur-sm p-3 relative select-none',
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
                className="w-10 h-10 rounded-lg object-cover border border-default flex-shrink-0"
              />
            )}
            <div className="min-w-0 flex-1">
              {title && (
                <div className="text-sm font-semibold text-primary truncate">
                  {title}
                </div>
              )}
              {artist && (
                <div className="text-xs text-muted truncate">{artist}</div>
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
            colorScheme === 'dark'
              ? 'dark'
              : colorScheme === 'light'
              ? 'light'
              : ''
          )}
          data-color-scheme={colorScheme}
          onPlay={() => onPlay?.()}
          onPause={() => onPause?.()}
          onEnded={() => onEnded?.()}
          onTimeUpdate={(e: any) => {
            if (onTimeUpdate) {
              const currentTime =
                typeof e?.currentTime === 'number'
                  ? e.currentTime
                  : e?.detail?.currentTime ?? 0;
              const duration =
                typeof e?.duration === 'number'
                  ? e.duration
                  : e?.detail?.duration ?? 0;
              onTimeUpdate({ currentTime, duration });
            }
          }}
          onVolumeChange={(e: any) => {
            if (onVolumeChange) {
              const volume =
                typeof e?.volume === 'number'
                  ? e.volume
                  : e?.detail?.volume ?? 1;
              const isMuted =
                typeof e?.muted === 'boolean'
                  ? e.muted
                  : e?.detail?.muted ?? false;
              onVolumeChange({ volume, muted: isMuted });
            }
          }}
          onError={(e: any) => onError?.(e)}
          onSeeked={(e: any) => {
            if (onSeeked) {
              const time =
                typeof e === 'number'
                  ? e
                  : typeof e?.currentTime === 'number'
                  ? e.currentTime
                  : e?.detail ?? 0;
              onSeeked(time);
            }
          }}
          onLoadedMetadata={(e: any) => {
            if (onLoadedMetadata) {
              const duration =
                typeof e?.duration === 'number'
                  ? e.duration
                  : e?.detail?.duration ?? 0;
              onLoadedMetadata({ duration });
            }
          }}
        >
          <MediaProvider>
            {tracks?.map((track) => (
              <Track
                key={track.src}
                src={track.src}
                label={track.label}
                lang={track.language}
                kind={track.kind || 'subtitles'}
                default={track.default}
              />
            ))}
          </MediaProvider>
          {controls && <DefaultAudioLayout icons={defaultLayoutIcons} />}
        </MediaPlayer>
      </div>
    );
  }
);

AudioPlayer.displayName = 'AudioPlayer';
