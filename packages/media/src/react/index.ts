'use client';

export * from './VideoPlayer';
export * from './AudioPlayer';
export type { MediaTrack, MediaTheme } from '../core';
export {
  MediaPlayer,
  MediaProvider,
  Track,
  useMediaRemote,
  useMediaState,
  useMediaPlayer,
  useActiveTextTrack,
  useVideoQualityOptions,
  useAudioOptions,
  useCaptionOptions,
  usePlaybackRateOptions,
  type MediaPlayerInstance,
} from '@vidstack/react';
export {
  DefaultVideoLayout,
  DefaultAudioLayout,
  defaultLayoutIcons,
  type DefaultVideoLayoutProps,
  type DefaultAudioLayoutProps,
} from '@vidstack/react/player/layouts/default';
