"use client";

import React, { useState, useCallback, useRef, forwardRef, createContext, useContext } from 'react';
import { cn } from '../../utils';

/* ============================================================
 * Types & Context
 * ============================================================ */

export interface TreeContextValue {
 expandedIds: Set<string>;
 toggleExpand: (id: string, e?: React.MouseEvent) => void;
 selectedId?: string;
 onSelect?: (id: string, node: any) => void;
 treeIdPrefix: string;
}

export const TreeContext = createContext<TreeContextValue | null>(null);

export interface TreeNode {
 id: string;
 label: React.ReactNode;
 icon?: React.ReactNode;
 disabled?: boolean;
 children?: TreeNode[];
}

export interface TreeViewProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
 data?: TreeNode[];
 selectedId?: string;
 defaultExpandedIds?: string[];
 onSelect?: (id: string, node: any) => void;
 children?: React.ReactNode;
}

/* ============================================================
 * TreeView Primitive
 * ============================================================ */

export const TreeViewRoot = forwardRef<HTMLDivElement, TreeViewProps>(({
 data,
 selectedId,
 defaultExpandedIds = [],
 onSelect,
 className,
 children,
 ...props
}, ref) => {
 const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(defaultExpandedIds));
 const treeRef = useRef<HTMLUListElement>(null);
 
 const baseId = React.useId();
 const treeIdPrefix = `tree-${baseId.replace(/:/g, '')}`;

 const toggleExpand = useCallback((id: string, e?: React.MouseEvent) => {
 e?.stopPropagation();
 setExpandedIds((prev) => {
 const next = new Set(prev);
 if (next.has(id)) next.delete(id);
 else next.add(id);
 return next;
 });
 }, []);

 const handleKeyDown = useCallback(
 (e: React.KeyboardEvent) => {
 if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End', '', 'Enter'].includes(e.key)) {
 e.preventDefault();
 }
 e.stopPropagation();

 const target = e.target as HTMLLIElement;
 if (target.getAttribute('role') !== 'treeitem') return;

 const getVisibleNodes = () => {
 if (!treeRef.current) return [];
 return Array.from(
 treeRef.current.querySelectorAll('[role="treeitem"]:not([aria-disabled="true"])')
 ) as HTMLLIElement[];
 };

 const nodes = getVisibleNodes();
 const currentIndex = nodes.indexOf(target);
 if (currentIndex === -1) return;

 const isExpanded = target.getAttribute('aria-expanded') === 'true';
 const hasChildren = target.hasAttribute('aria-expanded');
 const id = target.id.replace(`${treeIdPrefix}-`, '');

 switch (e.key) {
 case 'Enter':
 case ' ':
 if (target.getAttribute('aria-disabled') === 'true') return;
 if (hasChildren) toggleExpand(id);
 target.click();
 break;

 case 'ArrowRight':
 if (hasChildren && !isExpanded) toggleExpand(id);
 else if (hasChildren && isExpanded) nodes[currentIndex + 1]?.focus();
 break;

 case 'ArrowLeft':
 if (hasChildren && isExpanded) toggleExpand(id);
 else {
 const parent = target.parentElement?.closest('[role="treeitem"]') as HTMLElement;
 parent?.focus();
 }
 break;

 case 'ArrowDown':
 nodes[currentIndex + 1]?.focus();
 break;

 case 'ArrowUp':
 nodes[currentIndex - 1]?.focus();
 break;

 case 'Home':
 nodes[0]?.focus();
 break;

 case 'End':
 nodes[nodes.length - 1]?.focus();
 break;
 }
 },
 [treeIdPrefix, toggleExpand]
 );

 const renderNodes = (nodes: TreeNode[], level: number = 1): React.ReactNode => {
 return nodes.map((node, index) => {
  const isFirst = level === 1 && index === 0;
  return (
  <TreeItem
  key={node.id}
  id={node.id}
  label={node.label}
  icon={node.icon}
  disabled={node.disabled}
  level={level}
  tabIndex={isFirst ? 0 : -1}
  >
  {node.children && node.children.length > 0 && renderNodes(node.children, level + 1)}
  </TreeItem>
  );
 });
 };

 return (
 <TreeContext.Provider value={{ expandedIds, toggleExpand, selectedId, onSelect, treeIdPrefix }}>
 <div ref={ref} className={cn("font-sans text-default select-none", className)} {...props}>
 <ul role="tree" className="list-none m-0 p-0" ref={treeRef} onKeyDown={handleKeyDown}>
 {data ? renderNodes(data) : children}
 </ul>
 </div>
 </TreeContext.Provider>
 );
});

