import React from 'react';
import { NodeViewWrapper, NodeViewProps } from '@tiptap/react';
import { VideoPlayer } from '../../video/VideoPlayer';
import { cn } from '../../../utils';
import { Loader2 } from 'lucide-react';

export const VideoNodeView: React.FC<NodeViewProps> = ({ node, selected }) => {
  return (
    <NodeViewWrapper className={cn("react-component", selected && "ring-2 ring-primary rounded-lg")}>
      {node.attrs.uploading ? (
        <div className="flex flex-col items-center justify-center w-full max-w-lg aspect-video bg-subtle rounded-md border-2 border-dashed border-default animate-pulse">
           <Loader2 size={32} className="animate-spin text-muted mb-2" />
           <span className="text-muted text-sm font-medium">Uploading video...</span>
        </div>
      ) : (
        <VideoPlayer url={node.attrs.src} />
      )}
    </NodeViewWrapper>
  );
};
