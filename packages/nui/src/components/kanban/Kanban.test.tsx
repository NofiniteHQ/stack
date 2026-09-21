import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Kanban, KanbanColumnProps } from './Kanban';

describe('Kanban Component', () => {
  const columns: KanbanColumnProps[] = [
    {
      id: 'todo',
      title: 'To Do',
      items: [
        { id: '1', content: <span>Task 1</span> },
        { id: '2', content: <span>Task 2</span> },
      ],
    },
    {
      id: 'done',
      title: 'Done',
      items: [{ id: '3', content: <span>Task 3</span> }],
    },
  ];

  it('renders columns and items accurately', () => {
    const { container } = render(<Kanban columns={columns} />);

    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
    expect(screen.getByText('Task 3')).toBeInTheDocument();
    expect(container.querySelector('.kanban-board')).toBeInTheDocument();
  });
});
