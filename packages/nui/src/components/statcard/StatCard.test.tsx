import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { StatCard } from './StatCard';

// Mock resize observer for floating-ui which is used by Tooltip
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe('StatCard Component', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(
      <StatCard 
        label="Revenue" 
        value="$100" 
        trend="up" 
        trendValue="+10%" 
        trendLabel="vs last month" 
        info="Includes taxes"
        progressValue={50}
        sparklineData={[10, 20]}
      />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders label and value', () => {
    render(<StatCard label="Total Users" value="1,234" />);
    expect(screen.getByText('Total Users')).toBeInTheDocument();
    expect(screen.getByText('1,234')).toBeInTheDocument();
  });

  it('renders skeleton when loading', () => {
    const { container } = render(<StatCard label="Total" value="1,234" isLoading />);
    // When loading, value shouldn't be in the document directly as text
    expect(screen.queryByText('1,234')).not.toBeInTheDocument();
    // Skeleton elements should be rendered (indicated by empty spans with aria-hidden)
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders tooltip trigger when info is provided', async () => {
    render(<StatCard label="Info Stat" value="0" info="Helpful tooltip context" />);
    const trigger = screen.getByRole('article').querySelector('.cursor-help');
    expect(trigger).toBeInTheDocument();
    
    // We can simulate hover if we want, but just verifying the trigger is present is good enough for StatCard tests,
    // as Tooltip itself handles the rendering.
  });

  it('renders progress bar when progressValue is provided', () => {
    render(<StatCard label="Storage" value="50%" progressValue={50} />);
    const progress = screen.getByRole('progressbar');
    expect(progress).toBeInTheDocument();
    expect(progress).toHaveAttribute('aria-valuenow', '50');
  });

  it('renders sparkline when sparklineData is provided', () => {
    const { container } = render(<StatCard label="Sales" value="100" sparklineData={[10, 20, 30]} />);
    // Check for the SVG path inside
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders trend elements when provided', () => {
    render(
      <StatCard 
        label="Revenue" 
        value="$100" 
        trend="up" 
        trendValue="+10%" 
        trendLabel="vs last month" 
      />
    );
    expect(screen.getByText('+10%')).toBeInTheDocument();
    expect(screen.getByText('vs last month')).toBeInTheDocument();
  });

  it('is clickable when onClick is provided', async () => {
    const handleClick = vi.fn();
    render(<StatCard label="Clicks" value="42" onClick={handleClick} />);
    
    const card = screen.getByRole('button');
    await userEvent.click(card);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  it('generates a descriptive aria-label for trends', () => {
    render(
      <StatCard 
        label="Sales" 
        value="500" 
        trend="down" 
        trendValue="5%" 
        trendLabel="since yesterday" 
      />
    );
    // The inner container with the trend
    const trendContainer = screen.getByLabelText('Trend: decreased by 5% since yesterday');
    expect(trendContainer).toBeInTheDocument();
  });
});
