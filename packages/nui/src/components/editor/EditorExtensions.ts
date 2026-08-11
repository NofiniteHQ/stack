import { StarterKit } from '@tiptap/starter-kit'
import { Placeholder } from '@tiptap/extension-placeholder'
import { Link } from '@tiptap/extension-link'
import { ResizableImage } from './extensions/ResizableImage'
import { FontSize } from './extensions/FontSize'
import { Underline } from '@tiptap/extension-underline'
import { TextAlign } from '@tiptap/extension-text-align'
import { Color } from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
import { Highlight } from '@tiptap/extension-highlight'
import { TaskItem } from '@tiptap/extension-task-item'
import { TaskList } from '@tiptap/extension-task-list'
import { CharacterCount } from '@tiptap/extension-character-count'
import { Table } from '@tiptap/extension-table'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import { TableRow } from '@tiptap/extension-table-row'
import { Focus } from '@tiptap/extension-focus'
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight'
import { FontFamily } from '@tiptap/extension-font-family'
import { Subscript } from '@tiptap/extension-subscript'
import { Superscript } from '@tiptap/extension-superscript'
import { all, createLowlight } from 'lowlight'

const lowlight = createLowlight(all)



export const getEditorExtensions = (placeholder?: string) => [
  StarterKit.configure({
    codeBlock: false,
    heading: { levels: [1, 2, 3] },
  }),
  Placeholder.configure({
    placeholder: placeholder || 'Start writing...',
  }),
  Link.configure({
    openOnClick: false,
  }),
  ResizableImage,
  Underline,
  Color,
  TextStyle,
  FontSize,
  Highlight.configure({ multicolor: true }),
  TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),
  TaskList,
  TaskItem.configure({
    nested: true,
  }),
  CharacterCount,
  Table.configure({
    resizable: true,
  }),
  TableRow,
  TableHeader,
  TableCell,
  Focus.configure({
    className: 'has-focus',
    mode: 'all',
  }),
  CodeBlockLowlight.configure({
    lowlight,
  }),
  FontFamily,
  Subscript,
  Superscript,
]
