"use client";

import React, { useState, useCallback, useRef, forwardRef } from 'react';
import { cn } from '../../utils';
import './TreeView.css';

/* ============================================================
 * Types
 * ============================================================ */

export interface TreeNode {
  /** Unique identifier for the node */
  id: string;
  /** Text or element to display */
  label: React.ReactNode;
  /** Optional icon to display next to the label */
  icon?: React.ReactNode;
  /** Nested children nodes */
  children?: TreeNode[];
  /** Prevents interaction and applies muted styles */
  disabled?: boolean;
}

export interface TreeViewProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** The hierarchical data structure to render */
  data: TreeNode[];
  /** The ID of the currently selected node (Controlled) */
  selectedId?: string;
  /** Array of node IDs to expand by default on initial render */
  defaultExpandedIds?: string[];
  /** Callback fired when a node is selected */
  onSelect?: (id: string, node: TreeNode) => void;
}

/* ============================================================
 * Component
 * ============================================================ */

/**
 * TreeView Component
 * * A hierarchical list display with nested collapsible folders.
 * * Fully WAI-ARIA compliant with a smart roving tabindex for keyboard navigation.
 */
export const TreeView = forwardRef<HTMLDivElement, TreeViewProps>(({
  data,
  selectedId,
  defaultExpandedIds = [],
  onSelect,
  className,
  ...props
}, ref) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(defaultExpandedIds));
  const treeRef = useRef<HTMLUListElement>(null);
  
  // Generate a unique prefix so multiple TreeViews on the same page never clash IDs
  const baseId = React.useId();
  // Strip the colons that React adds to make it strictly valid for query selectors
  const treeIdPrefix = `nui-tree-${baseId.replace(/:/g, '')}`;

  const toggleExpand = useCallback((id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  /* ----------------------------------------------------
     Keyboard Navigation (WAI-ARIA Standard)
  ---------------------------------------------------- */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, node: TreeNode, parentNode?: TreeNode) => {
      // 1. Instantly kill all default browser scrolling for arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End', ' ', 'Enter'].includes(e.key)) {
        e.preventDefault();
      }
      
      // 2. Stop parent folders from stealing the keypress
      e.stopPropagation();

      const target = e.currentTarget as HTMLLIElement;
      const isExpanded = expandedIds.has(node.id);
      const hasChildren = !!node.children?.length;

      // Get all currently visible nodes in the exact DOM order
      const getVisibleNodes = () => {
        if (!treeRef.current) return [];
        return Array.from(
          treeRef.current.querySelectorAll('[role="treeitem"]:not([aria-disabled="true"])')
        ) as HTMLLIElement[];
      };

      const nodes = getVisibleNodes();
      const currentIndex = nodes.indexOf(target);

      switch (e.key) {
        case 'Enter':
        case ' ':
          if (node.disabled) return;
          // Modern UX: Enter/Space should expand/collapse folders
          if (hasChildren) toggleExpand(node.id);
          onSelect?.(node.id, node);
          break;

        case 'ArrowRight':
          if (hasChildren && !isExpanded) {
            // Closed folder -> Open it
            toggleExpand(node.id);
          } else if (hasChildren && isExpanded) {
            // Open folder -> The very next visible node in the DOM is ALWAYS its first child!
            nodes[currentIndex + 1]?.focus();
          }
          break;

        case 'ArrowLeft':
          if (hasChildren && isExpanded) {
            // Open folder -> Close it
            toggleExpand(node.id);
          } else if (parentNode) {
            // Closed folder or File -> Safely find parent by checking the end of the ID
            const parentEl = nodes.find(n => n.id.endsWith(`-${parentNode.id}`));
            parentEl?.focus();
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
    [expandedIds, toggleExpand, onSelect]
  );

  /* ----------------------------------------------------
     Recursive Render Function
  ---------------------------------------------------- */
  const renderTree = (nodes: TreeNode[], level = 1, parentNode?: TreeNode) => {
    return (
      <ul
        role={level === 1 ? 'tree' : 'group'}
        className={cn("nui-tree", level > 1 && "nui-tree--nested")}
        ref={level === 1 ? treeRef : undefined}
      >
        {nodes.map((node, index) => {
          const isExpanded = expandedIds.has(node.id);
          const isSelected = selectedId === node.id;
          const hasChildren = !!node.children?.length;
          
          // Only the first item in the entire tree is tabbable by default (Roving Tabindex)
          const isTabbable = level === 1 && index === 0;

          return (
            <li
              key={node.id}
              id={`${treeIdPrefix}-${node.id}`} 
              role="treeitem"
              aria-expanded={hasChildren ? isExpanded : undefined}
              aria-selected={isSelected}
              aria-disabled={node.disabled}
              tabIndex={isTabbable ? 0 : -1}
              className={cn(
                "nui-tree-item",
                isSelected && "nui-tree-item--selected",
                node.disabled && "nui-tree-item--disabled"
              )}
              onKeyDown={(e) => handleKeyDown(e, node, parentNode)} 
              onClick={(e) => {
                e.stopPropagation();
                if (node.disabled) return;
                
                (e.currentTarget as HTMLElement).focus();
                
                if (hasChildren) {
                  toggleExpand(node.id);
                }
                onSelect?.(node.id, node);
              }}
            >
              <div 
                className="nui-tree-item-content"
                style={{ paddingLeft: `${(level - 1) * 16}px` }}
              >
                <span 
                  className={cn("nui-tree-chevron", !hasChildren && "nui-tree-chevron--hidden")}
                  onClick={(e) => {
                    if (hasChildren) toggleExpand(node.id, e);
                  }}
                >
                  <svg 
                    width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    className={cn("nui-tree-chevron-icon", isExpanded && "nui-tree-chevron-icon--open")}
                    aria-hidden="true"
                  >
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </span>

                {node.icon && (
                  <span className="nui-tree-icon" aria-hidden="true">{node.icon}</span>
                )}

                <span className="nui-tree-label">{node.label}</span>
              </div>

              {hasChildren && isExpanded && node.children && (
                renderTree(node.children, level + 1, node) // Pass 'node' as the parent for the next level
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div ref={ref} className={cn("nui-tree-wrapper", className)} {...props}>
      {renderTree(data)}
    </div>
  );
});

TreeView.displayName = 'TreeView';