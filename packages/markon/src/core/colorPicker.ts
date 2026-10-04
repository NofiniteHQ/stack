/**
 * @nofinite/markon - Custom Interactive Color Picker Component
 * Bespoke glassmorphic color picker supporting expanded OKLCH presets,
 * interactive Hue slider, live Hex input (#RRGGBB), and zero native <input type="color">.
 * 100% styled with @nofinite/nuicss design tokens and collision-proof @floating-ui/dom.
 */

import {
  autoUpdate,
  computePosition,
  flip,
  offset,
  shift,
} from '@floating-ui/dom';
import {
  registerActivePopover,
  unregisterActivePopover,
  type ActivePopover,
} from './popoverManager';

export interface ColorPreset {
  label: string;
  color: string;
  previewBg?: string;
}

export const HIGHLIGHT_PRESETS: ColorPreset[] = [
  {
    label: 'Yellow',
    color: 'var(--color-warning-subtle)',
    previewBg: 'color-mix(in oklab, var(--color-warning) 25%, transparent)',
  },
  {
    label: 'Amber',
    color: 'color-mix(in oklab, var(--color-warning) 22%, transparent)',
    previewBg: 'color-mix(in oklab, var(--color-warning) 30%, transparent)',
  },
  {
    label: 'Coral',
    color: 'var(--color-danger-subtle)',
    previewBg: 'color-mix(in oklab, var(--color-danger) 22%, transparent)',
  },
  {
    label: 'Rose',
    color: 'color-mix(in oklab, var(--color-danger) 20%, transparent)',
    previewBg: 'color-mix(in oklab, var(--color-danger) 25%, transparent)',
  },
  {
    label: 'Lavender',
    color: 'color-mix(in oklab, var(--color-primary) 22%, transparent)',
    previewBg: 'color-mix(in oklab, var(--color-primary) 28%, transparent)',
  },
  {
    label: 'Violet',
    color: 'color-mix(in oklab, var(--color-primary) 30%, transparent)',
    previewBg: 'color-mix(in oklab, var(--color-primary) 35%, transparent)',
  },
  {
    label: 'Sky',
    color: 'var(--color-info-subtle)',
    previewBg: 'color-mix(in oklab, var(--color-info) 22%, transparent)',
  },
  {
    label: 'Teal',
    color: 'color-mix(in oklab, var(--color-info) 18%, transparent)',
    previewBg: 'color-mix(in oklab, var(--color-info) 25%, transparent)',
  },
  {
    label: 'Mint',
    color: 'color-mix(in oklab, var(--color-success) 18%, transparent)',
    previewBg: 'color-mix(in oklab, var(--color-success) 25%, transparent)',
  },
  {
    label: 'Emerald',
    color: 'var(--color-success-subtle)',
    previewBg: 'color-mix(in oklab, var(--color-success) 22%, transparent)',
  },
  {
    label: 'Slate',
    color: 'color-mix(in oklab, var(--fg-muted) 20%, transparent)',
    previewBg: 'color-mix(in oklab, var(--fg-muted) 25%, transparent)',
  },
  {
    label: 'Brown',
    color: 'color-mix(in oklab, var(--color-warning) 25%, var(--fg-default))',
    previewBg:
      'color-mix(in oklab, var(--color-warning) 30%, var(--fg-default))',
  },
];

export const TEXT_COLOR_PRESETS: ColorPreset[] = [
  { label: 'Default', color: 'inherit', previewBg: 'transparent' },
  { label: 'Muted', color: 'var(--fg-muted)', previewBg: 'var(--fg-muted)' },
  { label: 'Dark', color: 'var(--fg-default)', previewBg: 'var(--fg-default)' },
  {
    label: 'Amber',
    color: 'var(--color-warning)',
    previewBg: 'var(--color-warning)',
  },
  {
    label: 'Orange',
    color: 'color-mix(in oklab, var(--color-warning) 60%, var(--color-danger))',
    previewBg:
      'color-mix(in oklab, var(--color-warning) 60%, var(--color-danger))',
  },
  {
    label: 'Red',
    color: 'var(--color-danger)',
    previewBg: 'var(--color-danger)',
  },
  {
    label: 'Rose',
    color: 'color-mix(in oklab, var(--color-danger) 70%, var(--color-primary))',
    previewBg:
      'color-mix(in oklab, var(--color-danger) 70%, var(--color-primary))',
  },
  {
    label: 'Purple',
    color: 'color-mix(in oklab, var(--color-primary) 60%, var(--color-danger))',
    previewBg:
      'color-mix(in oklab, var(--color-primary) 60%, var(--color-danger))',
  },
  {
    label: 'Brand',
    color: 'var(--color-primary)',
    previewBg: 'var(--color-primary)',
  },
  { label: 'Blue', color: 'var(--color-info)', previewBg: 'var(--color-info)' },
  {
    label: 'Teal',
    color: 'color-mix(in oklab, var(--color-info) 60%, var(--color-success))',
    previewBg:
      'color-mix(in oklab, var(--color-info) 60%, var(--color-success))',
  },
  {
    label: 'Green',
    color: 'var(--color-success)',
    previewBg: 'var(--color-success)',
  },
];

