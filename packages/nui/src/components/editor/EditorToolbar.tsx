import React, { useState, useRef, useEffect } from 'react'
import { Editor as TiptapEditor } from '@tiptap/react'
import { Popover } from '../popover/Popover'
import { Dropdown } from '../dropdown/Dropdown'
import { Button } from '../button/Button'
import { Input } from '../input/Input'
import { ColorPicker } from '../colorpicker'
import { cn } from '../../utils'
import { motion } from 'framer-motion'
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Heading1, Heading2, Heading3,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Quote, Code,
  Link as LinkIcon, Image as ImageIcon,
  Undo2, Redo2, Palette, Highlighter, ChevronDown, CheckSquare, Table as TableIcon,
  Subscript as SubscriptIcon, Superscript as SuperscriptIcon, RemoveFormatting,
  Type, Minus, Youtube
} from 'lucide-react'

export const Separator = () => <div className="w-px h-5 bg-default mx-1 opacity-50" />

export const ToolbarButton = ({ 
  isActive, 
  onClick, 
  disabled, 
  icon: Icon, 
  label 
}: { 
  isActive?: boolean; 
  onClick: () => void; 
  disabled?: boolean; 
  icon: React.ElementType; 
  label: string; 
}) => (
  <motion.button
    whileTap={{ scale: disabled ? 1 : 0.9 }}
    type="button"
    className={cn(
      "flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-md bg-transparent border-none cursor-pointer transition-colors duration-200",
      "focus-visible:outline-none focus-visible:bg-subtle",
      isActive ? "bg-subtle text-primary" : "text-muted hover:bg-subtle hover:text-default",
      disabled && "opacity-50 cursor-not-allowed hover:bg-transparent hover:text-muted"
    )}
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    title={label}
  >
    <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
  </motion.button>
)

export const LinkButton = ({ editor }: { editor: TiptapEditor }) => {
  const [url, setUrl] = useState('')
  const isActive = editor.isActive('link')

  useEffect(() => {
    setUrl(editor.getAttributes('link').href || '')
  }, [editor.getAttributes('link').href])

  return (
    <Popover>
      <Popover.Trigger>
        <button 
          type="button" 
          className={cn(
            "flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-md bg-transparent border-none cursor-pointer transition-colors duration-200",
            "focus-visible:outline-none focus-visible:bg-subtle",
            isActive ? "bg-subtle text-primary" : "text-muted hover:bg-subtle hover:text-default"
          )} 
          aria-label="Link"
          title="Link"
        >
          <LinkIcon size={16} strokeWidth={isActive ? 2.5 : 2} />
        </button>
      </Popover.Trigger>
      <Popover.Content placement="bottom" className="flex gap-2 p-2 bg-surface border border-default rounded-lg shadow-xl">
        <Input 
          type="url" 
          value={url} 
          onChange={(e) => setUrl(e.target.value)} 
          placeholder="https://..." 
          inputSize="sm"
          className="w-48"
        />
        <Popover.Close>
          <Button 
            type="button" 
            variant="primary"
            size="sm"
            onClick={() => {
              if (url) editor.chain().focus().setLink({ href: url }).run()
              else editor.chain().focus().unsetLink().run()
            }}
          >
            Save
          </Button>
        </Popover.Close>
        {isActive && (
          <Popover.Close>
            <Button 
              type="button" 
              variant="outline"
              size="sm"
              onClick={() => editor.chain().focus().unsetLink().run()}
              title="Remove Link"
            >
              <Unlink size={14} />
            </Button>
          </Popover.Close>
        )}
      </Popover.Content>
    </Popover>
  )
}

