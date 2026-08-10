import React, { forwardRef, useEffect } from 'react';
import { TreeView, TreeItem, TreeViewProps } from './TreeView';

export interface DataTreeNode {
 id: string;
 label: React.ReactNode;
 icon?: React.ReactNode;
 children?: DataTreeNode[];
 disabled?: boolean;
}

export interface DataTreeProps extends Omit<TreeViewProps, 'children'> {
 nodes: DataTreeNode[];
}

export const DataTree = forwardRef<HTMLDivElement, DataTreeProps>(({
 nodes,
 ...props
}, ref) => {
 const renderNodes = (nodesToRender: DataTreeNode[], level = 1) => {
 return nodesToRender.map((node, index) => {
 // The roving tabindex allows the first node to be focused initially
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
 <TreeView ref={ref} {...props}>
 {renderNodes(nodes)}
 </TreeView>
 );
});

DataTree.displayName = 'DataTree';
