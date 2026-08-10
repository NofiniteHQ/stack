import type { Meta, StoryObj } from '@storybook/react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from './Form';
import { Input } from '../input/Input';
import { Button } from '../button/Button';

import { useForm } from 'react-hook-form';

const meta: Meta<typeof Form> = {
 title: 'Components/Forms/Form',
 component: Form,
 tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Form>;

export const Default: Story = {
 render: () => {
 const form = useForm({ defaultValues: { email: '' } });
 return (
 <Form {...form}>
 <form onSubmit={form.handleSubmit((data) => alert(JSON.stringify(data)))} className="flex flex-col gap-4">
 <FormField
 control={form.control}
 name="email"
 render={({ field }: any) => (
 <FormItem>
 <FormLabel>Email Address</FormLabel>
 <FormControl>
 <Input placeholder="Enter your email" {...field} />
 </FormControl>
 <FormMessage />
 </FormItem>
 )}
 />
 <Button type="submit">Submit</Button>
 </form>
 </Form>
 );
 }
};
