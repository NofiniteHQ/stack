import { Extension } from '@tiptap/core';
import Suggestion, { type SuggestionOptions } from '@tiptap/suggestion';
import {
  autoUpdate,
  computePosition,
  flip,
  shift,
  offset,
} from '@floating-ui/dom';

import { openMarkonModal } from './dialog';

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
    title: 'Video Embed',
    description: 'Embed YouTube, Vimeo, or MP4 video',
    command: (editor, range) => {
      editor.chain().focus().deleteRange(range).run();
      openMarkonModal({
        title: 'Insert Video Embed',
        label: 'Video URL (YouTube, Vimeo, or direct link)',
        initialValue: 'https://',
        placeholder: 'https://www.youtube.com/watch?v=...',
        confirmText: 'Embed Video',
        onConfirm: (url) => {
          if (url && url.trim() && url !== 'https://') {
            editor.commands.setVideo({ src: url.trim() });
          }
        },
        onCancel: () => {
          editor.commands.focus();
        },
      });
    },
  },
  {
    title: 'Collapsible Section',
    description: 'Notion-style accordion toggle block',
    command: (editor, range) => {
      editor.chain().focus().deleteRange(range).insertDetails().run();
    },
  },
  {
    title: 'Image',
    description: 'Insert an image from URL or upload',
    command: (editor, range) => {
      editor.chain().focus().deleteRange(range).run();
      const markon = (editor as any).__markon;
      if (markon) {
        markon.execCommand('insertImage');
      }
    },
  },
  {
    title: 'File Attachment',
    description: 'Attach a downloadable document or file',
    command: (editor, range) => {
      editor.chain().focus().deleteRange(range).run();
      const markon = (editor as any).__markon;
      if (markon) {
        markon.promptFileUpload();
      }
    },
  },
  {
    title: 'Horizontal Rule',
    description: 'Visually separate content',
    command: (editor, range) => {
      editor.chain().focus().deleteRange(range).setHorizontalRule().run();
    },
  },
  {
    title: 'Highlight',
    description: 'Highlight text with pastel color',
    command: (editor, range) => {
      editor.chain().focus().deleteRange(range).toggleHighlight().run();
    },
  },
  {
    title: 'Info Callout',
    description: 'Insert an informational note box',
    command: (editor, range) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertCallout({ type: 'info' })
        .run();
    },
  },
  {
    title: 'Success Callout',
    description: 'Insert a success tip or completion box',
    command: (editor, range) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertCallout({ type: 'success' })
        .run();
    },
  },
  {
    title: 'Warning Callout',
    description: 'Insert a warning or caution advisory box',
    command: (editor, range) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertCallout({ type: 'warning' })
        .run();
    },
  },
  {
    title: 'Danger Callout',
    description: 'Insert an error or danger alert box',
    command: (editor, range) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertCallout({ type: 'danger' })
        .run();
    },
  },
];

