"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { cn } from '../../utils';

export interface KanbanItem {
  id: string;
  content: React.ReactNode;
}

export interface KanbanColumnProps {
  id: string;
  title?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  items: KanbanItem[];
}

export interface KanbanProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  columns: KanbanColumnProps[];
  onChange?: (columns: KanbanColumnProps[]) => void;
  columnClassName?: string;
}

export function Kanban({ columns, onChange, className, columnClassName, ...props }: KanbanProps) {
  const [data, setData] = useState<KanbanColumnProps[]>(columns);

  // Sync internal state if columns prop changes from parent
  useEffect(() => {
    setData(columns);
  }, [columns]);

  const onDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;
    if (!destination) return;
    let destDroppableId = destination.droppableId;
    if (destDroppableId === 'board-spacer') {
      if (data.length === 0) return; // Prevent crash if dropping on spacer of empty board
      destDroppableId = data[data.length - 1].id;
    }

    if (source.droppableId === destDroppableId && source.index === destination.index) return;

    const newData = Array.from(data);

    // Handle Column Dragging
    if (type === 'COLUMN') {
      const [removed] = newData.splice(source.index, 1);
      newData.splice(destination.index, 0, removed);
      setData(newData);
      onChange?.(newData);
      return;
    }

    // Handle Card Dragging
    const sourceColIndex = newData.findIndex(c => c.id === source.droppableId);
    const destColIndex = newData.findIndex(c => c.id === destDroppableId);

    const sourceCol = newData[sourceColIndex];
    const destCol = newData[destColIndex];

    const sourceItems = Array.from(sourceCol.items);
    const destItems = source.droppableId === destDroppableId ? sourceItems : Array.from(destCol.items);

    const [removedItem] = sourceItems.splice(source.index, 1);
    
    // If dropping on the spacer, append to the end of the last column
    const insertIndex = destination.droppableId === 'board-spacer' ? destItems.length : destination.index;
    destItems.splice(insertIndex, 0, removedItem);

    newData[sourceColIndex] = { ...sourceCol, items: sourceItems };
    if (source.droppableId !== destDroppableId) {
      newData[destColIndex] = { ...destCol, items: destItems };
    }

    setData(newData);
    onChange?.(newData);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="board" type="COLUMN" direction="horizontal">
        {(provided) => (
          <div 
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn("font-sans antialiased flex flex-row items-stretch overflow-auto w-full h-full pb-4 px-2", className)} 
            {...props}
          >
            {data.map((col, colIndex) => (
              <Draggable key={col.id} draggableId={col.id} index={colIndex}>
                {(colProvided, colSnapshot) => (
                  <div 
                    ref={colProvided.innerRef}
                    {...colProvided.draggableProps}
                    className={cn(
                      "flex flex-col flex-shrink-0 px-2 max-w-[90vw] max-h-full",
                      columnClassName || "w-[336px]",
                      colSnapshot.isDragging && "z-50"
                    )}
                    style={colProvided.draggableProps.style}
                  >
                    <div className={cn(
                      "flex flex-col w-full h-full bg-subtle rounded-2xl overflow-hidden border border-default",
                      colSnapshot.isDragging && "shadow-2xl ring-2 ring-primary/30 scale-[1.02] rotate-1 opacity-95"
                    )}>
                      <div 
                        {...colProvided.dragHandleProps}
                        className="flex items-center justify-between px-4 py-4 font-semibold text-default shrink-0 cursor-grab active:cursor-grabbing hover:bg-muted transition-colors"
                      >
                        {col.header ? col.header : (
                          <div className="flex items-center gap-2">
                            <span>{col.title}</span>
                            <span className="flex items-center justify-center min-w-[20px] h-[20px] px-1.5 text-[11px] font-medium text-muted bg-muted rounded-full">
                              {col.items.length}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <Droppable droppableId={col.id}>
                        {(colDropProvided, snapshot) => (
                          <div
                            ref={colDropProvided.innerRef}
                            {...colDropProvided.droppableProps}
                            className={cn(
                              "flex-1 p-3 min-h-[150px] rounded-b-2xl mx-1 mb-1",
                              snapshot.isDraggingOver ? "bg-muted ring-1 ring-inset ring-primary/20" : "bg-transparent"
                            )}
                          >
                            {col.items.map((item, index) => (
                              <Draggable key={item.id} draggableId={item.id} index={index}>
                                {(itemProvided, itemSnapshot) => {
                                  const itemNode = (
                                    <div
                                      ref={itemProvided.innerRef}
                                      {...itemProvided.draggableProps}
                                      {...itemProvided.dragHandleProps}
                                      className={cn(
                                        "mb-3 p-4 bg-surface rounded-xl border border-default shadow-sm text-sm text-default cursor-grab active:cursor-grabbing hover:border-strong hover:shadow-md focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary/20 focus-visible:border-primary group",
                                        itemSnapshot.isDragging && "shadow-2xl border-primary ring-2 ring-primary/30 scale-[1.02] rotate-2 opacity-95 z-50"
                                      )}
                                      style={itemProvided.draggableProps.style}
                                    >
                                      {item.content}
                                    </div>
                                  );
                                  
                                  return itemSnapshot.isDragging && typeof document !== 'undefined'
                                    ? createPortal(itemNode, document.body)
                                    : itemNode;
                                }}
                              </Draggable>
                            ))}
                            {colDropProvided.placeholder}
                          </div>
                        )}
                      </Droppable>
                      
                      {col.footer && (
                        <div className="px-3 pb-3 shrink-0">
                          {col.footer}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            
            {/* Dummy spacer Droppable to catch auto-scrolls in the empty space on the right */}
            <Droppable droppableId="board-spacer">
              {(spacerProvided) => (
                <div 
                  ref={spacerProvided.innerRef} 
                  {...spacerProvided.droppableProps}
                  className="flex-1 min-w-[200px] self-stretch"
                >
                  {spacerProvided.placeholder}
                </div>
              )}
            </Droppable>

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
