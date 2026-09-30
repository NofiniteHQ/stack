/**
 * @nofinite/markon - File Attachment Extension
 * Framework-agnostic TipTap extension for file attachments with metadata,
 * download link, and visual file card.
 * 100% styled with @nofinite/nuicss design tokens.
 */

import { mergeAttributes, Node } from '@tiptap/core';

export function formatFileSize(bytes: number, decimals = 1): string {
  if (!+bytes) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    fileAttachment: {
      insertFileAttachment: (options: {
        src: string;
        name: string;
        size?: string;
        type?: string;
      }) => ReturnType;
    };
  }
}

export const FileAttachment = Node.create({
  name: 'fileAttachment',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: {
        default: '',
      },
      name: {
        default: 'Attachment',
      },
      size: {
        default: '',
      },
      type: {
        default: 'file',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-file-attachment]',
        getAttrs: (element) => {
          if (typeof element === 'string') return {};
          return {
            src: element.getAttribute('data-src') || '',
            name: element.getAttribute('data-name') || 'Attachment',
            size: element.getAttribute('data-size') || '',
            type: element.getAttribute('data-type') || 'file',
          };
        },
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const { src, name, size } = node.attrs;

    return [
      'div',
      mergeAttributes(
        {
          'data-file-attachment': '',
          'data-src': src,
          'data-name': name,
          'data-size': size,
          class:
            'markon-file-attachment flex items-center justify-between p-3 my-2 rounded-xl border border-default bg-subtle/60 hover:bg-subtle transition-colors select-none',
        },
        HTMLAttributes
      ),
      [
        'div',
        { class: 'flex items-center gap-3 overflow-hidden' },
        [
          'span',
          {
            class:
              'p-2 rounded-lg bg-surface border border-default text-primary shrink-0 flex items-center justify-center',
          },
          '📎',
        ],
        [
          'div',
          { class: 'flex flex-col min-w-0' },
          [
            'span',
            { class: 'text-xs font-semibold text-default truncate' },
            name,
          ],
          ['span', { class: 'text-[11px] text-muted' }, size || 'Attachment'],
        ],
      ],
      [
        'a',
        {
          href: src,
          download: name,
          target: '_blank',
          rel: 'noopener noreferrer',
          class:
            'btn btn-ghost btn-sm text-xs text-primary shrink-0 hover:underline',
        },
        'Download',
      ],
    ];
  },

  addCommands() {
    return {
      insertFileAttachment:
        (options) =>
        ({ chain }) => {
          return chain()
            .insertContent({
              type: this.name,
              attrs: options,
            })
            .run();
        },
    };
  },

  addNodeView() {
    return ({ node, getPos, editor }) => {
      const container = document.createElement('div');
      container.className =
        'markon-file-attachment group/file relative flex items-center justify-between p-3 my-2 rounded-xl border border-default bg-subtle/60 hover:bg-subtle transition-colors select-none';
      container.setAttribute('data-file-attachment', '');
      container.setAttribute('data-src', node.attrs.src);
      container.setAttribute('data-name', node.attrs.name);
      container.setAttribute('data-size', node.attrs.size);

      // Left info
      const left = document.createElement('div');
      left.className = 'flex items-center gap-3 overflow-hidden min-w-0';

      const iconBox = document.createElement('div');
      iconBox.className =
        'w-8 h-8 rounded-lg bg-surface border border-default text-primary flex items-center justify-center shrink-0';
      iconBox.innerHTML = `
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      `;
      left.appendChild(iconBox);

      const textCol = document.createElement('div');
      textCol.className = 'flex flex-col min-w-0';

      const nameEl = document.createElement('span');
      nameEl.className = 'text-xs font-semibold text-default truncate';
      nameEl.textContent = node.attrs.name || 'Attachment';
      textCol.appendChild(nameEl);

      const sizeEl = document.createElement('span');
      sizeEl.className = 'text-[11px] text-muted';
      sizeEl.textContent = node.attrs.size || 'Attachment';
      textCol.appendChild(sizeEl);

      left.appendChild(textCol);
      container.appendChild(left);

      // Right actions
      const right = document.createElement('div');
      right.className = 'flex items-center gap-2 shrink-0';

      const downloadLink = document.createElement('a');
      downloadLink.href = node.attrs.src;
      downloadLink.download = node.attrs.name;
      downloadLink.target = '_blank';
      downloadLink.rel = 'noopener noreferrer';
      downloadLink.className =
        'btn btn-ghost btn-sm text-xs text-primary font-medium hover:underline flex items-center gap-1';
      downloadLink.innerHTML = `
        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
        <span>Download</span>
      `;
      right.appendChild(downloadLink);

      if (editor.isEditable) {
        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.className =
          'btn btn-ghost btn-xs btn-icon text-muted hover:text-danger opacity-0 group-hover/file:opacity-100 transition-opacity';
        deleteBtn.title = 'Remove attachment';
        deleteBtn.innerHTML = `
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        `;
        deleteBtn.addEventListener('mousedown', (e) => e.preventDefault());
        deleteBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (typeof getPos === 'function') {
            const pos = getPos();
            if (typeof pos === 'number') {
              editor.view.dispatch(editor.view.state.tr.delete(pos, pos + 1));
            }
          }
        });
        right.appendChild(deleteBtn);
      }

      container.appendChild(right);

      return {
        dom: container,
        update: (updatedNode) => {
          if (updatedNode.type.name !== 'fileAttachment') return false;
          nameEl.textContent = updatedNode.attrs.name || 'Attachment';
          sizeEl.textContent = updatedNode.attrs.size || 'Attachment';
          downloadLink.href = updatedNode.attrs.src;
          downloadLink.download = updatedNode.attrs.name;
          return true;
        },
      };
    };
  },
});
