/**
 * @nofinite/markon - Block Drag Handle & Contextual Block Actions
 * Provides Notion-style gutter drag handles for block reordering, selection,
 * touch screen accessibility, and 1-tap contextual block manipulation.
 * Framework-agnostic and styled with @nofinite/nuicss tokens.
 */

import type { Editor } from '@tiptap/core';
import { NodeSelection } from '@tiptap/pm/state';
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

export interface MarkonDragHandleOptions {
  editor: Editor;
  container: HTMLElement;
}

export class MarkonDragHandle implements ActivePopover {
  private editor: Editor;
  private container: HTMLElement;
  private handleEl: HTMLElement;
  private dropLineEl: HTMLElement;
  private actionMenuEl: HTMLElement;
  private currentBlock: HTMLElement | null = null;
  private hideTimeout: any = null;
  private isDragging = false;
  private draggedPos: number | null = null;
  private dropTargetPos: number | null = null;
  private cleanupListeners: (() => void) | null = null;
  private cleanupAutoUpdate: (() => void) | null = null;
  private isActionMenuOpen = false;

  constructor(options: MarkonDragHandleOptions) {
    this.editor = editorWithView(options.editor);
    this.container = options.container;
    this.container.style.position = 'relative';

    this.handleEl = this.createHandleElement();
    this.dropLineEl = this.createDropLineElement();
    this.actionMenuEl = this.createActionMenuElement();

    this.container.appendChild(this.handleEl);
    this.container.appendChild(this.dropLineEl);

    const mountParent =
      typeof document !== 'undefined' ? document.body : this.container;
    mountParent.appendChild(this.actionMenuEl);

    this.attachEvents();
  }

  private createHandleElement(): HTMLElement {
    const handle = document.createElement('div');
    handle.className =
      'markon-drag-handle rounded text-muted hover:text-default hover:bg-subtle select-none';
    handle.style.cssText =
      'position: absolute; z-index: 20; width: 20px; height: 24px; display: none; align-items: center; justify-content: center; cursor: grab; opacity: 0; pointer-events: none; transition: opacity 0.15s ease; touch-action: manipulation;';
    handle.setAttribute('draggable', 'true');
    handle.setAttribute(
      'title',
      'Drag to move block or click for block actions'
    );
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

  private createActionMenuElement(): HTMLElement {
    const menu = document.createElement('div');
    menu.className = 'markon-block-actions-menu dropdown-menu card select-none';
    menu.style.cssText =
      'position: fixed; z-index: 10001; display: none; flex-direction: column;';
    menu.setAttribute('role', 'menu');
    return menu;
  }

  private attachEvents(): void {
    const editorDom = this.editor.view.dom;

    const onMouseMove = (e: MouseEvent) => {
      if (this.isDragging || !this.editor.isEditable || this.isActionMenuOpen) {
        return;
      }

      const target = e.target as HTMLElement;
      if (!target) return;

      const block = this.findDraggableBlock(target);
      if (block && block !== this.currentBlock) {
        this.currentBlock = block;
        this.showHandleForBlock(block);
      } else if (block && block === this.currentBlock) {
        this.cancelHide();
      }
    };

    const onMouseLeave = (e: MouseEvent) => {
      if (this.isActionMenuOpen) return;
      const related = e.relatedTarget as HTMLElement;
      if (
        related &&
        (this.handleEl.contains(related) || editorDom.contains(related))
      ) {
        return;
      }
      this.scheduleHide();
    };

    // Mobile / Touch support
    const onTouchStart = (e: TouchEvent) => {
      if (this.isDragging || !this.editor.isEditable) return;
      const touch = e.touches[0];
      if (!touch) return;
      const target = document.elementFromPoint(
        touch.clientX,
        touch.clientY
      ) as HTMLElement;
      if (!target) return;
      if (
        this.handleEl.contains(target) ||
        this.actionMenuEl.contains(target)
      ) {
        return;
      }

      const block = this.findDraggableBlock(target);
      if (block) {
        this.cancelHide();
        this.currentBlock = block;
        this.showHandleForBlock(block);
      }
    };

    editorDom.addEventListener('mousemove', onMouseMove);
    editorDom.addEventListener('mouseleave', onMouseLeave);
    editorDom.addEventListener('touchstart', onTouchStart, { passive: true });

    const onHandleMouseEnter = () => {
      this.cancelHide();
      this.handleEl.style.opacity = '1';
      this.handleEl.style.pointerEvents = 'auto';
    };

    const onHandleMouseLeave = () => {
      if (this.isActionMenuOpen) return;
      this.scheduleHide();
    };

    this.handleEl.addEventListener('mouseenter', onHandleMouseEnter);
    this.handleEl.addEventListener('mouseleave', onHandleMouseLeave);

    // Handle Click: Select Node & Toggle Contextual Action Menu
    const onHandleClick = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!this.currentBlock) return;

      this.selectBlock();
      this.toggleActionMenu();
    };
    this.handleEl.addEventListener('click', onHandleClick);

