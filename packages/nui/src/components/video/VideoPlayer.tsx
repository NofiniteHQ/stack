import React from 'react';
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import { MediaPlayer, MediaProvider } from '@vidstack/react';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';
import { cn } from '../../utils';
import { useTheme } from '../nuiprovider/NUIProvider';

export interface VideoPlayerProps {
  url: string;
  className?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, className }) => {
  const { resolvedTheme } = useTheme();
  
  if (!url) return null;

  return (
    <div className={cn("w-full aspect-video rounded-lg overflow-hidden border border-default shadow-sm bg-black group relative", className)} contentEditable={false}>
      <style>{`
        /* 
          Force Vidstack Portals and components to use NUI Theme Variables 
          We use direct CSS properties with !important to completely bypass 
          Vidstack's complex internal CSS variable mapping and shadow DOM encapsulation.
        */
        [data-media-player] {
          --media-font-family: var(--font-sans) !important;
          --media-focus-ring-color: var(--focus-ring) !important;
        }
        
        /* Tooltips */
        .vds-tooltip-content {
          background-color: var(--bg-surface-raised) !important;
          border: 1px solid var(--border-default) !important;
          color: var(--fg-default) !important;
          border-radius: var(--radius-sm) !important;
        }
        
        /* Menus */
        .vds-menu-items {
          background-color: var(--bg-surface) !important;
          border: 1px solid var(--border-default) !important;
          color: var(--fg-default) !important;
          border-radius: var(--radius-md) !important;
          box-shadow: var(--shadow-lg) !important;
        }
        
        /* Menu Items */
        .vds-menu-item:hover, .vds-radio:hover, .vds-menu-item[data-focus], .vds-radio[data-focus] {
          background-color: var(--bg-subtle) !important;
        }
        
        .vds-menu-item[aria-checked="true"], .vds-radio[aria-checked="true"] {
          background-color: var(--bg-selected) !important;
          color: var(--color-primary) !important;
        }

        /* Sliders */
        .vds-slider-track {
          background-color: var(--bg-muted) !important;
        }
        
        .vds-slider-track-fill {
          background-color: var(--color-primary) !important;
        }
        
        .vds-slider-thumb {
          background-color: var(--color-primary) !important;
        }

        /* YouTube Iframe Fix */
        .nui-vidstack-player media-provider[data-youtube] iframe {
          top: -50% !important;
          height: 200% !important;
        }
      `}</style>
      <MediaPlayer 
        src={url} 
        className={cn("w-full h-full nui-vidstack-player", resolvedTheme === 'dark' ? 'dark' : 'light')}
        data-color-scheme={resolvedTheme}
      >
        <MediaProvider />
        <DefaultVideoLayout 
          icons={defaultLayoutIcons} 
        />
      </MediaPlayer>
    </div>
  );
};
