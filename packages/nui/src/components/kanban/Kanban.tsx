"use client";

import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { cn } from '../../utils';

export interface KanbanItem {
 id: string;
 content: React.ReactNode;
}

export interface KanbanColumnProps {
 id: string;
 title: string;
 items: KanbanItem[];
}

export interface KanbanProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
 columns: KanbanColumnProps[];
 onChange?: (columns: KanbanColumnProps[]) => void;
}

export function Kanban({ columns, onChange, className, ...props }: KanbanProps) {
 const [data, setData] = useState<KanbanColumnProps[]>(columns);

 const onDragEnd = (result: DropResult) => {
 const { source, destination } = result;

 if (!destination) return;

 if (
 source.droppableId === destination.droppableId &&
 source.index === destination.index
 ) {
 return;
 }

 const newData = Array.from(data);
 const sourceColIndex = newData.findIndex(c => c.id === source.droppableId);
 const destColIndex = newData.findIndex(c => c.id === destination.droppableId);

 const sourceCol = newData[sourceColIndex];
 const destCol = newData[destColIndex];

 const sourceItems = Array.from(sourceCol.items);
 const destItems = source.droppableId === destination.droppableId ? sourceItems : Array.from(destCol.items);

 const [removed] = sourceItems.splice(source.index, 1);
 destItems.splice(destination.index, 0, removed);

 newData[sourceColIndex] = { ...sourceCol, items: sourceItems };
 if (source.droppableId !== destination.droppableId) {
 newData[destColIndex] = { ...destCol, items: destItems };
 }

 setData(newData);
 onChange?.(newData);
 };

 return (
 <div className={cn("flex flex-row items-start gap-4 overflow-x-auto p-4 w-full", className)} {...props}>
 <DragDropContext onDragEnd={onDragEnd}>
 {data.map((col) => (
 <div key={col.id} className="flex flex-col flex-shrink-0 w-80 max-w-[85vw] bg-subtle rounded-xl border border-default shadow-sm overflow-hidden">
 <div className="px-4 py-3 border-b border-default bg-subtle font-semibold text-default">
 {col.title}
 <span className="ml-2 text-xs font-normal text-muted bg-surface px-2 py-0.5 rounded-full border border-default">
 {col.items.length}
 </span>
 </div>
 
 <Droppable droppableId={col.id}>
 {(provided, snapshot) => (
 <div
 ref={provided.innerRef}
 {...provided.droppableProps}
 className={cn(
 "flex-1 p-3 min-h-[150px] transition-colors duration-200",
 snapshot.isDraggingOver ? "bg-subtle" : "bg-transparent"
 )}
 >
 {col.items.map((item, index) => (
 <Draggable key={item.id} draggableId={item.id} index={index}>
 {(provided, snapshot) => (
 <div
 ref={provided.innerRef}
 {...provided.draggableProps}
 {...provided.dragHandleProps}
 className={cn(
 "mb-3 p-4 bg-surface rounded-lg border border-default shadow-sm text-sm text-default will-change-transform transition-all duration-200 cursor-grab active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
 snapshot.isDragging && "shadow-xl border-primary ring-2 ring-primary ring-offset-2 ring-offset-surface scale-[1.02] rotate-2 opacity-90 z-50"
 )}
 style={provided.draggableProps.style}
 >
 {item.content}
 </div>
 )}
 </Draggable>
 ))}
 {provided.placeholder}
 </div>
 )}
 </Droppable>
 </div>
 ))}
 </DragDropContext>
 </div>
 );
}
