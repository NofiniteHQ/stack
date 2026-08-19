import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { Carousel } from './Carousel';

describe('Carousel Component', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(
      <Carousel aria-label="Test carousel">
        <div>Slide 1</div>
        <div>Slide 2</div>
      </Carousel>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders all slides', () => {
    render(
      <Carousel>
        <div>Slide A</div>
        <div>Slide B</div>
      </Carousel>
    );
    expect(screen.getByText('Slide A')).toBeInTheDocument();
    expect(screen.getByText('Slide B')).toBeInTheDocument();
  });

  it('handles prev and next buttons', async () => {
    render(
      <Carousel>
        <div>Slide 1</div>
        <div>Slide 2</div>
        <div>Slide 3</div>
      </Carousel>
    );
    
    const prevBtn = screen.getByRole('button', { name: 'Previous slide' });
    const nextBtn = screen.getByRole('button', { name: 'Next slide' });
    
    expect(prevBtn).toBeDisabled();
    expect(nextBtn).toBeEnabled();
    
    await userEvent.click(nextBtn);
    expect(prevBtn).toBeEnabled();
  });
});
