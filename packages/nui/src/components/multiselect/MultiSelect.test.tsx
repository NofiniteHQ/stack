import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useState } from 'react';
import { MultiSelect } from './MultiSelect';

const options = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'angular', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'solid', label: 'Solid', disabled: true },
];

describe('MultiSelect Component', () => {
  beforeEach(() => {
    // Mock window scroll properties required for Portal positioning
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
    Object.defineProperty(window, 'scrollX', { value: 0, writable: true });
    // Mock scrollIntoView
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  function setup(props = {}) {
    const onChangeSpy = vi.fn();
    render(<MultiSelect options={options} onChange={onChangeSpy} {...props} />);
    return { onChangeSpy };
  }

  it('renders placeholder', () => {
    setup();
    expect(screen.getByText('Select multiple...')).toBeInTheDocument();
  });

  it('opens listbox on trigger click', async () => {
    const user = userEvent.setup();
    setup();

    const trigger = screen.getByRole('button');
    await user.click(trigger);
    
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('selects option on click without closing menu', async () => {
    const user = userEvent.setup();
    const { onChangeSpy } = setup();

    await user.click(screen.getByRole('button'));
    
    // Target by role to avoid conflicts with selected tags
    await user.click(screen.getByRole('option', { name: 'React' }));

    expect(onChangeSpy).toHaveBeenCalledWith(['react']);
    
    // Menu should still be open
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('toggles selection when an active option is clicked again', async () => {
    const user = userEvent.setup();
    const { onChangeSpy } = setup({ defaultValue: ['react'] });

    await user.click(screen.getByRole('button'));
    
    // Specifically target the option in the listbox, not the tag in the trigger
    await user.click(screen.getByRole('option', { name: 'React' }));

    expect(onChangeSpy).toHaveBeenCalledWith([]);
  });

  it('does not select disabled options', async () => {
    const user = userEvent.setup();
    const { onChangeSpy } = setup();

    await user.click(screen.getByRole('button'));
    await user.click(screen.getByRole('option', { name: 'Solid' }));

    expect(onChangeSpy).not.toHaveBeenCalled();
  });

  it('opens menu via ArrowDown key', async () => {
    const user = userEvent.setup();
    setup();

    const trigger = screen.getByRole('button');
    trigger.focus(); // Explicitly use the variable to focus the element
    await user.keyboard('{ArrowDown}');

    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('navigates and selects via keyboard', async () => {
    const user = userEvent.setup();
    const { onChangeSpy } = setup();

    const trigger = screen.getByRole('button');
    await user.click(trigger);

    // Wait for the automatic focus engine to place focus on the listbox
    await waitFor(() => {
      expect(document.activeElement).toHaveAttribute('role', 'listbox');
    });

    // Arrow down to second item (Vue)
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{Enter}');

    expect(onChangeSpy).toHaveBeenCalledWith(['vue']);
  });

  it('closes on Escape key', async () => {
    const user = userEvent.setup();
    setup();

    await user.click(screen.getByRole('button'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('renders individual tags for selected values', () => {
    setup({ defaultValue: ['react', 'vue'] });

    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Vue')).toBeInTheDocument();
  });

  it('renders summary when maxTags is exceeded', () => {
    setup({
      defaultValue: ['react', 'vue', 'angular', 'svelte'],
      maxTags: 2,
    });

    expect(screen.getByText('4 items selected')).toBeInTheDocument();
  });

  it('functions properly in controlled mode', async () => {
    const user = userEvent.setup();
    const onChangeSpy = vi.fn();

    function ControlledWrapper() {
      const [val, setVal] = useState<string[]>(['vue']);
      return <MultiSelect options={options} value={val} onChange={(newVal) => {
        setVal(newVal);
        onChangeSpy(newVal);
      }} />;
    }

    render(<ControlledWrapper />);

    await user.click(screen.getByRole('button'));
    await user.click(screen.getByRole('option', { name: 'React' }));

    expect(onChangeSpy).toHaveBeenCalledWith(['vue', 'react']);
  });

  it('renders hidden inputs for native form submission', () => {
    setup({
      defaultValue: ['react', 'vue'],
      name: 'frameworks',
    });

    const inputs = document.querySelectorAll('input[type="hidden"]');
    expect(inputs.length).toBe(2);
    expect(inputs[0]).toHaveAttribute('value', 'react');
    expect(inputs[1]).toHaveAttribute('value', 'vue');
  });

  it('applies aria attributes correctly', () => {
    setup();
    const trigger = screen.getByRole('button');
    expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
  });
});