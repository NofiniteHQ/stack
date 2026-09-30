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
  private dropLineEl: HTMLElement;
  private currentBlock: HTMLElement | null = null;
  private hideTimeout: any = null;
  private isDragging = false;
  private draggedPos: number | null = null;
  private dropTargetPos: number | null = null;
  private cleanupListeners: (() => void) | null = null;

  constructor(options: MarkonDragHandleOptions) {
    this.editor = editorWithView(options.editor);
    this.container = options.container;
    this.container.style.position = 'relative';

    this.handleEl = this.createHandleElement();
    this.dropLineEl = this.createDropLineElement();

    this.container.appendChild(this.handleEl);
    this.container.appendChild(this.dropLineEl);

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

  private createDropLineElement(): HTMLElement {
    const line = document.createElement('div');
    line.className =
      'markon-drop-indicator bg-primary rounded-full transition-all pointer-events-none shadow-sm';
    line.style.cssText =
      'position: absolute; left: 24px; right: 12px; height: 2px; display: none; z-index: 30; transform: translateY(-50%);';
    return line;
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

    const onHandleMouseEnter = () => {
      this.cancelHide();
      this.handleEl.style.opacity = '1';
      this.handleEl.style.pointerEvents = 'auto';
    };

    const onHandleMouseLeave = () => {
      this.scheduleHide();
    };

    this.handleEl.addEventListener('mouseenter', onHandleMouseEnter);
    this.handleEl.addEventListener('mouseleave', onHandleMouseLeave);

    // Handle Click: Select Node
    const onHandleClick = (e: MouseEvent) => {
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
    };
    this.handleEl.addEventListener('click', onHandleClick);

    // Handle Dragstart
    const onDragStart = (e: DragEvent) => {
      if (!this.currentBlock) return;
      const pos = this.findBlockPos(this.currentBlock);
      if (typeof pos !== 'number') return;

      this.draggedPos = pos;
      this.isDragging = true;

      const { state, dispatch } = this.editor.view;
      try {
        const selection = NodeSelection.create(state.doc, pos);
        dispatch(state.tr.setSelection(selection));

        if (e.dataTransfer) {
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('application/x-markon-block', String(pos));
          e.dataTransfer.setData('text/html', this.currentBlock.outerHTML);
          e.dataTransfer.setData('text/plain', this.currentBlock.innerText);
        }
      } catch {
        // ignore
      }

      this.currentBlock.classList.add('opacity-40');
    };
    this.handleEl.addEventListener('dragstart', onDragStart);

    const onDragEnd = () => {
      this.cleanupDrag();
    };
    this.handleEl.addEventListener('dragend', onDragEnd);

    // Dragover & Drop handlers on editor container
    const onDragOver = (e: DragEvent) => {
      if (!this.isDragging || this.draggedPos === null) return;
      e.preventDefault();
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'move';
      }

      const coords = { left: e.clientX, top: e.clientY };
      const posAtCoords = this.editor.view.posAtCoords(coords);
      if (!posAtCoords) return;

      const resolved = this.editor.view.state.doc.resolve(posAtCoords.pos);
      if (resolved.depth === 0) return;

      const targetBlockPos = resolved.before(1);
      const targetNode = this.editor.view.state.doc.nodeAt(targetBlockPos);
      if (!targetNode) return;

      const domNode = this.editor.view.nodeDOM(targetBlockPos);
      const domEl =
        domNode instanceof HTMLElement
          ? domNode
          : (domNode?.parentElement as HTMLElement | null);
      if (!domEl) return;

      const rect = domEl.getBoundingClientRect();
      const containerRect = this.container.getBoundingClientRect();
      const isAfter = e.clientY > rect.top + rect.height / 2;

      const insertPos = isAfter
        ? targetBlockPos + targetNode.nodeSize
        : targetBlockPos;
      this.dropTargetPos = insertPos;

      const lineTop =
        (isAfter ? rect.bottom : rect.top) -
        containerRect.top +
        this.container.scrollTop;
      this.dropLineEl.style.top = `${lineTop}px`;
      this.dropLineEl.style.display = 'block';
    };

    const onDragLeave = (e: DragEvent) => {
      const related = e.relatedTarget as HTMLElement;
      if (related && this.container.contains(related)) return;
      this.dropLineEl.style.display = 'none';
      this.dropTargetPos = null;
    };

    const onDrop = (e: DragEvent) => {
      if (
        !this.isDragging ||
        this.draggedPos === null ||
        this.dropTargetPos === null
      ) {
        this.cleanupDrag();
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      const fromPos = this.draggedPos;
      const toPos = this.dropTargetPos;

      const doc = this.editor.view.state.doc;
      const sourceNode = doc.nodeAt(fromPos);

      if (sourceNode && fromPos !== toPos) {
        // Only move if not dropping directly before or after itself
        if (toPos !== fromPos && toPos !== fromPos + sourceNode.nodeSize) {
          const tr = this.editor.view.state.tr;

          // Delete original block
          tr.delete(fromPos, fromPos + sourceNode.nodeSize);

          // Calculate mapped destination position
          const mappedToPos = tr.mapping.map(toPos);

          // Insert block at target destination
          tr.insert(mappedToPos, sourceNode);

          try {
            const newSelection = NodeSelection.create(tr.doc, mappedToPos);
            tr.setSelection(newSelection);
          } catch {
            // fallback
          }

          this.editor.view.dispatch(tr);
          this.editor.view.focus();
        }
      }

      this.cleanupDrag();
    };

    this.container.addEventListener('dragover', onDragOver);
    this.container.addEventListener('dragleave', onDragLeave);
    this.container.addEventListener('drop', onDrop);

    this.cleanupListeners = () => {
      editorDom.removeEventListener('mousemove', onMouseMove);
      editorDom.removeEventListener('mouseleave', onMouseLeave);
      this.handleEl.removeEventListener('mouseenter', onHandleMouseEnter);
      this.handleEl.removeEventListener('mouseleave', onHandleMouseLeave);
      this.handleEl.removeEventListener('click', onHandleClick);
      this.handleEl.removeEventListener('dragstart', onDragStart);
      this.handleEl.removeEventListener('dragend', onDragEnd);
      this.container.removeEventListener('dragover', onDragOver);
      this.container.removeEventListener('dragleave', onDragLeave);
      this.container.removeEventListener('drop', onDrop);
    };
  }

  private cleanupDrag(): void {
    this.isDragging = false;
    this.draggedPos = null;
    this.dropTargetPos = null;
    this.dropLineEl.style.display = 'none';
    if (this.currentBlock) {
      this.currentBlock.classList.remove('opacity-40');
    }
    this.scheduleHide();
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
      return resolved.depth > 0 ? resolved.before(1) : 0;
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
    if (this.cleanupListeners) {
      this.cleanupListeners();
      this.cleanupListeners = null;
    }
    this.handleEl.remove();
    this.dropLineEl.remove();
  }
}

function editorWithView(editor: Editor): Editor {
  return editor;
}
