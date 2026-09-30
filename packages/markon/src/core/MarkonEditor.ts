/**
 * @nofinite/markon - Universal Content & Rich Text Authoring Engine
 * Framework-agnostic Vanilla DOM class powered by TipTap and ProseMirror.
 * 100% styled with @nofinite/nuicss design tokens and semantic superclasses.
 */

import { Editor } from '@tiptap/core';
import { getMarkonExtensions } from './extensions';
import { createBubbleMenuExtension } from './bubbleMenu';
import { createSlashCommandExtension } from './slashCommand';

export interface MarkonEditorOptions {
  element?: HTMLElement;
  name?: string;
  placeholder?: string;
  initialValue?: string;
  minHeight?: string;
  readOnly?: boolean;
  showWordCount?: boolean;
  showSaveStatus?: boolean;
  showBubbleMenu?: boolean;
  showSlashCommands?: boolean;
  onChange?: (html: string, json: any, text: string) => void;
  onSave?: (html: string, json: any) => void;
}

export function getCounts(text: string): { words: number; characters: number } {
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
  const characters = text.length;
  return { words, characters };
}

export function renderMarkonEditor(options: MarkonEditorOptions = {}): string {
  const name = options.name || 'content';
  const minHeight = options.minHeight || '220px';
  const showWordCount = options.showWordCount !== false;
  const showSaveStatus = options.showSaveStatus !== false;

  const initialCounts = getCounts(
    (options.initialValue || '').replace(/<[^>]*>/g, '')
  );

  return `
    <div class="editor markon-editor w-full rounded-xl border border-default bg-surface shadow-sm overflow-hidden font-sans focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all"
         data-editor-name="${name}">
      <!-- Formatting Toolbar -->
      <div class="editor-toolbar flex flex-wrap items-center gap-1 p-2 border-b border-default bg-subtle/40 select-none sticky top-0 z-10" role="toolbar" aria-label="Editor Toolbar">
        <!-- History -->
        <button type="button" class="editor-btn btn btn-ghost btn-sm btn-icon" data-command="undo" title="Undo (Ctrl+Z)">
          <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 7v6h6"></path>
            <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"></path>
          </svg>
        </button>
        <button type="button" class="editor-btn btn btn-ghost btn-sm btn-icon" data-command="redo" title="Redo (Ctrl+Y)">
          <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 7v6h-6"></path>
            <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"></path>
          </svg>
        </button>

        <span class="w-px h-5 bg-border mx-1 self-center shrink-0"></span>

        <!-- Text Type Selector -->
        <select class="editor-select text-xs font-medium bg-transparent border border-default rounded-md px-2 py-1 text-default cursor-pointer outline-none hover:bg-subtle focus:border-primary"
                data-command="formatBlock" title="Text Style">
          <option value="p">Paragraph</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="blockquote">Quote</option>
          <option value="codeBlock">Code Block</option>
        </select>

        <span class="w-px h-5 bg-border mx-1 self-center shrink-0"></span>

        <!-- Basic Marks -->
        <button type="button" class="editor-btn btn btn-ghost btn-sm btn-icon" data-command="bold" title="Bold (Ctrl+B)">
          <span class="font-bold text-sm">B</span>
        </button>
        <button type="button" class="editor-btn btn btn-ghost btn-sm btn-icon" data-command="italic" title="Italic (Ctrl+I)">
          <span class="italic text-sm">I</span>
        </button>
        <button type="button" class="editor-btn btn btn-ghost btn-sm btn-icon" data-command="underline" title="Underline (Ctrl+U)">
          <span class="underline text-sm">U</span>
        </button>
        <button type="button" class="editor-btn btn btn-ghost btn-sm btn-icon" data-command="strikeThrough" title="Strikethrough">
          <span class="line-through text-sm">S</span>
        </button>
        <button type="button" class="editor-btn btn btn-ghost btn-sm btn-icon" data-command="code" title="Inline Code">
          <span class="font-mono text-xs">&lt;/&gt;</span>
        </button>
        <button type="button" class="editor-btn btn btn-ghost btn-sm btn-icon" data-command="highlight" title="Highlight">
          <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m9 11-6 6v3h3l6-6"></path>
            <path d="m22 2-2.7 2.7a2.4 2.4 0 0 0 0 3.4l1.6 1.6a2.4 2.4 0 0 1 0 3.4L18 16"></path>
          </svg>
        </button>

        <span class="w-px h-5 bg-border mx-1 self-center shrink-0"></span>

        <!-- Alignment -->
        <button type="button" class="editor-btn btn btn-ghost btn-sm btn-icon" data-command="justifyLeft" title="Align Left">
          <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="21" y1="6" x2="3" y2="6"></line>
            <line x1="15" y1="12" x2="3" y2="12"></line>
            <line x1="17" y1="18" x2="3" y2="18"></line>
          </svg>
        </button>
        <button type="button" class="editor-btn btn btn-ghost btn-sm btn-icon" data-command="justifyCenter" title="Align Center">
          <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="6"></line>
            <line x1="21" y1="12" x2="3" y2="12"></line>
            <line x1="18" y1="18" x2="6" y2="18"></line>
          </svg>
        </button>
        <button type="button" class="editor-btn btn btn-ghost btn-sm btn-icon" data-command="justifyRight" title="Align Right">
          <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="21" y1="6" x2="3" y2="6"></line>
            <line x1="21" y1="12" x2="9" y2="12"></line>
            <line x1="21" y1="18" x2="7" y2="18"></line>
          </svg>
        </button>

        <span class="w-px h-5 bg-border mx-1 self-center shrink-0"></span>

        <!-- Lists -->
        <button type="button" class="editor-btn btn btn-ghost btn-sm btn-icon" data-command="insertUnorderedList" title="Bullet List">
          <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="9" y1="6" x2="20" y2="6"></line>
            <line x1="9" y1="12" x2="20" y2="12"></line>
            <line x1="9" y1="18" x2="20" y2="18"></line>
            <circle cx="4" cy="6" r="1.5" fill="currentColor"></circle>
            <circle cx="4" cy="12" r="1.5" fill="currentColor"></circle>
            <circle cx="4" cy="18" r="1.5" fill="currentColor"></circle>
          </svg>
        </button>
        <button type="button" class="editor-btn btn btn-ghost btn-sm btn-icon" data-command="insertOrderedList" title="Numbered List">
          <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="10" y1="6" x2="21" y2="6"></line>
            <line x1="10" y1="12" x2="21" y2="12"></line>
            <line x1="10" y1="18" x2="21" y2="18"></line>
            <text x="2" y="7" font-size="7" font-weight="bold" fill="currentColor">1</text>
            <text x="2" y="13" font-size="7" font-weight="bold" fill="currentColor">2</text>
            <text x="2" y="19" font-size="7" font-weight="bold" fill="currentColor">3</text>
          </svg>
        </button>
        <button type="button" class="editor-btn btn btn-ghost btn-sm btn-icon" data-command="insertTaskList" title="Task List">
          <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 11 12 14 22 4"></polyline>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
          </svg>
        </button>

        <span class="w-px h-5 bg-border mx-1 self-center shrink-0"></span>

        <!-- Blocks & Inserts -->
        <button type="button" class="editor-btn btn btn-ghost btn-sm btn-icon" data-command="insertTable" title="Insert Table (3x3)">
          <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2"></rect>
            <path d="M3 9h18"></path>
            <path d="M3 15h18"></path>
            <path d="M9 3v18"></path>
            <path d="M15 3v18"></path>
          </svg>
        </button>
        <button type="button" class="editor-btn btn btn-ghost btn-sm btn-icon" data-command="insertMath" title="Insert Math Formula (LaTeX)">
          <span class="font-serif font-bold text-sm italic">Σ</span>
        </button>
        <button type="button" class="editor-btn btn btn-ghost btn-sm btn-icon" data-command="insertCodeBlock" title="Code Block">
          <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
          </svg>
        </button>
        <button type="button" class="editor-btn btn btn-ghost btn-sm btn-icon" data-command="horizontalRule" title="Horizontal Divider">
          <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
          </svg>
        </button>
        <button type="button" class="editor-btn btn btn-ghost btn-sm btn-icon" data-command="createLink" title="Insert Link">
          <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
        </button>

        <!-- Table Operations Group (Hidden when not in table) -->
        <span class="editor-table-tools hidden flex items-center gap-1 ml-auto">
          <span class="w-px h-5 bg-border mx-1 self-center shrink-0"></span>
          <button type="button" class="editor-btn btn btn-ghost btn-sm px-2 text-xs" data-command="addRowAfter" title="Add Row Below">+Row</button>
          <button type="button" class="editor-btn btn btn-ghost btn-sm px-2 text-xs" data-command="deleteRow" title="Delete Row">-Row</button>
          <button type="button" class="editor-btn btn btn-ghost btn-sm px-2 text-xs" data-command="addColumnAfter" title="Add Column Right">+Col</button>
          <button type="button" class="editor-btn btn btn-ghost btn-sm px-2 text-xs" data-command="deleteColumn" title="Delete Column">-Col</button>
          <button type="button" class="editor-btn btn btn-ghost btn-sm px-2 text-xs text-danger hover:bg-danger/10" data-command="deleteTable" title="Delete Entire Table">Del Table</button>
        </span>
      </div>

      <!-- Editable Canvas (Empty container: TipTap mounts cleanly inside without duplicating initialValue) -->
      <div class="editor-content markon-content p-4 outline-none text-default leading-relaxed text-sm overflow-y-auto"
           style="min-height: ${minHeight}"></div>

      <!-- Status Footer -->
      <div class="editor-footer flex items-center justify-between px-3 py-2 border-t border-default text-xs text-muted bg-subtle select-none">
        <div class="flex items-center gap-2">
          ${
            showSaveStatus
              ? `
            <div class="editor-save-status flex items-center gap-1.5 text-xs text-muted">
              <span class="w-2 h-2 rounded-full bg-primary inline-block shrink-0"></span>
              <span class="editor-save-text">Saved</span>
            </div>
          `
              : ''
          }
        </div>
        <div class="flex items-center gap-3">
          ${
            showWordCount
              ? `
            <span class="editor-word-count">${initialCounts.words} words</span>
            <span class="editor-char-count">${initialCounts.characters} characters</span>
          `
              : ''
          }
        </div>
      </div>
      <input type="hidden" name="${name}" class="editor-hidden-input" value="" />
    </div>
  `.trim();
}

