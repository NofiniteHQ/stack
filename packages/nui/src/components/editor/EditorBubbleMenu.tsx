import React from 'react'
import { BubbleMenu } from '@tiptap/react/menus'
import { Editor as TiptapEditor } from '@tiptap/react'
import {
  Bold, Italic, Underline as UnderlineIcon,
  AlignHorizontalDistributeCenter,
  AlignHorizontalDistributeStart,
  AlignHorizontalDistributeEnd,
  Maximize, Minus, SplitSquareHorizontal,
  Type, Heading1, Heading2, Heading3, ChevronDown, Trash2
} from 'lucide-react'
import { LinkButton, Separator, ToolbarButton } from './EditorToolbar'
import { Dropdown } from '../dropdown/Dropdown'
import { Popover } from '../popover/Popover'
import { Input } from '../input/Input'
import { Button } from '../button/Button'
import { cn } from '../../utils'
import { motion } from 'framer-motion'

const BubbleButton = ({ 
  isActive, 
  onClick, 
  icon: Icon, 
  label 
}: { 
  isActive?: boolean; 
  onClick: () => void; 
  icon: React.ElementType; 
  label: string; 
}) => (
  <button
    type="button"
    className={cn(
      "flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-md bg-transparent border-none cursor-pointer transition-colors duration-200",
      "focus-visible:outline-none focus-visible:bg-subtle",
      isActive ? "bg-subtle text-primary" : "text-muted hover:bg-subtle hover:text-default"
    )}
    onClick={onClick}
    aria-label={label}
    title={label}
  >
    <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
  </button>
)