    // Handle Dragstart
    const onDragStart = (e: DragEvent) => {
      if (!this.currentBlock) return;
      const pos = this.findBlockPos(this.currentBlock);
      if (typeof pos !== 'number') return;

      this.hideActionMenu();
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

      const doc = this.editor.view.state.doc;
      const sourceNode = doc.nodeAt(this.draggedPos);
      if (!sourceNode) return;

      const resolved = doc.resolve(posAtCoords.pos);
      if (resolved.depth === 0) return;

      // Determine matching target block level
      let targetPos: number | null = null;
      let targetNode: any = null;

      // If dragged item is a listItem / taskItem, try to find target list item at same depth
      if (
        sourceNode.type.name === 'listItem' ||
        sourceNode.type.name === 'taskItem'
      ) {
        for (let d = resolved.depth; d > 0; d--) {
          const nodeAtDepth = resolved.node(d);
          if (nodeAtDepth.type.name === sourceNode.type.name) {
            targetPos = resolved.before(d);
            targetNode = nodeAtDepth;
            break;
          }
        }
      }

      // Default to top-level block if not a nested match
      if (targetPos === null || !targetNode) {
        for (let d = resolved.depth; d > 0; d--) {
          if (
            ['table', 'tableRow', 'tableCell', 'tableHeader'].includes(
              resolved.node(d).type.name
            )
          ) {
            if (resolved.node(d).type.name === 'table') {
              targetPos = resolved.before(d);
              targetNode = resolved.node(d);
            }
          }
        }

        if (!targetPos) {
          targetPos = resolved.before(1);
          targetNode = doc.nodeAt(targetPos);
        }
      }

      if (!targetNode || targetPos === null) return;

      const domNode = this.editor.view.nodeDOM(targetPos);
      const domEl =
        domNode instanceof HTMLElement
          ? domNode
          : (domNode?.parentElement as HTMLElement | null);
      if (!domEl) return;

      const rect = domEl.getBoundingClientRect();
      const containerRect = this.container.getBoundingClientRect();
      const isAfter = e.clientY > rect.top + rect.height / 2;

      const insertPos = isAfter ? targetPos + targetNode.nodeSize : targetPos;
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
        if (toPos !== fromPos && toPos !== fromPos + sourceNode.nodeSize) {
          const tr = this.editor.view.state.tr;

          try {
            tr.delete(fromPos, fromPos + sourceNode.nodeSize);
            const mappedToPos = tr.mapping.map(toPos);
            tr.insert(mappedToPos, sourceNode);

            const newSelection = NodeSelection.create(tr.doc, mappedToPos);
            tr.setSelection(newSelection);

            this.editor.view.dispatch(tr);
            this.editor.view.focus();
          } catch (err) {
            console.warn(
              '[MarkonDragHandle] Drag and drop transaction aborted by schema safety:',
              err
            );
          }
        }
      }

