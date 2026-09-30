import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import {
  autoUpdate,
  computePosition,
  flip,
  shift,
  offset,
} from '@floating-ui/dom';
import { openMarkonModal } from './dialog';

export function createBubbleMenuExtension() {
  let menuEl: HTMLElement | null = null;
  let cleanupAutoUpdate: (() => void) | null = null;

  return Extension.create({
    name: 'markonBubbleMenu',

    addProseMirrorPlugins() {
      const editor = this.editor;

      return [
        new Plugin({
          key: new PluginKey('markonBubbleMenuPlugin'),
          view: () => {
            return {
              update: (view) => {
                const { state } = view;
                const { empty } = state.selection;

                if (empty || !editor.isEditable) {
                  if (cleanupAutoUpdate) {
                    cleanupAutoUpdate();
                    cleanupAutoUpdate = null;
                  }
                  if (menuEl) menuEl.style.display = 'none';
                  return;
                }

                if (!menuEl) {
                  menuEl = document.createElement('div');
                  menuEl.className =
                    'markon-bubble-menu fixed z-50 flex items-center gap-1 p-1 rounded-lg border border-default bg-surface shadow-md select-none';
                  menuEl.innerHTML = `
                    <button type="button" class="btn btn-ghost btn-sm btn-icon h-7 w-7 text-xs" data-bubble-cmd="bold" title="Bold"><strong>B</strong></button>
                    <button type="button" class="btn btn-ghost btn-sm btn-icon h-7 w-7 text-xs" data-bubble-cmd="italic" title="Italic"><em>I</em></button>
                    <button type="button" class="btn btn-ghost btn-sm btn-icon h-7 w-7 text-xs" data-bubble-cmd="underline" title="Underline"><span class="underline">U</span></button>
                    <button type="button" class="btn btn-ghost btn-sm btn-icon h-7 w-7 text-xs" data-bubble-cmd="strike" title="Strikethrough"><span class="line-through">S</span></button>
                    <button type="button" class="btn btn-ghost btn-sm btn-icon h-7 w-7 text-xs" data-bubble-cmd="highlight" title="Highlight"><span class="px-1 rounded text-xs leading-none font-bold bg-warning/20 text-warning">H</span></button>
                    <button type="button" class="btn btn-ghost btn-sm btn-icon h-7 w-7 text-xs" data-bubble-cmd="code" title="Code">&lt;/&gt;</button>
                    <button type="button" class="btn btn-ghost btn-sm btn-icon h-7 w-7 text-xs" data-bubble-cmd="link" title="Link">
                      <svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                      </svg>
                    </button>
                  `;

                  menuEl.addEventListener('mousedown', (e) => {
                    const btn = (
                      e.target as HTMLElement
                    ).closest<HTMLButtonElement>('[data-bubble-cmd]');
                    if (!btn) return;
                    e.preventDefault();
                    e.stopPropagation();

                    const cmd = btn.getAttribute('data-bubble-cmd');
                    if (cmd === 'bold')
                      editor.chain().focus().toggleBold().run();
                    else if (cmd === 'italic')
                      editor.chain().focus().toggleItalic().run();
                    else if (cmd === 'underline')
                      editor.chain().focus().toggleUnderline().run();
                    else if (cmd === 'strike')
                      editor.chain().focus().toggleStrike().run();
                    else if (cmd === 'highlight')
                      editor.chain().focus().toggleHighlight().run();
                    else if (cmd === 'code')
                      editor.chain().focus().toggleCode().run();
                    else if (cmd === 'link') {
                      const selFrom = editor.state.selection.from;
                      const selTo = editor.state.selection.to;
                      const prevUrl = editor.getAttributes('link').href || '';
                      openMarkonModal({
                        title: prevUrl ? 'Edit Link' : 'Insert Link',
                        label: 'Link URL',
                        initialValue: prevUrl,
                        placeholder: 'https://...',
                        confirmText: 'Save Link',
                        onConfirm: (url) => {
                          const chain = editor.chain().focus();
                          if (selFrom !== undefined && selTo !== undefined) {
                            chain.setTextSelection({
                              from: selFrom,
                              to: selTo,
                            });
                          }
                          if (url && url.trim())
                            chain.setLink({ href: url.trim() }).run();
                          else chain.unsetLink().run();
                        },
                        onCancel: () => {
                          if (selFrom !== undefined && selTo !== undefined) {
                            editor
                              .chain()
                              .focus()
                              .setTextSelection({ from: selFrom, to: selTo })
                              .run();
                          } else {
                            editor.commands.focus();
                          }
                        },
                      });
                    }
                  });

                  document.body.appendChild(menuEl);
                }

                // Update active states
                const updateActive = (cmd: string, active: boolean) => {
                  const b = menuEl?.querySelector(`[data-bubble-cmd="${cmd}"]`);
                  if (b) {
                    if (active) b.classList.add('btn-active');
                    else b.classList.remove('btn-active');
                  }
                };

                updateActive('bold', editor.isActive('bold'));
                updateActive('italic', editor.isActive('italic'));
                updateActive('underline', editor.isActive('underline'));
                updateActive('strike', editor.isActive('strike'));
                updateActive('highlight', editor.isActive('highlight'));
                updateActive('code', editor.isActive('code'));
                updateActive('link', editor.isActive('link'));

                menuEl.style.display = 'flex';

                const updatePosition = () => {
                  if (!menuEl || menuEl.style.display === 'none') return;
                  const curState = view.state;
                  const curSel = curState.selection;
                  if (curSel.empty) return;

                  const startCoords = view.coordsAtPos(curSel.from);
                  const endCoords = view.coordsAtPos(curSel.to);
                  const top = Math.min(startCoords.top, endCoords.top);
                  const bottom = Math.max(startCoords.bottom, endCoords.bottom);
                  const left = Math.min(startCoords.left, endCoords.left);
                  const right = Math.max(startCoords.right, endCoords.right);

                  const virtualRef = {
                    getBoundingClientRect: () =>
                      new DOMRect(
                        left,
                        top,
                        Math.max(right - left, 1),
                        Math.max(bottom - top, 1)
                      ),
                  };

                  computePosition(virtualRef, menuEl, {
                    placement: 'top',
                    middleware: [offset(8), flip(), shift({ padding: 8 })],
                  }).then(({ x, y }) => {
                    if (menuEl) {
                      menuEl.style.left = `${x}px`;
                      menuEl.style.top = `${y}px`;
                    }
                  });
                };

                if (!cleanupAutoUpdate) {
                  cleanupAutoUpdate = autoUpdate(
                    view.dom,
                    menuEl,
                    updatePosition
                  );
                }
                updatePosition();
              },
              destroy: () => {
                if (cleanupAutoUpdate) {
                  cleanupAutoUpdate();
                  cleanupAutoUpdate = null;
                }
                if (menuEl) {
                  menuEl.remove();
                  menuEl = null;
                }
              },
            };
          },
        }),
      ];
    },
  });
}
