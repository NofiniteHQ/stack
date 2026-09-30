/**
 * @nofinite/markon - Resizable & Alignable Image Extension
 * Framework-agnostic TipTap Image extension with interactive corner drag handles,
 * width presets (25%, 50%, 75%, 100%), and alignment controls.
 * 100% styled with @nofinite/nuicss tokens.
 */

import Image, { type ImageOptions } from '@tiptap/extension-image';
import { mergeAttributes } from '@tiptap/core';

export interface MarkonImageOptions extends ImageOptions {
  resizable?: boolean;
}

export const MarkonImage = Image.extend<MarkonImageOptions>({
  name: 'image',

  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: '100%',
        renderHTML: (attributes) => ({
          style: `width: ${attributes.width}; max-width: 100%;`,
        }),
      },
      alignment: {
        default: 'center',
        renderHTML: (attributes) => ({
          'data-alignment': attributes.alignment,
        }),
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    const alignment = HTMLAttributes['data-alignment'] || 'center';
    const alignClass =
      alignment === 'left'
        ? 'mr-auto block'
        : alignment === 'right'
        ? 'ml-auto block'
        : 'mx-auto block';

    return [
      'img',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        class: `markon-image rounded-xl border border-default shadow-sm ${alignClass}`,
      }),
    ];
  },

  addNodeView() {
    return ({ node, getPos, editor }) => {
      const container = document.createElement('div');
      container.className = 'markon-image-container my-3 select-none flex';

      const applyAlignment = (align: string) => {
        container.classList.remove(
          'justify-start',
          'justify-center',
          'justify-end'
        );
        if (align === 'left') container.classList.add('justify-start');
        else if (align === 'right') container.classList.add('justify-end');
        else container.classList.add('justify-center');
      };

      applyAlignment(node.attrs.alignment || 'center');

      // Image wrapper
      const wrapper = document.createElement('div');
      wrapper.className =
        'markon-image-wrapper relative group/img inline-block';
      wrapper.style.width = node.attrs.width || '100%';
      wrapper.style.maxWidth = '100%';

      const img = document.createElement('img');
      img.src = node.attrs.src;
      img.alt = node.attrs.alt || '';
      img.title = node.attrs.title || '';
      img.className =
        'w-full h-auto rounded-xl border border-default shadow-sm block transition-all';
      wrapper.appendChild(img);

      if (editor.isEditable) {
        // Floating action toolbar
        const toolbar = document.createElement('div');
        toolbar.className =
          'markon-image-toolbar absolute top-2 right-2 flex items-center gap-1 p-1 rounded-lg bg-surface/90 border border-default shadow-md opacity-0 group-hover/img:opacity-100 focus-within:opacity-100 transition-opacity z-10';

        const createBtn = (
          content: string,
          title: string,
          onClick: () => void,
          isActive = false
        ) => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = `btn btn-ghost btn-xs text-xs px-1.5 py-0.5 ${
            isActive
              ? 'btn-active text-primary font-bold'
              : 'text-muted hover:text-default'
          }`;
          btn.title = title;
          btn.innerHTML = content;
          btn.addEventListener('mousedown', (e) => e.preventDefault());
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            onClick();
          });
          return btn;
        };

        const updateAttributes = (newAttrs: Record<string, any>) => {
          if (typeof getPos === 'function') {
            const pos = getPos();
            if (typeof pos === 'number') {
              editor.view.dispatch(
                editor.view.state.tr.setNodeMarkup(pos, undefined, {
                  ...node.attrs,
                  ...newAttrs,
                })
              );
            }
          }
        };

        // Align Left
        toolbar.appendChild(
          createBtn(
            '<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="21" y1="6" x2="3" y2="6"/><line x1="15" y1="12" x2="3" y2="12"/><line x1="17" y1="18" x2="3" y2="18"/></svg>',
            'Align Left',
            () => updateAttributes({ alignment: 'left' }),
            node.attrs.alignment === 'left'
          )
        );

        // Align Center
        toolbar.appendChild(
          createBtn(
            '<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="6"/><line x1="21" y1="12" x2="3" y2="12"/><line x1="18" y1="18" x2="6" y2="18"/></svg>',
            'Align Center',
            () => updateAttributes({ alignment: 'center' }),
            node.attrs.alignment === 'center'
          )
        );

        // Align Right
        toolbar.appendChild(
          createBtn(
            '<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="12" x2="9" y2="12"/><line x1="21" y1="18" x2="7" y2="18"/></svg>',
            'Align Right',
            () => updateAttributes({ alignment: 'right' }),
            node.attrs.alignment === 'right'
          )
        );

        // Divider
        const divider = document.createElement('span');
        divider.className = 'w-px h-3.5 bg-border mx-0.5 self-center';
        toolbar.appendChild(divider);

        // Width Presets: 25%, 50%, 75%, 100%
        ['25%', '50%', '75%', '100%'].forEach((w) => {
          toolbar.appendChild(
            createBtn(
              w,
              `Set width to ${w}`,
              () => updateAttributes({ width: w }),
              node.attrs.width === w
            )
          );
        });

        // Delete button
        toolbar.appendChild(
          createBtn(
            '<svg class="w-3.5 h-3.5 text-danger" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
            'Remove Image',
            () => {
              if (typeof getPos === 'function') {
                const pos = getPos();
                if (typeof pos === 'number') {
                  editor.view.dispatch(
                    editor.view.state.tr.delete(pos, pos + 1)
                  );
                }
              }
            }
          )
        );

        wrapper.appendChild(toolbar);

        // Drag resize handle at bottom-right corner
        const resizeHandle = document.createElement('div');
        resizeHandle.className =
          'markon-image-resize-handle absolute bottom-1 right-1 w-3.5 h-3.5 rounded-sm bg-primary border border-surface shadow cursor-se-resize opacity-0 group-hover/img:opacity-100 transition-opacity z-10';
        resizeHandle.title = 'Drag to resize image';

        let startX = 0;
        let startWidth = 0;
        let containerWidth = 1;

        const onPointerMove = (e: PointerEvent) => {
          const dx = e.clientX - startX;
          const newWidthPx = Math.max(80, startWidth + dx);
          const percent = Math.min(
            100,
            Math.max(15, Math.round((newWidthPx / containerWidth) * 100))
          );
          wrapper.style.width = `${percent}%`;
        };

        const onPointerUp = () => {
          document.removeEventListener('pointermove', onPointerMove);
          document.removeEventListener('pointerup', onPointerUp);
          const finalPercent = wrapper.style.width;
          if (finalPercent) {
            updateAttributes({ width: finalPercent });
          }
        };

        resizeHandle.addEventListener('pointerdown', (e: PointerEvent) => {
          e.preventDefault();
          e.stopPropagation();
          startX = e.clientX;
          startWidth = wrapper.getBoundingClientRect().width;
          const parentRect = container.parentElement?.getBoundingClientRect();
          containerWidth = parentRect?.width || startWidth || 1;

          document.addEventListener('pointermove', onPointerMove);
          document.addEventListener('pointerup', onPointerUp);
        });

        wrapper.appendChild(resizeHandle);
      }

      container.appendChild(wrapper);

      return {
        dom: container,
        update: (updatedNode) => {
          if (updatedNode.type.name !== 'image') return false;
          applyAlignment(updatedNode.attrs.alignment || 'center');
          wrapper.style.width = updatedNode.attrs.width || '100%';
          if (updatedNode.attrs.src !== img.src) {
            img.src = updatedNode.attrs.src;
          }
          if (updatedNode.attrs.alt !== img.alt) {
            img.alt = updatedNode.attrs.alt || '';
          }
          return true;
        },
      };
    };
  },
});
