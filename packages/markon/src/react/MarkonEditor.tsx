import React, { useRef, useEffect } from 'react';
import {
  MarkonEditor as CoreMarkonEditor,
  type MarkonEditorOptions,
} from '../core/MarkonEditor';

export interface MarkonEditorProps
  extends Omit<MarkonEditorOptions, 'element'> {
  value?: string;
  onChange?: (html: string, json: any, text: string) => void;
  className?: string;
}

export const MarkonEditor: React.FC<MarkonEditorProps> = ({
  value,
  onChange,
  className,
  placeholder,
  readOnly,
  minHeight,
  showWordCount,
  showSaveStatus,
  ...rest
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<CoreMarkonEditor | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const editor = new CoreMarkonEditor({
      element: containerRef.current,
      initialValue: value,
      placeholder,
      readOnly,
      minHeight,
      showWordCount,
      showSaveStatus,
      onChange,
      ...rest,
    });

    editorRef.current = editor;

    return () => {
      editor.destroy();
      editorRef.current = null;
    };
  }, []);

  // Sync external value updates
  useEffect(() => {
    if (editorRef.current && value !== undefined) {
      if (editorRef.current.getHTML() !== value) {
        editorRef.current.setContent(value);
      }
    }
  }, [value]);

  return <div ref={containerRef} className={className} />;
};

export default MarkonEditor;