export class MarkonEditor {
  public element: HTMLElement;
  public tiptap: Editor;
  public options: MarkonEditorOptions;

  constructor(options: MarkonEditorOptions = {}) {
    this.options = options;

    if (options.element) {
      this.element = options.element;
    } else {
      const container = document.createElement('div');
      container.innerHTML = renderMarkonEditor(options);
      this.element = container.firstElementChild as HTMLElement;
    }

    // Ensure markup exists inside element
    if (!this.element.querySelector('.editor-content')) {
      this.element.innerHTML = renderMarkonEditor(options);
    }

    const contentEl =
      this.element.querySelector<HTMLElement>('.editor-content') ||
      this.element;

    // Crucial: Clear any accidental static children to prevent double-rendering
    contentEl.innerHTML = '';

    const placeholder =
      options.placeholder || 'Write something amazing… (type / for commands)';
    const initialContent = options.initialValue || '';

    const extensions = getMarkonExtensions(placeholder);
    if (options.showSlashCommands !== false) {
      extensions.push(createSlashCommandExtension());
    }
    if (options.showBubbleMenu !== false) {
      extensions.push(createBubbleMenuExtension());
    }

    this.tiptap = new Editor({
      element: contentEl,
      extensions,
      content: initialContent,
      editable: !options.readOnly,
      onUpdate: ({ editor }) => {
        const html = editor.getHTML();
        const json = editor.getJSON();
        const text = editor.getText();

        this.updateFooter(text);
        options.onChange?.(html, json, text);

        this.element.dispatchEvent(
          new CustomEvent('markon:change', {
            detail: { html, json, text },
            bubbles: true,
          })
        );
      },
      onSelectionUpdate: () => {
        this.updateToolbarState();
      },
      onTransaction: () => {
        this.updateToolbarState();
      },
    });

    this.attachEvents();
    this.updateToolbarState();
    this.updateFooter(this.tiptap.getText());
  }

