import React from 'react';
import { NodeViewWrapper, NodeViewContent, NodeViewProps } from '@tiptap/react';
import { Collapsible } from '../../collapsible/Collapsible';

export const CollapsibleNodeView: React.FC<NodeViewProps> = ({ node, updateAttributes }) => {
  const { open } = node.attrs;

  return (
    <NodeViewWrapper className="my-2">
      <Collapsible 
        title="Toggle List"
        isOpen={open}
        onToggle={(isOpen) => updateAttributes({ open: isOpen })}
      >
        <div className="px-4 py-2 min-h-[1.5rem]">
           <NodeViewContent className="collapsible-content" />
        </div>
      </Collapsible>
    </NodeViewWrapper>
  );
};
