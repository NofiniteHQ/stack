import React, { useEffect, useRef, useState } from 'react';
import { NodeViewWrapper, NodeViewProps } from '@tiptap/react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { Sigma } from 'lucide-react';
import { cn } from '../../../utils';

export const BlockMathNodeView: React.FC<NodeViewProps> = ({ node, selected, updateAttributes }) => {
  const { equation } = node.attrs;
  const katexRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (katexRef.current) {
      try {
        katex.render(equation || '\\text{Enter an equation...}', katexRef.current, {
          displayMode: true,
          throwOnError: true,
        });
        setError(null);
      } catch (err: any) {
        setError(err.message);
      }
    }
  }, [equation]);

  return (
    <NodeViewWrapper className={cn("my-4 relative rounded-lg border border-default bg-surface shadow-sm overflow-hidden", selected && "ring-2 ring-primary ring-offset-2")}>
      <div 
        contentEditable={false}
        className="flex items-center justify-between px-3 py-1.5 bg-subtle border-b border-default select-none text-muted"
        onClick={() => setIsEditing(!isEditing)}
      >
        <div className="flex items-center gap-2">
          <Sigma size={16} />
          <span className="text-xs font-semibold uppercase tracking-wider">Block Math</span>
        </div>
        <span className="text-xs">{isEditing ? 'Close' : 'Edit'}</span>
      </div>
      
      {isEditing && (
        <textarea
          className="w-full min-h-[80px] p-4 bg-[#0d1117] text-gray-200 font-mono text-sm border-b border-default focus:outline-none resize-y"
          value={equation}
          onChange={(e) => updateAttributes({ equation: e.target.value })}
          placeholder="\sum_{i=1}^n i = \frac{n(n+1)}{2}"
        />
      )}

      <div className={cn("flex justify-center items-center min-h-[80px] p-6 bg-surface overflow-x-auto", error && "bg-destructive/10")}>
        {error ? (
          <div className="text-sm text-destructive font-mono whitespace-pre-wrap">{error}</div>
        ) : (
          <div ref={katexRef} className="text-default text-lg" />
        )}
      </div>
    </NodeViewWrapper>
  );
};
