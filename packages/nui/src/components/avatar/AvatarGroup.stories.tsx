import type { Meta, StoryObj } from '@storybook/react';
import { AvatarGroup } from './AvatarGroup';
import { Avatar } from './Avatar';

const meta: Meta<typeof AvatarGroup> = {
 title: 'Components/Data Display/AvatarGroup',
 component: AvatarGroup,
 tags: ['autodocs'],
 parameters: {
 layout: 'centered',
 },
 argTypes: {
 max: {
 control: { type: 'number', min: 1, max: 10 },
 description: 'Maximum visible avatars',
 },
 size: {
 control: 'select',
 options: ['sm', 'md', 'lg', 'xl'],
 },
 },
};

export default meta;
type Story = StoryObj<typeof AvatarGroup>;

const demoAvatars = [
 <Avatar key="1" name="Alice" src="https://i.pravatar.cc/150?u=1" />,
 <Avatar key="2" name="Bob" src="https://i.pravatar.cc/150?u=2" />,
 <Avatar key="3" name="Charlie" src="https://i.pravatar.cc/150?u=3" />,
 <Avatar key="4" name="David" src="https://i.pravatar.cc/150?u=4" />,
 <Avatar key="5" name="Eve" src="https://i.pravatar.cc/150?u=5" />,
];

// Default
export const Default: Story = {
 args: {
 max: 3,
 size: 'md',
 },
 render: (args) => <AvatarGroup {...args}>{demoAvatars}</AvatarGroup>,
};

// Small Size
export const Small: Story = {
 args: {
 max: 3,
 size: 'sm',
 },
 render: (args) => <AvatarGroup {...args}>{demoAvatars}</AvatarGroup>,
};

// Large Size
export const Large: Story = {
 args: {
 max: 3,
 size: 'lg',
 },
 render: (args) => <AvatarGroup {...args}>{demoAvatars}</AvatarGroup>,
};

// Show All
export const ShowAll: Story = {
 args: {
 max: 10,
 },
 render: (args) => <AvatarGroup {...args}>{demoAvatars}</AvatarGroup>,
};

// Text Only Avatars
export const TextAvatars: Story = {
 render: () => (
 <AvatarGroup max={3}>
 <Avatar name="A A" />
 <Avatar name="B B" />
 <Avatar name="C C" />
 <Avatar name="D D" />
 </AvatarGroup>
 ),
};

// Edge Case: Single Avatar
export const SingleAvatar: Story = {
 render: () => (
 <AvatarGroup>
 <Avatar name="Only User" />
 </AvatarGroup>
 ),
};