export interface MarkonColorPickerOptions {
  mode: 'highlight' | 'textColor';
  title?: string;
  trigger: HTMLElement;
  currentColor?: string;
  onSelect: (color: string) => void;
  onClear: () => void;
  onClose?: () => void;
}

export class MarkonColorPicker implements ActivePopover {
  private options: MarkonColorPickerOptions;
  private menuEl: HTMLElement | null = null;
  public isOpen = false;
  private cleanupAutoUpdate: (() => void) | null = null;
  private cleanupOutsideClick: (() => void) | null = null;
  private customColor = '#3b82f6';

  constructor(options: MarkonColorPickerOptions) {
    this.options = options;
  }

  public get trigger(): HTMLElement {
    return this.options.trigger;
  }

  public open(): void {
    if (this.isOpen) return;
    registerActivePopover(this);
    this.isOpen = true;
    this.options.trigger.setAttribute('aria-expanded', 'true');
    this.options.trigger.classList.add('btn-active');

    const isHighlight = this.options.mode === 'highlight';
    const presets = isHighlight ? HIGHLIGHT_PRESETS : TEXT_COLOR_PRESETS;
    const titleText =
      this.options.title || (isHighlight ? 'Highlight Color' : 'Text Color');

    const menu = document.createElement('div');
    menu.className = 'markon-color-picker dropdown-menu card select-none';
    menu.setAttribute('role', 'dialog');
    menu.setAttribute('data-state', 'open');
    menu.style.position = 'fixed';
    menu.style.display = 'flex';
    menu.style.flexDirection = 'column';
    menu.style.gap = '8px';
    menu.style.padding = '10px';
    menu.style.width = '236px';
    menu.style.boxSizing = 'border-box';
    menu.style.backgroundColor = 'var(--bg-surface)';
    menu.style.border = '1px solid var(--border-default)';
    menu.style.borderRadius = 'var(--radius-xl, 0.75rem)';
    menu.style.boxShadow = 'var(--shadow-xl)';
    menu.style.zIndex = '10001';
    menu.style.fontFamily =
      'var(--font-sans, system-ui, -apple-system, sans-serif)';
    menu.style.fontSize = '12px';

    // Header
    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.alignItems = 'center';
    header.style.justifyContent = 'space-between';
    header.style.padding = '0 2px 2px 2px';
    header.innerHTML = `
      <span style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--fg-muted);">${titleText}</span>
      <span style="font-size: 10px; font-weight: 500; color: var(--fg-muted);">OKLCH</span>
    `;
    menu.appendChild(header);

    // Preset Swatches Grid (6 cols x 2 rows)
    const grid = document.createElement('div');
    grid.className = 'markon-color-picker-grid';
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(6, 1fr)';
    grid.style.gap = '6px';
    grid.style.padding = '6px';
    grid.style.backgroundColor =
      'var(--bg-subtle, color-mix(in oklab, var(--fg-default) 3%, transparent))';
    grid.style.borderRadius = 'var(--radius-lg, 0.5rem)';
    grid.style.border = '1px solid var(--border-subtle, var(--border-default))';
    grid.style.boxSizing = 'border-box';

    const currentVal = this.options.currentColor;

    presets.forEach((preset) => {
      const swatch = document.createElement('button');
      swatch.type = 'button';
      swatch.className = 'markon-color-swatch';
      swatch.style.width = '100%';
      swatch.style.aspectRatio = '1 / 1';
      swatch.style.borderRadius = 'var(--radius-md, 0.375rem)';
      swatch.style.border = '1px solid var(--border-default)';
      swatch.style.cursor = 'pointer';
      swatch.style.display = 'flex';
      swatch.style.alignItems = 'center';
      swatch.style.justifyContent = 'center';
      swatch.style.padding = '0';
      swatch.style.margin = '0';
      swatch.style.boxSizing = 'border-box';
      swatch.style.transition = 'transform 0.12s ease, outline 0.12s ease';
      swatch.title = preset.label;

      if (preset.color === 'inherit') {
        swatch.style.backgroundColor = 'var(--bg-surface)';
        swatch.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--color-danger);">
            <line x1="4" y1="4" x2="20" y2="20"></line>
            <circle cx="12" cy="12" r="9"></circle>
          </svg>
        `;
      } else {
        swatch.style.backgroundColor = preset.color;
      }

      const isCurrent =
        currentVal === preset.color ||
        (!currentVal && preset.color === 'inherit');

      if (isCurrent) {
        swatch.style.outline = '2px solid var(--color-primary)';
        swatch.style.outlineOffset = '1px';
      }

      swatch.addEventListener('mouseenter', () => {
        swatch.style.transform = 'scale(1.12)';
      });
      swatch.addEventListener('mouseleave', () => {
        swatch.style.transform = 'scale(1)';
      });

      swatch.addEventListener('mousedown', (e) => e.preventDefault());
      swatch.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (preset.color === 'inherit') {
          this.options.onClear();
        } else {
          this.options.onSelect(preset.color);
        }
        this.close();
      });

      grid.appendChild(swatch);
    });
    menu.appendChild(grid);

    // Custom Color Section (No native system color input)
    const customSection = document.createElement('div');
    customSection.style.display = 'flex';
    customSection.style.flexDirection = 'column';
    customSection.style.gap = '6px';
    customSection.style.paddingTop = '6px';
    customSection.style.borderTop =
      '1px solid var(--border-subtle, var(--border-default))';

    const customLabel = document.createElement('div');
    customLabel.style.display = 'flex';
    customLabel.style.alignItems = 'center';
    customLabel.style.justifyContent = 'space-between';
    customLabel.style.padding = '0 2px';
    customLabel.style.fontSize = '11px';
    customLabel.style.fontWeight = '500';
    customLabel.style.color = 'var(--fg-muted)';
    customLabel.innerHTML = `<span>Custom Tone</span><span class="markon-custom-preview-code" style="font-family: monospace; font-size: 10px; font-weight: 600; color: var(--fg-default);">${this.customColor}</span>`;
    customSection.appendChild(customLabel);

    // Interactive Hue Slider Bar
    const hueSlider = document.createElement('input');
    hueSlider.type = 'range';
    hueSlider.min = '0';
    hueSlider.max = '360';
    hueSlider.value = '217'; // default blue
    hueSlider.style.width = '100%';
    hueSlider.style.height = '12px';
    hueSlider.style.borderRadius = '6px';
    hueSlider.style.appearance = 'none';
    hueSlider.style.webkitAppearance = 'none';
    hueSlider.style.cursor = 'pointer';
    hueSlider.style.outline = 'none';
    hueSlider.style.boxSizing = 'border-box';
    hueSlider.style.border = '1px solid var(--border-default)';
    hueSlider.style.background =
      'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)';

    // Hex Input Row with Preview Swatch and Apply Button
    const hexRow = document.createElement('div');
    hexRow.style.display = 'flex';
    hexRow.style.alignItems = 'center';
    hexRow.style.gap = '6px';
    hexRow.style.marginTop = '2px';

    const previewBadge = document.createElement('div');
    previewBadge.style.width = '26px';
    previewBadge.style.height = '26px';
    previewBadge.style.borderRadius = 'var(--radius-md, 0.375rem)';
    previewBadge.style.border = '1px solid var(--border-default)';
    previewBadge.style.backgroundColor = this.customColor;
    previewBadge.style.flexShrink = '0';
    previewBadge.style.boxShadow =
      'inset 0 1px 2px color-mix(in oklab, var(--fg-default) 10%, transparent)';

    const hexInput = document.createElement('input');
    hexInput.type = 'text';
    hexInput.className = 'input input-xs';
    hexInput.style.flex = '1';
    hexInput.style.minWidth = '0';
    hexInput.style.height = '26px';
    hexInput.style.padding = '0 6px';
    hexInput.style.fontFamily = 'monospace';
    hexInput.style.fontSize = '11px';
    hexInput.style.borderRadius = 'var(--radius-md, 0.375rem)';
    hexInput.style.border = '1px solid var(--border-default)';
    hexInput.style.backgroundColor = 'var(--bg-surface)';
    hexInput.style.color = 'var(--fg-default)';
    hexInput.style.boxSizing = 'border-box';
    hexInput.value = this.customColor;
    hexInput.maxLength = 7;
    hexInput.placeholder = '#RRGGBB';

    const applyBtn = document.createElement('button');
    applyBtn.type = 'button';
    applyBtn.className = 'btn btn-primary btn-xs';
    applyBtn.style.height = '26px';
    applyBtn.style.padding = '0 10px';
    applyBtn.style.fontSize = '11px';
    applyBtn.style.fontWeight = '600';
    applyBtn.style.borderRadius = 'var(--radius-md, 0.375rem)';
    applyBtn.style.display = 'inline-flex';
    applyBtn.style.alignItems = 'center';
    applyBtn.style.justifyContent = 'center';
    applyBtn.style.cursor = 'pointer';
    applyBtn.style.flexShrink = '0';
    applyBtn.textContent = 'Apply';

    const updateColorFromHue = (hue: number) => {
      // Convert HSL to Hex
      const lightness = isHighlight ? 88 : 45;
      const saturation = 90;
      const hex = hslToHex(hue, saturation, lightness);
      this.customColor = hex;
      previewBadge.style.backgroundColor = hex;
      hexInput.value = hex;
      const codeSpan = customLabel.querySelector('.markon-custom-preview-code');
      if (codeSpan) codeSpan.textContent = hex;
    };

    hueSlider.addEventListener('input', (e) => {
      const hue = parseInt((e.target as HTMLInputElement).value, 10);
      updateColorFromHue(hue);
    });

    hexInput.addEventListener('input', () => {
      let val = hexInput.value.trim();
      if (!val.startsWith('#')) val = '#' + val;
      if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(val)) {
        this.customColor = val;
        previewBadge.style.backgroundColor = val;
        const codeSpan = customLabel.querySelector(
          '.markon-custom-preview-code'
        );
        if (codeSpan) codeSpan.textContent = val;
      }
    });

    applyBtn.addEventListener('mousedown', (e) => e.preventDefault());
    applyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      let color = this.customColor;
      if (isHighlight) {
        color = `color-mix(in oklch, ${this.customColor} 24%, transparent)`;
      }
      this.options.onSelect(color);
      this.close();
    });

    hexRow.appendChild(previewBadge);
    hexRow.appendChild(hexInput);
    hexRow.appendChild(applyBtn);

    customSection.appendChild(hueSlider);
    customSection.appendChild(hexRow);
    menu.appendChild(customSection);

    // Clear / Reset Action Button
    const clearBtn = document.createElement('button');
    clearBtn.type = 'button';
    clearBtn.className = 'btn btn-ghost btn-xs';
    clearBtn.style.width = '100%';
    clearBtn.style.display = 'flex';
    clearBtn.style.alignItems = 'center';
    clearBtn.style.justifyContent = 'center';
    clearBtn.style.gap = '6px';
    clearBtn.style.padding = '6px 8px';
    clearBtn.style.fontSize = '11px';
    clearBtn.style.fontWeight = '500';
    clearBtn.style.color = 'var(--fg-muted)';
    clearBtn.style.borderRadius = 'var(--radius-md, 0.375rem)';
    clearBtn.style.border = 'none';
    clearBtn.style.borderTop =
      '1px solid var(--border-subtle, var(--border-default))';
    clearBtn.style.cursor = 'pointer';
    clearBtn.style.marginTop = '2px';
    clearBtn.innerHTML = `
      <svg width="14" height="14" style="flex-shrink: 0;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
      <span>${isHighlight ? 'Remove Highlight' : 'Reset to Default'}</span>
    `;
    clearBtn.addEventListener('mousedown', (e) => e.preventDefault());
    clearBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.options.onClear();
      this.close();
    });
    menu.appendChild(clearBtn);

    document.body.appendChild(menu);
    this.menuEl = menu;

    // Position using Floating UI
    this.cleanupAutoUpdate = autoUpdate(this.options.trigger, menu, () => {
      computePosition(this.options.trigger, menu, {
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
        !this.options.trigger.contains(e.target as Node) &&
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
    this.options.trigger.setAttribute('aria-expanded', 'false');
    this.options.trigger.classList.remove('btn-active');

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
    this.options.onClose?.();
  }

  public toggle(): void {
    if (this.isOpen) this.close();
    else this.open();
  }

  public destroy(): void {
    this.close();
  }
}

/**
 * Helper to convert HSL (Hue, Saturation %, Lightness %) to Hex string (#RRGGBB)
 */
export function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}
