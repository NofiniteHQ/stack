/**
 * @nofinite/markon - Universal Content & Rich Text Authoring Engine
 * Framework-agnostic Vanilla DOM class powered by TipTap and ProseMirror.
 * 100% styled with @nofinite/nuicss design tokens and semantic superclasses.
 */

import { Editor } from '@tiptap/core';
import { getMarkonExtensions } from './extensions';
import { createBubbleMenuExtension } from './bubbleMenu';
import { createSlashCommandExtension } from './slashCommand';
import { openMarkonModal } from './dialog';
import { MarkonTypographyMenu } from './typographyMenu';
import { MarkonDragHandle } from './dragHandle';
import {
  MarkonFontFamilyMenu,
  MarkonFontSizeMenu,
  MarkonHighlightMenu,
  MarkonTextColorMenu,
} from './toolbarMenus';
import { closeAllPopovers } from './popoverManager';

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
    <div class="editor markon-editor relative w-full rounded-xl border border-default bg-surface shadow-sm overflow-hidden font-sans focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all"
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

        <!-- Typography / Headings (Icon-only) -->
        <button type="button" class="editor-typography-trigger editor-btn btn btn-ghost btn-sm btn-icon"
                title="Text Style" aria-haspopup="true" aria-expanded="false">
          <span class="editor-typography-icon font-mono font-bold text-xs text-primary shrink-0">¶</span>
        </button>

        <!-- Font Family Selector -->
        <button type="button" class="editor-font-family-trigger editor-btn btn btn-ghost btn-sm btn-icon"
                title="Font Family" aria-haspopup="true" aria-expanded="false">
          <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="4 7 4 4 20 4 20 7"></polyline>
            <line x1="9" y1="20" x2="15" y2="20"></line>
            <line x1="12" y1="4" x2="12" y2="20"></line>
          </svg>
        </button>

        <!-- Font Size Selector -->
        <button type="button" class="editor-font-size-trigger editor-btn btn btn-ghost btn-sm btn-icon"
                title="Font Size" aria-haspopup="true" aria-expanded="false">
          <span class="font-sans font-bold text-xs leading-none">A↕</span>
        </button>

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
        <button type="button" class="editor-btn btn btn-ghost btn-sm btn-icon" data-command="subscript" title="Subscript">
          <span class="text-xs font-semibold">X₂</span>
        </button>
        <button type="button" class="editor-btn btn btn-ghost btn-sm btn-icon" data-command="superscript" title="Superscript">
          <span class="text-xs font-semibold">X²</span>
        </button>
        <button type="button" class="editor-btn btn btn-ghost btn-sm btn-icon" data-command="code" title="Inline Code">
          <span class="font-mono text-xs">&lt;/&gt;</span>
        </button>
        <button type="button" class="editor-btn btn btn-ghost btn-sm btn-icon" data-command="clearFormatting" title="Clear Formatting">
          <span class="text-xs font-semibold text-muted hover:text-danger">T⃠</span>
        </button>

        <span class="w-px h-5 bg-border mx-1 self-center shrink-0"></span>

        <!-- Colors: Text Color & Highlight -->
        <button type="button" class="editor-color-trigger editor-btn btn btn-ghost btn-sm btn-icon" title="Text Color" aria-haspopup="true" aria-expanded="false">
          <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle>
            <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle>
            <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle>
            <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle>
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path>
          </svg>
        </button>
        <button type="button" class="editor-highlight-trigger editor-btn btn btn-ghost btn-sm btn-icon" title="Highlight Color" aria-haspopup="true" aria-expanded="false">
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
        <button type="button" class="editor-btn btn btn-ghost btn-sm btn-icon" data-command="justifyFull" title="Justify">
          <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="21" y1="6" x2="3" y2="6"></line>
            <line x1="21" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="18" x2="3" y2="18"></line>
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
        <button type="button" class="editor-btn btn btn-ghost btn-sm btn-icon" data-command="insertImage" title="Insert Image">
          <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
            <circle cx="9" cy="9" r="2"/>
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
          </svg>
        </button>

        <!-- Table Operations Group (Hidden when not in table) -->
        <span class="editor-table-tools hidden items-center gap-0.5 px-1 py-0.5 rounded-lg bg-subtle/80 border border-default/60">
          <button type="button" class="editor-btn btn btn-ghost btn-sm px-1.5 py-0.5 text-xs" data-command="addRowAfter" title="Add Row Below">+Row</button>
          <button type="button" class="editor-btn btn btn-ghost btn-sm px-1.5 py-0.5 text-xs" data-command="deleteRow" title="Delete Row">-Row</button>
          <button type="button" class="editor-btn btn btn-ghost btn-sm px-1.5 py-0.5 text-xs" data-command="addColumnAfter" title="Add Column Right">+Col</button>
          <button type="button" class="editor-btn btn btn-ghost btn-sm px-1.5 py-0.5 text-xs" data-command="deleteColumn" title="Delete Column">-Col</button>
          <button type="button" class="editor-btn btn btn-ghost btn-sm px-1.5 py-0.5 text-xs text-danger hover:bg-danger/10" data-command="deleteTable" title="Delete Entire Table">Del Table</button>
        </span>

        <input type="file" class="editor-image-file-input hidden" accept="image/*" />
      </div>

      <!-- Editable Canvas -->
      <div class="editor-content markon-content relative pl-8 pr-4 py-4 outline-none text-default leading-relaxed text-sm overflow-y-auto"
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
  public typographyMenu?: MarkonTypographyMenu;
  public fontFamilyMenu?: MarkonFontFamilyMenu;
  public fontSizeMenu?: MarkonFontSizeMenu;
  public highlightMenu?: MarkonHighlightMenu;
  public textColorMenu?: MarkonTextColorMenu;
  public dragHandle?: MarkonDragHandle;

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

    const typographyTrigger = this.element.querySelector<HTMLElement>(
      '.editor-typography-trigger'
    );
    if (typographyTrigger) {
      this.typographyMenu = new MarkonTypographyMenu(
        this.tiptap,
        typographyTrigger
      );
    }

    const fontFamilyTrigger = this.element.querySelector<HTMLElement>(
      '.editor-font-family-trigger'
    );
    if (fontFamilyTrigger) {
      this.fontFamilyMenu = new MarkonFontFamilyMenu(
        this.tiptap,
        fontFamilyTrigger
      );
    }

    const fontSizeTrigger = this.element.querySelector<HTMLElement>(
      '.editor-font-size-trigger'
    );
    if (fontSizeTrigger) {
      this.fontSizeMenu = new MarkonFontSizeMenu(this.tiptap, fontSizeTrigger);
    }

    const colorTrigger = this.element.querySelector<HTMLElement>(
      '.editor-color-trigger'
    );
    if (colorTrigger) {
      this.textColorMenu = new MarkonTextColorMenu(this.tiptap, colorTrigger);
    }

    const highlightTrigger = this.element.querySelector<HTMLElement>(
      '.editor-highlight-trigger'
    );
    if (highlightTrigger) {
      this.highlightMenu = new MarkonHighlightMenu(
        this.tiptap,
        highlightTrigger
      );
    }

    if (!options.readOnly) {
      this.dragHandle = new MarkonDragHandle({
        editor: this.tiptap,
        container: contentEl,
      });
    }

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
    setBtnActive('subscript', this.tiptap.isActive('subscript'));
    setBtnActive('superscript', this.tiptap.isActive('superscript'));
    setBtnActive('code', this.tiptap.isActive('code'));
    setBtnActive('highlight', this.tiptap.isActive('highlight'));
    setBtnActive('justifyLeft', this.tiptap.isActive({ textAlign: 'left' }));
    setBtnActive(
      'justifyCenter',
      this.tiptap.isActive({ textAlign: 'center' })
    );
    setBtnActive('justifyRight', this.tiptap.isActive({ textAlign: 'right' }));
    setBtnActive('justifyFull', this.tiptap.isActive({ textAlign: 'justify' }));
    setBtnActive('insertUnorderedList', this.tiptap.isActive('bulletList'));
    setBtnActive('insertOrderedList', this.tiptap.isActive('orderedList'));
    setBtnActive('insertTaskList', this.tiptap.isActive('taskList'));
    setBtnActive('insertCodeBlock', this.tiptap.isActive('codeBlock'));
    setBtnActive('insertMath', this.tiptap.isActive('mathBlock'));
    setBtnActive('createLink', this.tiptap.isActive('link'));

    // Sync Custom Typography Selector
    this.typographyMenu?.updateTriggerState();

    // Toggle Table Tools
    const tableTools = toolbar.querySelector<HTMLElement>(
      '.editor-table-tools'
    );
    if (tableTools) {
      if (this.tiptap.isActive('table')) {
        tableTools.classList.remove('hidden');
        tableTools.classList.add('flex');
      } else {
        tableTools.classList.add('hidden');
        tableTools.classList.remove('flex');
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

    // Prevent focus loss from editor when clicking ANY toolbar button
    toolbar.addEventListener('mousedown', (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
      e.preventDefault();
    });

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

    const fileInput = toolbar.querySelector<HTMLInputElement>(
      '.editor-image-file-input'
    );
    if (fileInput) {
      fileInput.addEventListener('change', () => {
        const file = fileInput.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (readerEvent) => {
            const dataUrl = readerEvent.target?.result as string;
            if (dataUrl) {
              this.tiptap.chain().focus().setImage({ src: dataUrl }).run();
            }
          };
          reader.readAsDataURL(file);
          fileInput.value = '';
        }
      });
    }
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
      case 'subscript':
        chain.toggleSubscript().run();
        break;
      case 'superscript':
        chain.toggleSuperscript().run();
        break;
      case 'code':
        chain.toggleCode().run();
        break;
      case 'clearFormatting':
        chain.clearNodes().unsetAllMarks().run();
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
      case 'justifyFull':
        chain.setTextAlign('justify').run();
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
      case 'insertMath': {
        if (_val && typeof _val === 'string') {
          this.tiptap
            .chain()
            .focus()
            .insertContent({
              type: 'mathBlock',
              attrs: { equation: _val.trim() },
            })
            .run();
          this.updateToolbarState();
          break;
        }
        const { from, to } = this.tiptap.state.selection;
        openMarkonModal({
          title: 'Insert Math Formula (LaTeX)',
          label: 'LaTeX Formula',
          initialValue: 'E = mc^2',
          placeholder: 'e.g. \\sum_{i=1}^n x_i',
          confirmText: 'Insert Formula',
          onConfirm: (eq) => {
            if (eq && eq.trim()) {
              const chain = this.tiptap.chain().focus();
              if (from !== undefined && to !== undefined) {
                chain.setTextSelection({ from, to });
              }
              chain
                .insertContent({
                  type: 'mathBlock',
                  attrs: { equation: eq.trim() },
                })
                .run();
            }
            this.updateToolbarState();
          },
          onCancel: () => {
            if (from !== undefined && to !== undefined) {
              this.tiptap.chain().focus().setTextSelection({ from, to }).run();
            } else {
              this.tiptap.commands.focus();
            }
          },
        });
        break;
      }
      case 'horizontalRule':
        chain.setHorizontalRule().run();
        break;
      case 'createLink': {
        if (_val && typeof _val === 'string') {
          this.tiptap.chain().focus().setLink({ href: _val.trim() }).run();
          this.updateToolbarState();
          break;
        }
        const { from, to } = this.tiptap.state.selection;
        const prevUrl = this.tiptap.getAttributes('link').href || '';
        openMarkonModal({
          title: prevUrl ? 'Edit Link' : 'Insert Link',
          label: 'URL',
          initialValue: prevUrl || 'https://',
          placeholder: 'https://example.com',
          confirmText: prevUrl ? 'Update Link' : 'Add Link',
          onConfirm: (url) => {
            const cmdChain = this.tiptap.chain().focus();
            if (from !== undefined && to !== undefined) {
              cmdChain.setTextSelection({ from, to });
            }
            if (url && url.trim()) {
              cmdChain.setLink({ href: url.trim() }).run();
            } else {
              cmdChain.unsetLink().run();
            }
            this.updateToolbarState();
          },
          onCancel: () => {
            if (from !== undefined && to !== undefined) {
              this.tiptap.chain().focus().setTextSelection({ from, to }).run();
            } else {
              this.tiptap.commands.focus();
            }
          },
        });
        break;
      }
      case 'insertImage': {
        if (_val && typeof _val === 'string') {
          this.tiptap.chain().focus().setImage({ src: _val.trim() }).run();
          this.updateToolbarState();
          break;
        }
        const { from, to } = this.tiptap.state.selection;
        openMarkonModal({
          title: 'Insert Image',
          label: 'Image URL (or leave blank to pick a file)',
          initialValue: 'https://',
          placeholder: 'https://example.com/photo.jpg',
          confirmText: 'Insert Image',
          onConfirm: (src) => {
            const imgChain = this.tiptap.chain().focus();
            if (from !== undefined && to !== undefined) {
              imgChain.setTextSelection({ from, to });
            }
            if (src && src.trim() && src !== 'https://') {
              imgChain.setImage({ src: src.trim() }).run();
            } else {
              const fileInput = this.element.querySelector<HTMLInputElement>(
                '.editor-image-file-input'
              );
              fileInput?.click();
            }
            this.updateToolbarState();
          },
          onCancel: () => {
            if (from !== undefined && to !== undefined) {
              this.tiptap.chain().focus().setTextSelection({ from, to }).run();
            } else {
              this.tiptap.commands.focus();
            }
          },
        });
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
    closeAllPopovers();
    this.fontFamilyMenu?.destroy();
    this.fontSizeMenu?.destroy();
    this.highlightMenu?.destroy();
    this.textColorMenu?.destroy();
    this.typographyMenu?.destroy();
    this.dragHandle?.destroy();
    this.tiptap.destroy();
  }
}