  public updateToolbarState(): void {
    const toolbar = this.element.querySelector<HTMLElement>('.editor-toolbar');
    if (!toolbar) return;

    const setBtnActive = (cmd: string, isActive: boolean) => {
      const btn = toolbar.querySelector<HTMLButtonElement>(
        `.editor-btn[data-command="${cmd}"]`
      );
      if (btn) {
        if (isActive) {
          btn.classList.add('btn-active');
          btn.setAttribute('aria-pressed', 'true');
        } else {
          btn.classList.remove('btn-active');
          btn.setAttribute('aria-pressed', 'false');
        }
      }
    };

    setBtnActive('bold', this.tiptap.isActive('bold'));
    setBtnActive('italic', this.tiptap.isActive('italic'));
    setBtnActive('underline', this.tiptap.isActive('underline'));
    setBtnActive('strikeThrough', this.tiptap.isActive('strike'));
    setBtnActive('code', this.tiptap.isActive('code'));
    setBtnActive('highlight', this.tiptap.isActive('highlight'));
    setBtnActive('justifyLeft', this.tiptap.isActive({ textAlign: 'left' }));
    setBtnActive(
      'justifyCenter',
      this.tiptap.isActive({ textAlign: 'center' })
    );
    setBtnActive('justifyRight', this.tiptap.isActive({ textAlign: 'right' }));
    setBtnActive('insertUnorderedList', this.tiptap.isActive('bulletList'));
    setBtnActive('insertOrderedList', this.tiptap.isActive('orderedList'));
    setBtnActive('insertTaskList', this.tiptap.isActive('taskList'));
    setBtnActive('insertCodeBlock', this.tiptap.isActive('codeBlock'));
    setBtnActive('insertMath', this.tiptap.isActive('mathBlock'));
    setBtnActive('createLink', this.tiptap.isActive('link'));

    // Sync Text Style Dropdown
    const select = toolbar.querySelector<HTMLSelectElement>('.editor-select');
    if (select) {
      if (this.tiptap.isActive('heading', { level: 1 })) select.value = 'h1';
      else if (this.tiptap.isActive('heading', { level: 2 }))
        select.value = 'h2';
      else if (this.tiptap.isActive('heading', { level: 3 }))
        select.value = 'h3';
      else if (this.tiptap.isActive('blockquote')) select.value = 'blockquote';
      else if (this.tiptap.isActive('codeBlock')) select.value = 'codeBlock';
      else select.value = 'p';
    }

    // Toggle Table Tools
    const tableTools = toolbar.querySelector<HTMLElement>(
      '.editor-table-tools'
    );
    if (tableTools) {
      if (this.tiptap.isActive('table')) {
        tableTools.classList.remove('hidden');
      } else {
        tableTools.classList.add('hidden');
      }
    }
  }

