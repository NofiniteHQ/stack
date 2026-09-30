/**
 * @nofinite/markon - Custom Typography Selector Menu
 * Replaces unstyled native <select> with a sleek icon-only button and collision-proof @floating-ui popover.
 * 100% styled with @nofinite/nuicss design tokens.
 */

import {
  autoUpdate,
  computePosition,
  flip,
  offset,
  shift,
} from '@floating-ui/dom';
import type { Editor } from '@tiptap/core';

export interface TypographyItem {
  id: string;
  label: string;
  icon: string;
  command: (editor: Editor) => void;
  isActive: (editor: Editor) => boolean;
}

export const TYPOGRAPHY_ITEMS: TypographyItem[] = [
  {
    id: 'p',
    label: 'Paragraph',
    icon: '¶',
    command: (editor) =>
      editor.chain().focus().clearNodes().setParagraph().run(),
    isActive: (editor) =>
      !editor.isActive('heading') &&
      !editor.isActive('blockquote') &&
      !editor.isActive('codeBlock'),
  },
  {
    id: 'h1',
    label: 'Heading 1',
    icon: 'H1',
    command: (editor) =>
      editor.chain().focus().clearNodes().setHeading({ level: 1 }).run(),
    isActive: (editor) => editor.isActive('heading', { level: 1 }),
  },
  {
    id: 'h2',
    label: 'Heading 2',
    icon: 'H2',
    command: (editor) =>
      editor.chain().focus().clearNodes().setHeading({ level: 2 }).run(),
    isActive: (editor) => editor.isActive('heading', { level: 2 }),
  },
  {
    id: 'h3',
    label: 'Heading 3',
    icon: 'H3',
    command: (editor) =>
      editor.chain().focus().clearNodes().setHeading({ level: 3 }).run(),
    isActive: (editor) => editor.isActive('heading', { level: 3 }),
  },
  {
    id: 'blockquote',
    label: 'Quote',
    icon: '“',
    command: (editor) => editor.chain().focus().toggleBlockquote().run(),
    isActive: (editor) => editor.isActive('blockquote'),
  },
  {
    id: 'codeBlock',
    label: 'Code Block',
    icon: '</>',
    command: (editor) =>
      editor.chain().focus().clearNodes().toggleCodeBlock().run(),
    isActive: (editor) => editor.isActive('codeBlock'),
  },
];

export class MarkonTypographyMenu {
  private editor: Editor;
  private trigger: HTMLElement;
  private menuEl: HTMLElement | null = null;
  private isOpen = false;
  private cleanupAutoUpdate: (() => void) | null = null;
  private cleanupOutsideClick: (() => void) | null = null;

  constructor(editor: Editor, trigger: HTMLElement) {
    this.editor = editor;
    this.trigger = trigger;
    this.init();
  }

  private init(): void {
    // Prevent focus loss when clicking trigger
    this.trigger.addEventListener('mousedown', (e) => {
      e.preventDefault();
    });

    this.trigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.toggle();
    });
  }

  public toggle(): void {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  public open(): void {
    if (this.isOpen) return;
    this.isOpen = true;
    this.trigger.setAttribute('aria-expanded', 'true');
    this.trigger.classList.add('btn-active');

    const menu = document.createElement('div');
    menu.className =
      'editor-typography-menu card bg-surface border border-default rounded-xl shadow-2xl p-1 z-50 flex flex-col gap-0.5 min-w-[170px] animate-in fade-in zoom-in-95 duration-100';
    menu.setAttribute('role', 'menu');
    menu.style.position = 'fixed';
    menu.style.zIndex = '9999';

    TYPOGRAPHY_ITEMS.forEach((item) => {
      const active = item.isActive(this.editor);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `btn btn-ghost btn-sm w-full justify-start text-xs font-normal gap-2.5 px-2.5 py-1.5 rounded-lg transition-colors ${
        active ? 'btn-active font-semibold text-primary' : 'text-default'
      }`;

      // Prevent mousedown from blurring ProseMirror selection
      btn.addEventListener('mousedown', (e) => {
        e.preventDefault();
      });

      const escapedIcon = item.icon
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      btn.innerHTML = `
        <span class="w-5 text-center font-mono font-bold text-xs shrink-0 ${
          active ? 'text-primary' : 'text-muted'
        }">${escapedIcon}</span>
        <span class="flex-1 text-left">${item.label}</span>
        ${
          active
            ? `<svg class="w-3.5 h-3.5 text-primary shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`
            : ''
        }
      `;

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        item.command(this.editor);
        this.updateTriggerState();
        this.close();
        this.editor.commands.focus();
      });

      menu.appendChild(btn);
    });

    document.body.appendChild(menu);
    this.menuEl = menu;

    // Collision-proof positioning with @floating-ui/dom
    this.cleanupAutoUpdate = autoUpdate(this.trigger, menu, () => {
      computePosition(this.trigger, menu, {
        strategy: 'fixed',
        placement: 'bottom-start',
        middleware: [offset(4), flip(), shift({ padding: 8 })],
      }).then(({ x, y }) => {
        menu.style.left = `${x}px`;
        menu.style.top = `${y}px`;
      });
    });

    const handleOutsideClick = (e: MouseEvent) => {
      if (
        !this.trigger.contains(e.target as Node) &&
        !menu.contains(e.target as Node)
      ) {
        this.close();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        this.close();
      }
    };

    document.addEventListener('pointerdown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);

    this.cleanupOutsideClick = () => {
      document.removeEventListener('pointerdown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }

  public close(): void {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.trigger.setAttribute('aria-expanded', 'false');
    this.trigger.classList.remove('btn-active');

    if (this.cleanupAutoUpdate) {
      this.cleanupAutoUpdate();
      this.cleanupAutoUpdate = null;
    }

    if (this.cleanupOutsideClick) {
      this.cleanupOutsideClick();
      this.cleanupOutsideClick = null;
    }

    if (this.menuEl) {
      this.menuEl.remove();
      this.menuEl = null;
    }
  }

  public updateTriggerState(): void {
    const activeItem =
      TYPOGRAPHY_ITEMS.find((item) => item.isActive(this.editor)) ||
      TYPOGRAPHY_ITEMS[0];

    const iconEl = this.trigger.querySelector('.editor-typography-icon');
    if (iconEl) {
      iconEl.textContent = activeItem.icon;
    }
    this.trigger.setAttribute('title', `Text Style: ${activeItem.label}`);
  }

  public destroy(): void {
    this.close();
  }
}
