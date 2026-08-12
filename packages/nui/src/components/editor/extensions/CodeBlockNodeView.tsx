import React from 'react';
import { NodeViewWrapper, NodeViewContent, NodeViewProps } from '@tiptap/react';
import { CodeBlock } from '../../codeblock/CodeBlock';

export const CodeBlockNodeView: React.FC<NodeViewProps> = ({ node, updateAttributes }) => {
  return (
    <NodeViewWrapper className="my-4">
      <CodeBlock
        language={node.attrs.language || 'text'}
        onLanguageChange={(lang) => updateAttributes({ language: lang })}
        code={node.textContent}
      >
        <NodeViewContent as="code" className={node.attrs.language ? `language-${node.attrs.language}` : ''} />
      </CodeBlock>
    </NodeViewWrapper>
  );
};
