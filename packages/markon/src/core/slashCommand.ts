import { Extension } from '@tiptap/core';
import Suggestion, { type SuggestionOptions } from '@tiptap/suggestion';
import { computePosition, flip, shift, offset } from '@floating-ui/dom';

export interface SlashCommandItem {
  title: string;
  description: string;
  command: (editor: any, range: any) => void;
}

export const defaultSlashCommands: SlashCommandItem[] = [
  {
    title: 'Heading 1',
    description: 'Large section heading',
    command: (editor, range) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode('heading', { level: 1 })
        .run();
    },
  },
  {
    title: 'Heading 2',
    description: 'Medium section heading',
    command: (editor, range) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode('heading', { level: 2 })
        .run();
    },
  },
  {
    title: 'Heading 3',
    description: 'Small section heading',
    command: (editor, range) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode('heading', { level: 3 })
        .run();
    },
  },
  {
    title: 'Bullet List',
    description: 'Create an unnumbered list',
    command: (editor, range) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run();
    },
  },
  {
    title: 'Numbered List',
    description: 'Create a numbered list',
    command: (editor, range) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run();
    },
  },
  {
    title: 'Task List',
    description: 'Track items with checkboxes',
    command: (editor, range) => {
      editor.chain().focus().deleteRange(range).toggleTaskList().run();
    },
  },
  {
    title: 'Blockquote',
    description: 'Highlight a quotation or note',
    command: (editor, range) => {
      editor.chain().focus().deleteRange(range).toggleBlockquote().run();
    },
  },
  {
    title: 'Code Block',
    description: 'Insert syntax-highlighted code',
    command: (editor, range) => {
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
    },
  },
  {
    title: 'Table (3x3)',
    description: 'Insert a 3x3 table with headers',
    command: (editor, range) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
        .run();
    },
  },
  {
    title: 'Math Formula',
    description: 'Insert a LaTeX KaTeX formula',
    command: (editor, range) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertContent({ type: 'mathBlock' })
        .run();
    },
  },
  {
    title: 'Horizontal Rule',
    description: 'Visually separate content',
    command: (editor, range) => {
      editor.chain().focus().deleteRange(range).setHorizontalRule().run();
    },
  },
];

export function createSlashCommandExtension(customItems?: SlashCommandItem[]) {
  const items = customItems || defaultSlashCommands;

  let popupEl: HTMLElement | null = null;
  let selectedIndex = 0;
  let currentItems: SlashCommandItem[] = [];

  const updatePopup = (
    itemsList: SlashCommandItem[],
    clientRect: () => DOMRect | null
  ) => {
    if (!popupEl) return;
    currentItems = itemsList;
    if (itemsList.length === 0) {
      popupEl.style.display = 'none';
      return;
    }

    popupEl.style.display = 'block';
    popupEl.innerHTML = '';
    itemsList.forEach((item, index) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `w-full text-left px-3 py-2 rounded-lg text-xs flex flex-col gap-0.5 transition-colors cursor-pointer border-none bg-transparent ${
        index === selectedIndex
          ? 'bg-primary/10 text-primary font-medium'
          : 'text-default hover:bg-subtle'
      }`;
      btn.innerHTML = `<span class="font-semibold">${item.title}</span><span class="text-[11px] text-muted">${item.description}</span>`;
      btn.addEventListener('mousedown', (e) => {
        e.preventDefault();
      });
      popupEl?.appendChild(btn);
    });

    const rect = clientRect();
    if (!rect) return;

    const virtualRef = {
      getBoundingClientRect: () => rect,
    };

    computePosition(virtualRef, popupEl, {
      placement: 'bottom-start',
      middleware: [offset(6), flip(), shift({ padding: 8 })],
    }).then(({ x, y }) => {
      if (popupEl) {
        popupEl.style.left = `${x}px`;
        popupEl.style.top = `${y}px`;
      }
    });
  };

  return Extension.create({
    name: 'markonSlashCommand',

    addOptions() {
      return {
        suggestion: {
          char: '/',
          items: ({ query }: { query: string }) => {
            if (!query) return items;
            const q = query.toLowerCase();
            return items.filter(
              (i) =>
                i.title.toLowerCase().includes(q) ||
                i.description.toLowerCase().includes(q)
            );
          },
          render: () => {
            return {
              onStart: (props: any) => {
                if (!popupEl) {
                  popupEl = document.createElement('div');
                  popupEl.className =
                    'markon-slash-menu fixed z-50 p-1 w-64 max-h-72 overflow-y-auto rounded-xl border border-default bg-surface shadow-lg text-default font-sans';
                  document.body.appendChild(popupEl);
                }
                selectedIndex = 0;
                updatePopup(props.items, props.clientRect);
              },
              onUpdate: (props: any) => {
                if (selectedIndex >= props.items.length) {
                  selectedIndex = 0;
                }
                updatePopup(props.items, props.clientRect);
              },
              onKeyDown: ({ event, props }: any) => {
                if (event.key === 'ArrowUp') {
                  selectedIndex =
                    (selectedIndex - 1 + currentItems.length) %
                    currentItems.length;
                  updatePopup(currentItems, props.clientRect);
                  return true;
                }
                if (event.key === 'ArrowDown') {
                  selectedIndex = (selectedIndex + 1) % currentItems.length;
                  updatePopup(currentItems, props.clientRect);
                  return true;
                }
                if (event.key === 'Enter') {
                  const selected = currentItems[selectedIndex];
                  if (selected) {
                    selected.command(props.editor, props.range);
                    return true;
                  }
                }
                if (event.key === 'Escape') {
                  if (popupEl) popupEl.style.display = 'none';
                  return true;
                }
                return false;
              },
              onExit: () => {
                if (popupEl) {
                  popupEl.remove();
                  popupEl = null;
                }
              },
            };
          },
        } as Omit<SuggestionOptions, 'editor'>,
      };
    },

    addProseMirrorPlugins() {
      return [
        Suggestion({
          editor: this.editor,
          ...this.options.suggestion,
        }),
      ];
    },
  });
}
