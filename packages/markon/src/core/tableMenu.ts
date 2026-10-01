/**
 * @nofinite/markon - Table Dimension Picker Menu
 * Framework-agnostic popover with interactive hover-to-select grid (up to 10x10).
 * 100% styled with @nofinite/nuicss tokens and @floating-ui/dom positioning.
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

export class MarkonTableMenu {
  private editor: Editor;
  private trigger: HTMLElement;
  private menuEl: HTMLElement | null = null;
  private isOpen = false;
  private cleanupAutoUpdate: (() => void) | null = null;
  private cleanupOutsideClick: (() => void) | null = null;
  private cleanupTriggerEvents: (() => void) | null = null;
  private maxCols = 10;
  private maxRows = 10;

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

    this.renderMenu();
    document.body.appendChild(this.menuEl!);

    registerActivePopover(this);

    this.cleanupAutoUpdate = autoUpdate(this.trigger, this.menuEl!, () =>
      this.updatePosition()
    );

    const onPointerDown = (e: PointerEvent) => {
      if (
        this.menuEl &&
        !this.menuEl.contains(e.target as Node) &&
        !this.trigger.contains(e.target as Node)
      ) {
        this.close();
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        this.close();
        this.editor.commands.focus();
      }
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    this.cleanupOutsideClick = () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
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
    unregisterActivePopover(this);
    if (this.menuEl) {
      this.menuEl.remove();
      this.menuEl = null;
    }
  }

  private updatePosition(): void {
    if (!this.menuEl) return;
    computePosition(this.trigger, this.menuEl, {
      strategy: 'fixed',
      placement: 'bottom-start',
      middleware: [offset(4), flip(), shift({ padding: 8 })],
    }).then(({ x, y }) => {
      if (this.menuEl) {
        this.menuEl.style.left = `${x}px`;
        this.menuEl.style.top = `${y}px`;
      }
    });
  }

  private renderMenu(): void {
    this.menuEl = document.createElement('div');
    this.menuEl.className =
      'markon-table-menu dropdown-menu card fixed z-50 p-3 rounded-xl border border-default bg-surface shadow-xl flex flex-col gap-2 select-none animate-in fade-in zoom-in-95 duration-100';
    this.menuEl.setAttribute('role', 'dialog');
    this.menuEl.setAttribute('data-state', 'open');
    this.menuEl.style.position = 'fixed';
    this.menuEl.style.display = 'flex';
    this.menuEl.style.width = '240px';

    const header = document.createElement('div');
    header.className =
      'flex items-center justify-between text-xs text-muted pb-1 border-b border-default/40 font-medium';
    header.innerHTML = `<span>Insert Table</span><span class="markon-table-dimension text-primary font-bold">3 × 3</span>`;
    this.menuEl.appendChild(header);

    const dimensionSpan = header.querySelector(
      '.markon-table-dimension'
    ) as HTMLElement;

    const gridContainer = document.createElement('div');
    gridContainer.style.display = 'grid';
    gridContainer.style.gap = '4px';
    gridContainer.style.gridTemplateColumns = `repeat(${this.maxCols}, 18px)`;
    gridContainer.style.justifyContent = 'center';

    const cells: HTMLElement[][] = [];

    for (let r = 1; r <= this.maxRows; r++) {
      cells[r] = [];
      for (let c = 1; c <= this.maxCols; c++) {
        const cell = document.createElement('button');
        cell.type = 'button';
        cell.style.width = '18px';
        cell.style.height = '18px';
        cell.style.borderRadius = '3px';
        cell.style.border = '1px solid var(--border-default)';
        cell.style.backgroundColor = 'var(--bg-subtle)';
        cell.style.cursor = 'pointer';
        cell.style.padding = '0';
        cell.style.transition = 'all 150ms ease';
        cell.setAttribute('data-row', String(r));
        cell.setAttribute('data-col', String(c));
        cell.setAttribute('aria-label', `${c} by ${r} table`);

        cell.addEventListener('mouseenter', () => {
          if (dimensionSpan) {
            dimensionSpan.textContent = `${c} × ${r}`;
          }
          highlightCells(c, r);
        });

        cell.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.insertTable(c, r);
        });

        cells[r][c] = cell;
        gridContainer.appendChild(cell);
      }
    }

    const highlightCells = (cols: number, rows: number) => {
      for (let r = 1; r <= this.maxRows; r++) {
        for (let c = 1; c <= this.maxCols; c++) {
          const el = cells[r][c];
          if (r <= rows && c <= cols) {
            el.style.borderColor = 'var(--color-primary)';
            el.style.backgroundColor =
              'color-mix(in srgb, var(--color-primary) 30%, transparent)';
          } else {
            el.style.borderColor = 'var(--border-default)';
            el.style.backgroundColor = 'var(--bg-subtle)';
          }
        }
      }
    };

    highlightCells(3, 3);
    this.menuEl.appendChild(gridContainer);
  }

  private insertTable(cols: number, rows: number): void {
    this.close();
    this.editor
      .chain()
      .focus()
      .insertTable({ rows, cols, withHeaderRow: true })
      .run();
  }

  public destroy(): void {
    this.close();
    if (this.cleanupTriggerEvents) {
      this.cleanupTriggerEvents();
      this.cleanupTriggerEvents = null;
    }
  }
}
