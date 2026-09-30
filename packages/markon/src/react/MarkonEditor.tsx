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
  setContent: (
    content: string,
    emitUpdate?: boolean,
    preserveCursor?: boolean
  ) => void;
  setReadOnly: (readOnly: boolean) => void;
  setMinHeight: (minHeight: string) => void;
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
      onUploadFile,
      onSave,
      ...rest
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const editorRef = useRef<CoreMarkonEditor | null>(null);
    const lastEmittedValueRef = useRef<string>(value || '');

    // Stable callback refs to eliminate stale closure bugs
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;

    const onSaveRef = useRef(onSave);
    onSaveRef.current = onSave;

    const onUploadFileRef = useRef(onUploadFile);
    onUploadFileRef.current = onUploadFile;

    useImperativeHandle(
      ref,
      () => ({
        getHTML: () => editorRef.current?.getHTML() || '',
        getJSON: () => editorRef.current?.getJSON() || {},
        getText: () => editorRef.current?.getText() || '',
        setContent: (c: string, emitUpdate = false, preserveCursor = false) =>
          editorRef.current?.setContent(c, emitUpdate, preserveCursor),
        setReadOnly: (ro: boolean) => editorRef.current?.setReadOnly(ro),
        setMinHeight: (mh: string) => editorRef.current?.setMinHeight(mh),
        focus: () => editorRef.current?.focus(),
        editor: editorRef.current,
      }),
      []
    );

    // Initial instantiation
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
          onChangeRef.current?.(html, json, text);
        },
        onSave: (html, json) => {
          onSaveRef.current?.(html, json);
        },
        onUploadFile: (file) => {
          if (onUploadFileRef.current) {
            return onUploadFileRef.current(file);
          }
          return Promise.reject(new Error('No onUploadFile handler provided'));
        },
        ...rest,
      });

      editorRef.current = editor;

      return () => {
        editor.destroy();
        editorRef.current = null;
      };
    }, []);

    // Non-destructive controlled content sync (eliminates cursor jumping)
    useEffect(() => {
      if (editorRef.current && value !== undefined) {
        if (value === lastEmittedValueRef.current) return;

        const currentHTML = editorRef.current.getHTML();
        if (currentHTML !== value) {
          editorRef.current.setContent(value, false, true);
          lastEmittedValueRef.current = value;
        }
      }
    }, [value]);

    // Reactive readOnly synchronization without tearing down the editor
    useEffect(() => {
      if (editorRef.current && readOnly !== undefined) {
        editorRef.current.setReadOnly(readOnly);
      }
    }, [readOnly]);

    // Reactive minHeight synchronization
    useEffect(() => {
      if (editorRef.current && minHeight !== undefined) {
        editorRef.current.setMinHeight(minHeight);
      }
    }, [minHeight]);

    return <div ref={containerRef} className={className} />;
  }
);

MarkonEditor.displayName = 'MarkonEditor';

export default MarkonEditor;
