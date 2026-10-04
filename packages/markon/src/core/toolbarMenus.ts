/**
 * @nofinite/markon - Custom Toolbar Menus
 * Framework-agnostic popovers for Font Family, Font Size, Text Color, and Highlight.
 * 100% styled with @nofinite/nuicss tokens and collision-proof @floating-ui/dom.
 */

import {
  autoUpdate,
  computePosition,
  flip,
  offset,
  shift,
} from '@floating-ui/dom';
import type { Editor } from '@tiptap/core';
import {
  registerActivePopover,
  unregisterActivePopover,
} from './popoverManager';

// --- FONT FAMILY MENU ---
export interface FontFamilyItem {
  label: string;
  value: string;
}

export const FONT_FAMILIES: FontFamilyItem[] = [
  { label: 'Inter (Sans)', value: 'Inter, system-ui, sans-serif' },
  { label: 'Arial', value: 'Arial, Helvetica, sans-serif' },
  { label: 'Georgia (Serif)', value: 'Georgia, serif' },
  { label: 'Times New Roman', value: '"Times New Roman", Times, serif' },
  {
    label: 'Monospace',
    value: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  },
];

export class MarkonFontFamilyMenu {
  private editor: Editor;
  private trigger: HTMLElement;
  private menuEl: HTMLElement | null = null;
  private isOpen = false;
  private cleanupAutoUpdate: (() => void) | null = null;
  private cleanupOutsideClick: (() => void) | null = null;
  private cleanupTriggerEvents: (() => void) | null = null;

  constructor(editor: Editor, trigger: HTMLElement) {
    this.editor = editor;
    this.trigger = trigger;
    this.init();
  }

  private init(): void {
    const onMouseDown = (e: MouseEvent) => e.preventDefault();
    const onClick = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      this.toggle();
    };

    this.trigger.addEventListener('mousedown', onMouseDown);
    this.trigger.addEventListener('click', onClick);

    this.cleanupTriggerEvents = () => {
      this.trigger.removeEventListener('mousedown', onMouseDown);
      this.trigger.removeEventListener('click', onClick);
    };
  }

  public toggle(): void {
    if (this.isOpen) this.close();
    else this.open();
  }

  public open(): void {
    if (this.isOpen) return;
    registerActivePopover(this);
    this.isOpen = true;
    this.trigger.setAttribute('aria-expanded', 'true');
    this.trigger.classList.add('btn-active');

    const menu = document.createElement('div');
    menu.className =
      'markon-font-family-menu dropdown-menu card bg-surface border border-default rounded-xl shadow-2xl p-1 z-50 flex flex-col gap-0.5 min-w-[160px] animate-in fade-in zoom-in-95 duration-100';
    menu.setAttribute('role', 'menu');
    menu.setAttribute('data-state', 'open');
    menu.style.position = 'fixed';
    menu.style.display = 'flex';
    menu.style.zIndex = '9999';

    const currentFont = this.editor.getAttributes('textStyle').fontFamily;

    FONT_FAMILIES.forEach((font) => {
      const active = currentFont === font.value;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `btn btn-ghost btn-sm w-full justify-start text-xs font-normal px-2.5 py-1.5 rounded-lg transition-colors ${
        active ? 'btn-active font-semibold text-primary' : 'text-default'
      }`;
      btn.style.fontFamily = font.value;
      btn.textContent = font.label;

      btn.addEventListener('mousedown', (e) => e.preventDefault());
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.editor.chain().focus().setFontFamily(font.value).run();
        this.close();
        this.editor.commands.focus();
      });

      menu.appendChild(btn);
    });

    document.body.appendChild(menu);
    this.menuEl = menu;

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

    const handleOutsideClick = (e: MouseEvent | PointerEvent) => {
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
    unregisterActivePopover(this);
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

  public destroy(): void {
    this.close();
    if (this.cleanupTriggerEvents) {
      this.cleanupTriggerEvents();
      this.cleanupTriggerEvents = null;
    }
  }
}

// --- FONT SIZE MENU ---
export const FONT_SIZES = [
  '12px',
  '14px',
  '16px',
  '18px',
  '20px',
  '24px',
  '30px',
  '36px',
];

export class MarkonFontSizeMenu {
  private editor: Editor;
  private trigger: HTMLElement;
  private menuEl: HTMLElement | null = null;
  private isOpen = false;
  private cleanupAutoUpdate: (() => void) | null = null;
  private cleanupOutsideClick: (() => void) | null = null;
  private cleanupTriggerEvents: (() => void) | null = null;

  constructor(editor: Editor, trigger: HTMLElement) {
    this.editor = editor;
    this.trigger = trigger;
    this.init();
  }

  private init(): void {
    const onMouseDown = (e: MouseEvent) => e.preventDefault();
    const onClick = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      this.toggle();
    };

    this.trigger.addEventListener('mousedown', onMouseDown);
    this.trigger.addEventListener('click', onClick);