  private updateFooter(text: string): void {
    const counts = getCounts(text);
    const wordEl =
      this.element.querySelector<HTMLElement>('.editor-word-count');
    const charEl =
      this.element.querySelector<HTMLElement>('.editor-char-count');
    if (wordEl) wordEl.textContent = `${counts.words} words`;
    if (charEl) charEl.textContent = `${counts.characters} characters`;

    const hiddenInput = this.element.querySelector<HTMLInputElement>(
      '.editor-hidden-input'
    );
    if (hiddenInput) {
      hiddenInput.value = this.tiptap.getHTML();
    }
  }

  private attachEvents(): void {
    const toolbar = this.element.querySelector<HTMLElement>('.editor-toolbar');
    if (!toolbar) return;

    toolbar.addEventListener('click', (e: MouseEvent) => {
      const btn = (e.target as HTMLElement).closest<HTMLButtonElement>(
        '.editor-btn'
      );
      if (!btn) return;
      e.preventDefault();

      const cmd = btn.getAttribute('data-command');
      if (cmd) {
        this.execCommand(cmd);
      }
    });

    toolbar.addEventListener('change', (e: Event) => {
      const select = e.target as HTMLSelectElement;
      if (select?.classList?.contains('editor-select')) {
        const val = select.value;
        if (val === 'p') this.tiptap.chain().focus().setParagraph().run();
        else if (val === 'h1')
          this.tiptap.chain().focus().toggleHeading({ level: 1 }).run();
        else if (val === 'h2')
          this.tiptap.chain().focus().toggleHeading({ level: 2 }).run();
        else if (val === 'h3')
          this.tiptap.chain().focus().toggleHeading({ level: 3 }).run();
        else if (val === 'blockquote')
          this.tiptap.chain().focus().toggleBlockquote().run();
        else if (val === 'codeBlock')
          this.tiptap.chain().focus().toggleCodeBlock().run();
      }
    });
  }

