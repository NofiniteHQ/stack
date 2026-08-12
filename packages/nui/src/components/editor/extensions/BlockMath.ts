import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { BlockMathNodeView } from './BlockMathNodeView';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    blockMath: {
      setBlockMath: (options?: { equation: string }) => ReturnType;
    };
  }
}

export const BlockMath = Node.create({
  name: 'blockMath',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      equation: { default: '\\sum_{i=1}^n i = \\frac{n(n+1)}{2}' },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-block-math]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes({ 'data-block-math': '' }, HTMLAttributes)];
  },
  
  addCommands() {
    return {
      setBlockMath:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options || {},
          });
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(BlockMathNodeView);
  },
});
