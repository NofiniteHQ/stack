"use client";

import React, { createContext, useContext, forwardRef, useId } from 'react';
import {
 FormProvider,
 Controller,
 ControllerProps,
 FieldPath,
 FieldValues,
 useFormContext,
} from 'react-hook-form';
import { cn } from '../../utils/cn/cn';
import { Slot } from '../../utils/slot/slot';

/* ============================================================
 * Form Contexts
 * ============================================================ */

type FormFieldContextValue<
 TFieldValues extends FieldValues = FieldValues,
 TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
 name: TName;
};

const FormFieldContext = createContext<FormFieldContextValue>({} as FormFieldContextValue);

type FormItemContextValue = {
 id: string;
};

const FormItemContext = createContext<FormItemContextValue>({} as FormItemContextValue);

/* ============================================================
 * Hooks
 * ============================================================ */

export const useFormField = () => {
 const fieldContext = useContext(FormFieldContext);
 const itemContext = useContext(FormItemContext);
 const { getFieldState, formState } = useFormContext();

 if (!fieldContext) {
 throw new Error('useFormField should be used within <FormField>');
 }

 const fieldState = getFieldState(fieldContext.name, formState);
 const { id } = itemContext;

 return {
 id,
 name: fieldContext.name,
 formItemId: `${id}-form-item`,
 formDescriptionId: `${id}-form-item-description`,
 formMessageId: `${id}-form-item-message`,
 ...fieldState,
 };
};

/* ============================================================
 * Components
 * ============================================================ */

const Form = FormProvider;

const FormField = <
 TFieldValues extends FieldValues = FieldValues,
 TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
 ...props
}: ControllerProps<TFieldValues, TName>) => {
 return (
 <FormFieldContext.Provider value={{ name: props.name }}>
 <Controller {...props} />
 </FormFieldContext.Provider>
 );
};

const FormItem = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
 ({ className, ...props }, ref) => {
 const id = useId();

 return (
 <FormItemContext.Provider value={{ id }}>
 <div ref={ref} className={cn('space-y-2', className)} {...props} />
 </FormItemContext.Provider>
 );
 }
);
FormItem.displayName = 'FormItem';

const FormLabel = forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
 ({ className, ...props }, ref) => {
 const { error, formItemId } = useFormField();

 return (
 <label
 ref={ref}
 htmlFor={formItemId}
 className={cn(
 'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-default font-sans',
 error && 'text-danger',
 className
 )}
 {...props}
 />
 );
 }
);
FormLabel.displayName = 'FormLabel';

const FormControl = forwardRef<React.ElementRef<typeof Slot>, React.ComponentPropsWithoutRef<typeof Slot>>(
 ({ ...props }, ref) => {
 const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

 return (
 <Slot
 ref={ref}
 id={formItemId}
 aria-describedby={!error ? formDescriptionId : `${formDescriptionId} ${formMessageId}`}
 aria-invalid={!!error}
 {...props}
 />
 );
 }
);
FormControl.displayName = 'FormControl';

const FormDescription = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
 ({ className, ...props }, ref) => {
 const { formDescriptionId } = useFormField();

 return (
 <p
 ref={ref}
 id={formDescriptionId}
 className={cn('text-[13px] text-muted font-sans mt-2', className)}
 {...props}
 />
 );
 }
);
FormDescription.displayName = 'FormDescription';

const FormMessage = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
 ({ className, children, ...props }, ref) => {
 const { error, formMessageId } = useFormField();
 const body = error ? String(error?.message) : children;

 if (!body) {
 return null;
 }

 return (
 <p
 ref={ref}
 id={formMessageId}
 className={cn('text-[13px] font-medium text-danger font-sans mt-2', className)}
 {...props}
 >
 {body}
 </p>
 );
 }
);
FormMessage.displayName = 'FormMessage';

export {
 Form,
 FormItem,
 FormLabel,
 FormControl,
 FormDescription,
 FormMessage,
 FormField,
};


