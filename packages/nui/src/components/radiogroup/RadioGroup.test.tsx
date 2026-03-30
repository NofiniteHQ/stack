import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { RadioGroup } from './RadioGroup';

describe('RadioGroup Component', () => {
  it('renders a group of radio items', () => {
    render(
      <RadioGroup defaultValue="1">
        <label>
          <RadioGroup.Item value="1" /> Option 1
        </label>
        <label>
          <RadioGroup.Item value="2" /> Option 2
        </label>
      </RadioGroup>
    );

    const group = screen.getByRole('radiogroup');
    const radios = screen.getAllByRole('radio');

    expect(group).toBeInTheDocument();
    expect(radios).toHaveLength(2);
    expect(radios[0]).toBeChecked();
  });

  it('changes value when an item is clicked', async () => {
    const user = userEvent.setup();
    const onChangeSpy = vi.fn();
    
    render(
      <RadioGroup onChange={onChangeSpy}>
        <RadioGroup.Item value="apple" aria-label="Apple" />
        <RadioGroup.Item value="orange" aria-label="Orange" />
      </RadioGroup>
    );

    const orangeRadio = screen.getByRole('radio', { name: 'Orange' });
    await user.click(orangeRadio);

    expect(onChangeSpy).toHaveBeenCalledWith('orange');
    expect(orangeRadio).toBeChecked();
  });

  it('handles controlled state correctly', () => {
    const { rerender } = render(
      <RadioGroup value="a">
        <RadioGroup.Item value="a" />
        <RadioGroup.Item value="b" />
      </RadioGroup>
    );

    const radios = screen.getAllByRole('radio');
    expect(radios[0]).toBeChecked();

    rerender(
      <RadioGroup value="b">
        <RadioGroup.Item value="a" />
        <RadioGroup.Item value="b" />
      </RadioGroup>
    );
    expect(radios[1]).toBeChecked();
  });

  it('disables all items when the group is disabled', () => {
    render(
      <RadioGroup disabled>
        <RadioGroup.Item value="1" />
        <RadioGroup.Item value="2" />
      </RadioGroup>
    );

    const radios = screen.getAllByRole('radio');
    radios.forEach((radio) => expect(radio).toBeDisabled());
  });

  it('sets correct matching name attribute across items for native browser navigation', () => {
    render(
      <RadioGroup name="custom-group">
        <RadioGroup.Item value="1" />
        <RadioGroup.Item value="2" />
      </RadioGroup>
    );

    const radios = screen.getAllByRole('radio');
    expect(radios[0]).toHaveAttribute('name', 'custom-group');
    expect(radios[1]).toHaveAttribute('name', 'custom-group');
  });

  it('applies orientation attributes correctly for screen readers', () => {
    render(<RadioGroup orientation="horizontal" />);
    expect(screen.getByRole('radiogroup')).toHaveAttribute(
      'aria-orientation',
      'horizontal'
    );
  });
});