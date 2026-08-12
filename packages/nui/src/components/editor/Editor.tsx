import React, { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import { EditorToolbar } from './EditorToolbar'
import { EditorBubbleMenu } from './EditorBubbleMenu'
import { getEditorExtensions } from './EditorExtensions'
import { EditorDragHandle } from './EditorDragHandle'
import { useAutoSave } from './hooks/useAutoSave'
import { CheckCircle2, Loader2, CloudOff } from 'lucide-react'

export interface EditorProps {
  value?: string
  onChange?: (html: string, json: any) => void
  placeholder?: string
}

export const Editor: React.FC<EditorProps> = ({
  value = '',
  onChange,
  placeholder,
  documentId = 'default-draft',
}: EditorProps & { documentId?: string }) => {
  const { triggerSave, saveStatus, lastSaved } = useAutoSave({
    documentId,
    onSave: (html, json) => {
      // Could also trigger a real backend API save here
    }
  });

  const editor = useEditor({
    extensions: getEditorExtensions(placeholder),
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const json = editor.getJSON();
      onChange?.(html, json)
      triggerSave(html, json)
    },
    editorProps: {
      attributes: {
        class: 'nui-editor p-5 focus:outline-none min-h-[250px] font-sans text-default',
      },
      handleDrop: (view, event, slice, moved) => {
        if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length > 0) {
          const file = event.dataTransfer.files[0]
          
          let nodeType = 'fileAttachment'
          let attrs: any = { filename: file.name, filesize: file.size, filetype: file.type, uploading: true }
          
          if (file.type.startsWith('image/')) {
            nodeType = 'image'
            attrs = { src: '', uploading: true }
          } else if (file.type.startsWith('video/')) {
            nodeType = 'customVideo'
            attrs = { src: '', uploading: true }
          }
          
          const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY })
          const pos = coordinates ? coordinates.pos : view.state.selection.from
          
          const node = view.state.schema.nodes[nodeType].create(attrs)
          const transaction = view.state.tr.insert(pos, node)
          view.dispatch(transaction)
          
          // Mock Upload
          setTimeout(() => {
            const url = URL.createObjectURL(file)
            const { state } = view
            let foundPos = -1
            state.doc.descendants((n, p) => {
              if (n.attrs.uploading === true && (n.type.name === nodeType)) {
                // In a real app we'd match a unique upload ID, here we just take the first uploading node of this type
                foundPos = p
                return false
              }
            })
            
            if (foundPos !== -1) {
              view.dispatch(view.state.tr.setNodeMarkup(foundPos, null, {
                ...view.state.doc.nodeAt(foundPos)?.attrs,
                src: url,
                uploading: false
              }))
            }
          }, 1500)
          
          event.preventDefault()
          return true
        }
        return false
      }
    },
  })

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, false)
    }
  }, [value, editor])

  return (
    <div className="flex flex-col border border-default rounded-md shadow-sm focus-within:ring-2 focus-within:ring-primary focus-within:border-primary bg-surface transition-all duration-200 tiptap-wrapper">
      <EditorToolbar editor={editor} />
      
      <EditorBubbleMenu editor={editor} />

      <div className="relative isolate group">
        <EditorDragHandle editor={editor} />
        <EditorContent editor={editor} data-testid="editor-content" className="bg-surface relative text-default font-sans" />
      </div>
      
      {editor && (
        <div className="flex items-center justify-between p-2 border-t border-default text-xs text-muted bg-subtle">
          <div className="flex items-center gap-2">
            {saveStatus === 'saving' && <><Loader2 size={12} className="animate-spin" /> Saving...</>}
            {saveStatus === 'saved' && <><CheckCircle2 size={12} className="text-primary" /> Saved locally</>}
            {saveStatus === 'error' && <><CloudOff size={12} className="text-destructive" /> Save failed</>}
            {saveStatus === 'idle' && lastSaved && <span>Last saved {lastSaved.toLocaleTimeString()}</span>}
          </div>
          <div className="flex gap-4">
            <span>{editor.storage.characterCount.words()} words</span>
            <span>{editor.storage.characterCount.characters()} characters</span>
          </div>
        </div>
      )}
    </div>
  )
}
