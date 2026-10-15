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
  DefaultVideoLayout,
} from '@vidstack/react/player/layouts/default';
import clsx from 'clsx';
import type { MediaTrack, MediaTheme } from '../core';

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
  theme?: MediaTheme;
  aspectRatio?: string;
  className?: string;
  style?: React.CSSProperties;
  tracks?: MediaTrack[];
  thumbnails?: string;
  playbackRates?: number[] | { min: number; max: number; step: number };
  seekStep?: number;
  crossOrigin?: 'anonymous' | 'use-credentials' | boolean;
  load?: 'eager' | 'idle' | 'visible' | 'play' | 'custom';
  preload?: 'none' | 'metadata' | 'auto';
  slots?: any;
  // Event Callbacks
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (detail: { currentTime: number; duration: number }) => void;
  onVolumeChange?: (detail: { volume: number; muted: boolean }) => void;
  onError?: (error: any) => void;
  onSeeked?: (time: number) => void;
  onLoadedMetadata?: (detail: { duration: number }) => void;
  onFullscreenChange?: (fullscreen: boolean) => void;
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
      theme = 'auto',
      aspectRatio = '16/9',
      className,
      style,
      tracks,
      thumbnails,
      playbackRates,
      seekStep,
      crossOrigin = 'anonymous',
      load,
      preload,
      slots,
      onPlay,
      onPause,
      onEnded,
      onTimeUpdate,
      onVolumeChange,
      onError,
      onSeeked,
      onLoadedMetadata,
      onFullscreenChange,
    },
    ref
  ) => {
    const mediaSrc = src || url;
    if (!mediaSrc) return null;

    const colorScheme = theme === 'auto' ? undefined : theme;
    const resolvedCrossOrigin =
      crossOrigin === false
        ? undefined
        : crossOrigin === true
        ? 'anonymous'
        : crossOrigin;

    return (
      <div
        className={clsx(
          'w-full aspect-video rounded-xl overflow-hidden border border-default shadow-sm bg-black group relative select-none',
          className
        )}
        style={{ aspectRatio, ...style }}
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
          load={load ?? (autoPlay ? 'eager' : 'visible')}
          preload={preload}
          crossorigin={resolvedCrossOrigin}
          className={clsx(
            'w-full h-full nui-vidstack-player',
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
          onFullscreenChange={(e: any) => {
            if (onFullscreenChange) {
              const isFullscreen =
                typeof e === 'boolean' ? e : e?.detail ?? false;
              onFullscreenChange(isFullscreen);
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
          {controls && (
            <DefaultVideoLayout
              icons={defaultLayoutIcons}
              thumbnails={thumbnails}
              playbackRates={playbackRates}
              seekStep={seekStep}
              slots={slots}
            />
          )}
        </MediaPlayer>
      </div>
    );
  }
);

VideoPlayer.displayName = 'VideoPlayer';