TreeViewRoot.displayName = 'TreeView';

/* ============================================================
 * TreeItem Primitive
 * ============================================================ */

export interface TreeItemProps extends Omit<React.HTMLAttributes<HTMLLIElement>, 'id' | 'tabIndex'> {
 id: string;
 label: React.ReactNode;
 icon?: React.ReactNode;
 disabled?: boolean;
 children?: React.ReactNode;
 level?: number;
 tabIndex?: number;
}

export const TreeItem = forwardRef<HTMLLIElement, TreeItemProps>(({
 id,
 label,
 icon,
 disabled,
 children,
 level = 1,
 className,
 tabIndex,
 ...props
}, ref) => {
 const context = useContext(TreeContext);
 if (!context) throw new Error('TreeItem must be used within TreeView');

 const { expandedIds, toggleExpand, selectedId, onSelect, treeIdPrefix } = context;
 const isExpanded = expandedIds.has(id);
 const isSelected = selectedId === id;
 const hasChildren = React.Children.count(children) > 0;
 
 return (
 <li
 ref={ref}
 id={`${treeIdPrefix}-${id}`}
 role="treeitem"
 aria-expanded={hasChildren ? isExpanded : undefined}
 aria-selected={isSelected}
 aria-disabled={disabled}
 tabIndex={tabIndex ?? -1} 
 className={cn("relative outline-none focus-visible:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nui-fg-default)] group", className)}
 onClick={(e) => {
 e.stopPropagation();
 if (disabled) return;
 (e.currentTarget as HTMLElement).focus();
 if (hasChildren) toggleExpand(id, e);
 onSelect?.(id, { id, label, icon, disabled });
 }}
 {...props}
 >
 <div 
 className={cn(
 "flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-all duration-200 hover:text-primary group-focus-visible:outline-none group-focus-visible:outline group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-[var(--nui-fg-default)] group-focus-visible:bg-subtle",
 isSelected ? "text-primary font-medium" : "text-subtle",
 disabled && "opacity-50 cursor-not-allowed"
 )}
 style={{ paddingLeft: `${(level - 1) * 16}px` }}
 >
 <span 
 className={cn(
 "flex items-center justify-center w-5 h-5 rounded-sm text-muted hover:bg-subtle hover:text-default transition-colors",
 !hasChildren && "invisible pointer-events-none"
 )}
 onClick={(e) => {
 if (hasChildren) toggleExpand(id, e);
 }}
 >
 <svg 
 width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
 className={cn("transition-transform duration-200", isExpanded && "rotate-90")}
 aria-hidden="true"
 >
 <polyline points="9 18 15 12 9 6"></polyline>
 </svg>
 </span>

 {icon && (
 <span className="flex items-center text-inherit opacity-80" aria-hidden="true">{icon}</span>
 )}

 <span className="text-sm whitespace-nowrap overflow-hidden text-ellipsis">{label}</span>
 </div>

 {hasChildren && isExpanded && (
 <ul role="group" className="list-none m-0 p-0">
 {children}
 </ul>
 )}
 </li>
 );
});

TreeItem.displayName = 'TreeView.Item';

/* ============================================================
 * Export
 * ============================================================ */

export const TreeView = Object.assign(TreeViewRoot, {
  Item: TreeItem,
});