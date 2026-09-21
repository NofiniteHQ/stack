import { useEffect, useRef, useState } from 'react';
import { MarkonEditor, type MarkonEditorOptions } from '../core/MarkonEditor';

export function useMarkon(options: Omit<MarkonEditorOptions, 'element'> = {}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [editor, setEditor] = useState<MarkonEditor | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const instance = new MarkonEditor({
      element: containerRef.current,
      ...options,
    });

    setEditor(instance);

    return () => {
      instance.destroy();
      setEditor(null);
    };
  }, []);

  return { containerRef, editor };
}
