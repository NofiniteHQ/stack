import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { createRef } from 'react';
import { Container } from './Container';
import { Grid } from './Grid';
import { Flex, Stack, HStack } from './Flex';

describe('Layout Primitives', () => {

  describe('Container', () => {
    it('renders children safely', () => {
      render(<Container>content</Container>);
      expect(screen.getByText('content')).toBeInTheDocument();
    });

    it('applies the correct default size data attribute', () => {
      render(<Container>x</Container>);
      expect(screen.getByText('x')).toHaveAttribute('data-size', 'lg');
    });

    it('applies the overridden size data attribute', () => {
      render(<Container size="xl">x</Container>);
      expect(screen.getByText('x')).toHaveAttribute('data-size', 'xl');
    });

    it('forwards the React ref', () => {
      const ref = createRef<HTMLDivElement>();
      render(<Container ref={ref}>x</Container>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('Flex', () => {
    it('applies default flex data attributes', () => {
      render(<Flex>x</Flex>);
      const el = screen.getByText('x');
      expect(el).toHaveAttribute('data-direction', 'row');
      expect(el).toHaveAttribute('data-align', 'stretch');
      expect(el).toHaveAttribute('data-justify', 'start');
      expect(el).toHaveAttribute('data-wrap', 'nowrap');
    });

    it('applies overridden direction/align/justify/wrap attributes', () => {
      render(
        <Flex direction="column" align="center" justify="between" wrap="wrap">
          x
        </Flex>
      );
      const el = screen.getByText('x');
      expect(el).toHaveAttribute('data-direction', 'column');
      expect(el).toHaveAttribute('data-align', 'center');
      expect(el).toHaveAttribute('data-justify', 'between');
      expect(el).toHaveAttribute('data-wrap', 'wrap');
    });

    it('sets numeric gap as a px css variable', () => {
      render(<Flex gap={8}>x</Flex>);
      const el = screen.getByText('x');
      expect(el.style.getPropertyValue('--nui-flex-gap')).toBe('8px');
    });

    it('sets string gap as a raw css variable', () => {
      render(<Flex gap="2rem">x</Flex>);
      const el = screen.getByText('x');
      expect(el.style.getPropertyValue('--nui-flex-gap')).toBe('2rem');
    });
  });

  describe('Syntactic Sugar: Stack & HStack', () => {
    it('Stack component forces a column direction', () => {
      render(<Stack>stack</Stack>);
      expect(screen.getByText('stack')).toHaveAttribute('data-direction', 'column');
    });

    it('HStack component forces a row direction and center alignment', () => {
      render(<HStack>hstack</HStack>);
      const el = screen.getByText('hstack');
      expect(el).toHaveAttribute('data-direction', 'row');
      expect(el).toHaveAttribute('data-align', 'center');
    });
  });

  describe('Grid', () => {
    it('sets the auto-fit attribute by default', () => {
      render(<Grid>g</Grid>);
      expect(screen.getByText('g')).toHaveAttribute('data-cols', 'auto-fit');
    });

    it('sets fixed column CSS variables when passed a numeric value', () => {
      render(<Grid columns={3}>g</Grid>);
      const el = screen.getByText('g');
      expect(el).toHaveAttribute('data-cols', 'fixed');
      expect(el.style.getPropertyValue('--nui-grid-cols-fixed')).toBe('3');
    });

    it('injects the gap CSS variable', () => {
      render(<Grid gap={12}>g</Grid>);
      const el = screen.getByText('g');
      expect(el.style.getPropertyValue('--nui-grid-gap')).toBe('12px');
    });

    it('injects the minColWidth CSS variable', () => {
      render(<Grid minColWidth="180px">g</Grid>);
      const el = screen.getByText('g');
      expect(el.style.getPropertyValue('--nui-grid-min-width')).toBe('180px');
    });
  });
});