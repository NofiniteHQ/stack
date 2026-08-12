import React from 'react';
import { NodeViewWrapper, NodeViewProps } from '@tiptap/react';
import { Attachment } from '../../attachment/Attachment';
import { cn } from '../../../utils';

export const FileAttachmentNodeView: React.FC<NodeViewProps> = ({ node, selected }) => {
  const { src, filename, filesize, filetype, uploading } = node.attrs;

  return (
    <NodeViewWrapper className={cn("my-4 inline-block w-full max-w-sm", selected && "ring-2 ring-primary ring-offset-2 rounded-lg")}>
      <Attachment
        filename={filename}
        filesize={filesize}
        filetype={filetype}
        src={src}
        isLoading={uploading}
      />
    </NodeViewWrapper>
  );
};