    this.cleanupTriggerEvents = () => {
      this.trigger.removeEventListener('mousedown', onMouseDown);
      this.trigger.removeEventListener('click', onClick);
    };
  }

  public toggle(): void {
    if (this.isOpen) this.close();
    else this.open();
  }

  public open(): void {
    if (this.isOpen) return;
    registerActivePopover(this);
    this.isOpen = true;
    this.trigger.setAttribute('aria-expanded', 'true');
    this.trigger.classList.add('btn-active');

    const menu = document.createElement('div');
    menu.className =
      'markon-font-size-menu dropdown-menu card bg-surface border border-default rounded-xl shadow-2xl p-1 z-50 flex flex-col gap-0.5 min-w-[100px] max-h-56 overflow-y-auto animate-in fade-in zoom-in-95 duration-100';
    menu.setAttribute('role', 'menu');
    menu.setAttribute('data-state', 'open');
    menu.style.position = 'fixed';
    menu.style.display = 'flex';
    menu.style.zIndex = '9999';

    const currentSize = this.editor.getAttributes('textStyle').fontSize;

    FONT_SIZES.forEach((size) => {
      const active = currentSize === size;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `btn btn-ghost btn-sm w-full justify-between text-xs font-normal px-2.5 py-1.5 rounded-lg transition-colors ${
        active ? 'btn-active font-semibold text-primary' : 'text-default'
      }`;
      btn.innerHTML = `<span>${size}</span>${
        active ? '<span class="text-primary font-bold">✓</span>' : ''
      }`;

      btn.addEventListener('mousedown', (e) => e.preventDefault());
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.editor.chain().focus().setFontSize(size).run();
        this.close();
        this.editor.commands.focus();
      });

      menu.appendChild(btn);
    });

    document.body.appendChild(menu);
    this.menuEl = menu;

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

    const handleOutsideClick = (e: MouseEvent | PointerEvent) => {
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
    unregisterActivePopover(this);
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

  public destroy(): void {
    this.close();
    if (this.cleanupTriggerEvents) {
      this.cleanupTriggerEvents();
      this.cleanupTriggerEvents = null;
    }
  }
}

// --- HIGHLIGHT COLOR MENU ---
import {
  MarkonColorPicker,
  HIGHLIGHT_PRESETS,
  TEXT_COLOR_PRESETS,
  type ColorPreset,
} from './colorPicker';

export { HIGHLIGHT_PRESETS, TEXT_COLOR_PRESETS };
export type HighlightPreset = ColorPreset;
export type TextColorPreset = ColorPreset;

export class MarkonHighlightMenu {
  private editor: Editor;
  private trigger: HTMLElement;
  private picker: MarkonColorPicker | null = null;
  private cleanupTriggerEvents: (() => void) | null = null;

  constructor(editor: Editor, trigger: HTMLElement) {
    this.editor = editor;
    this.trigger = trigger;
    this.init();
  }

  private init(): void {
    const onMouseDown = (e: MouseEvent) => e.preventDefault();
    const onClick = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      this.toggle();
    };

    this.trigger.addEventListener('mousedown', onMouseDown);
    this.trigger.addEventListener('click', onClick);

    this.cleanupTriggerEvents = () => {
      this.trigger.removeEventListener('mousedown', onMouseDown);
      this.trigger.removeEventListener('click', onClick);
    };
  }

  public toggle(): void {
    if (this.picker?.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  public open(): void {
    const currentColor = this.editor.getAttributes('highlight').color;
    this.picker = new MarkonColorPicker({
      mode: 'highlight',
      title: 'Highlight Color',
      trigger: this.trigger,
      currentColor,
      onSelect: (color) => {
        this.editor.chain().focus().setHighlight({ color }).run();
      },
      onClear: () => {
        this.editor.chain().focus().unsetHighlight().run();
      },
    });
    this.picker.open();
  }

  public close(): void {
    if (this.picker?.isOpen) {
      this.picker.close();
    }
  }

  public destroy(): void {
    this.close();
    if (this.cleanupTriggerEvents) {
      this.cleanupTriggerEvents();
      this.cleanupTriggerEvents = null;
    }
  }
}

// --- TEXT COLOR MENU ---
export class MarkonTextColorMenu {
  private editor: Editor;
  private trigger: HTMLElement;
  private picker: MarkonColorPicker | null = null;
  private cleanupTriggerEvents: (() => void) | null = null;

  constructor(editor: Editor, trigger: HTMLElement) {
    this.editor = editor;
    this.trigger = trigger;
    this.init();
  }

  private init(): void {
    const onMouseDown = (e: MouseEvent) => e.preventDefault();
    const onClick = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      this.toggle();
    };

    this.trigger.addEventListener('mousedown', onMouseDown);
    this.trigger.addEventListener('click', onClick);

    this.cleanupTriggerEvents = () => {
      this.trigger.removeEventListener('mousedown', onMouseDown);
      this.trigger.removeEventListener('click', onClick);
    };
  }

  public toggle(): void {
    if (this.picker?.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  public open(): void {
    const currentColor = this.editor.getAttributes('textStyle').color;
    this.picker = new MarkonColorPicker({
      mode: 'textColor',
      title: 'Text Color',
      trigger: this.trigger,
      currentColor,
      onSelect: (color) => {
        this.editor.chain().focus().setColor(color).run();
      },
      onClear: () => {
        this.editor.chain().focus().unsetColor().run();
      },
    });
    this.picker.open();
  }

  public close(): void {
    if (this.picker?.isOpen) {
      this.picker.close();
    }
  }

  public destroy(): void {
    this.close();
    if (this.cleanupTriggerEvents) {
      this.cleanupTriggerEvents();
      this.cleanupTriggerEvents = null;
    }
  }
}
