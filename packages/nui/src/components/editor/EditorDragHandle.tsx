import React, { useEffect, useState, useRef } from 'react'
import { Editor } from '@tiptap/react'
import { GripVertical } from 'lucide-react'

interface EditorDragHandleProps {
  editor: Editor | null
}

export const EditorDragHandle: React.FC<EditorDragHandleProps> = ({ editor }) => {
  const [handleStyle, setHandleStyle] = useState<React.CSSProperties>({ opacity: 0, top: 0, left: 0, pointerEvents: 'none' })
  const [currentNode, setCurrentNode] = useState<Element | null>(null)
  const dragHandleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!editor) return

    const handleMouseMove = (event: MouseEvent) => {
      const view = editor.view
      if (!view.dom.parentElement) return

      // Find the prose mirror node we are hovering over
      const node = document.elementFromPoint(event.clientX, event.clientY)
      
      // Look up the tree for a top-level block element directly inside ProseMirror
      let blockNode = node
      while (blockNode && blockNode.parentElement && !blockNode.parentElement.classList.contains('ProseMirror')) {
        blockNode = blockNode.parentElement
      }

      if (blockNode && blockNode.parentElement?.classList.contains('ProseMirror')) {
        setCurrentNode(blockNode)
        const rect = blockNode.getBoundingClientRect()
        const editorRect = view.dom.parentElement.getBoundingClientRect()

        setHandleStyle({
          opacity: 1,
          top: rect.top - editorRect.top + 4, // slight offset for alignment
          left: -28, // position outside the left edge
          pointerEvents: 'auto',
        })
      } else {
        // Hide if we leave the blocks
        const handleRect = dragHandleRef.current?.getBoundingClientRect()
        if (handleRect && event.clientX >= handleRect.left && event.clientX <= handleRect.right && event.clientY >= handleRect.top && event.clientY <= handleRect.bottom) {
           return // We are hovering the handle itself
        }
        setHandleStyle(s => ({ ...s, opacity: 0, pointerEvents: 'none' }))
        setCurrentNode(null)
      }
    }

    const editorDom = editor.view.dom.parentElement
    if (editorDom) {
      editorDom.addEventListener('mousemove', handleMouseMove)
    }

    return () => {
      if (editorDom) editorDom.removeEventListener('mousemove', handleMouseMove)
    }
  }, [editor])

  const handleDragStart = (e: React.DragEvent) => {
    if (!currentNode || !editor) {
      e.preventDefault()
      return
    }

    const view = editor.view
    const pos = view.posAtDOM(currentNode, 0)
    if (pos < 0) {
      e.preventDefault()
      return
    }

    const node = view.state.doc.nodeAt(pos)
    if (!node) {
      e.preventDefault()
      return
    }

    // Set up Tiptap drag data
    const slice = view.state.doc.slice(pos, pos + node.nodeSize)
    const { dom, text } = view.serializeForClipboard(slice)
    
    e.dataTransfer.clearData()
    e.dataTransfer.setData('text/html', dom.innerHTML)
    e.dataTransfer.setData('text/plain', text)
    e.dataTransfer.effectAllowed = 'move'
    
    // Select the node so user sees what is being dragged
    editor.commands.setNodeSelection(pos)
  }

  return (
    <div
      ref={dragHandleRef}
      draggable
      onDragStart={handleDragStart}
      className="absolute flex items-center justify-center w-6 h-6 rounded-md cursor-grab active:cursor-grabbing text-muted hover:bg-subtle hover:text-default transition-opacity duration-150 z-50"
      style={handleStyle}
    >
      <GripVertical size={16} />
    </div>
  )
}
