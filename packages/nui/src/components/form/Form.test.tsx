/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import { valibotResolver } from '@hookform/resolvers/valibot';
import * as v from 'valibot';
import {
 Form,
 FormField,
 FormItem,
 FormLabel,
 FormControl,
 FormMessage,
} from './Form';
import { Input } from '../input/Input';

const schema = v.object({
 username: v.pipe(v.string(), v.minLength(3, 'Username must be at least 3 characters')),
});

const TestForm = () => {
 const form = useForm({
 resolver: valibotResolver(schema),
 defaultValues: { username: '' },
 mode: 'onChange',
 });

 return (
 <Form {...form}>
 <form onSubmit={form.handleSubmit(() => {})}>
 <FormField
 control={form.control}
 name="username"
 render={({ field }) => (
 <FormItem>
 <FormLabel>Username</FormLabel>
 <FormControl>
 <Input placeholder="Enter username" {...field} />
 </FormControl>
 <FormMessage data-testid="form-message" />
 </FormItem>
 )}
 />
 <button type="submit">Submit</button>
 </form>
 </Form>
 );
};

describe('Form Ecosystem', () => {
 it('renders form and passes a11y attributes correctly', () => {
 render(<TestForm />);
 const input = screen.getByPlaceholderText('Enter username');
 expect(input).toBeInTheDocument();
 
 // Initial state: no error
 expect(input).toHaveAttribute('aria-invalid', 'false');
 });

 it('displays validation errors using valibot when input is invalid', async () => {
 render(<TestForm />);
 const user = userEvent.setup();
 const input = screen.getByPlaceholderText('Enter username');

 // Type an invalid value
 await user.type(input, 'ab');

 // Error should appear
 const message = await screen.findByText('Username must be at least 3 characters');
 expect(message).toBeInTheDocument();
 
 // A11y attributes should update
 expect(input).toHaveAttribute('aria-invalid', 'true');
 expect(input.getAttribute('aria-describedby')).toContain(message.id);
 });
});
