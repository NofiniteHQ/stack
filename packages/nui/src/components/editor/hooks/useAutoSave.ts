import { useEffect, useRef, useState } from 'react';
import { saveDraft, loadDraft } from '../utils/indexedDB';

export interface UseAutoSaveOptions {
  documentId: string;
  onSave?: (html: string, json: any) => void;
  debounceMs?: number;
}

export const useAutoSave = ({ documentId, onSave, debounceMs = 2000 }: UseAutoSaveOptions) => {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const triggerSave = (html: string, json: any) => {
    setSaveStatus('saving');
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        await saveDraft(documentId, html, json);
        setSaveStatus('saved');
        setLastSaved(new Date());
        onSave?.(html, json);
        
        setTimeout(() => setSaveStatus('idle'), 2000); // clear saved status after 2s
      } catch (err) {
        console.error('Failed to auto-save to IndexedDB', err);
        setSaveStatus('error');
      }
    }, debounceMs);
  };

  const loadInitialDraft = async () => {
    try {
      const draft = await loadDraft(documentId);
      return draft;
    } catch (err) {
      console.error('Failed to load draft from IndexedDB', err);
      return null;
    }
  };

  // Automatically sync when the internet reconnects
  useEffect(() => {
    const handleOnline = async () => {
      console.log('Internet reconnected. Syncing draft...');
      setSaveStatus('saving');
      const draft = await loadInitialDraft();
      if (draft && onSave) {
        onSave(draft.html, draft.json);
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      }
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [documentId, onSave]);

  return { triggerSave, loadInitialDraft, saveStatus, lastSaved };
};
