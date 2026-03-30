import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FileUploader } from './FileUploader';

function createFile(name: string, size: number, type = 'text/plain') {
  const file = new File(['a'.repeat(size)], name, { type });
  Object.defineProperty(file, 'size', { value: size });
  return file;
}

describe('FileUploader Component', () => {
  it('renders placeholder', () => {
    render(<FileUploader />);
    expect(screen.getByText(/drag & drop files/i)).toBeInTheDocument();
  });

  it('uploads file via hidden input interaction', async () => {
    const user = userEvent.setup();
    const file = createFile('test.txt', 1000);

    render(<FileUploader />);
    const input = screen.getByTestId('nui-file-input');

    await user.upload(input, file);

    expect(await screen.findByText('test.txt')).toBeInTheDocument();
  });

  it('calls onChange when file selected', async () => {
    const user = userEvent.setup();
    const onChangeSpy = vi.fn();
    const file = createFile('test.txt', 1000);

    render(<FileUploader onChange={onChangeSpy} />);
    const input = screen.getByTestId('nui-file-input');

    await user.upload(input, file);

    expect(onChangeSpy).toHaveBeenCalledTimes(1);
    // Verifies the payload contains an array of File objects
    expect(onChangeSpy).toHaveBeenCalledWith(
        expect.arrayContaining([
            expect.objectContaining({ name: 'test.txt' })
        ])
    );
  });

  it('removes file using the remove button', async () => {
    const user = userEvent.setup();
    const file = createFile('test.txt', 1000);

    render(<FileUploader defaultValue={[file]} />);
    expect(screen.getByText('test.txt')).toBeInTheDocument();

    const removeBtn = screen.getByRole('button', { name: /remove test\.txt/i });
    await user.click(removeBtn);

    expect(screen.queryByText('test.txt')).not.toBeInTheDocument();
  });

  it('respects maxSize filtering', async () => {
    const user = userEvent.setup();
    const file = createFile('big.txt', 5000);

    render(<FileUploader maxSize={1000} />);
    const input = screen.getByTestId('nui-file-input');

    await user.upload(input, file);

    expect(screen.queryByText('big.txt')).not.toBeInTheDocument();
  });

  it('disabled state prevents upload and removal', async () => {
    const user = userEvent.setup();
    const file = createFile('test.txt', 1000);

    render(<FileUploader disabled defaultValue={[file]} />);
    
    // Verify dropzone is inaccessible
    const dropzone = screen.getByRole('button', { name: /upload files/i });
    expect(dropzone).toHaveAttribute('aria-disabled', 'true');
    expect(dropzone).toHaveAttribute('tabIndex', '-1');

    // Verify input is disabled
    const input = screen.getByTestId('nui-file-input');
    expect(input).toBeDisabled();

    // Verify removal is disabled
    const removeBtn = screen.getByRole('button', { name: /remove test\.txt/i });
    expect(removeBtn).toBeDisabled();
    await user.click(removeBtn);
    expect(screen.getByText('test.txt')).toBeInTheDocument(); // Still there
  });

  it('supports fully controlled mode', () => {
    const file = createFile('controlled.txt', 1000);
    render(<FileUploader value={[file]} />);

    expect(screen.getByText('controlled.txt')).toBeInTheDocument();
  });

  it('handles simulated drag and drop upload', () => {
    const file = createFile('drag.txt', 1000);

    render(<FileUploader />);
    const dropzone = screen.getByRole('button', { name: /upload files/i });

    // Note: JSDOM does not fully support DataTransfer objects natively, 
    // so we must mock the drop event structure using fireEvent
    fireEvent.drop(dropzone, {
      dataTransfer: {
        files: [file],
      },
    });

    expect(screen.getByText('drag.txt')).toBeInTheDocument();
  });
});