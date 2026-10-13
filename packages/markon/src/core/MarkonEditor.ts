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
import { MarkonTableMenu } from './tableMenu';
import { formatFileSize } from './fileAttachment';
import { closeAllPopovers } from './popoverManager';
import {
  MarkonDraftManager,
  type AutoSaveConfig,
  type SaveStatusState,
} from './draftManager';
import { htmlToMarkdown, markdownToHtml } from './markdown';
import { ensureMarkonStyles } from './styleInjector';

export type { AutoSaveConfig, SaveStatusState };

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
  autoSave?: boolean | AutoSaveConfig;
  onUploadFile?: (
    file: File
  ) => Promise<string | { url: string; name?: string; size?: number | string }>;
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
  ensureMarkonStyles();
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

        <!-- Typography / Headings Dropdown -->
        <button type="button" class="editor-typography-trigger editor-btn btn btn-ghost btn-sm btn-icon"
                title="Text Style: Paragraph" aria-haspopup="true" aria-expanded="false">
          <span class="editor-typography-icon font-mono font-bold text-xs text-primary shrink-0">¶</span>
          <span class="editor-typography-label sr-only">Paragraph</span>
        </button>

        <!-- Font Family Selector -->
        <button type="button" class="editor-font-family-trigger editor-btn btn btn-ghost btn-sm btn-icon"
                title="Font Family" aria-haspopup="true" aria-expanded="false">
          <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 20h16"></path>
            <path d="m6 16 6-12 6 12"></path>
            <path d="M8 12h8"></path>
          </svg>
        </button>

        <!-- Font Size Selector -->
        <button type="button" class="editor-font-size-trigger editor-btn btn btn-ghost btn-sm btn-icon"
                title="Font Size" aria-haspopup="true" aria-expanded="false">
          <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 7V4h12v3"></path>
            <path d="M10 4v16"></path>
            <path d="M16 13v-2h6v2"></path>
            <path d="M19 11v9"></path>
          </svg>
        </button>

        <span class="editor-toolbar-separator w-px h-5 bg-border mx-1 self-center shrink-0"></span>

        <!-- Basic Marks -->
        <button type="button" class="editor-btn btn btn-ghost btn-sm btn-icon" data-command="bold" title="Bold (Ctrl+B)">
          <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 12h9a4 4 0 0 1 0 8H6v-8Z"></path>
            <path d="M6 4h8a4 4 0 0 1 0 8H6V4Z"></path>
          </svg>
        </button>
        <button type="button" class="editor-btn btn btn-ghost btn-sm btn-icon" data-command="italic" title="Italic (Ctrl+I)">
          <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="4" x2="10" y2="4"></line>
            <line x1="14" y1="20" x2="5" y2="20"></line>
            <line x1="15" y1="4" x2="9" y2="20"></line>
          </svg>
        </button>
        <button type="button" class="editor-btn btn btn-ghost btn-sm btn-icon" data-command="underline" title="Underline (Ctrl+U)">
          <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 4v6a6 6 0 0 0 12 0V4"></path>
            <line x1="4" y1="20" x2="20" y2="20"></line>
          </svg>
        </button>
        <button type="button" class="editor-btn btn btn-ghost btn-sm btn-icon" data-command="strikeThrough" title="Strikethrough">
          <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 4H9a3 3 0 0 0-2.83 4"></path>
            <path d="M14 12a4 4 0 0 1 0 8H6"></path>
            <line x1="4" y1="12" x2="20" y2="12"></line>
          </svg>
        </button>
        <button type="button" class="editor-btn btn btn-ghost btn-sm btn-icon" data-command="subscript" title="Subscript">
          <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m4 5 8 8"></path>
            <path d="m12 5-8 8"></path>
            <path d="M20 19h-4c0-1.5.44-2 1.5-2.5S20 15.33 20 14c0-.47-.17-.93-.48-1.29a2.11 2.11 0 0 0-2.62-.44c-.42.24-.74.62-.9 1.07"></path>
            <path d="M16 19h4"></path>
          </svg>
        </button>
        <button type="button" class="editor-btn btn btn-ghost btn-sm btn-icon" data-command="superscript" title="Superscript">
          <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m4 19 8-8"></path>
            <path d="m12 19-8-8"></path>
            <path d="M20 9h-4c0-1.5.44-2 1.5-2.5S20 5.33 20 4c0-.47-.17-.93-.48-1.29a2.11 2.11 0 0 0-2.62-.44c-.42.24-.74.62-.9 1.07"></path>
            <path d="M16 9h4"></path>
          </svg>
        </button>
        <button type="button" class="editor-btn btn btn-ghost btn-sm btn-icon" data-command="code" title="Inline Code">
          <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
          </svg>
        </button>
        <button type="button" class="editor-btn btn btn-ghost btn-sm btn-icon" data-command="clearFormatting" title="Clear Formatting">
          <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 7V4h16v3"></path>
            <path d="M5 20h6"></path>
            <path d="M13 4 8 20"></path>
            <line x1="15" y1="15" x2="21" y2="21"></line>
            <line x1="21" y1="15" x2="15" y2="21"></line>
          </svg>
        </button>

        <span class="editor-toolbar-separator w-px h-5 bg-border mx-1 self-center shrink-0"></span>

        <!-- Colors: Text Color & Highlight -->
        <button type="button" class="editor-color-trigger editor-btn btn btn-ghost btn-sm btn-icon" title="Text Color" aria-haspopup="true" aria-expanded="false">
          <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m4 17 6-12h4l6 12"></path>
            <path d="M6.5 12h11"></path>
            <path d="M3 21h18" stroke-width="3"></path>
          </svg>
        </button>
        <button type="button" class="editor-highlight-trigger editor-btn btn btn-ghost btn-sm btn-icon" title="Highlight Color" aria-haspopup="true" aria-expanded="false">
          <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m9 11-6 6v3h3l6-6"></path>
            <path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"></path>
          </svg>
        </button>

        <span class="editor-toolbar-separator w-px h-5 bg-border mx-1 self-center shrink-0"></span>

        <!-- Alignment -->
        <button type="button" class="editor-btn btn btn-ghost btn-sm btn-icon" data-command="justifyLeft" title="Align Left">
          <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="21" y1="6" x2="3" y2="6"></line>
            <line x1="15" y1="12" x2="3" y2="12"></line>
            <line x1="17" y1="18" x2="3" y2="18"></line>
          </svg>
        </button>
        <button type="button" class="editor-btn btn btn-ghost btn-sm btn-icon" data-command="justifyCenter" title="Align Center">
          <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="6"></line>
            <line x1="21" y1="12" x2="3" y2="12"></line>
            <line x1="18" y1="18" x2="6" y2="18"></line>
          </svg>
        </button>
        <button type="button" class="editor-btn btn btn-ghost btn-sm btn-icon" data-command="justifyRight" title="Align Right">
          <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="21" y1="6" x2="3" y2="6"></line>
            <line x1="21" y1="12" x2="9" y2="12"></line>
            <line x1="21" y1="18" x2="7" y2="18"></line>
          </svg>
        </button>
        <button type="button" class="editor-btn btn btn-ghost btn-sm btn-icon" data-command="justifyFull" title="Justify">
          <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="21" y1="6" x2="3" y2="6"></line>
            <line x1="21" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="18" x2="3" y2="18"></line>
          </svg>
        </button>

        <span class="editor-toolbar-separator w-px h-5 bg-border mx-1 self-center shrink-0"></span>

        <!-- Lists -->
        <button type="button" class="editor-btn btn btn-ghost btn-sm btn-icon" data-command="insertUnorderedList" title="Bullet List">
          <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="9" y1="6" x2="20" y2="6"></line>
            <line x1="9" y1="12" x2="20" y2="12"></line>
            <line x1="9" y1="18" x2="20" y2="18"></line>
            <circle cx="4" cy="6" r="1.5" fill="currentColor"></circle>
            <circle cx="4" cy="12" r="1.5" fill="currentColor"></circle>
            <circle cx="4" cy="18" r="1.5" fill="currentColor"></circle>
          </svg>
        </button>
        <button type="button" class="editor-btn btn btn-ghost btn-sm btn-icon" data-command="insertOrderedList" title="Numbered List">
          <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="10" y1="6" x2="21" y2="6"></line>
            <line x1="10" y1="12" x2="21" y2="12"></line>
            <line x1="10" y1="18" x2="21" y2="18"></line>
            <path d="M4 6h1v4"></path>
            <path d="M4 10h2"></path>
            <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path>
            <path d="M4 14h2"></path>
          </svg>
        </button>
        <button type="button" class="editor-btn btn btn-ghost btn-sm btn-icon" data-command="insertTaskList" title="Task List">
          <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 11 12 14 22 4"></polyline>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
          </svg>
        </button>

        <span class="editor-toolbar-separator w-px h-5 bg-border mx-1 self-center shrink-0"></span>

        <!-- Blocks & Inserts -->
        <button type="button" class="editor-table-trigger editor-btn btn btn-ghost btn-sm btn-icon" data-command="insertTable" title="Insert Table" aria-haspopup="true" aria-expanded="false">
          <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2"></rect>
            <path d="M3 9h18"></path>
            <path d="M3 15h18"></path>
            <path d="M9 3v18"></path>
            <path d="M15 3v18"></path>
          </svg>
        </button>
        <button type="button" class="editor-btn btn btn-ghost btn-sm btn-icon" data-command="insertMath" title="Insert Math Formula (LaTeX)">
          <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 4h16v2l-9 6 9 6v2H4"></path>
          </svg>
        </button>
        <button type="button" class="editor-btn btn btn-ghost btn-sm btn-icon" data-command="insertCodeBlock" title="Code Block">
          <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
          </svg>
        </button>
        <button type="button" class="editor-btn btn btn-ghost btn-sm btn-icon" data-command="insertVideo" title="Embed Video (YouTube, Vimeo, MP4)">
          <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect width="20" height="15" x="2" y="4.5" rx="2" ry="2"/>
            <polygon points="10 9 15 12 10 15 10 9" fill="currentColor"/>
          </svg>
        </button>
        <button type="button" class="editor-btn btn btn-ghost btn-sm btn-icon" data-command="insertDetails" title="Collapsible Section">
          <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2"/>
            <path d="m9 10 3 3 3-3"/>
          </svg>
        </button>
        <button type="button" class="editor-btn btn btn-ghost btn-sm btn-icon" data-command="insertCallout" title="Callout / Alert Note">
          <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        </button>
        <button type="button" class="editor-btn btn btn-ghost btn-sm btn-icon" data-command="insertFile" title="Attach File">
          <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
          </svg>
        </button>
        <button type="button" class="editor-btn btn btn-ghost btn-sm btn-icon" data-command="horizontalRule" title="Horizontal Divider">
          <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
          </svg>
        </button>
        <button type="button" class="editor-btn btn btn-ghost btn-sm btn-icon" data-command="createLink" title="Insert Link">
          <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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

        <input type="file" class="editor-image-file-input hidden" accept="image/*" hidden style="display: none;" />
        <input type="file" class="editor-generic-file-input hidden" hidden style="display: none;" />
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
            <div class="editor-save-status flex items-center gap-1.5 text-xs text-muted" aria-live="polite">
              <span class="editor-save-indicator w-2 h-2 rounded-full bg-primary inline-block shrink-0 transition-colors"></span>
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
  public tableMenu?: MarkonTableMenu;
  public dragHandle?: MarkonDragHandle;
  public draftManager?: MarkonDraftManager;

  constructor(options: MarkonEditorOptions = {}) {
    ensureMarkonStyles();
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
    let initialContent = options.initialValue || '';

    // Recover draft if autoSave is active and initialValue is empty
    if (
      options.autoSave &&
      !initialContent &&
      typeof window !== 'undefined' &&
      window.localStorage
    ) {
      const storageKey =
        (typeof options.autoSave === 'object' && options.autoSave.key) ||
        `markon_draft_${options.name || 'default'}`;
      const saved = window.localStorage.getItem(storageKey);
      if (saved) {
        initialContent = saved;
      }
    }

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
      editorProps: {
        handleDrop: (_view, event, _slice, moved) => {
          if (moved || !event.dataTransfer?.files?.length) return false;
          const file = event.dataTransfer.files[0];
          this.handleUploadedFile(file);
          return true;
        },
        handlePaste: (_view, event) => {
          if (!event.clipboardData?.files?.length) return false;
          const file = event.clipboardData.files[0];
          this.handleUploadedFile(file);
          return true;
        },
      },
      onUpdate: ({ editor }) => {
        const html = editor.getHTML();
        const json = editor.getJSON();
        const text = editor.getText();

        this.updateFooter(text);
        this.draftManager?.handleUpdate();
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

    (this.tiptap as any).__markon = this;

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

    const tableTrigger = this.element.querySelector<HTMLElement>(
      '.editor-table-trigger'
    );
    if (tableTrigger) {
      this.tableMenu = new MarkonTableMenu(this.tiptap, tableTrigger);
    }

    if (!options.readOnly) {
      this.dragHandle = new MarkonDragHandle({
        editor: this.tiptap,
        container: contentEl,
      });
    }

    if (options.autoSave) {
      this.draftManager = new MarkonDraftManager(
        this,
        typeof options.autoSave === 'object' ? options.autoSave : {}
      );
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
    setBtnActive('insertVideo', this.tiptap.isActive('videoBlock'));
    setBtnActive('insertDetails', this.tiptap.isActive('details'));
    setBtnActive('createLink', this.tiptap.isActive('link'));

    // Sync Undo and Redo availability states
    const setBtnDisabled = (cmd: string, canExecute: boolean) => {
      const btn = toolbar.querySelector<HTMLButtonElement>(
        `.editor-btn[data-command="${cmd}"]`
      );
      if (btn) {
        if (canExecute) {
          btn.removeAttribute('disabled');
          btn.removeAttribute('aria-disabled');
          btn.classList.remove('opacity-40', 'cursor-not-allowed');
        } else {
          btn.setAttribute('disabled', 'true');
          btn.setAttribute('aria-disabled', 'true');
          btn.classList.add('opacity-40', 'cursor-not-allowed');
        }
      }
    };

    setBtnDisabled('undo', Boolean(this.tiptap.can?.().undo?.()));
    setBtnDisabled('redo', Boolean(this.tiptap.can?.().redo?.()));

    // Sync Custom Typography Selector
    this.typographyMenu?.updateTriggerState();
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
      if (btn.disabled || btn.getAttribute('aria-disabled') === 'true') return;
      if (btn.classList.contains('editor-table-trigger')) return;
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
          this.handleUploadedFile(file);
          fileInput.value = '';
        }
      });
    }

    const genericFileInput = toolbar.querySelector<HTMLInputElement>(
      '.editor-generic-file-input'
    );
    if (genericFileInput) {
      genericFileInput.addEventListener('change', () => {
        const file = genericFileInput.files?.[0];
        if (file) {
          this.handleUploadedFile(file);
          genericFileInput.value = '';
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
        if (_val && typeof _val === 'object') {
          const rows = _val.rows || 3;
          const cols = _val.cols || 3;
          chain.insertTable({ rows, cols, withHeaderRow: true }).run();
        } else {
          chain.insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
        }
        break;
      case 'addRowBefore':
        chain.addRowBefore().run();
        break;
      case 'addRowAfter':
        chain.addRowAfter().run();
        break;
      case 'deleteRow':
        chain.deleteRow().run();
        break;
      case 'addColumnBefore':
        chain.addColumnBefore().run();
        break;
      case 'addColumnAfter':
        chain.addColumnAfter().run();
        break;
      case 'deleteColumn':
        chain.deleteColumn().run();
        break;
      case 'toggleHeaderRow':
        chain.toggleHeaderRow().run();
        break;
      case 'toggleHeaderColumn':
        chain.toggleHeaderColumn().run();
        break;
      case 'mergeCells':
        chain.mergeCells().run();
        break;
      case 'splitCell':
        chain.splitCell().run();
        break;
      case 'deleteTable':
        chain.deleteTable().run();
        break;
      case 'insertCodeBlock':
        chain.toggleCodeBlock().run();
        break;
      case 'insertVideo': {
        if (_val && typeof _val === 'string') {
          this.tiptap.chain().focus().setVideo({ src: _val.trim() }).run();
          this.updateToolbarState();
          break;
        }
        const { from, to } = this.tiptap.state.selection;
        openMarkonModal({
          title: 'Embed Video',
          label: 'YouTube, Vimeo, or Video URL',
          initialValue: 'https://',
          placeholder: 'https://youtube.com/watch?v=...',
          confirmText: 'Embed Video',
          onConfirm: (url) => {
            const cmdChain = this.tiptap.chain().focus();
            if (from !== undefined && to !== undefined) {
              cmdChain.setTextSelection({ from, to });
            }
            if (url && url.trim() && url !== 'https://') {
              cmdChain.setVideo({ src: url.trim() }).run();
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
      case 'insertDetails':
        chain.insertDetails().run();
        break;
      case 'insertCallout':
        chain.insertCallout(_val || { type: 'info' }).run();
        break;
      case 'insertFile':
        this.promptFileUpload();
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

  public setContent(
    content: string,
    emitUpdate = false,
    preserveCursor = false
  ): void {
    let selection: { from: number; to: number } | null = null;
    if (preserveCursor && this.tiptap?.state) {
      selection = {
        from: this.tiptap.state.selection.from,
        to: this.tiptap.state.selection.to,
      };
    }

    this.tiptap.commands.setContent(content, { emitUpdate });

    if (selection && this.tiptap?.state) {
      const maxPos = this.tiptap.state.doc.content.size;
      const safeFrom = Math.min(selection.from, maxPos);
      const safeTo = Math.min(selection.to, maxPos);
      try {
        this.tiptap.commands.setTextSelection({ from: safeFrom, to: safeTo });
      } catch {
        // Fallback if target position is invalid
      }
    }

    const text = this.tiptap.getText();
    this.updateFooter(text);
    this.updateToolbarState();

    this.element.dispatchEvent(
      new CustomEvent('markon:change', {
        detail: {
          html: this.tiptap.getHTML(),
          json: this.tiptap.getJSON(),
          text,
        },
        bubbles: true,
      })
    );
  }

  public setReadOnly(readOnly: boolean): void {
    this.options.readOnly = readOnly;
    this.tiptap.setEditable(!readOnly);

    const contentEl =
      this.element.querySelector<HTMLElement>('.editor-content');
    if (contentEl) {
      contentEl.setAttribute('contenteditable', readOnly ? 'false' : 'true');
    }

    const toolbar = this.element.querySelector<HTMLElement>('.editor-toolbar');
    if (toolbar) {
      if (readOnly) {
        toolbar.classList.add('opacity-50', 'pointer-events-none');
        toolbar.setAttribute('aria-disabled', 'true');
      } else {
        toolbar.classList.remove('opacity-50', 'pointer-events-none');
        toolbar.removeAttribute('aria-disabled');
      }
    }

    if (readOnly) {
      this.dragHandle?.destroy();
      this.dragHandle = undefined;
    } else if (!this.dragHandle && contentEl) {
      this.dragHandle = new MarkonDragHandle({
        editor: this.tiptap,
        container: contentEl,
      });
    }

    this.updateToolbarState();
  }

  public setMinHeight(minHeight: string): void {
    this.options.minHeight = minHeight;
    const contentEl =
      this.element.querySelector<HTMLElement>('.editor-content');
    if (contentEl) {
      contentEl.style.minHeight = minHeight;
    }
  }

  public focus(): void {
    this.tiptap.commands.focus();
  }

  public promptFileUpload(): void {
    const fileInput = this.element.querySelector<HTMLInputElement>(
      '.editor-generic-file-input'
    );
    fileInput?.click();
  }

  public async handleUploadedFile(file: File): Promise<void> {
    const isImage = file.type.startsWith('image/');
    const uploadId =
      'upload-' + Math.random().toString(36).substring(2, 9) + '-' + Date.now();
    let previewUrl = '';
    if (isImage && typeof URL !== 'undefined' && URL.createObjectURL) {
      try {
        previewUrl = URL.createObjectURL(file);
      } catch {
        previewUrl = '';
      }
    }

    const formattedSize = formatFileSize(file.size);

    // Optimistically insert upload placeholder card into editor
    this.tiptap
      .chain()
      .focus()
      .insertContent({
        type: 'uploadPlaceholder',
        attrs: {
          uploadId,
          name: file.name,
          size: formattedSize,
          type: file.type || 'file',
          previewUrl,
          status: 'uploading',
        },
      })
      .run();

    if (this.options.onUploadFile) {
      try {
        const res = await this.options.onUploadFile(file);
        const url = typeof res === 'string' ? res : res.url;
        const name = typeof res === 'object' && res.name ? res.name : file.name;
        const size =
          typeof res === 'object' && res.size
            ? typeof res.size === 'number'
              ? formatFileSize(res.size)
              : res.size
            : formattedSize;

        this.replaceUploadPlaceholder(uploadId, {
          isImage,
          url,
          name,
          size,
          type: file.type || 'file',
        });
        if (previewUrl && typeof URL !== 'undefined' && URL.revokeObjectURL) {
          try {
            URL.revokeObjectURL(previewUrl);
          } catch {
            // ignore
          }
        }
        return;
      } catch (err: any) {
        console.error('File upload failed', err);
        this.setUploadPlaceholderError(
          uploadId,
          err?.message || 'Upload failed. Click to remove.'
        );
        return;
      }
    }

    // Fallback to Base64 FileReader
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        this.replaceUploadPlaceholder(uploadId, {
          isImage,
          url: dataUrl,
          name: file.name,
          size: formattedSize,
          type: file.type || 'file',
        });
        if (previewUrl && typeof URL !== 'undefined' && URL.revokeObjectURL) {
          try {
            URL.revokeObjectURL(previewUrl);
          } catch {
            // ignore
          }
        }
      }
    };
    reader.onerror = () => {
      this.setUploadPlaceholderError(uploadId, 'Failed to read file locally.');
    };
    reader.readAsDataURL(file);
  }

  private replaceUploadPlaceholder(
    uploadId: string,
    data: {
      isImage: boolean;
      url: string;
      name: string;
      size: string;
      type: string;
    }
  ): void {
    let targetPos: number | null = null;
    let targetNodeSize = 1;

    this.tiptap.state.doc.descendants((node, pos) => {
      if (
        node.type.name === 'uploadPlaceholder' &&
        node.attrs.uploadId === uploadId
      ) {
        targetPos = pos;
        targetNodeSize = node.nodeSize;
        return false;
      }
      return true;
    });

    if (targetPos !== null) {
      const fromPos: number = targetPos;
      const toPos: number = targetPos + targetNodeSize;
      const tr = this.tiptap.state.tr;
      if (data.isImage) {
        const imageType = this.tiptap.schema.nodes.image;
        if (imageType) {
          tr.replaceWith(
            fromPos,
            toPos,
            imageType.create({ src: data.url, alt: data.name })
          );
        }
      } else {
        const fileType = this.tiptap.schema.nodes.fileAttachment;
        if (fileType) {
          tr.replaceWith(
            fromPos,
            toPos,
            fileType.create({
              src: data.url,
              name: data.name,
              size: data.size,
              type: data.type,
            })
          );
        }
      }
      this.tiptap.view.dispatch(tr);
      this.updateToolbarState();
    }
  }

  private setUploadPlaceholderError(
    uploadId: string,
    errorMessage: string
  ): void {
    let targetPos: number | null = null;
    let targetNode: any = null;

    this.tiptap.state.doc.descendants((node, pos) => {
      if (
        node.type.name === 'uploadPlaceholder' &&
        node.attrs.uploadId === uploadId
      ) {
        targetPos = pos;
        targetNode = node;
        return false;
      }
      return true;
    });

    if (targetPos !== null && targetNode) {
      const tr = this.tiptap.state.tr.setNodeMarkup(targetPos, undefined, {
        ...targetNode.attrs,
        status: 'error',
        errorMessage,
      });
      this.tiptap.view.dispatch(tr);
      this.updateToolbarState();
    }
  }

  public setSaveStatus(status: SaveStatusState, message?: string): void {
    const statusEl = this.element.querySelector<HTMLElement>(
      '.editor-save-status'
    );
    if (!statusEl) return;
    const dot = statusEl.querySelector<HTMLElement>('.editor-save-indicator');
    const text = statusEl.querySelector<HTMLElement>('.editor-save-text');

    if (dot) {
      dot.classList.remove(
        'bg-primary',
        'bg-warning',
        'bg-danger',
        'animate-pulse'
      );
      if (status === 'saving') {
        dot.classList.add('bg-warning', 'animate-pulse');
      } else if (status === 'error') {
        dot.classList.add('bg-danger');
      } else {
        dot.classList.add('bg-primary');
      }
    }

    if (text) {
      if (message) {
        text.textContent = message;
      } else if (status === 'saving') {
        text.textContent = 'Saving…';
      } else if (status === 'saved') {
        text.textContent = 'Saved just now';
      } else if (status === 'error') {
        text.textContent = 'Save failed';
      } else {
        text.textContent = 'Saved';
      }
    }
  }

  public getMarkdown(): string {
    return htmlToMarkdown(this.getHTML());
  }

  public setMarkdown(md: string, emitUpdate = false): void {
    this.setContent(markdownToHtml(md), emitUpdate);
  }

  public async saveDraft(): Promise<void> {
    if (this.draftManager) {
      await this.draftManager.saveNow();
    }
  }

  public clearDraft(): void {
    this.draftManager?.clearDraft();
  }

  public getSavedDraft(): string | null {
    return this.draftManager?.getSavedDraft() || null;
  }

  public destroy(): void {
    closeAllPopovers();
    this.fontFamilyMenu?.destroy();
    this.fontSizeMenu?.destroy();
    this.highlightMenu?.destroy();
    this.textColorMenu?.destroy();
    this.typographyMenu?.destroy();
    this.tableMenu?.destroy();
    this.dragHandle?.destroy();
    this.draftManager?.destroy();
    this.tiptap.destroy();
  }
}