const ImageButton = ({ editor }: { editor: TiptapEditor }) => {
  const [url, setUrl] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const objectUrl = URL.createObjectURL(file)
      editor.chain().focus().setImage({ src: objectUrl }).run()
    }
  }

  return (
    <>
      <Popover>
        <Popover.Trigger>
          <button 
          type="button" 
          className={cn(
            "flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-md bg-transparent border-none cursor-pointer transition-colors duration-200 focus-visible:outline-none focus-visible:bg-subtle",
            editor.isActive('image') ? "bg-subtle text-primary" : "text-muted hover:bg-subtle hover:text-default"
          )}
          aria-label="Image"
          title="Image"
        >
          <ImageIcon size={16} />
        </button>
        </Popover.Trigger>
        <Popover.Content placement="bottom" className="flex flex-col gap-2 w-64 p-3 bg-surface border border-default rounded-lg shadow-xl">
          <div className="flex gap-2">
            <Input 
              type="url" 
              value={url} 
              onChange={(e) => setUrl(e.target.value)} 
              placeholder="Image URL..." 
              inputSize="sm"
            />
            <Popover.Close>
              <Button 
                type="button" 
                variant="primary"
                size="sm"
                onClick={() => {
                  if (url) {
                    editor.chain().focus().setImage({ src: url }).run()
                    setUrl('')
                  }
                }}
              >
                Add
              </Button>
            </Popover.Close>
          </div>
          <div className="text-[10px] font-medium text-center text-muted uppercase tracking-wider my-1">OR</div>
          <Popover.Close>
            <Button 
              type="button"
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => fileInputRef.current?.click()}
            >
              Upload File
            </Button>
          </Popover.Close>
        </Popover.Content>
      </Popover>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={(e) => {
          handleUpload(e);
          e.target.value = '';
        }} 
        accept="image/*" 
        className="hidden" 
      />
    </>
  )
}

const ColorPickerPopover = ({ editor, type }: { editor: TiptapEditor; type: 'color' | 'highlight' }) => {
  const currentColor = type === 'color' 
    ? editor.getAttributes('textStyle').color || 'currentColor'
    : editor.getAttributes('highlight').color || 'transparent';

  const setFormatColor = (color: string) => {
    if (type === 'color') {
      editor.chain().focus().setColor(color).run();
    } else {
      editor.chain().focus().toggleHighlight({ color }).run();
    }
  }

  return (
    <ColorPicker 
      value={currentColor} 
      onChange={setFormatColor} 
      icon={type === 'color' ? Palette : Highlighter} 
      title={type === 'color' ? 'Text Color' : 'Highlight Color'} 
    />
  )
}

