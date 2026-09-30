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

  constructor(editor: Editor, trigger: HTMLElement) {
    this.editor = editor;
    this.trigger = trigger;
    this.init();
  }

  private init(): void {
    this.trigger.addEventListener('mousedown', (e) => e.preventDefault());
    this.trigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.toggle();
    });
  }

  public toggle(): void {
    if (this.isOpen) this.close();
    else this.open();
  }

  public open(): void {
    if (this.isOpen) return;
    this.isOpen = true;
    this.trigger.setAttribute('aria-expanded', 'true');
    this.trigger.classList.add('btn-active');

    const menu = document.createElement('div');
    menu.className =
      'markon-font-family-menu card bg-surface border border-default rounded-xl shadow-2xl p-1 z-50 flex flex-col gap-0.5 min-w-[160px] animate-in fade-in zoom-in-95 duration-100';
    menu.style.position = 'fixed';
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

    const handleOutsideClick = (e: MouseEvent) => {
      if (
        !this.trigger.contains(e.target as Node) &&
        !menu.contains(e.target as Node)
      ) {
        this.close();
      }
    };
    document.addEventListener('click', handleOutsideClick);
    this.cleanupOutsideClick = () =>
      document.removeEventListener('click', handleOutsideClick);
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

  public destroy(): void {
    this.close();
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

  constructor(editor: Editor, trigger: HTMLElement) {
    this.editor = editor;
    this.trigger = trigger;
    this.init();
  }

  private init(): void {
    this.trigger.addEventListener('mousedown', (e) => e.preventDefault());
    this.trigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.toggle();
    });
  }

  public toggle(): void {
    if (this.isOpen) this.close();
    else this.open();
  }

  public open(): void {
    if (this.isOpen) return;
    this.isOpen = true;
    this.trigger.setAttribute('aria-expanded', 'true');
    this.trigger.classList.add('btn-active');

    const menu = document.createElement('div');
    menu.className =
      'markon-font-size-menu card bg-surface border border-default rounded-xl shadow-2xl p-1 z-50 flex flex-col gap-0.5 min-w-[100px] max-h-56 overflow-y-auto animate-in fade-in zoom-in-95 duration-100';
    menu.style.position = 'fixed';
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

    const handleOutsideClick = (e: MouseEvent) => {
      if (
        !this.trigger.contains(e.target as Node) &&
        !menu.contains(e.target as Node)
      ) {
        this.close();
      }
    };
    document.addEventListener('click', handleOutsideClick);
    this.cleanupOutsideClick = () =>
      document.removeEventListener('click', handleOutsideClick);
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

  public destroy(): void {
    this.close();
  }
}

// --- HIGHLIGHT COLOR MENU ---
export interface HighlightPreset {
  label: string;
  color: string;
}

export const HIGHLIGHT_PRESETS: HighlightPreset[] = [
  {
    label: 'Yellow',
    color: 'var(--color-warning-subtle, oklch(0.96 0.08 95))',
  },
  {
    label: 'Green',
    color: 'var(--color-success-subtle, oklch(0.95 0.06 150))',
  },
  { label: 'Blue', color: 'var(--color-info-subtle, oklch(0.94 0.06 240))' },
  { label: 'Pink', color: 'var(--color-danger-subtle, oklch(0.95 0.06 25))' },
  {
    label: 'Orange',
    color: 'var(--color-warning-subtle, oklch(0.94 0.07 65))',
  },
  {
    label: 'Purple',
    color: 'var(--color-accent-subtle, oklch(0.94 0.07 310))',
  },
];

export class MarkonHighlightMenu {
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
    this.trigger.addEventListener('mousedown', (e) => e.preventDefault());
    this.trigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.toggle();
    });
  }

  public toggle(): void {
    if (this.isOpen) this.close();
    else this.open();
  }

  public open(): void {
    if (this.isOpen) return;
    this.isOpen = true;
    this.trigger.setAttribute('aria-expanded', 'true');
    this.trigger.classList.add('btn-active');

    const menu = document.createElement('div');
    menu.className =
      'markon-highlight-menu card bg-surface border border-default rounded-xl shadow-2xl p-2 z-50 flex flex-col gap-2 min-w-[160px] animate-in fade-in zoom-in-95 duration-100';
    menu.style.position = 'fixed';
    menu.style.zIndex = '9999';

    const header = document.createElement('div');
    header.className =
      'text-xs font-semibold text-muted px-1 uppercase tracking-wider';
    header.textContent = 'Highlight Color';
    menu.appendChild(header);

    // Color Swatch Grid
    const grid = document.createElement('div');
    grid.className =
      'grid grid-cols-6 gap-1.5 p-1 bg-subtle/50 rounded-lg border border-default/50';

    const currentColor = this.editor.getAttributes('highlight').color;

    HIGHLIGHT_PRESETS.forEach((preset) => {
      const swatch = document.createElement('button');
      swatch.type = 'button';
      swatch.className =
        'rounded-md border border-black/10 cursor-pointer transition-transform hover:scale-110 flex items-center justify-center shrink-0';
      swatch.style.width = '22px';
      swatch.style.height = '22px';
      swatch.style.minWidth = '22px';
      swatch.style.minHeight = '22px';
      swatch.style.backgroundColor = preset.color;
      swatch.title = preset.label;

      if (currentColor === preset.color) {
        swatch.classList.add('ring-2', 'ring-primary', 'ring-offset-1');
      }

      swatch.addEventListener('mousedown', (e) => e.preventDefault());
      swatch.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.editor
          .chain()
          .focus()
          .toggleHighlight({ color: preset.color })
          .run();
        this.close();
        this.editor.commands.focus();
      });

      grid.appendChild(swatch);
    });
    menu.appendChild(grid);

    // Remove Highlight button
    const clearBtn = document.createElement('button');
    clearBtn.type = 'button';
    clearBtn.className =
      'btn btn-ghost btn-sm w-full justify-start text-xs text-muted hover:text-danger gap-2';
    clearBtn.innerHTML = `
      <svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
      <span>Remove Highlight</span>
    `;
    clearBtn.addEventListener('mousedown', (e) => e.preventDefault());
    clearBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.editor.chain().focus().unsetHighlight().run();
      this.close();
      this.editor.commands.focus();
    });
    menu.appendChild(clearBtn);

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

    const handleOutsideClick = (e: MouseEvent) => {
      if (
        !this.trigger.contains(e.target as Node) &&
        !menu.contains(e.target as Node)
      ) {
        this.close();
      }
    };
    document.addEventListener('click', handleOutsideClick);
    this.cleanupOutsideClick = () =>
      document.removeEventListener('click', handleOutsideClick);
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

  public destroy(): void {
    this.close();
  }
}

