/**
 * @nofinite/markon - Universal Content & Rich Text Authoring Engine
 * Framework-agnostic Vanilla DOM class powered by @tiptap/core and ProseMirror.
 * 100% styled with @nofinite/nuicss design tokens.
 */

import { Editor, type AnyExtension } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import CharacterCount from '@tiptap/extension-character-count';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Image from '@tiptap/extension-image';

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

export function getMarkonExtensions(placeholder?: string): AnyExtension[] {
  return [
    StarterKit.configure({
      heading: { levels: [1, 2, 3] },
      codeBlock: false,
      link: false,
      underline: false,
    }),
    Placeholder.configure({
      placeholder:
        placeholder || 'Write something amazing… (type / for commands)',
    }),
    Link.configure({
      openOnClick: false,
      HTMLAttributes: { class: 'link' },
    }),
    Underline,
    TextStyle,
    Color,
    Highlight.configure({ multicolor: true }),
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    TaskList.configure({
      HTMLAttributes: { class: 'task-list list-none p-0 my-2 space-y-1' },
    }),
    TaskItem.configure({
      nested: true,
      HTMLAttributes: { class: 'task-item flex items-center gap-2' },
    }),
    CharacterCount,
    Table.configure({
      resizable: true,
      HTMLAttributes: {
        class:
          'table border border-default w-full my-3 rounded-lg overflow-hidden text-sm',
      },
    }),
    TableRow,
    TableHeader.configure({
      HTMLAttributes: {
        class: 'border border-default p-2 text-left bg-subtle/50 font-semibold',
      },
    }),
    TableCell.configure({
      HTMLAttributes: { class: 'border border-default p-2' },
    }),
    Subscript,
    Superscript,
    Image.configure({
      inline: true,
      HTMLAttributes: { class: 'rounded-lg max-w-full my-2' },
    }),
  ];
}

export function renderMarkonEditor(options: MarkonEditorOptions = {}): string {
  const name = options.name || 'content';
  const placeholder =
    options.placeholder || 'Write something amazing… (type / for commands)';
  const initialValue = options.initialValue || '';
  const minHeight = options.minHeight || '220px';
  const showWordCount = options.showWordCount !== false;
  const showSaveStatus = options.showSaveStatus !== false;

  const initialCounts = getCounts(initialValue.replace(/<[^>]*>/g, ''));

  return `
    <div class="editor markon-editor tiptap-wrapper w-full rounded-xl border border-default bg-surface shadow-sm overflow-hidden font-sans focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all"
         data-editor-name="${name}">
      <!-- Formatting Toolbar -->
      <div class="editor-toolbar flex flex-wrap items-center gap-1 p-2 border-b border-default bg-surface select-none sticky top-0 z-10">
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

        <span class="w-px h-5 bg-[var(--border-default)] mx-1 self-center shrink-0"></span>

        <!-- Text Type Selector -->
        <select class="editor-select text-xs font-medium bg-transparent border border-default rounded-md px-2 py-1 text-default cursor-pointer outline-none hover:bg-subtle focus:border-primary"
                data-command="formatBlock" title="Text Style">
          <option value="p">Paragraph</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="blockquote">Quote</option>
        </select>

        <span class="w-px h-5 bg-[var(--border-default)] mx-1 self-center shrink-0"></span>

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

        <span class="w-px h-5 bg-[var(--border-default)] mx-1 self-center shrink-0"></span>

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

        <span class="w-px h-5 bg-[var(--border-default)] mx-1 self-center shrink-0"></span>

        <!-- Lists & Blocks -->
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
        <button type="button" class="editor-btn btn btn-ghost btn-sm btn-icon" data-command="insertTable" title="Insert Table (3x3)">
          <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2"></rect>
            <path d="M3 9h18"></path>
            <path d="M3 15h18"></path>
            <path d="M9 3v18"></path>
            <path d="M15 3v18"></path>
          </svg>
        </button>
        <button type="button" class="editor-btn btn btn-ghost btn-sm btn-icon" data-command="createLink" title="Insert Link">
          <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
        </button>
      </div>

      <!-- Editable Canvas -->
      <div class="editor-content markon-content tiptap p-4 outline-none text-default leading-relaxed text-sm overflow-y-auto"
           contenteditable="${options.readOnly ? 'false' : 'true'}"
           spellcheck="true"
           data-placeholder="${placeholder}"
           style="min-height: ${minHeight}">
        ${initialValue}
      </div>

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
      <input type="hidden" name="${name}" class="editor-hidden-input" value="${encodeURIComponent(
    initialValue
  )}" />
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
    const placeholder =
      options.placeholder || 'Write something amazing… (type / for commands)';
    const initialContent =
      options.initialValue || contentEl.innerHTML.trim() || '';

    this.tiptap = new Editor({
      element: contentEl,
      extensions: getMarkonExtensions(placeholder),
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
    });

    this.attachEvents();
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
      case 'justifyLeft':
        chain.setTextAlign('left').run();
        break;
      case 'justifyCenter':
        chain.setTextAlign('center').run();
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
      case 'createLink': {
        const url =
          typeof window !== 'undefined'
            ? window.prompt('Enter link URL:')
            : null;
        if (url) chain.setLink({ href: url }).run();
        break;
      }
    }
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

  public setContent(content: string): void {
    this.tiptap.commands.setContent(content);
    this.updateFooter(this.tiptap.getText());
  }

  public focus(): void {
    this.tiptap.commands.focus();
  }

  public destroy(): void {
    this.tiptap.destroy();
  }
}
