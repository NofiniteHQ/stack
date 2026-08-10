import React, { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import { EditorToolbar } from './EditorToolbar'
import { EditorBubbleMenu } from './EditorBubbleMenu'
import { getEditorExtensions } from './EditorExtensions'

export interface EditorProps {
  value?: string
  onChange?: (html: string, json: any) => void
  placeholder?: string
}

export const Editor: React.FC<EditorProps> = ({
  value = '',
  onChange,
  placeholder,
}) => {
  const editor = useEditor({
    extensions: getEditorExtensions(placeholder),
    content: value,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML(), editor.getJSON())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm prose-p:my-2 prose-headings:mb-3 prose-headings:mt-4 max-w-none p-5 focus:outline-none min-h-[250px] font-sans text-default',
      },
    },
  })

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, false)
    }
  }, [value, editor])

  return (
    <div className="flex flex-col border border-default rounded-md shadow-sm focus-within:border-primary focus-within:ring-1 focus-within:ring-primary bg-surface transition-all duration-200 overflow-hidden tiptap-wrapper">
      <style dangerouslySetInnerHTML={{__html: `
        .tiptap-wrapper .tiptap ul[data-type="taskList"] {
          list-style: none;
          padding: 0;
        }
        .tiptap-wrapper .tiptap ul[data-type="taskList"] li {
          display: flex;
          align-items: flex-start;
          margin-bottom: 0.25rem;
        }
        .tiptap-wrapper .tiptap ul[data-type="taskList"] li > label {
          margin-right: 0.5rem;
          user-select: none;
          margin-top: 0.25rem;
        }
        .tiptap-wrapper .tiptap ul[data-type="taskList"] li > div {
          flex: 1;
        }
      `}} />
      <EditorToolbar editor={editor} />
      
      <EditorBubbleMenu editor={editor} />

      <EditorContent editor={editor} data-testid="editor-content" className="bg-surface relative text-default font-sans" />
      
      {editor && (
        <div className="flex items-center justify-between p-2 border-t border-default text-xs text-muted bg-subtle">
          <div className="flex gap-4">
            <span>{editor.storage.characterCount.words()} words</span>
            <span>{editor.storage.characterCount.characters()} characters</span>
          </div>
        </div>
      )}
    </div>
  )
}
