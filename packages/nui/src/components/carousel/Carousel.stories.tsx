import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { Carousel } from './Carousel';
import { Card } from '../card/Card';

export default {
  title: 'Components/Data Display/Carousel',
  component: Carousel,
  parameters: {
    layout: 'padded',
  },
  args: {
    showArrows: true,
    showDots: true,
  },
} as Meta<typeof Carousel>;

type Story = StoryObj<typeof Carousel>;

const mockSlides = Array.from({ length: 5 }).map((_, i) => (
  <Card key={i} className="h-64 flex flex-col justify-center items-center bg-subtle w-full min-w-0">
    <Card.Header className="text-2xl text-center">Slide {i + 1}</Card.Header>
    <Card.Body className="text-muted text-center flex-grow-0 whitespace-normal px-4">
      Swipe or use the arrows to navigate.
    </Card.Body>
  </Card>
));

export const Default: Story = {
  render: (args) => (
    <div className="w-full max-w-[500px] min-w-0 mx-auto">
      <Carousel {...args} loop={true} align="center">
        {mockSlides}
      </Carousel>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Check initial render
    const carousel = canvas.getByRole('region', { name: 'Image Carousel' });
    await expect(carousel).toBeInTheDocument();

    // Arrows are visually hidden until hover in real life, but screen reader accessible or visible when tabbed to.
    const nextBtn = canvas.getByRole('button', { name: 'Next slide' });
    const prevBtn = canvas.getByRole('button', { name: 'Previous slide' });

    await expect(nextBtn).toBeEnabled();

    // Click next
    await userEvent.click(nextBtn);
    
    // Now previous should be enabled
    await expect(prevBtn).toBeEnabled();
  }
};

export const WithoutDotsOrArrows: Story = {
  render: (args) => (
    <div className="w-full max-w-[500px] min-w-0 mx-auto">
      <Carousel {...args} showArrows={false} showDots={false} loop={true} align="center">
        {mockSlides}
      </Carousel>
    </div>
  )
};

export const MultiItemView: Story = {
  render: (args) => (
    <div className="w-full max-w-[800px] min-w-0 mx-auto">
      <Carousel {...args} itemWidth="280px" gap="1rem" align="center" loop={true}>
        {mockSlides}
      </Carousel>
    </div>
  )
};