      this.cleanupDrag();
    };

    this.container.addEventListener('dragover', onDragOver);
    this.container.addEventListener('dragleave', onDragLeave);
    this.container.addEventListener('drop', onDrop);

    // Global click-outside & Escape dismissal for Action Menu
    const onDocClick = (e: MouseEvent) => {
      if (!this.isActionMenuOpen) return;
      const target = e.target as HTMLElement;
      if (
        this.handleEl.contains(target) ||
        this.actionMenuEl.contains(target)
      ) {
        return;
      }
      this.hideActionMenu();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && this.isActionMenuOpen) {
        this.hideActionMenu();
      }
    };

    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKeyDown);

    this.cleanupListeners = () => {
      editorDom.removeEventListener('mousemove', onMouseMove);
      editorDom.removeEventListener('mouseleave', onMouseLeave);
      editorDom.removeEventListener('touchstart', onTouchStart);
      this.handleEl.removeEventListener('mouseenter', onHandleMouseEnter);
      this.handleEl.removeEventListener('mouseleave', onHandleMouseLeave);
      this.handleEl.removeEventListener('click', onHandleClick);
      this.handleEl.removeEventListener('dragstart', onDragStart);
      this.handleEl.removeEventListener('dragend', onDragEnd);
      this.container.removeEventListener('dragover', onDragOver);
      this.container.removeEventListener('dragleave', onDragLeave);
      this.container.removeEventListener('drop', onDrop);
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onKeyDown);
    };
  }

  public toggleActionMenu(): void {
    if (this.isActionMenuOpen) {
      this.hideActionMenu();
    } else {
      this.showActionMenu();
    }
  }

  public showActionMenu(): void {
    if (!this.currentBlock) return;
    const pos = this.findBlockPos(this.currentBlock);
    if (typeof pos !== 'number') return;

    const { state } = this.editor.view;
    const $pos = state.doc.resolve(pos);
    const parent = $pos.parent;
    const index = $pos.index();
    const canMoveUp = index > 0;
    const canMoveDown = index < parent.childCount - 1;

    registerActivePopover(this);
    this.isActionMenuOpen = true;

    this.actionMenuEl.innerHTML = `
      <button type="button" class="dropdown-item ${
        !canMoveUp ? 'opacity-40 pointer-events-none' : ''
      }" data-action="move-up" title="Move block up">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="19" x2="12" y2="5"></line>
          <polyline points="5 12 12 5 19 12"></polyline>
        </svg>
        <span>Move Up</span>
      </button>
      <button type="button" class="dropdown-item ${
        !canMoveDown ? 'opacity-40 pointer-events-none' : ''
      }" data-action="move-down" title="Move block down">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <polyline points="19 12 12 19 5 12"></polyline>
        </svg>
        <span>Move Down</span>
      </button>
      <button type="button" class="dropdown-item" data-action="duplicate" title="Duplicate block">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
        <span>Duplicate</span>
      </button>
      <button type="button" class="dropdown-item" data-action="select" title="Select entire block">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
        <span>Select Block</span>
      </button>
      <div class="menu-divider"></div>
      <button type="button" class="dropdown-item is-danger text-danger" data-action="delete" title="Delete block">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
        <span>Delete Block</span>
      </button>
    `;

    this.actionMenuEl.onclick = (e) => {
      const btn = (e.target as HTMLElement).closest<HTMLButtonElement>(
        '[data-action]'
      );
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();

      const action = btn.getAttribute('data-action');
      switch (action) {
        case 'move-up':
          this.moveBlock('up');
          break;
        case 'move-down':
          this.moveBlock('down');
          break;
        case 'duplicate':
          this.duplicateBlock();
          break;
        case 'select':
          this.selectBlock();
          this.hideActionMenu();
          break;
        case 'delete':
          this.deleteBlock();
          break;
      }
    };

    this.actionMenuEl.style.display = 'flex';
    this.actionMenuEl.style.flexDirection = 'column';

    this.updateActionMenuPosition();

    if (this.cleanupAutoUpdate) {
      this.cleanupAutoUpdate();
    }
    this.cleanupAutoUpdate = autoUpdate(
      this.handleEl,
      this.actionMenuEl,
      () => {
        this.updateActionMenuPosition();
      }
    );
  }

  private updateActionMenuPosition(): void {
    if (!this.isActionMenuOpen || !this.actionMenuEl) return;

    computePosition(this.handleEl, this.actionMenuEl, {
      placement: 'right-start',
      middleware: [offset(6), flip(), shift({ padding: 8 })],
    }).then(({ x, y }) => {
      this.actionMenuEl.style.left = `${x}px`;
      this.actionMenuEl.style.top = `${y}px`;
    });
  }

  public hideActionMenu(): void {
    if (!this.isActionMenuOpen) return;
    this.isActionMenuOpen = false;
    this.actionMenuEl.style.display = 'none';
    if (this.cleanupAutoUpdate) {
      this.cleanupAutoUpdate();
      this.cleanupAutoUpdate = null;
    }
    unregisterActivePopover(this);
  }

  public close(): void {
    this.hideActionMenu();
  }

  public selectBlock(): void {
    if (!this.currentBlock) return;
    const pos = this.findBlockPos(this.currentBlock);
    if (typeof pos !== 'number') return;

    const { state, dispatch } = this.editor.view;
    try {
      const selection = NodeSelection.create(state.doc, pos);
      dispatch(state.tr.setSelection(selection));
      this.editor.view.focus();
    } catch {
      // ignore
    }
  }

  public moveBlock(direction: 'up' | 'down'): void {
    if (!this.currentBlock) return;
    const pos = this.findBlockPos(this.currentBlock);
    if (typeof pos !== 'number') return;

    const { state, dispatch } = this.editor.view;
    const node = state.doc.nodeAt(pos);
    if (!node) return;

    const $pos = state.doc.resolve(pos);
    const parent = $pos.parent;
    const index = $pos.index();

    if (direction === 'up') {
      if (index === 0) return;
      const prevNode = parent.child(index - 1);
      const prevPos = pos - prevNode.nodeSize;

      const tr = state.tr
        .delete(pos, pos + node.nodeSize)
        .insert(prevPos, node);

      try {
        tr.setSelection(NodeSelection.create(tr.doc, prevPos));
      } catch {
        // fallback
      }

      dispatch(tr);
      this.editor.view.focus();
    } else {
      if (index >= parent.childCount - 1) return;
      const nextNode = parent.child(index + 1);
      const targetPos = pos + nextNode.nodeSize;

      const tr = state.tr
        .delete(pos, pos + node.nodeSize)
        .insert(targetPos, node);

      try {
        tr.setSelection(NodeSelection.create(tr.doc, targetPos));
      } catch {
        // fallback
      }

      dispatch(tr);
      this.editor.view.focus();
    }

    this.hideActionMenu();
  }

  public duplicateBlock(): void {
    if (!this.currentBlock) return;
    const pos = this.findBlockPos(this.currentBlock);
    if (typeof pos !== 'number') return;

    const { state, dispatch } = this.editor.view;
    const node = state.doc.nodeAt(pos);
    if (!node) return;

    const cloned = node.type.create(node.attrs, node.content, node.marks);
    const insertPos = pos + node.nodeSize;
    const tr = state.tr.insert(insertPos, cloned);

    try {
      tr.setSelection(NodeSelection.create(tr.doc, insertPos));
    } catch {
      // fallback
    }

    dispatch(tr);
    this.editor.view.focus();
    this.hideActionMenu();
  }

  public deleteBlock(): void {
    if (!this.currentBlock) return;
    const pos = this.findBlockPos(this.currentBlock);
    if (typeof pos !== 'number') return;

    const { state, dispatch } = this.editor.view;
    const node = state.doc.nodeAt(pos);
    if (!node) return;

    const tr = state.tr.delete(pos, pos + node.nodeSize);
    dispatch(tr);
    this.editor.view.focus();
    this.hideActionMenu();
    this.scheduleHide();
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

  private findDraggableBlock(el: HTMLElement): HTMLElement | null {
    const editorDom = this.editor.view.dom;
    let curr: HTMLElement | null = el;

    while (curr && curr !== editorDom) {
      const tag = curr.tagName.toLowerCase();
      if (tag === 'li') {
        return curr;
      }
      if (curr.parentElement === editorDom) {
        return curr;
      }
      curr = curr.parentElement;
    }

    return null;
  }

  private findBlockPos(block: HTMLElement): number | null {
    try {
      const pos = this.editor.view.posAtDOM(block, 0);
      const resolved = this.editor.view.state.doc.resolve(pos);
      if (block.tagName.toLowerCase() === 'li') {
        for (let d = resolved.depth; d > 0; d--) {
          const name = resolved.node(d).type.name;
          if (name === 'listItem' || name === 'taskItem') {
            return resolved.before(d);
          }
        }
      }
      return resolved.depth > 0 ? resolved.before(1) : 0;
    } catch {
      return null;
    }
  }

  private showHandleForBlock(block: HTMLElement): void {
    this.cancelHide();

    const blockRect = block.getBoundingClientRect();
    const containerRect = this.container.getBoundingClientRect();

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
      if (!this.isDragging && !this.isActionMenuOpen) {
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
    this.hideActionMenu();
    if (this.cleanupListeners) {
      this.cleanupListeners();
      this.cleanupListeners = null;
    }
    this.handleEl.remove();
    this.dropLineEl.remove();
    this.actionMenuEl.remove();
  }
}

function editorWithView(editor: Editor): Editor {
  return editor;
}
