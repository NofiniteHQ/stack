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

      <MediaPlayer 
        src={url} 
        load="play"
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
