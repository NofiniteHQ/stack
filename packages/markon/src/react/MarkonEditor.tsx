import { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
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

export interface MarkonEditorRef {
  getHTML: () => string;
  getJSON: () => any;
  getText: () => string;
  setContent: (content: string) => void;
  focus: () => void;
  editor: CoreMarkonEditor | null;
}

export const MarkonEditor = forwardRef<MarkonEditorRef, MarkonEditorProps>(
  (
    {
      value,
      onChange,
      className,
      placeholder,
      readOnly,
      minHeight,
      showWordCount,
      showSaveStatus,
      showBubbleMenu,
      showSlashCommands,
      ...rest
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const editorRef = useRef<CoreMarkonEditor | null>(null);
    const lastEmittedValueRef = useRef<string>(value || '');

    useImperativeHandle(
      ref,
      () => ({
        getHTML: () => editorRef.current?.getHTML() || '',
        getJSON: () => editorRef.current?.getJSON() || {},
        getText: () => editorRef.current?.getText() || '',
        setContent: (c: string) => editorRef.current?.setContent(c, false),
        focus: () => editorRef.current?.focus(),
        editor: editorRef.current,
      }),
      []
    );

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
        showBubbleMenu,
        showSlashCommands,
        onChange: (html, json, text) => {
          lastEmittedValueRef.current = html;
          onChange?.(html, json, text);
        },
        ...rest,
      });

      editorRef.current = editor;

      return () => {
        editor.destroy();
        editorRef.current = null;
      };
    }, []);

    // Sync external value updates without resetting caret during typing
    useEffect(() => {
      if (editorRef.current && value !== undefined) {
        // If the update came from internal typing, do not reset content
        if (value === lastEmittedValueRef.current) return;

        const currentHTML = editorRef.current.getHTML();
        if (currentHTML !== value) {
          editorRef.current.setContent(value, false);
          lastEmittedValueRef.current = value;
        }
      }
    }, [value]);

    return <div ref={containerRef} className={className} />;
  }
);

MarkonEditor.displayName = 'MarkonEditor';

export default MarkonEditor;
