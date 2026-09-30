/**
 * @nofinite/markon - Draft Auto-Save & Recovery Manager
 * Debounced persistence with active state feedback (saving, saved, error).
 */

import type { MarkonEditor } from './MarkonEditor';

export interface AutoSaveConfig {
  enabled?: boolean;
  key?: string;
  debounceMs?: number;
  onSave?: (html: string, json: any) => void | Promise<void>;
}

export type SaveStatusState = 'idle' | 'saving' | 'saved' | 'error';

export class MarkonDraftManager {
  private editor: MarkonEditor;
  private config: AutoSaveConfig;
  private storageKey: string;
  private debounceMs: number;
  private saveTimeout: ReturnType<typeof setTimeout> | null = null;
  private isDestroyed = false;

  constructor(editor: MarkonEditor, config: AutoSaveConfig = {}) {
    this.editor = editor;
    this.config = config;
    this.storageKey =
      config.key || `markon_draft_${editor.options.name || 'default'}`;
    this.debounceMs = config.debounceMs ?? 1000;
  }

  public handleUpdate(): void {
    if (this.isDestroyed) return;

    this.editor.setSaveStatus('saving');

    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }

    this.saveTimeout = setTimeout(async () => {
      if (this.isDestroyed) return;
      await this.saveNow();
    }, this.debounceMs);
  }

  public async saveNow(): Promise<void> {
    try {
      const html = this.editor.getHTML();
      const json = this.editor.getJSON();

      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(this.storageKey, html);
      }

      if (this.config.onSave) {
        await this.config.onSave(html, json);
      }

      const now = new Date();
      const timeStr = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      this.editor.setSaveStatus('saved', `Saved at ${timeStr}`);
    } catch (err) {
      console.error('Markon auto-save failed:', err);
      this.editor.setSaveStatus('error', 'Save failed');
    }
  }

  public getSavedDraft(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(this.storageKey);
    }
    return null;
  }

  public clearDraft(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(this.storageKey);
    }
  }

  public hasDraft(): boolean {
    return Boolean(this.getSavedDraft());
  }

  public destroy(): void {
    this.isDestroyed = true;
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
      this.saveTimeout = null;
    }
  }
}
