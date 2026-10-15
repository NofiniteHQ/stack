/**
 * @nofinite/markon - Optimistic Upload Placeholder Extension
 * Framework-agnostic TipTap extension that displays an animated progress card
 * during asynchronous file or image uploads.
 * 100% styled with @nofinite/nuicss tokens and superclasses.
 */

import { mergeAttributes, Node } from '@tiptap/core';

export interface UploadPlaceholderAttrs {
  uploadId: string;
  name: string;
  size?: string;
  type?: string;
  previewUrl?: string;
  status?: 'uploading' | 'error';
  errorMessage?: string;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    uploadPlaceholder: {
      insertUploadPlaceholder: (attrs: UploadPlaceholderAttrs) => ReturnType;
    };
  }
}

export const UploadPlaceholder = Node.create({
  name: 'uploadPlaceholder',
  group: 'block',
  atom: true,
  draggable: false,
  selectable: true,

  addAttributes() {
    return {
      uploadId: {
        default: '',
      },
      name: {
        default: 'Uploading file…',
      },
      size: {
        default: '',
      },
      type: {
        default: 'file',
      },
      previewUrl: {
        default: '',
      },
      status: {
        default: 'uploading',
      },
      errorMessage: {
        default: '',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-upload-placeholder]',
        getAttrs: (element) => {
          if (typeof element === 'string') return {};
          return {
            uploadId: element.getAttribute('data-upload-id') || '',
            name: element.getAttribute('data-name') || 'Uploading file…',
            size: element.getAttribute('data-size') || '',
            type: element.getAttribute('data-type') || 'file',
            previewUrl: element.getAttribute('data-preview-url') || '',
            status: element.getAttribute('data-status') || 'uploading',
            errorMessage: element.getAttribute('data-error-message') || '',
          };
        },
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const { uploadId, name, size, type, previewUrl, status, errorMessage } =
      node.attrs;

    return [
      'div',
      mergeAttributes(
        {
          'data-upload-placeholder': '',
          'data-upload-id': uploadId,
          'data-name': name,
          'data-size': size,
          'data-type': type,
          'data-preview-url': previewUrl,
          'data-status': status,
          'data-error-message': errorMessage,
          class: `markon-uploading-card card p-3 my-2 rounded-xl border border-default bg-surface select-none shadow-sm ${
            status === 'error' ? 'is-error' : 'is-uploading'
          }`,
        },
        HTMLAttributes
      ),
    ];
  },

  addCommands() {
    return {
      insertUploadPlaceholder:
        (attrs) =>
        ({ chain }) => {
          return chain().insertContent({ type: this.name, attrs }).run();
        },
    };
  },

  addNodeView() {
    return ({ node, getPos, editor }) => {
      let currentNode = node;

      const dom = document.createElement('div');
      dom.className =
        'markon-uploading-card card p-3 my-2 rounded-xl border border-default bg-surface select-none shadow-sm flex items-center justify-between gap-3 transition-all';
      dom.setAttribute('data-upload-placeholder', '');
      dom.setAttribute('data-upload-id', node.attrs.uploadId || '');

      const render = () => {
        const { name, size, previewUrl, status, errorMessage } =
          currentNode.attrs;
        const isError = status === 'error';

        dom.className = `markon-uploading-card card p-3 my-2 rounded-xl border border-default bg-surface select-none shadow-sm flex items-center justify-between gap-3 transition-all ${
          isError ? 'is-error' : 'is-uploading'
        }`;
        dom.style.cssText =
          'display: flex !important; flex-direction: row !important; align-items: center !important; justify-content: space-between !important; gap: 12px; width: 100%; box-sizing: border-box;';

        const spinnerSvg = `
          <svg class="animate-spin text-primary" style="width: 20px; height: 20px;" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
        `;

        const errorSvg = `
          <svg class="text-danger" style="width: 20px; height: 20px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        `;

        const fileIconSvg = `
          <svg class="text-muted" style="width: 20px; height: 20px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
        `;

        let visualThumbnail = '';
        if (previewUrl && !isError) {
          visualThumbnail = `
            <div class="relative w-12 h-12 rounded-lg overflow-hidden border border-default flex-shrink-0 bg-subtle" style="width: 48px; height: 48px;">
              <img src="${previewUrl}" class="w-full h-full object-cover opacity-60" alt="" style="width: 100%; height: 100%; object-fit: cover;" />
              <div class="absolute inset-0 flex items-center justify-center bg-black/25" style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background-color: rgba(0,0,0,0.25);">
                ${spinnerSvg}
              </div>
            </div>
          `;
        } else if (isError) {
          visualThumbnail = `
            <div class="w-10 h-10 rounded-lg flex items-center justify-center bg-danger/10 border border-danger/30 text-danger flex-shrink-0" style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
              ${errorSvg}
            </div>
          `;
        } else if (
          currentNode.attrs.type &&
          !currentNode.attrs.type.startsWith('image/')
        ) {
          visualThumbnail = `
            <div class="relative w-10 h-10 rounded-lg flex items-center justify-center bg-subtle border border-default flex-shrink-0" style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
              ${fileIconSvg}
              <div class="absolute inset-0 flex items-center justify-center bg-black/10 rounded-lg">
                ${spinnerSvg}
              </div>
            </div>
          `;
        } else {
          visualThumbnail = `
            <div class="w-10 h-10 rounded-lg flex items-center justify-center bg-subtle border border-default text-primary flex-shrink-0" style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
              ${spinnerSvg}
            </div>
          `;
        }

        const subtitleHtml = isError
          ? `<span class="text-xs text-danger font-medium flex items-center gap-1">${
              errorMessage || 'Upload failed'
            }</span>`
          : `<span class="text-xs text-muted flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" style="width: 6px; height: 6px; border-radius: 9999px; background-color: var(--color-primary); display: inline-block;"></span>Uploading ${
              size ? `(${size})` : ''
            }…</span>`;

        const actionHtml = isError
          ? `<button type="button" class="markon-upload-dismiss-btn btn btn-ghost btn-xs text-danger hover:bg-danger/10 px-2 py-1 rounded" style="cursor: pointer; font-size: 0.75rem;">✕ Dismiss</button>`
          : `<span class="badge badge-subtle text-xs text-primary font-mono px-2 py-0.5 rounded" style="font-size: 0.75rem;">In progress</span>`;

        dom.innerHTML = `
          <div class="flex items-center gap-3 overflow-hidden min-w-0 flex-1" style="display: flex; align-items: center; gap: 0.75rem; min-width: 0; flex: 1;">
            ${visualThumbnail}
            <div class="flex flex-col min-w-0 flex-1" style="display: flex; flex-direction: column; min-width: 0; flex: 1;">
              <span class="text-sm font-medium text-default truncate" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 0.875rem;" title="${name}">${name}</span>
              <div class="mt-0.5" style="margin-top: 2px;">${subtitleHtml}</div>
            </div>
          </div>
          <div class="flex items-center gap-2 flex-shrink-0" style="display: flex; align-items: center; flex-shrink: 0;">
            ${actionHtml}
          </div>
        `;

        if (isError) {
          const dismissBtn = dom.querySelector<HTMLButtonElement>(
            '.markon-upload-dismiss-btn'
          );
          if (dismissBtn) {
            dismissBtn.addEventListener('click', (e) => {
              e.preventDefault();
              e.stopPropagation();
              if (typeof getPos === 'function') {
                const pos = getPos();
                if (typeof pos === 'number') {
                  const tr = editor.view.state.tr.delete(
                    pos,
                    pos + currentNode.nodeSize
                  );
                  editor.view.dispatch(tr);
                }
              }
            });
          }
        }
      };

      render();

      return {
        dom,
        update: (updatedNode) => {
          if (updatedNode.type.name !== 'uploadPlaceholder') {
            return false;
          }
          currentNode = updatedNode;
          render();
          return true;
        },
        destroy: () => {
          if (
            currentNode.attrs.previewUrl &&
            typeof URL !== 'undefined' &&
            URL.revokeObjectURL
          ) {
            try {
              URL.revokeObjectURL(currentNode.attrs.previewUrl);
            } catch {
              // ignore
            }
          }
        },
      };
    };
  },
});
