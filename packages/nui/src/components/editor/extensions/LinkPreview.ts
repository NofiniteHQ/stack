import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { LinkPreviewNodeView } from './LinkPreviewNodeView';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    linkPreview: {
      setLinkPreview: (options: { url: string }) => ReturnType;
    };
  }
}

export const LinkPreview = Node.create({
  name: 'linkPreview',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      url: { default: null },
      title: { default: '' },
      description: { default: '' },
      image: { default: '' },
      loading: { default: true },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-link-preview]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes({ 'data-link-preview': '' }, HTMLAttributes)];
  },
  
  addCommands() {
    return {
      setLinkPreview:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: { url: options.url, loading: true },
          });
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(LinkPreviewNodeView);
  },
});
