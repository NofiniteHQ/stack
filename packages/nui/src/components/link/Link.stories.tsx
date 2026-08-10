import type { Meta, StoryObj } from '@storybook/react';
import { Link } from './Link';

/**
 * Typographical links designed to blend seamlessly into text content.
 * Use these for inline navigation, breadcrumbs, and standard web links.
 */
const meta: Meta<typeof Link> = {
 title: 'Components/Navigation/Link',
 component: Link,
 tags: ['autodocs'],
 args: {
 href: '#',
 children: 'Click here to read more',
 },
 argTypes: {
 variant: {
 control: 'select',
 options: ['default', 'primary', 'muted', 'danger'],
 description: 'The visual style of the link text.',
 },
 underline: {
 control: 'radio',
 options: ['none', 'hover', 'always'],
 description: 'Controls the underline behavior.',
 },
 isExternal: {
 control: 'boolean',
 description: 'Automatically applies security attributes for external URLs.',
 },
 asChild: {
 control: 'boolean',
 description: 'Delegates rendering to the child element (for Next.js/React Router support).',
 }
 },
};

export default meta;
type Story = StoryObj<typeof Link>;

/**
 * The standard link used for general navigation. Inherits font size from its parent container.
 */
export const Default: Story = {
 args: {
 variant: 'default',
 },
};

/**
 * Use the primary variant to draw attention to important inline links.
 */
export const Primary: Story = {
 args: {
 variant: 'primary',
 },
};

/**
 * Muted links are excellent for secondary information like "Terms of Service" or footer navigation.
 */
export const Muted: Story = {
 args: {
 variant: 'muted',
 },
};

/**
 * Use the danger variant strictly for destructive actions (e.g., a "Delete Account" link).
 */
export const Danger: Story = {
 args: {
 variant: 'danger',
 },
};

/**
 * Demonstrates the different underline behaviors available in the NUI design system.
 */
export const UnderlineBehaviors: Story = {
 render: () => (
 <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
 <Link href="#" underline="hover">Hover (Default)</Link>
 <Link href="#" underline="always">Always Underlined</Link>
 <Link href="#" underline="none">Never Underlined</Link>
 </div>
 ),
};

/**
 * Demonstrates how the Link behaves when mixed into a standard paragraph of text.
 */
export const InlineContext: Story = {
 render: () => (
 <p style={{ maxWidth: '400px', lineHeight: '1.5' }}>
 By creating an account, you agree to our{' '}
 <Link href="#" variant="primary" underline="always">Terms of Service</Link>{' '}
 and acknowledge that you have read our{' '}
 <Link href="#" variant="primary" underline="always">Privacy Policy</Link>.
 </p>
 ),
};