import { useEffect, useRef, useState } from 'react';
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

  useEffect(() => {
    if (!containerRef.current) return;

    const instance = new MarkonEditor({
      element: containerRef.current,
      ...options,
      onChange: (html, json, text) => {
        const counts = getCounts(text);
        setStats({
          wordCount: counts.words,
          charCount: counts.characters,
          isEmpty: text.trim().length === 0,
        });
        options.onChange?.(html, json, text);
      },
    });

    setEditor(instance);

    const initialText = instance.getText();
    const counts = getCounts(initialText);
    setStats({
      wordCount: counts.words,
      charCount: counts.characters,
      isEmpty: initialText.trim().length === 0,
    });

    return () => {
      instance.destroy();
      setEditor(null);
    };
  }, []);

  return {
    containerRef,
    editor,
    wordCount: stats.wordCount,
    charCount: stats.charCount,
    isEmpty: stats.isEmpty,
  };
}
