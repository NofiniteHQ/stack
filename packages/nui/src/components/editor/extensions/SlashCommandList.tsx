import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { cn } from '../../../utils'

export const SlashCommandList = forwardRef((props: any, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const selectItem = (index: number) => {
    const item = props.items[index]
    if (item) {
      props.command(item)
    }
  }

  const upHandler = () => {
    setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length)
  }

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length)
  }

  const enterHandler = () => {
    selectItem(selectedIndex)
  }

  useEffect(() => setSelectedIndex(0), [props.items])

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: any) => {
      if (event.key === 'ArrowUp') {
        upHandler()
        return true
      }
      if (event.key === 'ArrowDown') {
        downHandler()
        return true
      }
      if (event.key === 'Enter') {
        enterHandler()
        return true
      }
      return false
    },
  }))

  if (!props.items.length) {
    return null
  }

  return (
    <div className="flex flex-col gap-1 bg-surface border border-default rounded-lg shadow-xl p-2 w-72 max-h-80 overflow-y-auto">
      <div className="text-xs font-semibold text-muted uppercase tracking-wider px-2 py-1">Basic Blocks</div>
      {props.items.map((item: any, index: number) => (
        <button
          type="button"
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors border-none outline-none focus:outline-none cursor-pointer",
            index === selectedIndex ? "bg-subtle text-primary" : "bg-transparent text-default hover:bg-subtle"
          )}
          key={index}
          onClick={() => selectItem(index)}
        >
          <div className="flex items-center justify-center w-8 h-8 text-muted">
            <item.icon size={18} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium text-default truncate">{item.title}</span>
            <span className="text-xs text-muted truncate">{item.description}</span>
          </div>
        </button>
      ))}
    </div>
  )
})

SlashCommandList.displayName = 'SlashCommandList'
