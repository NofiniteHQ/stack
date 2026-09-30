import { useEffect, useRef, useState, useCallback } from 'react';
import {
  MarkonEditor,
  getCounts,
  type MarkonEditorOptions,
} from '../core/MarkonEditor';

export interface UseMarkonReturn {
  containerRef: React.RefObject<HTMLDivElement | null>;
  editor: MarkonEditor | null;
  wordCount: number;
  charCount: number;
  isEmpty: boolean;
  setContent: (
    content: string,
    emitUpdate?: boolean,
    preserveCursor?: boolean
  ) => void;
  clearContent: () => void;
  focus: () => void;
  getHTML: () => string;
  getText: () => string;
  getJSON: () => any;
}

export function useMarkon(
  options: Omit<MarkonEditorOptions, 'element'> = {}
): UseMarkonReturn {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [editor, setEditor] = useState<MarkonEditor | null>(null);
  const [stats, setStats] = useState({
    wordCount: 0,
    charCount: 0,
    isEmpty: true,
  });

  const optionsRef = useRef(options);
  optionsRef.current = options;

  const updateStatsFromText = useCallback((text: string) => {
    const counts = getCounts(text);
    setStats({
      wordCount: counts.words,
      charCount: counts.characters,
      isEmpty: text.trim().length === 0,
    });
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const instance = new MarkonEditor({
      element: containerRef.current,
      ...optionsRef.current,
      onChange: (html, json, text) => {
        updateStatsFromText(text);
        optionsRef.current.onChange?.(html, json, text);
      },
      onSave: (html, json) => {
        optionsRef.current.onSave?.(html, json);
      },
      onUploadFile: (file) => {
        if (optionsRef.current.onUploadFile) {
          return optionsRef.current.onUploadFile(file);
        }
        return Promise.reject(new Error('No onUploadFile handler provided'));
      },
    });

    setEditor(instance);

    const initialText = instance.getText();
    updateStatsFromText(initialText);

    // Listen to custom markon:change events so programmatic setContent updates stats
    const container = containerRef.current;
    const handleCustomChange = (e: Event) => {
      const custom = e as CustomEvent<{ text?: string }>;
      if (typeof custom.detail?.text === 'string') {
        updateStatsFromText(custom.detail.text);
      }
    };

    container.addEventListener('markon:change', handleCustomChange);

    return () => {
      container.removeEventListener('markon:change', handleCustomChange);
      instance.destroy();
      setEditor(null);
    };
  }, [updateStatsFromText]);

  // Synchronize readOnly dynamically
  useEffect(() => {
    if (editor && options.readOnly !== undefined) {
      editor.setReadOnly(options.readOnly);
    }
  }, [editor, options.readOnly]);

  // Synchronize minHeight dynamically
  useEffect(() => {
    if (editor && options.minHeight !== undefined) {
      editor.setMinHeight(options.minHeight);
    }
  }, [editor, options.minHeight]);

  const setContent = useCallback(
    (content: string, emitUpdate = false, preserveCursor = false) => {
      if (editor) {
        editor.setContent(content, emitUpdate, preserveCursor);
        updateStatsFromText(editor.getText());
      }
    },
    [editor, updateStatsFromText]
  );

  const clearContent = useCallback(() => {
    if (editor) {
      editor.setContent('', true);
      updateStatsFromText('');
    }
  }, [editor, updateStatsFromText]);

  const focus = useCallback(() => {
    editor?.focus();
  }, [editor]);

  const getHTML = useCallback(() => {
    return editor?.getHTML() || '';
  }, [editor]);

  const getText = useCallback(() => {
    return editor?.getText() || '';
  }, [editor]);

  const getJSON = useCallback(() => {
    return editor?.getJSON() || {};
  }, [editor]);

  return {
    containerRef,
    editor,
    wordCount: stats.wordCount,
    charCount: stats.charCount,
    isEmpty: stats.isEmpty,
    setContent,
    clearContent,
    focus,
    getHTML,
    getText,
    getJSON,
  };
}
