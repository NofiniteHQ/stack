import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { createRef } from 'react';
import { Container } from './Container';
import { Grid } from './Grid';
import { Flex, Stack, HStack } from './Flex';

describe('Layout Primitives', () => {

 describe('Container', () => {
 it('should have no accessibility violations', async () => {
 const { container } = render(<Container>content</Container>);
 expect(await axe(container)).toHaveNoViolations();
 });

 it('renders children safely', () => {
 render(<Container>content</Container>);
 expect(screen.getByText('content')).toBeInTheDocument();
 });

 it('applies the correct default size class', () => {
 render(<Container>x</Container>);
 expect(screen.getByText('x')).toHaveClass('max-w-screen-lg');
 });

 it('applies the overridden size class', () => {
 render(<Container size="xl">x</Container>);
 expect(screen.getByText('x')).toHaveClass('max-w-screen-xl');
 });

 it('forwards the React ref', () => {
 const ref = createRef<HTMLDivElement>();
 render(<Container ref={ref}>x</Container>);
 expect(ref.current).toBeInstanceOf(HTMLDivElement);
 });
 });

 describe('Flex', () => {
 it('applies default flex classes', () => {
 render(<Flex>x</Flex>);
 const el = screen.getByText('x');
 expect(el).toHaveClass('flex-row');
 expect(el).toHaveClass('items-stretch');
 expect(el).toHaveClass('justify-start');
 expect(el).toHaveClass('flex-nowrap');
 });

 it('applies overridden direction/align/justify/wrap classes', () => {
 render(
 <Flex direction="column" align="center" justify="between" wrap="wrap">
 x
 </Flex>
 );
 const el = screen.getByText('x');
 expect(el).toHaveClass('flex-col');
 expect(el).toHaveClass('items-center');
 expect(el).toHaveClass('justify-between');
 expect(el).toHaveClass('flex-wrap');
 });

 it('sets numeric gap as a px style', () => {
 render(<Flex gap={8}>x</Flex>);
 const el = screen.getByText('x');
 expect(el.style.gap).toBe('8px');
 });

 it('sets string gap as a raw style', () => {
 render(<Flex gap="2rem">x</Flex>);
 const el = screen.getByText('x');
 expect(el.style.gap).toBe('2rem');
 });
 });

 describe('Syntactic Sugar: Stack & HStack', () => {
 it('Stack component forces a column direction class', () => {
 render(<Stack>stack</Stack>);
 expect(screen.getByText('stack')).toHaveClass('flex-col');
 });

 it('HStack component forces a row direction and center alignment classes', () => {
 render(<HStack>hstack</HStack>);
 const el = screen.getByText('hstack');
 expect(el).toHaveClass('flex-row');
 expect(el).toHaveClass('items-center');
 });
 });

 describe('Grid', () => {
 it('sets the auto-fit grid template by default', () => {
 render(<Grid>g</Grid>);
 expect(screen.getByText('g').style.gridTemplateColumns).toBe('repeat(auto-fit, minmax(250px, 1fr))');
 });

 it('sets fixed column grid template when passed a numeric value', () => {
 render(<Grid columns={3}>g</Grid>);
 const el = screen.getByText('g');
 expect(el.style.gridTemplateColumns).toBe('repeat(3, 1fr)');
 });

 it('injects the gap style', () => {
 render(<Grid gap={12}>g</Grid>);
 const el = screen.getByText('g');
 expect(el.style.gap).toBe('12px');
 });

 it('injects the minColWidth in grid template', () => {
 render(<Grid minColWidth="180px">g</Grid>);
 const el = screen.getByText('g');
 expect(el.style.gridTemplateColumns).toBe('repeat(auto-fit, minmax(180px, 1fr))');
 });
 });
});