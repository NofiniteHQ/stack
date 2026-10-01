import { Extension } from '@tiptap/core';
import { Plugin, PluginKey, NodeSelection } from '@tiptap/pm/state';
import {
  autoUpdate,
  computePosition,
  flip,
  shift,
  offset,
} from '@floating-ui/dom';
import { openMarkonModal } from './dialog';

type BubbleContext = 'none' | 'text' | 'image' | 'video';

function detectBubbleContext(editor: any): BubbleContext {
  if (!editor.isEditable) return 'none';
  if (editor.isActive('image')) return 'image';
  if (editor.isActive('videoBlock')) return 'video';
  if (editor.isActive('codeBlock')) return 'none';
  if (!editor.state.selection.empty) return 'text';
  return 'none';
}

export function createBubbleMenuExtension() {
  let menuEl: HTMLElement | null = null;
  let cleanupAutoUpdate: (() => void) | null = null;
  let activeContext: BubbleContext = 'none';

  return Extension.create({
    name: 'markonBubbleMenu',

    addProseMirrorPlugins() {
      const editor = this.editor;

      return [
        new Plugin({
          key: new PluginKey('markonBubbleMenuPlugin'),
          view: () => {
            const renderMenuContent = (context: BubbleContext) => {
              if (!menuEl) return;

              if (context === 'text') {
                menuEl.innerHTML = `
                  <button type="button" class="btn btn-ghost btn-sm btn-icon h-7 w-7 text-xs" data-bubble-cmd="bold" title="Bold"><strong>B</strong></button>
                  <button type="button" class="btn btn-ghost btn-sm btn-icon h-7 w-7 text-xs" data-bubble-cmd="italic" title="Italic"><em>I</em></button>
                  <button type="button" class="btn btn-ghost btn-sm btn-icon h-7 w-7 text-xs" data-bubble-cmd="underline" title="Underline"><span class="underline">U</span></button>
                  <button type="button" class="btn btn-ghost btn-sm btn-icon h-7 w-7 text-xs" data-bubble-cmd="strike" title="Strikethrough"><span class="line-through">S</span></button>
                  <button type="button" class="btn btn-ghost btn-sm btn-icon h-7 w-7 text-xs" data-bubble-cmd="highlight" title="Highlight"><span class="px-1 rounded text-xs leading-none font-bold bg-warning/20 text-warning">H</span></button>
                  <button type="button" class="btn btn-ghost btn-sm btn-icon h-7 w-7 text-xs" data-bubble-cmd="code" title="Code">&lt;/&gt;</button>
                  <button type="button" class="btn btn-ghost btn-sm btn-icon h-7 w-7 text-xs" data-bubble-cmd="link" title="Link">
                    <svg width="14" height="14" class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                    </svg>
                  </button>
                `;
              } else if (context === 'image') {
                menuEl.innerHTML = `
                  <button type="button" class="btn btn-ghost btn-sm btn-icon h-7 w-7 text-xs" data-image-align="left" title="Align Left">
                    <svg width="14" height="14" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="21" y1="6" x2="3" y2="6"/><line x1="15" y1="12" x2="3" y2="12"/><line x1="17" y1="18" x2="3" y2="18"/>
                    </svg>
                  </button>
                  <button type="button" class="btn btn-ghost btn-sm btn-icon h-7 w-7 text-xs" data-image-align="center" title="Align Center">
                    <svg width="14" height="14" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="18" y1="6" x2="6" y2="6"/><line x1="21" y1="12" x2="3" y2="12"/><line x1="18" y1="18" x2="6" y2="18"/>
                    </svg>
                  </button>
                  <button type="button" class="btn btn-ghost btn-sm btn-icon h-7 w-7 text-xs" data-image-align="right" title="Align Right">
                    <svg width="14" height="14" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="12" x2="9" y2="12"/><line x1="21" y1="18" x2="7" y2="18"/>
                    </svg>
                  </button>
                  <span class="w-px h-4 bg-border/60 mx-0.5 self-center shrink-0"></span>
                  <button type="button" class="btn btn-ghost btn-xs px-1.5 py-0.5 text-xs" data-image-width="25%" title="25% Width">25%</button>
                  <button type="button" class="btn btn-ghost btn-xs px-1.5 py-0.5 text-xs" data-image-width="50%" title="50% Width">50%</button>
                  <button type="button" class="btn btn-ghost btn-xs px-1.5 py-0.5 text-xs" data-image-width="75%" title="75% Width">75%</button>
                  <button type="button" class="btn btn-ghost btn-xs px-1.5 py-0.5 text-xs" data-image-width="100%" title="100% Width">100%</button>
                  <span class="w-px h-4 bg-border/60 mx-0.5 self-center shrink-0"></span>
                  <button type="button" class="btn btn-ghost btn-sm btn-icon h-7 w-7 text-xs" data-image-action="editAlt" title="Edit Alt / Caption">
                    <svg width="14" height="14" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 20h9"></path>
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                    </svg>
                  </button>
                  <button type="button" class="btn btn-ghost btn-sm btn-icon h-7 w-7 text-xs text-danger hover:bg-danger/10" data-image-action="delete" title="Delete Image">
                    <svg width="14" height="14" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                `;
              } else if (context === 'video') {
                menuEl.innerHTML = `
                  <button type="button" class="btn btn-ghost btn-sm btn-icon h-7 w-7 text-xs" data-video-align="left" title="Align Left">
                    <svg width="14" height="14" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="21" y1="6" x2="3" y2="6"/><line x1="15" y1="12" x2="3" y2="12"/><line x1="17" y1="18" x2="3" y2="18"/>
                    </svg>
                  </button>
                  <button type="button" class="btn btn-ghost btn-sm btn-icon h-7 w-7 text-xs" data-video-align="center" title="Align Center">
                    <svg width="14" height="14" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="18" y1="6" x2="6" y2="6"/><line x1="21" y1="12" x2="3" y2="12"/><line x1="18" y1="18" x2="6" y2="18"/>
                    </svg>
                  </button>
                  <button type="button" class="btn btn-ghost btn-sm btn-icon h-7 w-7 text-xs" data-video-align="right" title="Align Right">
                    <svg width="14" height="14" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="12" x2="9" y2="12"/><line x1="21" y1="18" x2="7" y2="18"/>
                    </svg>
                  </button>
                  <span class="w-px h-4 bg-border/60 mx-0.5 self-center shrink-0"></span>
                  <button type="button" class="btn btn-ghost btn-sm btn-icon h-7 w-7 text-xs" data-video-action="editUrl" title="Edit Video URL">
                    <svg width="14" height="14" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 20h9"></path>
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                    </svg>
                  </button>
                  <button type="button" class="btn btn-ghost btn-sm btn-icon h-7 w-7 text-xs text-danger hover:bg-danger/10" data-video-action="delete" title="Delete Video">
                    <svg width="14" height="14" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                `;
              }
            };

            const setupDelegation = () => {
              if (!menuEl) return;
              menuEl.addEventListener('mousedown', (e) => {
                const target = e.target as HTMLElement;

                // 1. Text commands
                const textBtn =
                  target.closest<HTMLButtonElement>('[data-bubble-cmd]');
                if (textBtn) {
                  e.preventDefault();
                  e.stopPropagation();
                  const cmd = textBtn.getAttribute('data-bubble-cmd');
                  if (cmd === 'bold') editor.chain().focus().toggleBold().run();
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
                          chain.setTextSelection({ from: selFrom, to: selTo });
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
                  return;
                }

                // 2. Image commands
                const imgAlignBtn =
                  target.closest<HTMLButtonElement>('[data-image-align]');
                if (imgAlignBtn) {
                  e.preventDefault();
                  e.stopPropagation();
                  const align = imgAlignBtn.getAttribute('data-image-align');
                  editor
                    .chain()
                    .focus()
                    .updateAttributes('image', { alignment: align })
                    .run();
                  return;
                }

                const imgWidthBtn =
                  target.closest<HTMLButtonElement>('[data-image-width]');
                if (imgWidthBtn) {
                  e.preventDefault();
                  e.stopPropagation();
                  const width = imgWidthBtn.getAttribute('data-image-width');
                  editor
                    .chain()
                    .focus()
                    .updateAttributes('image', { width })
                    .run();
                  return;
                }

                const imgActionBtn = target.closest<HTMLButtonElement>(
                  '[data-image-action]'
                );
                if (imgActionBtn) {
                  e.preventDefault();
                  e.stopPropagation();
                  const action = imgActionBtn.getAttribute('data-image-action');
                  if (action === 'delete') {
                    editor.commands.deleteSelection();
                  } else if (action === 'editAlt') {
                    const prevAlt = editor.getAttributes('image').alt || '';
                    openMarkonModal({
                      title: 'Edit Image Alt / Caption',
                      label: 'Image Alt Text',
                      initialValue: prevAlt,
                      placeholder: 'Descriptive alt text...',
                      confirmText: 'Save',
                      onConfirm: (alt) => {
                        editor
                          .chain()
                          .focus()
                          .updateAttributes('image', { alt })
                          .run();
                      },
                      onCancel: () => {
                        editor.commands.focus();
                      },
                    });
                  }
                  return;
                }

                // 3. Video commands
                const vidAlignBtn =
                  target.closest<HTMLButtonElement>('[data-video-align]');
                if (vidAlignBtn) {
                  e.preventDefault();
                  e.stopPropagation();
                  const align = vidAlignBtn.getAttribute('data-video-align');
                  editor
                    .chain()
                    .focus()
                    .updateAttributes('videoBlock', { alignment: align })
                    .run();
                  return;
                }

                const vidActionBtn = target.closest<HTMLButtonElement>(
                  '[data-video-action]'
                );
                if (vidActionBtn) {
                  e.preventDefault();
                  e.stopPropagation();
                  const action = vidActionBtn.getAttribute('data-video-action');
                  if (action === 'delete') {
                    editor.commands.deleteSelection();
                  } else if (action === 'editUrl') {
                    const prevSrc =
                      editor.getAttributes('videoBlock').src || '';
                    openMarkonModal({
                      title: 'Edit Video URL',
                      label: 'Video Link (YouTube, Vimeo, MP4)',
                      initialValue: prevSrc,
                      placeholder: 'https://...',
                      confirmText: 'Update Video',
                      onConfirm: (url) => {
                        if (url && url.trim()) {
                          editor
                            .chain()
                            .focus()
                            .updateAttributes('videoBlock', { src: url.trim() })
                            .run();
                        }
                      },
                      onCancel: () => {
                        editor.commands.focus();
                      },
                    });
                  }
                  return;
                }
              });
            };

            return {
              update: (view) => {
                const context = detectBubbleContext(editor);

                if (context === 'none') {
                  if (cleanupAutoUpdate) {
                    cleanupAutoUpdate();
                    cleanupAutoUpdate = null;
                  }
                  if (menuEl) menuEl.style.display = 'none';
                  activeContext = 'none';
                  return;
                }

                if (!menuEl) {
                  menuEl = document.createElement('div');
                  menuEl.className =
                    'markon-bubble-menu dropdown-menu flex items-center select-none font-sans';
                  menuEl.style.position = 'fixed';
                  menuEl.style.zIndex = '9999';
                  menuEl.style.display = 'flex';
                  menuEl.style.gap = '4px';
                  menuEl.style.padding = '4px';
                  menuEl.style.minWidth = 'unset';
                  menuEl.style.width = 'max-content';
                  setupDelegation();
                  document.body.appendChild(menuEl);
                }

                if (activeContext !== context) {
                  renderMenuContent(context);
                  activeContext = context;
                }

                // Update active states
                if (context === 'text') {
                  const updateActive = (cmd: string, active: boolean) => {
                    const b = menuEl?.querySelector(
                      `[data-bubble-cmd="${cmd}"]`
                    );
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
                } else if (context === 'image') {
                  const align =
                    editor.getAttributes('image').alignment || 'center';
                  menuEl
                    .querySelectorAll<HTMLButtonElement>('[data-image-align]')
                    .forEach((btn) => {
                      if (btn.getAttribute('data-image-align') === align)
                        btn.classList.add('btn-active');
                      else btn.classList.remove('btn-active');
                    });

                  const width = editor.getAttributes('image').width || '100%';
                  menuEl
                    .querySelectorAll<HTMLButtonElement>('[data-image-width]')
                    .forEach((btn) => {
                      if (btn.getAttribute('data-image-width') === width)
                        btn.classList.add(
                          'btn-active',
                          'text-primary',
                          'font-bold'
                        );
                      else
                        btn.classList.remove(
                          'btn-active',
                          'text-primary',
                          'font-bold'
                        );
                    });
                } else if (context === 'video') {
                  const align =
                    editor.getAttributes('videoBlock').alignment || 'center';
                  menuEl
                    .querySelectorAll<HTMLButtonElement>('[data-video-align]')
                    .forEach((btn) => {
                      if (btn.getAttribute('data-video-align') === align)
                        btn.classList.add('btn-active');
                      else btn.classList.remove('btn-active');
                    });
                }

                menuEl.style.display = 'flex';

                const updatePosition = () => {
                  if (!menuEl || menuEl.style.display === 'none') return;
                  const curState = view.state;
                  const curSel = curState.selection;

                  let virtualRef: { getBoundingClientRect: () => DOMRect };

                  if (curSel instanceof NodeSelection) {
                    const nodeDOM = view.nodeDOM(
                      curSel.from
                    ) as HTMLElement | null;
                    if (
                      nodeDOM &&
                      typeof nodeDOM.getBoundingClientRect === 'function'
                    ) {
                      virtualRef = {
                        getBoundingClientRect: () =>
                          nodeDOM.getBoundingClientRect(),
                      };
                    } else {
                      const coords = view.coordsAtPos(curSel.from);
                      virtualRef = {
                        getBoundingClientRect: () =>
                          new DOMRect(
                            coords.left,
                            coords.top,
                            Math.max(coords.right - coords.left, 40),
                            Math.max(coords.bottom - coords.top, 40)
                          ),
                      };
                    }
                  } else {
                    if (curSel.empty) return;
                    const startCoords = view.coordsAtPos(curSel.from);
                    const endCoords = view.coordsAtPos(curSel.to);
                    const top = Math.min(startCoords.top, endCoords.top);
                    const bottom = Math.max(
                      startCoords.bottom,
                      endCoords.bottom
                    );
                    const left = Math.min(startCoords.left, endCoords.left);
                    const right = Math.max(startCoords.right, endCoords.right);

                    virtualRef = {
                      getBoundingClientRect: () =>
                        new DOMRect(
                          left,
                          top,
                          Math.max(right - left, 1),
                          Math.max(bottom - top, 1)
                        ),
                    };
                  }

                  computePosition(virtualRef, menuEl, {
                    strategy: 'fixed',
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
