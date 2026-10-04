/**
 * @nofinite/markon - Callout / Alert Extension
 * Enterprise-grade callout / alert box powered by @nofinite/nuicss superclasses.
 * Supports Info, Success, Warning, and Danger variants with live type switching.
 */

import { mergeAttributes, Node } from '@tiptap/core';

export type CalloutType = 'info' | 'success' | 'warning' | 'danger';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    callout: {
      insertCallout: (options?: { type?: CalloutType }) => ReturnType;
      setCalloutType: (type: CalloutType) => ReturnType;
    };
  }
}

export const CALLOUT_ICONS: Record<CalloutType, string> = {
  info: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="16" x2="12" y2="12"></line>
      <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
  `,
  success: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  `,
  warning: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
      <line x1="12" y1="9" x2="12" y2="13"></line>
      <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
  `,
  danger: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
  `,
};

export const CALLOUT_THEMES: Record<
  CalloutType,
  { border: string; bg: string; iconColor: string }
> = {
  info: {
    border: '1px solid color-mix(in oklab, var(--color-info) 30%, transparent)',
    bg: 'color-mix(in oklab, var(--color-info) 8%, transparent)',
    iconColor: 'var(--color-info)',
  },
  success: {
    border:
      '1px solid color-mix(in oklab, var(--color-success) 30%, transparent)',
    bg: 'color-mix(in oklab, var(--color-success) 8%, transparent)',
    iconColor: 'var(--color-success)',
  },
  warning: {
    border:
      '1px solid color-mix(in oklab, var(--color-warning) 30%, transparent)',
    bg: 'color-mix(in oklab, var(--color-warning) 8%, transparent)',
    iconColor: 'var(--color-warning)',
  },
  danger: {
    border:
      '1px solid color-mix(in oklab, var(--color-danger) 30%, transparent)',
    bg: 'color-mix(in oklab, var(--color-danger) 8%, transparent)',
    iconColor: 'var(--color-danger)',
  },
};

