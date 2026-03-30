import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect } from '@storybook/test';
import { Resizable } from './Resizable';

const meta: Meta<typeof Resizable> = {
  title: 'Components/Resizable',
  component: Resizable,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;

const PanelContent = ({ title, color }: { title: string; color: string }) => (
  <div
    style={{
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: color,
      fontSize: '14px',
      fontWeight: 'bold',
      fontFamily: 'sans-serif',
      color: '#334155'
    }}
  >
    {title}
  </div>
);

export const Horizontal: StoryObj = {
  render: () => (
    <div style={{ height: '300px', padding: '20px' }}>
      <Resizable direction="horizontal" style={{ border: '1px solid #e2e8f0', borderRadius: '8px' }}>
        <Resizable.Panel defaultSize={25} minSize={10} data-testid="sidebar">
          <PanelContent title="Sidebar" color="#f8fafc" />
        </Resizable.Panel>
        <Resizable.Handle withIcon />
        <Resizable.Panel defaultSize={75}>
          <PanelContent title="Main Content" color="#ffffff" />
        </Resizable.Panel>
      </Resizable>
    </div>
  ),
};

export const Vertical: StoryObj = {
  render: () => (
    <div style={{ height: '400px', padding: '20px' }}>
      <Resizable direction="vertical" style={{ border: '1px solid #e2e8f0', borderRadius: '8px' }}>
        <Resizable.Panel defaultSize={70}>
          <PanelContent title="Editor" color="#ffffff" />
        </Resizable.Panel>
        <Resizable.Handle withIcon />
        <Resizable.Panel defaultSize={30} minSize={20}>
          <PanelContent title="Terminal" color="#f1f5f9" />
        </Resizable.Panel>
      </Resizable>
    </div>
  ),
};

export const Nested: StoryObj = {
  render: () => (
    <div style={{ height: '500px', padding: '20px' }}>
      <Resizable direction="horizontal" style={{ border: '1px solid #e2e8f0', borderRadius: '8px' }}>
        <Resizable.Panel defaultSize={20}>
          <PanelContent title="File Explorer" color="#f8fafc" />
        </Resizable.Panel>
        <Resizable.Handle />
        <Resizable.Panel defaultSize={80}>
          <Resizable direction="vertical">
            <Resizable.Panel defaultSize={70}>
              <PanelContent title="Main Editor" color="#ffffff" />
            </Resizable.Panel>
            <Resizable.Handle withIcon />
            <Resizable.Panel defaultSize={30}>
              <PanelContent title="Console Output" color="#f1f5f9" />
            </Resizable.Panel>
          </Resizable>
        </Resizable.Panel>
      </Resizable>
    </div>
  ),
};

/**
 * Automated Interaction Test
 * Verifies that the keyboard math engine accurately resizes panels in real-time.
 */
export const InteractiveTest: StoryObj = {
  render: () => (
    <div style={{ height: '300px', padding: '20px' }}>
      <Resizable direction="horizontal" style={{ border: '1px solid #e2e8f0' }}>
        <Resizable.Panel defaultSize={30} data-testid="test-panel">
          <PanelContent title="Test Panel" color="#f8fafc" />
        </Resizable.Panel>
        <Resizable.Handle withIcon data-testid="test-handle" />
        <Resizable.Panel defaultSize={70}>
          <PanelContent title="Other Panel" color="#ffffff" />
        </Resizable.Panel>
      </Resizable>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const handle = canvas.getByTestId('test-handle');
    const panel = canvas.getByTestId('test-panel');

    // Initial state check
    await expect(panel.style.flexGrow).toBe('30');

    // Focus and use keyboard to resize
    handle.focus();
    await userEvent.keyboard('{Shift>}{ArrowRight}{/Shift}');

    // Panel should grow by 10% (Shift step)
    await expect(panel.style.flexGrow).toBe('40');
  },
};