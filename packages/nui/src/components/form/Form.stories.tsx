import type { Meta, StoryObj } from '@storybook/react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from './Form';
import { Input } from '../input/Input';
import { Button } from '../button/Button';

import { useForm } from 'react-hook-form';

const meta: Meta<typeof Form> = {
  title: 'Components/Forms/Form',
  component: Form,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div className="max-w-md w-full mx-auto p-6 bg-white dark:bg-[#0a0a0b] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm font-sans box-border">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">Account Settings</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Update your personal details here.</p>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Form>;

export const Default: Story = {
  render: () => {
    const form = useForm({
      defaultValues: {
        fullName: 'Jane Doe',
        email: '',
        password: ''
      }
    });

    const onSubmit = (data: any) => {
      alert(JSON.stringify(data, null, 2));
    };

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <FormField
            control={form.control}
            name="fullName"
            rules={{ required: "Full name is required" }}
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Jane Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            rules={{ 
              required: "Email is required",
              pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" } 
            }}
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input placeholder="jane@example.com" type="email" {...field} />
                </FormControl>
                <FormDescription>We will never share your email with anyone else.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            rules={{ required: "Password is required", minLength: { value: 8, message: "Must be at least 8 characters" } }}
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input placeholder="••••••••" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="pt-2 flex justify-end">
            <Button type="button" variant="ghost" className="mr-2" onClick={() => form.reset()}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    );
  }
};