  public execCommand(cmd: string, _val: any = null): void {
    const chain = this.tiptap.chain().focus();
    switch (cmd) {
      case 'undo':
        chain.undo().run();
        break;
      case 'redo':
        chain.redo().run();
        break;
      case 'bold':
        chain.toggleBold().run();
        break;
      case 'italic':
        chain.toggleItalic().run();
        break;
      case 'underline':
        chain.toggleUnderline().run();
        break;
      case 'strikeThrough':
        chain.toggleStrike().run();
        break;
      case 'code':
        chain.toggleCode().run();
        break;
      case 'highlight':
        chain.toggleHighlight().run();
        break;
      case 'justifyLeft':
        chain.setTextAlign('left').run();
        break;
      case 'justifyCenter':
        chain.setTextAlign('center').run();
        break;
      case 'justifyRight':
        chain.setTextAlign('right').run();
        break;
      case 'insertUnorderedList':
        chain.toggleBulletList().run();
        break;
      case 'insertOrderedList':
        chain.toggleOrderedList().run();
        break;
      case 'insertTaskList':
        chain.toggleTaskList().run();
        break;
      case 'insertTable':
        chain.insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
        break;
      case 'addRowAfter':
        chain.addRowAfter().run();
        break;
      case 'deleteRow':
        chain.deleteRow().run();
        break;
      case 'addColumnAfter':
        chain.addColumnAfter().run();
        break;
      case 'deleteColumn':
        chain.deleteColumn().run();
        break;
      case 'deleteTable':
        chain.deleteTable().run();
        break;
      case 'insertCodeBlock':
        chain.toggleCodeBlock().run();
        break;
      case 'insertMath':
        chain.insertContent({ type: 'mathBlock' }).run();
        break;
      case 'horizontalRule':
        chain.setHorizontalRule().run();
        break;
      case 'createLink': {
        const prevUrl = this.tiptap.getAttributes('link').href;
        const url =
          typeof window !== 'undefined'
            ? window.prompt('Enter link URL:', prevUrl || 'https://')
            : null;
        if (url) chain.setLink({ href: url }).run();
        else if (url === '') chain.unsetLink().run();
        break;
      }
    }
    this.updateToolbarState();
  }

  public getHTML(): string {
    return this.tiptap.getHTML();
  }

  public getJSON(): any {
    return this.tiptap.getJSON();
  }

  public getText(): string {
    return this.tiptap.getText();
  }

  public setContent(content: string, emitUpdate = false): void {
    this.tiptap.commands.setContent(content, { emitUpdate });
    this.updateFooter(this.tiptap.getText());
    this.updateToolbarState();
  }

  public focus(): void {
    this.tiptap.commands.focus();
  }

  public destroy(): void {
    this.tiptap.destroy();
  }
}