// --- TEXT COLOR MENU ---
export interface TextColorPreset {
  label: string;
  color: string;
}

export const TEXT_COLOR_PRESETS: TextColorPreset[] = [
  { label: 'Default', color: 'inherit' },
  { label: 'Primary', color: 'var(--color-primary)' },
  { label: 'Indigo', color: 'var(--brand-700, #1d4ed8)' },
  { label: 'Success', color: 'var(--color-success)' },
  { label: 'Danger', color: 'var(--color-danger)' },
  { label: 'Warning', color: 'var(--color-warning)' },
  { label: 'Info', color: 'var(--color-info)' },
  { label: 'Muted', color: 'var(--fg-muted)' },
];

export class MarkonTextColorMenu {
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
    this.trigger.addEventListener('mousedown', (e) => e.preventDefault());
    this.trigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.toggle();
    });
  }

  public toggle(): void {
    if (this.isOpen) this.close();
    else this.open();
  }

  public open(): void {
    if (this.isOpen) return;
    this.isOpen = true;
    this.trigger.setAttribute('aria-expanded', 'true');
    this.trigger.classList.add('btn-active');

    const menu = document.createElement('div');
    menu.className =
      'markon-color-menu card bg-surface border border-default rounded-xl shadow-2xl p-2 z-50 flex flex-col gap-2 min-w-[170px] animate-in fade-in zoom-in-95 duration-100';
    menu.style.position = 'fixed';
    menu.style.zIndex = '9999';

    const header = document.createElement('div');
    header.className =
      'text-xs font-semibold text-muted px-1 uppercase tracking-wider';
    header.textContent = 'Text Color';
    menu.appendChild(header);

    const grid = document.createElement('div');
    grid.className =
      'grid grid-cols-4 gap-2 p-1.5 bg-subtle/50 rounded-lg border border-default/50';

    const currentColor = this.editor.getAttributes('textStyle').color;

    TEXT_COLOR_PRESETS.forEach((preset) => {
      const swatch = document.createElement('button');
      swatch.type = 'button';
      swatch.className =
        'rounded-md border border-default cursor-pointer transition-transform hover:scale-110 flex items-center justify-center shrink-0';
      swatch.style.width = '22px';
      swatch.style.height = '22px';
      swatch.style.minWidth = '22px';
      swatch.style.minHeight = '22px';
      swatch.style.backgroundColor =
        preset.color === 'inherit' ? 'var(--fg-default)' : preset.color;
      swatch.title = preset.label;

      if (
        currentColor === preset.color ||
        (!currentColor && preset.color === 'inherit')
      ) {
        swatch.classList.add('ring-2', 'ring-primary', 'ring-offset-1');
      }

      swatch.addEventListener('mousedown', (e) => e.preventDefault());
      swatch.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (preset.color === 'inherit') {
          this.editor.chain().focus().unsetColor().run();
        } else {
          this.editor.chain().focus().setColor(preset.color).run();
        }
        this.close();
        this.editor.commands.focus();
      });

      grid.appendChild(swatch);
    });
    menu.appendChild(grid);

    // Reset color button
    const clearBtn = document.createElement('button');
    clearBtn.type = 'button';
    clearBtn.className =
      'btn btn-ghost btn-sm w-full justify-start text-xs text-muted hover:text-danger gap-2';
    clearBtn.innerHTML = `
      <svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
      <span>Reset to Default</span>
    `;
    clearBtn.addEventListener('mousedown', (e) => e.preventDefault());
    clearBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.editor.chain().focus().unsetColor().run();
      this.close();
      this.editor.commands.focus();
    });
    menu.appendChild(clearBtn);

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

    const handleOutsideClick = (e: MouseEvent) => {
      if (
        !this.trigger.contains(e.target as Node) &&
        !menu.contains(e.target as Node)
      ) {
        this.close();
      }
    };
    document.addEventListener('click', handleOutsideClick);
    this.cleanupOutsideClick = () =>
      document.removeEventListener('click', handleOutsideClick);
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

  public destroy(): void {
    this.close();
  }
}