const TextTypeDropdown = ({ editor }: { editor: TiptapEditor }) => {
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
          className="flex-shrink-0 flex items-center gap-1.5 h-8 px-2 rounded-md hover:bg-subtle text-muted hover:text-default transition-colors text-sm font-medium border-none bg-transparent outline-none focus-visible:outline-none"
        >
          <activeType.icon size={16} />
          <span className="w-20 text-left truncate">{activeType.label}</span>
          <ChevronDown size={14} className="opacity-50" />
        </button>
      </Dropdown.Trigger>
      <Dropdown.Menu className="min-w-[180px]">
        {types.map((type) => (
          <Dropdown.Item
            key={type.value}
            onClick={type.onClick}
            className={type.isActive() ? "bg-subtle font-bold" : ""}
          >
            <div className="flex items-center gap-2">
              <type.icon size={16} className="text-muted" />
              {type.label}
            </div>
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}

const FontSizeDropdown = ({ editor }: { editor: TiptapEditor }) => {
  const sizes = [
    { label: '12px', value: '12px' },
    { label: '14px', value: '14px' },
    { label: '16px', value: '16px' },
    { label: '18px', value: '18px' },
    { label: '20px', value: '20px' },
    { label: '24px', value: '24px' },
    { label: '30px', value: '30px' },
    { label: '36px', value: '36px' },
  ];

  const currentSize = editor.getAttributes('textStyle').fontSize || 'Size';

  return (
    <Dropdown>
      <Dropdown.Trigger>
        <button 
          type="button" 
          className="flex items-center gap-1 h-8 px-2 rounded-md hover:bg-subtle text-muted hover:text-default transition-colors text-sm font-medium border-none bg-transparent outline-none focus-visible:outline-none"
        >
          <span className="w-10 text-left truncate">{currentSize}</span>
          <ChevronDown size={14} className="opacity-50" />
        </button>
      </Dropdown.Trigger>
      <Dropdown.Menu className="max-h-60 overflow-y-auto min-w-[120px]">
        {sizes.map((size) => (
          <Dropdown.Item
            key={size.value}
            onClick={() => editor.chain().focus().setFontSize(size.value).run()}
            className={currentSize === size.value ? "bg-subtle font-bold" : ""}
          >
            {size.label}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}

const FontFamilyDropdown = ({ editor }: { editor: TiptapEditor }) => {
  const fonts = [
    { label: 'Inter', value: 'Inter, sans-serif' },
    { label: 'Arial', value: 'Arial, Helvetica, sans-serif' },
    { label: 'Georgia', value: 'Georgia, serif' },
    { label: 'Times New Roman', value: '"Times New Roman", Times, serif' },
    { label: 'Monospace', value: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' },
  ];

  const currentFontFamily = editor.getAttributes('textStyle').fontFamily;
  const activeFont = fonts.find(f => currentFontFamily === f.value)?.label || 'Font';

  return (
    <Dropdown>
      <Dropdown.Trigger>
        <button 
          type="button" 
          className="flex items-center gap-1 h-8 px-2 rounded-md hover:bg-subtle text-muted hover:text-default transition-colors text-sm font-medium border-none bg-transparent outline-none focus-visible:outline-none"
        >
          <span className="w-16 text-left truncate">{activeFont}</span>
          <ChevronDown size={14} className="opacity-50" />
        </button>
      </Dropdown.Trigger>
      <Dropdown.Menu className="min-w-[150px]">
        {fonts.map((font) => (
          <Dropdown.Item
            key={font.label}
            onClick={() => editor.chain().focus().setFontFamily(font.value).run()}
            className={activeFont === font.label ? "bg-subtle font-bold" : ""}
          >
            {font.label}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}

const TableCreator = ({ editor }: { editor: TiptapEditor }) => {
  const [hovered, setHovered] = useState({ r: 0, c: 0 })

  return (
    <Popover>
      <Popover.Trigger>
        <button 
          type="button"
          className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-md bg-transparent border-none cursor-pointer transition-colors duration-200 text-muted hover:bg-subtle hover:text-default focus-visible:outline-none"
          title="Insert Table"
        >
          <TableIcon size={16} strokeWidth={2} />
        </button>
      </Popover.Trigger>
      <Popover.Content placement="bottom" className="p-3 bg-surface border border-default rounded-lg shadow-xl flex flex-col gap-2">
        <div className="text-xs font-semibold text-muted text-center tracking-wide uppercase mb-1">
          {hovered.r > 0 ? `${hovered.c} x ${hovered.r} Table` : "Insert Table"}
        </div>
        <div className="flex flex-col gap-0.5" onMouseLeave={() => setHovered({ r: 0, c: 0 })}>
          {Array.from({ length: 8 }).map((_, r) => (
            <div key={r} className="flex gap-0.5">
              {Array.from({ length: 8 }).map((_, c) => (
                <Popover.Close key={c}>
                  <button
                    type="button"
                    className={cn(
                      "w-4 h-4 rounded-sm border transition-all duration-75 cursor-pointer outline-none focus:outline-none",
                      r < hovered.r && c < hovered.c 
                        ? "bg-primary/20 border-primary" 
                        : "border-default bg-transparent hover:border-primary"
                    )}
                    onMouseEnter={() => setHovered({ r: r + 1, c: c + 1 })}
                    onClick={() => {
                      editor.chain().focus().insertTable({ rows: r + 1, cols: c + 1, withHeaderRow: false }).run()
                      setHovered({ r: 0, c: 0 })
                    }}
                  />
                </Popover.Close>
              ))}
            </div>
          ))}
        </div>
      </Popover.Content>
    </Popover>
  )
}

const YouTubeButton = ({ editor }: { editor: TiptapEditor }) => {
  const [url, setUrl] = useState('')

  return (
    <Popover>
      <Popover.Trigger>
        <button 
          type="button" 
          className={cn(
            "flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-md bg-transparent border-none cursor-pointer transition-colors duration-200 focus-visible:outline-none focus-visible:bg-subtle",
            editor.isActive('customVideo') ? "bg-subtle text-primary" : "text-muted hover:bg-subtle hover:text-default"
          )}
          aria-label="YouTube"
          title="YouTube Video"
        >
          <Youtube size={16} />
        </button>
      </Popover.Trigger>
      <Popover.Content placement="bottom" className="flex flex-col gap-2 w-64 p-3 bg-surface border border-default rounded-lg shadow-xl">
        <div className="flex gap-2">
          <Input 
            type="url" 
            value={url} 
            onChange={(e) => setUrl(e.target.value)} 
            placeholder="YouTube URL..." 
            inputSize="sm"
          />
          <Popover.Close>
            <Button 
              type="button" 
              variant="primary"
              size="sm"
              onClick={() => {
                if (url) {
                  editor.chain().focus().setVideo({ src: url }).run()
                  setUrl('')
                }
              }}
            >
              Add
            </Button>
          </Popover.Close>
        </div>
      </Popover.Content>
    </Popover>
  )
}

export const EditorToolbar = ({ editor }: { editor: TiptapEditor | null }) => {
  if (!editor) return null

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-default shadow-[0_4px_12px_-4px_rgba(0,0,0,0.08)] bg-surface p-1.5 rounded-t-md sticky top-0 z-10 w-full min-w-0">
      <ToolbarButton
        icon={Undo2} label="Undo"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
      />
      <ToolbarButton
        icon={Redo2} label="Redo"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
      />

      <Separator />

      <TextTypeDropdown editor={editor} />
      <FontFamilyDropdown editor={editor} />
      <FontSizeDropdown editor={editor} />

      <Separator />

      <ToolbarButton
        icon={Bold} label="Bold"
        isActive={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
      />
      <ToolbarButton
        icon={Italic} label="Italic"
        isActive={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
      />
      <ToolbarButton
        icon={UnderlineIcon} label="Underline"
        isActive={editor.isActive('underline')}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        disabled={!editor.can().chain().focus().toggleUnderline().run()}
      />
      <ToolbarButton
        icon={Strikethrough} label="Strikethrough"
        isActive={editor.isActive('strike')}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
      />
      <ToolbarButton
        icon={SubscriptIcon} label="Subscript"
        isActive={editor.isActive('subscript')}
        onClick={() => editor.chain().focus().toggleSubscript().run()}
        disabled={!editor.can().chain().focus().toggleSubscript().run()}
      />
      <ToolbarButton
        icon={SuperscriptIcon} label="Superscript"
        isActive={editor.isActive('superscript')}
        onClick={() => editor.chain().focus().toggleSuperscript().run()}
        disabled={!editor.can().chain().focus().toggleSuperscript().run()}
      />
      <ToolbarButton
        icon={RemoveFormatting} label="Clear Formatting"
        onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
      />

      <Separator />

      <ColorPickerPopover editor={editor} type="color" />
      <ColorPickerPopover editor={editor} type="highlight" />

      <Separator />

      <ToolbarButton
        icon={AlignLeft} label="Align Left"
        isActive={editor.isActive({ textAlign: 'left' })}
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
      />
      <ToolbarButton
        icon={AlignCenter} label="Align Center"
        isActive={editor.isActive({ textAlign: 'center' })}
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
      />
      <ToolbarButton
        icon={AlignRight} label="Align Right"
        isActive={editor.isActive({ textAlign: 'right' })}
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
      />
      <ToolbarButton
        icon={AlignJustify} label="Justify"
        isActive={editor.isActive({ textAlign: 'justify' })}
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
      />

      <Separator />

      <ToolbarButton
        icon={List} label="Bullet List"
        isActive={editor.isActive('bulletList')}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      />
      <ToolbarButton
        icon={ListOrdered} label="Ordered List"
        isActive={editor.isActive('orderedList')}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      />
      <ToolbarButton
        icon={CheckSquare} label="Task List"
        isActive={editor.isActive('taskList')}
        onClick={() => editor.chain().focus().toggleTaskList().run()}
      />
      
      <Separator />

      <TableCreator editor={editor} />
      <ToolbarButton
        icon={Minus} label="Divider"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      />
      <ToolbarButton
        icon={Quote} label="Quote"
        isActive={editor.isActive('blockquote')}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      />
      <ToolbarButton
        icon={Code} label="Code Block"
        isActive={editor.isActive('codeBlock')}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      />
      
      <LinkButton editor={editor} />
      <ImageButton editor={editor} />
      <YouTubeButton editor={editor} />
    </div>
  )
}
