import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { computePosition, flip, shift, offset } from '@floating-ui/dom';

export function createBubbleMenuExtension() {
  let menuEl: HTMLElement | null = null;

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
                const { from, to, empty } = state.selection;

                if (empty || !editor.isEditable) {
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
                    <button type="button" class="btn btn-ghost btn-sm btn-icon h-7 w-7 text-xs" data-bubble-cmd="code" title="Code">&lt;/&gt;</button>
                    <button type="button" class="btn btn-ghost btn-sm btn-icon h-7 w-7 text-xs" data-bubble-cmd="link" title="Link">🔗</button>
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
                    else if (cmd === 'code')
                      editor.chain().focus().toggleCode().run();
                    else if (cmd === 'link') {
                      const prevUrl = editor.getAttributes('link').href;
                      const url = window.prompt(
                        'Enter URL:',
                        prevUrl || 'https://'
                      );
                      if (url)
                        editor.chain().focus().setLink({ href: url }).run();
                      else if (url === '')
                        editor.chain().focus().unsetLink().run();
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
                updateActive('code', editor.isActive('code'));
                updateActive('link', editor.isActive('link'));

                menuEl.style.display = 'flex';

                // Virtual reference from selection
                const startCoords = view.coordsAtPos(from);
                const endCoords = view.coordsAtPos(to);
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
                      bottom - top
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
              },
              destroy: () => {
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
