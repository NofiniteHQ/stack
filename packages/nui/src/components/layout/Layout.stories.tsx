import type { Meta, StoryObj } from '@storybook/react';
import { Container } from './Container';
import { Grid } from './Grid';
import { Flex, Stack, HStack } from './Flex';

const meta: Meta = {
  title: 'Layout/Primitives',
  tags: ['autodocs'],
};
export default meta;

/* ---------- Container Stories ---------- */
export const ContainerSizes: StoryObj = {
  render: () => (
    <Stack gap={16}>
      <Container size="sm" style={{ background: '#e0e7ff', padding: '1rem' }}>SM Container</Container>
      <Container size="md" style={{ background: '#e0e7ff', padding: '1rem' }}>MD Container</Container>
      <Container size="lg" style={{ background: '#e0e7ff', padding: '1rem' }}>LG Container</Container>
      <Container size="xl" style={{ background: '#e0e7ff', padding: '1rem' }}>XL Container</Container>
      <Container size="full" style={{ background: '#e0e7ff', padding: '1rem' }}>FULL Container</Container>
    </Stack>
  ),
};

/* ---------- Flex Stories ---------- */
const boxStyle = { padding: '1rem 2rem', background: '#e2e8f0', borderRadius: '4px' };

export const FlexPlayground: StoryObj = {
  render: () => (
    <Flex gap={12} justify="between" align="center" style={{ border: '1px dashed #cbd5e1', padding: '1rem' }}>
      <div style={boxStyle}>Item 1</div>
      <div style={boxStyle}>Item 2</div>
      <div style={boxStyle}>Item 3</div>
    </Flex>
  ),
};

export const StackExample: StoryObj = {
  render: () => (
    <Stack gap={8}>
      <div style={boxStyle}>One</div>
      <div style={boxStyle}>Two</div>
      <div style={boxStyle}>Three</div>
    </Stack>
  ),
};

export const HStackExample: StoryObj = {
  render: () => (
    <HStack gap={8}>
      <div style={boxStyle}>Left</div>
      <div style={boxStyle}>Center</div>
      <div style={boxStyle}>Right</div>
    </HStack>
  ),
};

/* ---------- Grid Stories ---------- */
export const GridAutoFit: StoryObj = {
  render: () => (
    <Grid gap={16} minColWidth="150px">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} style={{ padding: 16, border: '1px solid #ddd', textAlign: 'center', background: '#f8fafc' }}>
          Item {i + 1}
        </div>
      ))}
    </Grid>
  ),
};

export const GridFixed: StoryObj = {
  render: () => (
    <Grid columns={3} gap={16}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} style={{ padding: 16, border: '1px solid #ddd', textAlign: 'center', background: '#f8fafc' }}>
          Item {i + 1}
        </div>
      ))}
    </Grid>
  ),
};