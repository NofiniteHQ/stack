/**
 * @nofinite/markon - Collapsible Accordion / Details Extension
 * Framework-agnostic TipTap extensions for Notion-style toggle sections (<details>, <summary>, content).
 * 100% styled with @nofinite/nuicss design tokens.
 */

import { mergeAttributes, Node } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    details: {
      insertDetails: () => ReturnType;
    };
  }
}

export const DetailsSummary = Node.create({
  name: 'detailsSummary',
  content: 'text*',
  defining: true,
  isolating: true,

  parseHTML() {
    return [{ tag: 'summary' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'summary',
      mergeAttributes(
        {
          class:
            'markon-summary font-semibold text-sm cursor-pointer select-none text-default hover:text-primary list-none flex items-center gap-2 py-1',
        },
        HTMLAttributes
      ),
      0,
    ];
  },
});

export const DetailsContent = Node.create({
  name: 'detailsContent',
  group: 'block',
  content: 'block+',
  defining: true,

  parseHTML() {
    return [
      { tag: 'div[data-details-content]' },
      { tag: 'div.markon-details-content' },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(
        {
          'data-details-content': '',
          class:
            'markon-details-content pt-2 pl-4 border-l-2 border-primary/40 mt-1 space-y-2',
        },
        HTMLAttributes
      ),
      0,
    ];
  },
});

export const Details = Node.create({
  name: 'details',
  group: 'block',
  content: 'detailsSummary detailsContent',
  defining: true,
  isolating: true,
  allowGapCursor: false,

  addAttributes() {
    return {
      open: {
        default: true,
        renderHTML: (attributes) => {
          if (attributes.open) {
            return { open: '' };
          }
          return {};
        },
        parseHTML: (element) => element.hasAttribute('open'),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'details' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'details',
      mergeAttributes(
        {
          class:
            'markon-details rounded-xl border border-default p-3 my-2 bg-subtle/20 group open:bg-subtle/30 transition-all',
        },
        HTMLAttributes
      ),
      0,
    ];
  },

  addCommands() {
    return {
      insertDetails:
        () =>
        ({ chain }) => {
          return chain()
            .insertContent({
              type: this.name,
              attrs: { open: true },
              content: [
                {
                  type: 'detailsSummary',
                  content: [{ type: 'text', text: 'Toggle title' }],
                },
                {
                  type: 'detailsContent',
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        {
                          type: 'text',
                          text: 'Enter collapsible content here...',
                        },
                      ],
                    },
                  ],
                },
              ],
            })
            .run();
        },
    };
  },
});
