import React, { useEffect, useState } from 'react';
import { NodeViewWrapper, NodeViewProps } from '@tiptap/react';
import { LinkPreview } from '../../linkpreview/LinkPreview';
import { cn } from '../../../utils';

export const LinkPreviewNodeView: React.FC<NodeViewProps> = ({ node, selected, updateAttributes }) => {
  const { url, title, description, image, loading } = node.attrs;
  const [error, setError] = useState(false);

  // Mock fetching OpenGraph data
  useEffect(() => {
    if (loading && url) {
      const timer = setTimeout(() => {
        try {
          const domain = new URL(url).hostname;
          updateAttributes({
            loading: false,
            title: `Preview for ${domain}`,
            description: `This is an automatically generated rich preview card for ${url}. In a real application, this would fetch OpenGraph metadata from a backend service.`,
            image: `https://picsum.photos/seed/${domain}/600/300` // Mock image
          });
        } catch (e) {
          setError(true);
          updateAttributes({ loading: false });
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [loading, url, updateAttributes]);

  return (
    <NodeViewWrapper className={cn("my-4 w-full select-none", selected && "ring-2 ring-primary ring-offset-2 rounded-lg")}>
      <LinkPreview 
        url={url} 
        title={title} 
        description={description} 
        image={image} 
        loading={loading} 
        error={error} 
      />
    </NodeViewWrapper>
  );
};
