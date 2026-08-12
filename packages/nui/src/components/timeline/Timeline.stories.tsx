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
 data: mockItems,
 orientation: 'vertical',
 },
};

export const PrimitiveMode: Story = {
 render: () => (
  <Timeline orientation="vertical">
   <Timeline.Item>
    <Timeline.Node status="success" />
    <Timeline.Content time="10:00 AM" title="Primitive Node 1" description="This node was manually composed using the underlying primitives." />
   </Timeline.Item>
   <Timeline.Item>
    <Timeline.Node status="primary" />
    <Timeline.Content time="11:30 AM" title="Primitive Node 2" description="No data prop required." />
   </Timeline.Item>
  </Timeline>
 )
};

export const Horizontal: Story = {
 args: {
 data: mockItems,
 orientation: 'horizontal',
 },
};

import { CheckCircle2, Rocket, Code2, PackageCheck } from 'lucide-react';

export const WithIcons: Story = {
 args: {
 data: [
  {
  id: '1',
  time: 'Phase 1',
  title: 'Project Kickoff',
  description: 'Initial planning and requirement gathering.',
  status: 'success',
  icon: <CheckCircle2 size={16} />
  },
  {
  id: '2',
  time: 'Phase 2',
  title: 'Design System',
  description: 'Establishing typography, colors, and layout foundations.',
  status: 'primary',
  icon: <Rocket size={16} />
  },
  {
  id: '3',
  time: 'Phase 3',
  title: 'Component Development',
  description: 'Building out the UI library.',
  status: 'warning',
  icon: <Code2 size={16} />
  },
  {
  id: '4',
  time: 'Phase 4',
  title: 'Production Release',
  description: 'Shipping to the end users.',
  status: 'default',
  icon: <PackageCheck size={16} />
  }
 ],
 orientation: 'vertical',
 }
};
