import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { CollapsibleNodeView } from './CollapsibleNodeView';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    collapsibleBlock: {
      setCollapsibleBlock: () => ReturnType;
    };
  }
}

export const CollapsibleBlock = Node.create({
  name: 'collapsibleBlock',
  group: 'block',
  content: 'block+',
  draggable: true,

  addAttributes() {
    return {
      open: { default: true },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="collapsible-block"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'collapsible-block' }), 0];
  },

  addCommands() {
    return {
      setCollapsibleBlock:
        () =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            content: [
              {
                type: 'paragraph',
              },
            ],
          });
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(CollapsibleNodeView);
  },
});
