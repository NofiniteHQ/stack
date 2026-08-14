import type { Meta, StoryObj } from '@storybook/react';
import { Container } from './Container';
import { Grid } from './Grid';
import { Flex, Stack, HStack } from './Flex';

const meta: Meta = {
 title: 'Components/Layout/Layout',
 tags: ['autodocs'],
};
export default meta;

/* ---------- Container Stories ---------- */
export const ContainerSizes: StoryObj = {
 render: () => (
  <Stack gap={16} className="font-sans text-sm">
  <Container size="sm">
    <div className="bg-subtle border border-default rounded-md px-6 py-4 text-center font-medium text-default">SM Container</div>
  </Container>
  <Container size="md">
    <div className="bg-subtle border border-default rounded-md px-6 py-4 text-center font-medium text-default">MD Container</div>
  </Container>
  <Container size="lg">
    <div className="bg-subtle border border-default rounded-md px-6 py-4 text-center font-medium text-default">LG Container</div>
  </Container>
  <Container size="xl">
    <div className="bg-subtle border border-default rounded-md px-6 py-4 text-center font-medium text-default">XL Container</div>
  </Container>
  <Container size="full">
    <div className="bg-subtle border border-default rounded-md px-6 py-4 text-center font-medium text-default">FULL Container</div>
  </Container>
  </Stack>
 ),
};

/* ---------- Flex Stories ---------- */
const boxClass = "px-6 py-3 bg-surface border border-default rounded-md text-default font-medium text-sm shadow-sm";

export const FlexPlayground: StoryObj = {
  render: () => (
  <Flex gap={12} justify="between" align="center" className="p-6 border border-default border-dashed rounded-lg bg-subtle font-sans">
  <div className={boxClass}>Item 1</div>
  <div className={boxClass}>Item 2</div>
  <div className={boxClass}>Item 3</div>
  </Flex>
  ),
};

export const StackExample: StoryObj = {
  render: () => (
  <Stack gap={8} className="font-sans">
  <div className={boxClass}>One</div>
  <div className={boxClass}>Two</div>
  <div className={boxClass}>Three</div>
  </Stack>
  ),
};

export const HStackExample: StoryObj = {
  render: () => (
  <HStack gap={8} className="font-sans">
  <div className={boxClass}>Left</div>
  <div className={boxClass}>Center</div>
  <div className={boxClass}>Right</div>
  </HStack>
  ),
};

/* ---------- Grid Stories ---------- */
export const GridAutoFit: StoryObj = {
  render: () => (
  <Grid gap={16} minColWidth="150px" className="font-sans">
  {Array.from({ length: 6 }).map((_, i) => (
  <div key={i} className="p-6 border border-default bg-surface rounded-md text-default text-center font-medium text-sm shadow-sm">
  Item {i + 1}
  </div>
  ))}
  </Grid>
  ),
};

export const GridFixed: StoryObj = {
  render: () => (
  <Grid columns={3} gap={16} className="font-sans">
  {Array.from({ length: 6 }).map((_, i) => (
  <div key={i} className="p-6 border border-default bg-surface rounded-md text-default text-center font-medium text-sm shadow-sm">
  Item {i + 1}
  </div>
  ))}
  </Grid>
  ),
};