const BubbleTextTypeDropdown = ({ editor }: { editor: TiptapEditor }) => {
  const types = [
    { label: 'Paragraph', value: 'paragraph', icon: Type, onClick: () => editor.chain().focus().setParagraph().run(), isActive: () => editor.isActive('paragraph') },
    { label: 'Heading 1', value: 'h1', icon: Heading1, onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), isActive: () => editor.isActive('heading', { level: 1 }) },
    { label: 'Heading 2', value: 'h2', icon: Heading2, onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), isActive: () => editor.isActive('heading', { level: 2 }) },
    { label: 'Heading 3', value: 'h3', icon: Heading3, onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), isActive: () => editor.isActive('heading', { level: 3 }) },
  ];

  const activeType = types.find(t => t.isActive()) || types[0];

  return (
    <Dropdown>
      <Dropdown.Trigger>
        <button 
          type="button" 
          className="flex items-center gap-1 h-8 px-2 rounded-md hover:bg-subtle text-muted hover:text-default transition-colors text-sm font-medium border-none bg-transparent outline-none focus-visible:outline-none"
        >
          <span className="text-left truncate">{activeType.label}</span>
          <ChevronDown size={14} className="opacity-50" />
        </button>
      </Dropdown.Trigger>
      <Dropdown.Menu className="min-w-[120px]">
        {types.map((type) => (
          <Dropdown.Item
            key={type.value}
            onClick={type.onClick}
            className={cn(
              type.isActive() ? "bg-subtle text-primary font-bold" : "text-default"
            )}
          >
            <div className="flex items-center gap-2">
              <type.icon size={14} />
              {type.label}
            </div>
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export interface EditorBubbleMenuProps {
  editor: TiptapEditor | null;
}

const YoutubeBubbleMenu = ({ editor }: { editor: TiptapEditor }) => {
  return (
    <div className="flex items-center gap-1">
      <div className="px-3 py-1.5 h-8 flex items-center justify-center text-xs font-medium text-muted uppercase tracking-wider">
        Video Options
      </div>
      <div className="w-px h-5 bg-default mx-1 opacity-50" />
      <BubbleButton 
        icon={Trash2} label="Delete Video" 
        onClick={() => editor.chain().focus().deleteSelection().run()} 
      />
    </div>
  )
}

export const EditorBubbleMenu: React.FC<EditorBubbleMenuProps> = ({ editor }) => {
  if (!editor) return null;

  // Base class containing our defaults so we don't lose the rounding/shadows
  const baseImgClass = 'max-w-full h-auto rounded-md shadow-sm my-4 transition-all duration-200'

  const setImgClass = (cls: string) => {
    editor.chain().focus().updateAttributes('image', { class: cls }).run()
  }

  const ImageOptionsPopover = ({ editor }: { editor: TiptapEditor }) => {
    const [alt, setAlt] = React.useState('')
    const [caption, setCaption] = React.useState('')

    React.useEffect(() => {
      if (editor.isActive('image')) {
        const attrs = editor.getAttributes('image');
        setAlt(attrs.alt || '');
        setCaption(attrs.caption || '');
      }
    }, [editor.state.selection, editor])

    const applyChanges = () => {
      editor.chain().focus().updateAttributes('image', { alt, caption }).run()
    }

    return (
      <Popover>
        <Popover.Trigger>
          <button 
            type="button" 
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 h-8 rounded-md bg-transparent border-none hover:bg-subtle text-default transition-colors focus-visible:outline-none cursor-pointer text-sm font-medium"
          >
            Image Options <ChevronDown size={14} className="opacity-50" />
          </button>
        </Popover.Trigger>
        <Popover.Content placement="bottom" className="flex flex-col gap-2 w-64 p-3 bg-surface border border-default rounded-lg shadow-xl">
          <div className="text-xs font-semibold text-muted uppercase tracking-wide mb-1">Image Options</div>
          <Input 
            type="text" 
            value={alt} 
            onChange={(e) => setAlt(e.target.value)} 
            placeholder="Alt Text (accessibility)" 
            inputSize="sm"
          />
          <Input 
            type="text" 
            value={caption} 
            onChange={(e) => setCaption(e.target.value)} 
            placeholder="Image Caption" 
            inputSize="sm"
          />
          <div className="flex gap-2 mt-1">
            <Popover.Close>
              <Button 
                type="button" 
                variant="primary"
                size="sm"
                className="w-full"
                onClick={applyChanges}
              >
                Apply
              </Button>
            </Popover.Close>
          </div>
        </Popover.Content>
      </Popover>
    )
  }

  return (
    <>
      <BubbleMenu 
        editor={editor} 
        tippyOptions={{ 
          duration: 150, 
          zIndex: 50,
          placement: 'bottom-start',
          popperOptions: { modifiers: [{ name: 'flip', enabled: false }] }
        }}
        shouldShow={({ editor }) => editor.isActive('image')}
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 5 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="flex flex-wrap items-center gap-1 bg-surface/90 text-default backdrop-blur-md shadow-2xl rounded-lg p-1.5 border border-default max-w-[260px] sm:max-w-[320px] md:max-w-max"
        >
          <ImageOptionsPopover editor={editor} />
          <div className="w-px h-5 bg-default mx-1 opacity-50" />
          <BubbleButton 
            icon={Minus} label="Small (25%)" 
            onClick={() => setImgClass(`${baseImgClass} w-1/4`)} 
          />
          <BubbleButton 
            icon={SplitSquareHorizontal} label="Medium (50%)" 
            onClick={() => setImgClass(`${baseImgClass} w-1/2`)} 
          />
          <BubbleButton 
            icon={Maximize} label="Full Width (100%)" 
            onClick={() => setImgClass(`${baseImgClass} w-full`)} 
          />
          <div className="w-px h-5 bg-default mx-1 opacity-50" />
          <BubbleButton 
            icon={AlignHorizontalDistributeStart} label="Float Left" 
            onClick={() => setImgClass(`${baseImgClass} w-1/2 float-left mr-6`)} 
          />
          <BubbleButton 
            icon={AlignHorizontalDistributeCenter} label="Center" 
            onClick={() => setImgClass(`${baseImgClass} w-1/2 mx-auto block`)} 
          />
          <BubbleButton 
            icon={AlignHorizontalDistributeEnd} label="Float Right" 
            onClick={() => setImgClass(`${baseImgClass} w-1/2 float-right ml-6`)} 
          />
        </motion.div>
      </BubbleMenu>

      <BubbleMenu 
        editor={editor} 
        tippyOptions={{ 
          duration: 150, 
          zIndex: 50,
          placement: 'bottom-start',
          popperOptions: { modifiers: [{ name: 'flip', enabled: false }] }
        }}
        shouldShow={({ editor }) => editor.isActive('youtube')}
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 5 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="flex flex-wrap items-center gap-1 bg-surface/90 text-default backdrop-blur-md shadow-2xl rounded-lg p-1.5 border border-default max-w-[260px] sm:max-w-[320px] md:max-w-max"
        >
          <YoutubeBubbleMenu editor={editor} />
        </motion.div>
      </BubbleMenu>

      <BubbleMenu 
        editor={editor} 
        tippyOptions={{ 
          duration: 150, 
          zIndex: 50, 
          offset: [0, 8],
          placement: 'bottom-start',
          popperOptions: { modifiers: [{ name: 'flip', enabled: false }] }
        }}
        shouldShow={({ editor, state }) => {
          const { selection } = state
          const { empty } = selection
          if (empty || editor.isActive('image') || editor.isActive('table')) return false
          return true
        }}
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 5 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="flex flex-wrap items-center gap-0.5 bg-surface/90 text-default backdrop-blur-md shadow-2xl rounded-lg p-1.5 border border-default max-w-[260px] sm:max-w-[320px] md:max-w-max"
        >
          <BubbleTextTypeDropdown editor={editor} />
          <div className="w-px h-5 bg-default mx-1 opacity-50" />
          
          <BubbleButton 
            icon={Bold} label="Bold" 
            isActive={editor.isActive('bold')}
            onClick={() => editor.chain().focus().toggleBold().run()} 
          />
          <BubbleButton 
            icon={Italic} label="Italic" 
            isActive={editor.isActive('italic')}
            onClick={() => editor.chain().focus().toggleItalic().run()} 
          />
          <BubbleButton 
            icon={UnderlineIcon} label="Underline" 
            isActive={editor.isActive('underline')}
            onClick={() => editor.chain().focus().toggleUnderline().run()} 
          />
          
          <div className="w-px h-5 bg-default mx-1 opacity-50" />
          
          <div>
            <LinkButton editor={editor} />
          </div>
        </motion.div>
      </BubbleMenu>

      <BubbleMenu 
        editor={editor} 
        tippyOptions={{ duration: 150, zIndex: 50 }}
        shouldShow={({ editor }) => editor.isActive('table')}
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 5 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="flex items-center gap-0.5 bg-surface/90 backdrop-blur-md border border-default shadow-2xl rounded-lg p-1 text-sm font-medium"
        >
          <Dropdown>
            <Dropdown.Trigger>
              <button 
                type="button" 
                className="flex items-center gap-1.5 px-3 py-1.5 h-8 rounded-md bg-transparent border-none hover:bg-subtle text-default transition-colors focus-visible:outline-none cursor-pointer"
              >
                Table Options <ChevronDown size={14} className="opacity-50" />
              </button>
            </Dropdown.Trigger>
            <Dropdown.Menu className="min-w-[160px]">
              <Dropdown.Item onClick={() => editor.chain().focus().addColumnBefore().run()}>Add Column Left</Dropdown.Item>
              <Dropdown.Item onClick={() => editor.chain().focus().addColumnAfter().run()}>Add Column Right</Dropdown.Item>
              <Dropdown.Item onClick={() => editor.chain().focus().deleteColumn().run()}>Delete Column</Dropdown.Item>
              
              <div className="w-full h-px bg-default my-1" />
              
              <Dropdown.Item onClick={() => editor.chain().focus().addRowBefore().run()}>Add Row Above</Dropdown.Item>
              <Dropdown.Item onClick={() => editor.chain().focus().addRowAfter().run()}>Add Row Below</Dropdown.Item>
              <Dropdown.Item onClick={() => editor.chain().focus().deleteRow().run()}>Delete Row</Dropdown.Item>
              
              <div className="w-full h-px bg-default my-1" />
              
              <Dropdown.Item onClick={() => editor.chain().focus().deleteTable().run()}>Delete Table</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </motion.div>
      </BubbleMenu>
    </>
  )
}
