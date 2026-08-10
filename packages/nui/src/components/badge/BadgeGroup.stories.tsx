import type { Meta, StoryObj } from '@storybook/react';
import { BadgeGroup } from './BadgeGroup';
import { Badge } from './Badge';

const meta: Meta<typeof BadgeGroup> = {
 title: 'Components/Data Display/BadgeGroup',
 component: BadgeGroup,
 tags: ['autodocs'],
 parameters: {
 layout: 'centered',
 },
};

export default meta;
type Story = StoryObj<typeof BadgeGroup>;

export const Default: Story = {
 render: () => (
 <BadgeGroup>
 <Badge>React</Badge>
 <Badge>TypeScript</Badge>
 <Badge>Node</Badge>
 <Badge>GraphQL</Badge>
 </BadgeGroup>
 ),
};

export const Limited: Story = {
 render: () => (
 <BadgeGroup max={2}>
 <Badge>React</Badge>
 <Badge>TypeScript</Badge>
 <Badge>Node</Badge>
 <Badge>GraphQL</Badge>
 </BadgeGroup>
 ),
};

export const ManyBadges: Story = {
 render: () => (
 <BadgeGroup max={4}>
 {Array.from({ length: 8 }).map((_, i) => (
 <Badge key={i}>Tag {i + 1}</Badge>
 ))}
 </BadgeGroup>
 ),
};