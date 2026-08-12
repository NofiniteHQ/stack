import { Extension } from '@tiptap/core'
import Suggestion from '@tiptap/suggestion'
import { ReactRenderer } from '@tiptap/react'
import tippy, { Instance as TippyInstance } from 'tippy.js'
import { SlashCommandList } from './SlashCommandList'
import { Heading1, Heading2, Heading3, List, ListOrdered, CheckSquare, Quote, Code, Minus, Table, Youtube, Link as LinkIcon, ChevronDown, Sigma } from 'lucide-react'

export const getSuggestionItems = ({ query }: { query: string }) => {
  return [
    { title: 'Heading 1', description: 'Large section heading', icon: Heading1, searchTerms: ['title', 'large', 'h1'], command: ({ editor, range }: any) => { editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run() } },
    { title: 'Heading 2', description: 'Medium section heading', icon: Heading2, searchTerms: ['subtitle', 'medium', 'h2'], command: ({ editor, range }: any) => { editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run() } },
    { title: 'Heading 3', description: 'Small section heading', icon: Heading3, searchTerms: ['small', 'h3'], command: ({ editor, range }: any) => { editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run() } },
    { title: 'Bullet List', description: 'Create a simple bulleted list', icon: List, searchTerms: ['ul', 'list'], command: ({ editor, range }: any) => { editor.chain().focus().deleteRange(range).toggleBulletList().run() } },
    { title: 'Numbered List', description: 'Create a list with numbering', icon: ListOrdered, searchTerms: ['ol', 'list'], command: ({ editor, range }: any) => { editor.chain().focus().deleteRange(range).toggleOrderedList().run() } },
    { title: 'Task List', description: 'Track tasks with checkboxes', icon: CheckSquare, searchTerms: ['todo', 'task', 'list'], command: ({ editor, range }: any) => { editor.chain().focus().deleteRange(range).toggleTaskList().run() } },
    { title: 'Quote', description: 'Capture a quote', icon: Quote, searchTerms: ['blockquote'], command: ({ editor, range }: any) => { editor.chain().focus().deleteRange(range).toggleBlockquote().run() } },
    { title: 'Code Block', description: 'Insert a code snippet', icon: Code, searchTerms: ['codeblock'], command: ({ editor, range }: any) => { editor.chain().focus().deleteRange(range).toggleCodeBlock().run() } },
    { title: 'Divider', description: 'Visually divide sections', icon: Minus, searchTerms: ['hr', 'line', 'divider'], command: ({ editor, range }: any) => { editor.chain().focus().deleteRange(range).setHorizontalRule().run() } },
    { title: 'Table', description: 'Insert a 3x3 table', icon: Table, searchTerms: ['table'], command: ({ editor, range }: any) => { editor.chain().focus().deleteRange(range).insertTable({ rows: 3, cols: 3, withHeaderRow: false }).run() } },
    { title: 'Video Embed', description: 'Embed a playable video', icon: Youtube, searchTerms: ['video', 'youtube', 'embed'], command: ({ editor, range }: any) => { 
      const url = prompt('Enter Video URL (YouTube, Vimeo, etc):')
      if (url) {
        editor.chain().focus().deleteRange(range).setVideo({ src: url }).run()
      } else {
        editor.chain().focus().deleteRange(range).run()
      }
    }},
    { title: 'Bookmark', description: 'Create a rich link preview', icon: LinkIcon, searchTerms: ['bookmark', 'link', 'preview', 'embed'], command: ({ editor, range }: any) => { 
      const url = prompt('Enter URL to bookmark:')
      if (url) {
        editor.chain().focus().deleteRange(range).setLinkPreview({ url }).run()
      } else {
        editor.chain().focus().deleteRange(range).run()
      }
    }},
    { title: 'Toggle List', description: 'Hide or show content', icon: ChevronDown, searchTerms: ['toggle', 'accordion', 'collapsible'], command: ({ editor, range }: any) => { editor.chain().focus().deleteRange(range).setCollapsibleBlock().run() } },
    { title: 'Block Math', description: 'Insert a KaTeX equation block', icon: Sigma, searchTerms: ['math', 'equation', 'katex', 'latex'], command: ({ editor, range }: any) => { editor.chain().focus().deleteRange(range).setBlockMath().run() } },
  ].filter(item => {
    if (typeof query === 'string' && query.length > 0) {
      const search = query.toLowerCase()
      return item.title.toLowerCase().includes(search) || item.searchTerms.some(term => term.includes(search))
    }
    return true
  })
}

const renderItems = () => {
  let component: ReactRenderer
  let popup: TippyInstance[]

  return {
    onStart: (props: any) => {
      component = new ReactRenderer(SlashCommandList, {
        props,
        editor: props.editor,
      })

      if (!props.clientRect) {
        return
      }

      popup = tippy('body', {
        getReferenceClientRect: props.clientRect,
        appendTo: () => document.body,
        content: component.element,
        showOnCreate: true,
        interactive: true,
        trigger: 'manual',
        placement: 'bottom-start',
      })
    },

    onUpdate(props: any) {
      component.updateProps(props)

      if (!props.clientRect) {
        return
      }

      popup[0].setProps({
        getReferenceClientRect: props.clientRect,
      })
    },

    onKeyDown(props: any) {
      if (props.event.key === 'Escape') {
        popup[0].hide()
        return true
      }

      return (component?.ref as any)?.onKeyDown(props)
    },

    onExit() {
      popup[0].destroy()
      component.destroy()
    },
  }
}

export const SlashCommand = Extension.create({
  name: 'slashCommand',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        command: ({ editor, range, props }: any) => {
          props.command({ editor, range })
        },
      },
    }
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
        items: getSuggestionItems,
        render: renderItems,
      }),
    ]
  },
})
