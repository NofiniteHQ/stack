/**
 * @nofinite/markon - Block Drag Handle
 * Provides Notion-style gutter drag handles for block reordering and selection.
 * Framework-agnostic and styled with @nofinite/nuicss tokens.
 */

import type { Editor } from '@tiptap/core';
import { NodeSelection } from '@tiptap/pm/state';

export interface MarkonDragHandleOptions {
  editor: Editor;
  container: HTMLElement;
}

export class MarkonDragHandle {
  private editor: Editor;
  private container: HTMLElement;
  private handleEl: HTMLElement;
  private currentBlock: HTMLElement | null = null;
  private hideTimeout: any = null;
  private isDragging = false;

  constructor(options: MarkonDragHandleOptions) {
    this.editor = editorWithView(options.editor);
    this.container = options.container;
    this.container.style.position = 'relative';
    this.handleEl = this.createHandleElement();
    this.container.appendChild(this.handleEl);
    this.attachEvents();
  }

  private createHandleElement(): HTMLElement {
    const handle = document.createElement('div');
    handle.className =
      'markon-drag-handle rounded text-muted hover:text-default hover:bg-subtle/80 select-none';
    handle.style.cssText =
      'position: absolute; z-index: 20; width: 18px; height: 22px; display: none; align-items: center; justify-content: center; cursor: grab; opacity: 0; pointer-events: none; transition: opacity 0.15s ease;';
    handle.setAttribute('draggable', 'true');
    handle.setAttribute('title', 'Drag to move block or click to select');
    handle.innerHTML = `
      <svg width="14" height="14" style="width: 14px; height: 14px; min-width: 14px; min-height: 14px; display: block;" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="9" cy="5" r="1.5" />
        <circle cx="9" cy="12" r="1.5" />
        <circle cx="9" cy="19" r="1.5" />
        <circle cx="15" cy="5" r="1.5" />
        <circle cx="15" cy="12" r="1.5" />
        <circle cx="15" cy="19" r="1.5" />
      </svg>
    `;
    return handle;
  }

  private attachEvents(): void {
    const editorDom = this.editor.view.dom;

    const onMouseMove = (e: MouseEvent) => {
      if (this.isDragging || !this.editor.isEditable) return;

      const target = e.target as HTMLElement;
      if (!target) return;

      // Find top-level block inside ProseMirror
      const block = this.findTopLevelBlock(target);
      if (block && block !== this.currentBlock) {
        this.currentBlock = block;
        this.showHandleForBlock(block);
      } else if (block && block === this.currentBlock) {
        this.cancelHide();
      }
    };

    const onMouseLeave = (e: MouseEvent) => {
      const related = e.relatedTarget as HTMLElement;
      if (
        related &&
        (this.handleEl.contains(related) || editorDom.contains(related))
      ) {
        return;
      }
      this.scheduleHide();
    };

    editorDom.addEventListener('mousemove', onMouseMove);
    editorDom.addEventListener('mouseleave', onMouseLeave);

    this.handleEl.addEventListener('mouseenter', () => {
      this.cancelHide();
      this.handleEl.style.opacity = '1';
      this.handleEl.style.pointerEvents = 'auto';
    });

    this.handleEl.addEventListener('mouseleave', () => {
      this.scheduleHide();
    });

    // Handle Click: Select Node
    this.handleEl.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!this.currentBlock) return;

      const pos = this.findBlockPos(this.currentBlock);
      if (typeof pos === 'number') {
        const { state, dispatch } = this.editor.view;
        try {
          const selection = NodeSelection.create(state.doc, pos);
          dispatch(state.tr.setSelection(selection));
          this.editor.view.focus();
        } catch {
          // ignore selection errors if position changed
        }
      }
    });

    // Handle Dragstart
    this.handleEl.addEventListener('dragstart', (e) => {
      if (!this.currentBlock) return;
      this.isDragging = true;

      const pos = this.findBlockPos(this.currentBlock);
      if (typeof pos === 'number') {
        const { state, dispatch } = this.editor.view;
        try {
          const selection = NodeSelection.create(state.doc, pos);
          dispatch(state.tr.setSelection(selection));

          if (e.dataTransfer) {
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', this.currentBlock.outerHTML);
            e.dataTransfer.setData('text/plain', this.currentBlock.innerText);
          }
        } catch {
          // ignore
        }
      }

      this.currentBlock.classList.add('opacity-40');
    });

    this.handleEl.addEventListener('dragend', () => {
      this.isDragging = false;
      if (this.currentBlock) {
        this.currentBlock.classList.remove('opacity-40');
      }
      this.scheduleHide();
    });
  }

  private findTopLevelBlock(el: HTMLElement): HTMLElement | null {
    const editorDom = this.editor.view.dom;
    let curr: HTMLElement | null = el;

    while (curr && curr.parentElement && curr.parentElement !== editorDom) {
      curr = curr.parentElement;
    }

    if (curr && curr.parentElement === editorDom) {
      return curr;
    }
    return null;
  }

  private findBlockPos(block: HTMLElement): number | null {
    try {
      const pos = this.editor.view.posAtDOM(block, 0);
      const resolved = this.editor.view.state.doc.resolve(pos);
      return resolved.before(1);
    } catch {
      return null;
    }
  }

  private showHandleForBlock(block: HTMLElement): void {
    this.cancelHide();

    const blockRect = block.getBoundingClientRect();
    const containerRect = this.container.getBoundingClientRect();

    // Position in the left gutter, vertically centered to the first line of the block
    const top =
      blockRect.top - containerRect.top + this.container.scrollTop + 3;
    const left = 6;

    this.handleEl.style.display = 'flex';
    this.handleEl.style.top = `${top}px`;
    this.handleEl.style.left = `${left}px`;
    this.handleEl.style.opacity = '1';
    this.handleEl.style.pointerEvents = 'auto';
  }

  private scheduleHide(): void {
    this.cancelHide();
    this.hideTimeout = setTimeout(() => {
      if (!this.isDragging) {
        this.handleEl.style.opacity = '0';
        this.handleEl.style.pointerEvents = 'none';
        this.handleEl.style.display = 'none';
        this.currentBlock = null;
      }
    }, 250);
  }

  private cancelHide(): void {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
  }

  public destroy(): void {
    this.cancelHide();
    this.handleEl.remove();
  }
}

function editorWithView(editor: Editor): Editor {
  return editor;
}
