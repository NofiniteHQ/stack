import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { TreeView, TreeNode } from './TreeView';

const mockData: TreeNode[] = [
 {
 id: '1',
 label: 'Documents',
 children: [
 { id: '1.1', label: 'Resume.pdf' },
 { id: '1.2', label: 'Project.docx' },
 ],
 },
 { id: '2', label: 'Images' },
];

describe('TreeView Component', () => {
 it('should have no accessibility violations', async () => {
 const { container } = render(<TreeView data={mockData} />);
 expect(await axe(container)).toHaveNoViolations();
 });

 it('renders root nodes but hides children by default', () => {
 render(<TreeView data={mockData} />);
 expect(screen.getByText('Documents')).toBeInTheDocument();
 expect(screen.queryByText('Resume.pdf')).not.toBeInTheDocument();
 });

 it('expands a folder on click', async () => {
 const user = userEvent.setup();
 render(<TreeView data={mockData} />);
 
 await user.click(screen.getByText('Documents'));
 
 expect(screen.getByText('Resume.pdf')).toBeInTheDocument();
 });

 it('navigates down and up with Arrow Keys', async () => {
 const user = userEvent.setup();
 render(<TreeView data={mockData} defaultExpandedIds={['1']} />);
 
 // Instead of closest('li'), we grab the elements directly by their WAI-ARIA role!
 const treeItems = screen.getAllByRole('treeitem');
 const firstItem = treeItems[0]; // Documents
 const secondItem = treeItems[1]; // Resume.pdf

 firstItem.focus();
 expect(firstItem).toHaveFocus();

 await user.keyboard('{ArrowDown}');
 expect(secondItem).toHaveFocus();

 await user.keyboard('{ArrowUp}');
 expect(firstItem).toHaveFocus();
 });

 it('expands and collapses with Right/Left arrow keys', async () => {
 const user = userEvent.setup();
 render(<TreeView data={mockData} />);
 
 const rootFolder = screen.getAllByRole('treeitem')[0]; // Documents
 rootFolder.focus();

 // Expand
 await user.keyboard('{ArrowRight}');
 expect(screen.getByText('Resume.pdf')).toBeInTheDocument();

 // Collapse
 await user.keyboard('{ArrowLeft}');
 expect(screen.queryByText('Resume.pdf')).not.toBeInTheDocument();
 });

 it('fires onSelect when a node is clicked or activated', async () => {
 const user = userEvent.setup();
 const onSelectSpy = vi.fn();
 render(<TreeView data={mockData} onSelect={onSelectSpy} />);
 
 const imageNode = screen.getByText('Images');
 await user.click(imageNode);

 expect(onSelectSpy).toHaveBeenCalledWith('2', expect.objectContaining({ id: '2', label: 'Images' }));
 });
});