export function createSlashCommandExtension(customItems?: SlashCommandItem[]) {
  const items = customItems || defaultSlashCommands;

  let popupEl: HTMLElement | null = null;
  let cleanupAutoUpdate: (() => void) | null = null;
  let selectedIndex = 0;
  let currentItems: SlashCommandItem[] = [];

  const updatePopup = (props: any) => {
    if (!popupEl) return;
    const itemsList: SlashCommandItem[] = props.items || [];
    currentItems = itemsList;
    if (itemsList.length === 0) {
      if (cleanupAutoUpdate) {
        cleanupAutoUpdate();
        cleanupAutoUpdate = null;
      }
      popupEl.style.display = 'none';
      return;
    }

    popupEl.style.display = 'block';
    popupEl.setAttribute('data-state', 'open');
    popupEl.innerHTML = '';
    itemsList.forEach((item, index) => {
      const isSelected = index === selectedIndex;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `dropdown-item flex flex-col items-start gap-0.5 cursor-pointer text-left ${
        isSelected ? 'btn-active' : ''
      }`;
      btn.style.alignItems = 'flex-start';
      btn.style.height = 'auto';
      btn.style.padding = '6px 10px';
      btn.style.borderRadius = 'var(--radius-lg, 0.5rem)';
      btn.style.border = 'none';
      btn.style.width = '100%';
      btn.style.backgroundColor = isSelected
        ? 'var(--bg-subtle)'
        : 'transparent';
      btn.innerHTML = `<span class="item-title font-semibold text-xs" style="color: var(--fg-default);">${item.title}</span><span class="item-desc text-xs" style="color: var(--fg-muted); font-size: 0.72rem; line-height: 1.3;">${item.description}</span>`;
      btn.addEventListener('mousedown', (e) => {
        e.preventDefault();
      });
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        item.command(props.editor, props.range);
        if (popupEl) popupEl.style.display = 'none';
      });
      popupEl?.appendChild(btn);
      if (isSelected) {
        btn.scrollIntoView({ block: 'nearest' });
      }
    });

    const updatePosition = () => {
      if (!popupEl || popupEl.style.display === 'none') return;
      let rect =
        typeof props.clientRect === 'function' ? props.clientRect() : null;

      if (!rect || (rect.left === 0 && rect.top === 0 && rect.bottom === 0)) {
        try {
          const { from } = props.editor.state.selection;
          const coords = props.editor.view.coordsAtPos(from);
          if (coords) {
            rect = new DOMRect(
              coords.left,
              coords.top,
              0,
              coords.bottom - coords.top || 18
            );
          }
        } catch {
          // fallback failed
        }
      }
      if (!rect) return;

      const virtualRef = {
        getBoundingClientRect: () => rect,
      };

      computePosition(virtualRef, popupEl, {
        strategy: 'fixed',
        placement: 'bottom-start',
        middleware: [
          offset(6),
          flip({ fallbackPlacements: ['top-start', 'bottom-end'] }),
          shift({ padding: 12 }),
        ],
      }).then(({ x, y }) => {
        if (popupEl) {
          popupEl.style.left = `${Math.max(12, x)}px`;
          popupEl.style.top = `${y}px`;
        }
      });
    };

    if (!cleanupAutoUpdate && props.editor?.view?.dom) {
      cleanupAutoUpdate = autoUpdate(
        props.editor.view.dom,
        popupEl,
        updatePosition
      );
    }
    updatePosition();
  };

  return Extension.create({
    name: 'markonSlashCommand',

    onDestroy() {
      if (cleanupAutoUpdate) {
        cleanupAutoUpdate();
        cleanupAutoUpdate = null;
      }
      if (popupEl) {
        popupEl.remove();
        popupEl = null;
      }
    },

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
                  popupEl.className = 'markon-slash-menu font-sans';
                  popupEl.setAttribute('data-state', 'open');
                  popupEl.style.position = 'fixed';
                  popupEl.style.zIndex = '9999';
                  popupEl.style.maxHeight = '280px';
                  popupEl.style.overflowY = 'auto';
                  popupEl.style.overflowX = 'hidden';
                  popupEl.style.width = '260px';
                  popupEl.style.backgroundColor = 'var(--bg-surface)';
                  popupEl.style.border = '1px solid var(--border-default)';
                  popupEl.style.borderRadius = 'var(--radius-xl, 0.75rem)';
                  popupEl.style.boxShadow =
                    'var(--shadow-xl, 0 20px 25px -5px rgba(0, 0, 0, 0.18))';
                  popupEl.style.backdropFilter = 'blur(12px)';
                  (popupEl.style as any).webkitBackdropFilter = 'blur(12px)';
                  popupEl.style.padding = '4px';
                  popupEl.style.scrollbarWidth = 'thin';
                  popupEl.style.display = 'none';
                  document.body.appendChild(popupEl);
                }
                selectedIndex = 0;
                updatePopup(props);
              },
              onUpdate: (props: any) => {
                if (selectedIndex >= props.items.length) {
                  selectedIndex = 0;
                }
                updatePopup(props);
              },
              onKeyDown: ({ event, props }: any) => {
                if (!currentItems || currentItems.length === 0) return false;
                if (event.key === 'ArrowUp') {
                  selectedIndex =
                    (selectedIndex - 1 + currentItems.length) %
                    currentItems.length;
                  updatePopup(props);
                  return true;
                }
                if (event.key === 'ArrowDown') {
                  selectedIndex = (selectedIndex + 1) % currentItems.length;
                  updatePopup(props);
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
                if (cleanupAutoUpdate) {
                  cleanupAutoUpdate();
                  cleanupAutoUpdate = null;
                }
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
