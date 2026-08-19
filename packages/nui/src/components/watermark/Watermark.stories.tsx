import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Watermark } from './Watermark';
import { Card } from '../card/Card';

const meta: Meta<typeof Watermark> = {
  title: 'Components/Data Display/Watermark',
  component: Watermark,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Watermark>;

export const Default: Story = {
  args: {
    text: 'CONFIDENTIAL',
    opacity: 0.1,
  },
  render: (args) => (
    <Watermark {...args}>
      <Card className="w-96 min-h-[300px]">
        <Card.Header>
          Top Secret Document
        </Card.Header>
        <Card.Body>
          <p className="text-muted leading-relaxed">
            This document contains highly classified information. The watermark overlay ensures any screenshots or prints are traceable and clearly marked as confidential.
          </p>
        </Card.Body>
      </Card>
    </Watermark>
  )
};
