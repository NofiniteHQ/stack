import React from 'react'
import { BubbleMenu } from '@tiptap/react/menus'
import { Editor as TiptapEditor } from '@tiptap/react'
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  AlignHorizontalDistributeCenter,
  AlignHorizontalDistributeStart,
  AlignHorizontalDistributeEnd,
  Maximize, Minus, SplitSquareHorizontal
} from 'lucide-react'
import { ToolbarButton, LinkButton } from './EditorToolbar'

export interface EditorBubbleMenuProps {
  editor: TiptapEditor | null;
}

export const EditorBubbleMenu: React.FC<EditorBubbleMenuProps> = ({ editor }) => {
  if (!editor) return null;

  // Base class containing our defaults so we don't lose the rounding/shadows
  const baseImgClass = 'max-w-full h-auto rounded-md shadow-sm my-4 transition-all duration-200'

  const setImgClass = (cls: string) => {
    editor.chain().focus().updateAttributes('image', { class: cls }).run()
  }

  return (
    <>
      <BubbleMenu 
        editor={editor} 
        tippyOptions={{ duration: 150 }}
        shouldShow={({ editor }) => editor.isActive('image')}
      >
        <div className="flex items-center gap-1 bg-surface/90 backdrop-blur-md border border-default shadow-2xl rounded-lg p-1.5">
          <ToolbarButton 
            icon={Minus} label="Small (25%)" 
            onClick={() => setImgClass(`${baseImgClass} w-1/4`)} 
          />
          <ToolbarButton 
            icon={SplitSquareHorizontal} label="Medium (50%)" 
            onClick={() => setImgClass(`${baseImgClass} w-1/2`)} 
          />
          <ToolbarButton 
            icon={Maximize} label="Full Width (100%)" 
            onClick={() => setImgClass(`${baseImgClass} w-full`)} 
          />
          <div className="w-px h-5 bg-default mx-1 opacity-50" />
          <ToolbarButton 
            icon={AlignHorizontalDistributeStart} label="Float Left" 
            onClick={() => setImgClass(`${baseImgClass} w-1/2 float-left mr-6`)} 
          />
          <ToolbarButton 
            icon={AlignHorizontalDistributeCenter} label="Center" 
            onClick={() => setImgClass(`${baseImgClass} w-1/2 mx-auto block`)} 
          />
          <ToolbarButton 
            icon={AlignHorizontalDistributeEnd} label="Float Right" 
            onClick={() => setImgClass(`${baseImgClass} w-1/2 float-right ml-6`)} 
          />
        </div>
      </BubbleMenu>

      <BubbleMenu 
        editor={editor} 
        tippyOptions={{ duration: 150 }}
        shouldShow={({ editor, state }) => {
          const { selection } = state
          const { empty } = selection
          if (empty || editor.isActive('image') || editor.isActive('table')) return false
          return true
        }}
      >
        <div className="flex items-center gap-1 bg-surface/90 backdrop-blur-md border border-default shadow-2xl rounded-lg p-1.5">
          <ToolbarButton 
            icon={Bold} label="Bold" 
            isActive={editor.isActive('bold')}
            onClick={() => editor.chain().focus().toggleBold().run()} 
          />
          <ToolbarButton 
            icon={Italic} label="Italic" 
            isActive={editor.isActive('italic')}
            onClick={() => editor.chain().focus().toggleItalic().run()} 
          />
          <ToolbarButton 
            icon={UnderlineIcon} label="Underline" 
            isActive={editor.isActive('underline')}
            onClick={() => editor.chain().focus().toggleUnderline().run()} 
          />
          <ToolbarButton 
            icon={Strikethrough} label="Strikethrough" 
            isActive={editor.isActive('strike')}
            onClick={() => editor.chain().focus().toggleStrike().run()} 
          />
          <div className="w-px h-5 bg-default mx-1 opacity-50" />
          <LinkButton editor={editor} />
        </div>
      </BubbleMenu>

      <BubbleMenu 
        editor={editor} 
        tippyOptions={{ duration: 150 }}
        shouldShow={({ editor }) => editor.isActive('table')}
      >
        <div className="flex items-center gap-0.5 bg-surface/90 backdrop-blur-md border border-default shadow-2xl rounded-lg p-1.5 text-xs font-medium text-muted">
          <button type="button" className="px-2 py-1 rounded-md hover:bg-subtle hover:text-default transition-colors" onClick={() => editor.chain().focus().addColumnBefore().run()}>+ Col Left</button>
          <button type="button" className="px-2 py-1 rounded-md hover:bg-subtle hover:text-default transition-colors" onClick={() => editor.chain().focus().addColumnAfter().run()}>+ Col Right</button>
          <button type="button" className="px-2 py-1 rounded-md hover:bg-subtle hover:text-default transition-colors" onClick={() => editor.chain().focus().deleteColumn().run()}>- Col</button>
          <div className="w-px h-4 bg-default mx-1 opacity-50" />
          <button type="button" className="px-2 py-1 rounded-md hover:bg-subtle hover:text-default transition-colors" onClick={() => editor.chain().focus().addRowBefore().run()}>+ Row Above</button>
          <button type="button" className="px-2 py-1 rounded-md hover:bg-subtle hover:text-default transition-colors" onClick={() => editor.chain().focus().addRowAfter().run()}>+ Row Below</button>
          <button type="button" className="px-2 py-1 rounded-md hover:bg-subtle hover:text-default transition-colors" onClick={() => editor.chain().focus().deleteRow().run()}>- Row</button>
          <div className="w-px h-4 bg-default mx-1 opacity-50" />
          <button type="button" className="px-2 py-1 rounded-md hover:bg-subtle text-red-500 transition-colors" onClick={() => editor.chain().focus().deleteTable().run()}>Delete Table</button>
        </div>
      </BubbleMenu>
    </>
  )
}
