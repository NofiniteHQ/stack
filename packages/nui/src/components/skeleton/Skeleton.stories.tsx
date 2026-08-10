import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from './Skeleton';

const meta: Meta<typeof Skeleton> = {
 title: 'Components/Feedback/Skeleton',
 component: Skeleton,
 parameters: { layout: 'centered' },
 tags: ['autodocs'],
};

export default meta;

export const Text: StoryObj = {
 render: () => (
 <div style={{ width: '300px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
 <Skeleton.Text size="xs" width="40%" />
 <Skeleton.Text size="lg" />
 <Skeleton.Paragraph lines={3} />
 </div>
 ),
};

export const ProfileCard: StoryObj = {
 render: () => <Skeleton.Card style={{ width: '400px' }} />,
};

export const Shapes: StoryObj = {
 render: () => (
 <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
 <Skeleton.Avatar size={64} />
 <Skeleton.Button width={120} height={40} />
 <Skeleton.Button width={40} height={40} className="nui-skeleton--circle" />
 </div>
 ),
};

export const StaticNoAnimation: StoryObj = {
 render: () => (
 <div style={{ width: '300px' }}>
 <Skeleton animated={false} width="100%" size="lg" />
 </div>
 )
};