/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import { valibotResolver } from '@hookform/resolvers/valibot';
import * as v from 'valibot';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  useFormField,
} from './Form';
import { Input } from '../input/Input';

const singleFieldSchema = v.object({
  username: v.pipe(
    v.string(),
    v.minLength(3, 'Username must be at least 3 characters')
  ),
});

const multiFieldSchema = v.object({
  username: v.pipe(
    v.string(),
    v.minLength(3, 'Username must be at least 3 characters')
  ),
  email: v.pipe(v.string(), v.email('Invalid email address format')),
});

interface TestFormProps {
  onSubmit?: (data: { username: string; email?: string }) => void;
  disabledInput?: boolean;
  defaultValues?: { username: string; email?: string };
  withDescription?: boolean;
}

const SingleFieldTestForm: React.FC<TestFormProps> = ({
  onSubmit = () => {},
  disabledInput = false,
  defaultValues = { username: '' },
  withDescription = false,
}) => {
  const form = useForm({
    resolver: valibotResolver(singleFieldSchema),
    defaultValues,
    mode: 'onChange',
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((values) => onSubmit(values))}>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter username"
                  disabled={disabledInput}
                  {...field}
                />
              </FormControl>
              {withDescription && (
                <FormDescription>Your unique public handle</FormDescription>
              )}
              <FormMessage data-testid="form-message" />
            </FormItem>
          )}
        />
        <button type="submit">Submit</button>
      </form>
    </Form>
  );
};

const MultiFieldTestForm: React.FC<{ onSubmit: (data: any) => void }> = ({
  onSubmit,
}) => {
  const form = useForm({
    resolver: valibotResolver(multiFieldSchema),
    defaultValues: { username: '', email: '' },
    mode: 'onChange',
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((values) => onSubmit(values))}>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter username" {...field} />
              </FormControl>
              <FormMessage data-testid="username-error" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter email" {...field} />
              </FormControl>
              <FormMessage data-testid="email-error" />
            </FormItem>
          )}
        />
        <button type="submit">Submit</button>
      </form>
    </Form>
  );
};

describe('Form Ecosystem', () => {
  describe('Rendering & Accessibility Contracts', () => {
    it('renders form and passes a11y attributes correctly in pristine state', () => {
      render(<SingleFieldTestForm />);
      const input = screen.getByPlaceholderText('Enter username');
      const label = screen.getByText('Username');

      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('aria-invalid', 'false');

      // WAI-ARIA Contract: label htmlFor must link to input id
      const inputId = input.getAttribute('id');
      expect(label).toHaveAttribute('for', inputId);
    });

    it('links FormControl aria-describedby with both FormDescription and FormMessage IDs', async () => {
      render(<SingleFieldTestForm withDescription />);
      const user = userEvent.setup();
      const input = screen.getByPlaceholderText('Enter username');
      const description = screen.getByText('Your unique public handle');

      // Before error: aria-describedby contains description id
      expect(input.getAttribute('aria-describedby')).toContain(
        description.getAttribute('id')
      );

      // Trigger validation error
      await user.type(input, 'a');
      const error = await screen.findByText(
        'Username must be at least 3 characters'
      );

      // After error: aria-describedby links to both description and error message
      const describedBy = input.getAttribute('aria-describedby');
      expect(describedBy).toContain(description.getAttribute('id'));
      expect(describedBy).toContain(error.getAttribute('id'));
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('passes axe accessibility audit in valid state', async () => {
      const { container } = render(
        <SingleFieldTestForm defaultValues={{ username: 'validUser' }} />
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });

  describe('Validation Errors & Schema Integration', () => {
    it('displays validation errors using valibot when input is invalid', async () => {
      render(<SingleFieldTestForm />);
      const user = userEvent.setup();
      const input = screen.getByPlaceholderText('Enter username');

      await user.type(input, 'ab');

      const message = await screen.findByText(
        'Username must be at least 3 characters'
      );
      expect(message).toBeInTheDocument();
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input.getAttribute('aria-describedby')).toContain(message.id);
    });

    it('clears error message when input becomes valid', async () => {
      render(<SingleFieldTestForm />);
      const user = userEvent.setup();
      const input = screen.getByPlaceholderText('Enter username');

      // Type invalid value
      await user.type(input, 'ab');
      expect(
        await screen.findByText('Username must be at least 3 characters')
      ).toBeInTheDocument();

      // Type further to make it valid
      await user.type(input, 'cde');
      await waitFor(() => {
        expect(
          screen.queryByText('Username must be at least 3 characters')
        ).not.toBeInTheDocument();
      });
      expect(input).toHaveAttribute('aria-invalid', 'false');
    });

    it('validates multi-field schemas with distinct error messages', async () => {
      const handleSubmit = vi.fn();
      render(<MultiFieldTestForm onSubmit={handleSubmit} />);
      const user = userEvent.setup();

      const usernameInput = screen.getByPlaceholderText('Enter username');
      const emailInput = screen.getByPlaceholderText('Enter email');

      await user.type(usernameInput, 'al');
      await user.type(emailInput, 'not-an-email');

      expect(
        await screen.findByText('Username must be at least 3 characters')
      ).toBeInTheDocument();
      expect(
        await screen.findByText('Invalid email address format')
      ).toBeInTheDocument();
      expect(handleSubmit).not.toHaveBeenCalled();
    });
  });

  describe('Submit Handling', () => {
    it('invokes onSubmit handler with valid form data', async () => {
      const handleSubmit = vi.fn();
      render(<SingleFieldTestForm onSubmit={handleSubmit} />);
      const user = userEvent.setup();

      const input = screen.getByPlaceholderText('Enter username');
      await user.type(input, 'octocat');

      const submitBtn = screen.getByRole('button', { name: 'Submit' });
      await user.click(submitBtn);

      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalledTimes(1);
        expect(handleSubmit).toHaveBeenCalledWith({ username: 'octocat' });
      });
    });

    it('prevents submission when fields fail schema validation', async () => {
      const handleSubmit = vi.fn();
      render(<SingleFieldTestForm onSubmit={handleSubmit} />);
      const user = userEvent.setup();

      const input = screen.getByPlaceholderText('Enter username');
      await user.type(input, 'x'); // invalid

      const submitBtn = screen.getByRole('button', { name: 'Submit' });
      await user.click(submitBtn);

      expect(
        await screen.findByText('Username must be at least 3 characters')
      ).toBeInTheDocument();
      expect(handleSubmit).not.toHaveBeenCalled();
    });
  });

  describe('Disabled State', () => {
    it('supports disabled form controls and prevents user interaction', async () => {
      const handleSubmit = vi.fn();
      render(<SingleFieldTestForm disabledInput onSubmit={handleSubmit} />);
      const input = screen.getByPlaceholderText('Enter username');

      expect(input).toBeDisabled();

      const user = userEvent.setup();
      await user.type(input, 'testing');
      expect(input).toHaveValue('');
    });
  });

  describe('Error Boundary Guard', () => {
    it('throws informative error when useFormField is called outside of FormField', () => {
      const BadConsumer = () => {
        useFormField();
        return null;
      };

      // Suppress console.error in test output for expected error throw
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      expect(() => render(<BadConsumer />)).toThrow(
        'useFormField should be used within <FormField>'
      );

      consoleSpy.mockRestore();
    });
  });
});