export const Callout = Node.create({
  name: 'callout',
  group: 'block',
  content: 'block+',
  defining: true,
  isolating: true,

  addAttributes() {
    return {
      type: {
        default: 'info',
        parseHTML: (element) => {
          const typeAttr = element.getAttribute('data-callout-type');
          if (
            typeAttr &&
            ['info', 'success', 'warning', 'danger'].includes(typeAttr)
          ) {
            return typeAttr;
          }
          if (element.classList.contains('alert-success')) return 'success';
          if (element.classList.contains('alert-warning')) return 'warning';
          if (element.classList.contains('alert-danger')) return 'danger';
          return 'info';
        },
        renderHTML: (attributes) => ({
          'data-callout-type': attributes.type || 'info',
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-callout]',
        contentElement: (el) =>
          (el as HTMLElement).querySelector('.alert-content') ||
          (el as HTMLElement),
      },
      {
        tag: 'div.markon-callout',
        contentElement: (el) =>
          (el as HTMLElement).querySelector('.alert-content') ||
          (el as HTMLElement),
      },
      {
        tag: 'div.alert',
        contentElement: (el) =>
          (el as HTMLElement).querySelector('.alert-content') ||
          (el as HTMLElement),
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const type: CalloutType = node.attrs.type || 'info';
    return [
      'div',
      mergeAttributes(
        {
          'data-callout': '',
          'data-callout-type': type,
          class: `markon-callout alert alert-${type} my-3 relative rounded-xl border flex items-start gap-3.5 p-4`,
        },
        HTMLAttributes
      ),
      [
        'div',
        { class: 'alert-icon shrink-0 w-5 h-5 mt-0.5' },
        CALLOUT_ICONS[type] || CALLOUT_ICONS.info,
      ],
      ['div', { class: 'alert-content flex-1 min-w-0' }, 0],
    ];
  },

  addCommands() {
    return {
      insertCallout:
        (options = {}) =>
        ({ chain }) => {
          const type = options.type || 'info';
          return chain()
            .insertContent({
              type: this.name,
              attrs: { type },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    { type: 'text', text: 'Enter callout text here...' },
                  ],
                },
              ],
            })
            .run();
        },

      setCalloutType:
        (type: CalloutType) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, { type });
        },
    };
  },

  addNodeView() {
    return ({ node, getPos, editor }) => {
      let currentType: CalloutType = (node.attrs.type as CalloutType) || 'info';

      const container = document.createElement('div');
      container.className = `markon-callout alert alert-${currentType} group/callout relative my-3`;
      container.setAttribute('data-callout', '');
      container.setAttribute('data-callout-type', currentType);

      const applyTheme = (t: CalloutType) => {
        const theme = CALLOUT_THEMES[t] || CALLOUT_THEMES.info;
        container.style.border = theme.border;
        container.style.backgroundColor = theme.bg;
      };

      container.style.display = 'flex';
      container.style.alignItems = 'flex-start';
      container.style.gap = '12px';
      container.style.padding = '14px 16px';
      container.style.margin = '12px 0';
      container.style.borderRadius = '12px';
      container.style.position = 'relative';
      container.style.transition = 'all 150ms ease';
      applyTheme(currentType);

      // Icon element
      const iconWrapper = document.createElement('div');
      iconWrapper.className = 'alert-icon shrink-0 w-5 h-5 mt-0.5';
      iconWrapper.style.display = 'inline-flex';
      iconWrapper.style.alignItems = 'center';
      iconWrapper.style.justifyContent = 'center';
      iconWrapper.style.width = '20px';
      iconWrapper.style.height = '20px';
      iconWrapper.style.flexShrink = '0';
      iconWrapper.style.marginTop = '2px';
      iconWrapper.style.userSelect = 'none';
      iconWrapper.style.color = CALLOUT_THEMES[currentType].iconColor;
      iconWrapper.innerHTML = CALLOUT_ICONS[currentType] || CALLOUT_ICONS.info;
      container.appendChild(iconWrapper);

      // Content wrapper (ProseMirror contentDOM)
      const contentDOM = document.createElement('div');
      contentDOM.className = 'alert-content flex-1 min-w-0 font-normal';
      contentDOM.style.flex = '1 1 0%';
      contentDOM.style.minWidth = '0';
      contentDOM.style.lineHeight = '1.6';
      container.appendChild(contentDOM);

      // Controls toolbar (Type selector + Delete button)
      if (editor.isEditable) {
        const controls = document.createElement('div');
        controls.className = 'alert-controls';
        controls.style.position = 'absolute';
        controls.style.top = '8px';
        controls.style.right = '8px';
        controls.style.display = 'flex';
        controls.style.alignItems = 'center';
        controls.style.gap = '2px';
        controls.style.backgroundColor = 'var(--bg-surface)';
        controls.style.border = '1px solid var(--border-default)';
        controls.style.borderRadius = '8px';
        controls.style.padding = '2px 4px';
        controls.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
        controls.style.opacity = '0';
        controls.style.transition = 'opacity 150ms ease';
        controls.style.zIndex = '10';

        container.addEventListener('mouseenter', () => {
          controls.style.opacity = '1';
        });
        container.addEventListener('mouseleave', () => {
          controls.style.opacity = '0';
        });

        const types: { id: CalloutType; label: string }[] = [
          { id: 'info', label: 'Info' },
          { id: 'success', label: 'Success' },
          { id: 'warning', label: 'Warning' },
          { id: 'danger', label: 'Danger' },
        ];

        types.forEach(({ id, label }) => {
          const typeBtn = document.createElement('button');
          typeBtn.type = 'button';
          typeBtn.className = `btn btn-ghost btn-xs text-[10px] px-1.5 py-0.5 rounded ${
            currentType === id
              ? 'btn-active font-bold text-primary'
              : 'text-muted'
          }`;
          typeBtn.textContent = label;
          typeBtn.setAttribute('data-callout-btn', id);

          typeBtn.addEventListener('mousedown', (e) => e.preventDefault());
          typeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (typeof getPos === 'function') {
              const pos = getPos();
              if (typeof pos === 'number') {
                editor.view.dispatch(
                  editor.view.state.tr.setNodeMarkup(pos, undefined, {
                    ...node.attrs,
                    type: id,
                  })
                );
              }
            }
          });
          controls.appendChild(typeBtn);
        });

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.className =
          'btn btn-ghost btn-xs text-muted hover:text-danger px-1 py-0.5 rounded ml-0.5';
        deleteBtn.title = 'Remove Callout';
        deleteBtn.innerHTML = `
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
              editor.view.dispatch(
                editor.view.state.tr.delete(pos, pos + node.nodeSize)
              );
            }
          }
        });
        controls.appendChild(deleteBtn);

        container.appendChild(controls);
      }

      return {
        dom: container,
        contentDOM,
        update: (updatedNode) => {
          if (updatedNode.type.name !== 'callout') return false;
          const newType: CalloutType =
            (updatedNode.attrs.type as CalloutType) || 'info';

          if (newType !== currentType) {
            container.classList.remove(`alert-${currentType}`);
            container.classList.add(`alert-${newType}`);
            container.setAttribute('data-callout-type', newType);
            applyTheme(newType);

            iconWrapper.style.color = CALLOUT_THEMES[newType].iconColor;
            iconWrapper.innerHTML =
              CALLOUT_ICONS[newType] || CALLOUT_ICONS.info;

            const allButtons =
              container.querySelectorAll<HTMLButtonElement>(
                '[data-callout-btn]'
              );
            allButtons.forEach((b) => {
              const btnType = b.getAttribute('data-callout-btn');
              if (btnType === newType) {
                b.classList.add('btn-active', 'font-bold', 'text-primary');
                b.classList.remove('text-muted');
              } else {
                b.classList.remove('btn-active', 'font-bold', 'text-primary');
                b.classList.add('text-muted');
              }
            });

            currentType = newType;
          }
          return true;
        },
      };
    };
  },
});
