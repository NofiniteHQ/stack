import React, { useRef, useState, useCallback, useEffect } from 'react'
import { NodeViewWrapper, NodeViewProps, ReactNodeViewRenderer } from '@tiptap/react'
import { Image as BaseImage } from '@tiptap/extension-image'

const ResizableImageNode = (props: NodeViewProps) => {
  const { node, updateAttributes, selected } = props
  const [isResizing, setIsResizing] = useState(false)
  const imageRef = useRef<HTMLImageElement>(null)
  
  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsResizing(true)
  }, [])
  
  useEffect(() => {
    if (!isResizing) return
    
    const onMouseMove = (e: MouseEvent) => {
      if (!imageRef.current) return
      const rect = imageRef.current.getBoundingClientRect()
      // Calculate new width based on mouse X position relative to image left edge
      const newWidth = Math.max(50, e.clientX - rect.left)
      updateAttributes({ width: newWidth, height: 'auto' })
    }
    
    const onMouseUp = (e: MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsResizing(false)
    }
    
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [isResizing, updateAttributes])
  
  return (
    <NodeViewWrapper className={`relative inline-block my-4 max-w-full ${node.attrs.class || ''}`}>
      {node.attrs.uploading ? (
        <div className="flex flex-col items-center justify-center w-full max-w-md h-48 bg-subtle rounded-md border-2 border-dashed border-default animate-pulse">
           <span className="text-muted text-sm font-medium">Uploading image...</span>
        </div>
      ) : (
        <>
          <img
            ref={imageRef}
            src={node.attrs.src}
            alt={node.attrs.alt}
            title={node.attrs.title}
            className={`max-w-full rounded-md shadow-sm transition-all duration-100 ${
              selected ? 'ring-2 ring-primary ring-offset-2' : ''
            }`}
            style={{ width: node.attrs.width || 'auto', height: node.attrs.height || 'auto' }}
          />
          {node.attrs.caption && (
            <div className="text-xs text-muted text-center mt-2 font-medium italic">
              {node.attrs.caption}
            </div>
          )}
        </>
      )}
      {selected && (
        <div
          className="absolute bottom-0 right-0 w-3 h-3 bg-primary border-2 border-white rounded-full cursor-nwse-resize transform translate-x-1/2 translate-y-1/2 shadow-sm z-10"
          onMouseDown={startResizing}
          title="Drag to resize"
        />
      )}
    </NodeViewWrapper>
  )
}

export const ResizableImage = BaseImage.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
      },
      height: {
        default: null,
      },
      class: {
        default: null,
      },
      caption: {
        default: null,
      },
      uploading: {
        default: false,
      },
    }
  },
  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageNode)
  },
})
