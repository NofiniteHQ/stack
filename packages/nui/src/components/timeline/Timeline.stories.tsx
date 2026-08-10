import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Timeline, TimelineItem } from './Timeline';

const meta = {
 title: 'Components/Enterprise/Timeline',
 component: Timeline,
 parameters: {
 layout: 'padded',
 },
} satisfies Meta<typeof Timeline>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockItems: TimelineItem[] = [
 {
 id: '1',
 time: 'August 10, 2026',
 title: 'Project Kickoff',
 description: 'Initial meeting with stakeholders to discuss the scope and requirements of the new UI component library.',
 status: 'success',
 },
 {
 id: '2',
 time: 'August 15, 2026',
 title: 'Design System Approved',
 description: 'The core aesthetic including glassmorphism and semantic tokens has been signed off by the design team.',
 status: 'primary',
 },
 {
 id: '3',
 time: 'August 20, 2026',
 title: 'Development Phase',
 description: 'Currently building advanced components like Kanban and Timeline.',
 status: 'warning',
 },
 {
 id: '4',
 time: 'September 1, 2026',
 title: 'Production Release',
 description: 'Scheduled release of version 2.1 to NPM registry.',
 status: 'default',
 },
];

export const Vertical: Story = {
 args: {
 items: mockItems,
 orientation: 'vertical',
 },
};

export const Horizontal: Story = {
 args: {
 items: mockItems,
 orientation: 'horizontal',
 },
};
