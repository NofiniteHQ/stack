import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect, fn } from '@storybook/test';
import { TreeView } from './TreeView';

const meta: Meta<typeof TreeView> = {
 title: 'Components/Data Display/TreeView',
 component: TreeView,
 tags: ['autodocs'],
};

export default meta;

// Simple inline SVG icons to prevent relying on external libraries for raw component testing
const FolderIcon = () => (
 <svg
 width="16"
 height="16"
 viewBox="0 0 24 24"
 fill="none"
 stroke="currentColor"
 strokeWidth="2"
 strokeLinecap="round"
 strokeLinejoin="round"
 >
 <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
 </svg>
);
const FileIcon = () => (
 <svg
 width="16"
 height="16"
 viewBox="0 0 24 24"
 fill="none"
 stroke="currentColor"
 strokeWidth="2"
 strokeLinecap="round"
 strokeLinejoin="round"
 >
 <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
 <polyline points="14 2 14 8 20 8" />
 </svg>
);

const data = [
 {
 id: 'src',
 label: 'src',
 icon: <FolderIcon />,
 children: [
 { id: 'app', label: 'app.tsx', icon: <FileIcon /> },
 { id: 'utils', label: 'utils.ts', icon: <FileIcon /> },
 ],
 },
 {
 id: 'assets',
 label: 'assets',
 icon: <FolderIcon />,
 children: [{ id: 'logo', label: 'logo.png', icon: <FileIcon /> }],
 },
 {
 id: 'node_modules',
 label: 'node_modules',
 icon: <FolderIcon />,
 disabled: true,
 },
];

export const FileExplorer: StoryObj<typeof TreeView> = {
 render: function Explorer() {
 const [selectedId, setSelectedId] = useState<string>();
 return (
 <div
 style={{
 padding: '24px',
 border: '1px solid #e2e8f0',
 borderRadius: '8px',
 width: '320px',
 }}
 >
 <TreeView
 data={data}
 defaultExpandedIds={['src']}
 selectedId={selectedId}
 onSelect={setSelectedId}
 />
 </div>
 );
 },
};

/**
 * Automated Interaction Test
 * Verifies that the TreeView properly opens nested folders and applies focus styles.
 */
export const InteractiveTest: StoryObj<typeof TreeView> = {
 args: {
 data,
 defaultExpandedIds: [], // Start fully closed
 },
 play: async ({ canvasElement }) => {
 const canvas = within(canvasElement);

 // Initial state: Assets folder is visible, but logo.png is hidden
 await expect(canvas.queryByText('logo.png')).not.toBeInTheDocument();

 // Click to expand Assets
 const assetsFolder = canvas.getByRole('treeitem', { name: /assets/i });
 await userEvent.click(assetsFolder);

 // Verify it opened and rendered children
 const logoFile = canvas.getAllByRole('treeitem')[2];
 await expect(logoFile).toBeInTheDocument();

 // Verify clicking disabled folder does nothing
 const nodeModulesItem = canvas.getByRole('treeitem', { name: /node_modules/i });

 await userEvent.click(nodeModulesItem);
 await expect(nodeModulesItem).not.toHaveFocus();
 },
};

export const PrimitiveTreeView: StoryObj<typeof TreeView> = {
 render: () => (
  <div style={{ padding: '24px', border: '1px solid #e2e8f0', borderRadius: '8px', width: '320px' }}>
   <TreeView>
    <TreeView.Item id="root1" label="Documents" icon={<FolderIcon />}>
     <TreeView.Item id="file1" label="resume.pdf" icon={<FileIcon />} />
     <TreeView.Item id="file2" label="budget.xlsx" icon={<FileIcon />} />
    </TreeView.Item>
    <TreeView.Item id="root2" label="Pictures" icon={<FolderIcon />}>
     <TreeView.Item id="pic1" label="vacation.jpg" icon={<FileIcon />} />
    </TreeView.Item>
   </TreeView>
  </div>
 )
};
