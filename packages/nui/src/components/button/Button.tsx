'use client';

import React from 'react';
import { cn, Slot, Slottable } from '../../utils';

export type ButtonVariant =
  | 'default'
  | 'primary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  loading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  asChild?: boolean;
}

const variantMap: Record<ButtonVariant, string> = {
  default: 'btn-default',
  primary: 'btn-primary',
  outline: 'btn-outline',
  ghost: 'btn-ghost',
  danger: 'btn-danger',
  link: 'btn-link',
};

const sizeMap: Record<ButtonSize, string> = {
  sm: 'btn-sm',
  md: 'btn-md',
  lg: 'btn-lg',
  icon: 'btn-icon',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      isLoading = false,
      loading = false,
      iconLeft,
      iconRight,
      asChild = false,
      children,
      disabled,
      onClick,
      ...props
    },
    ref
  ) => {
    const isSpinnerLoading = Boolean(isLoading || loading);
    const isDisabled = disabled || isSpinnerLoading;
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        ref={ref}
        disabled={asChild ? undefined : isDisabled}
        aria-disabled={isDisabled ? 'true' : undefined}
        data-disabled={isDisabled ? '' : undefined}
        onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
          if (isDisabled) {
            e.preventDefault();
            return;
          }
          onClick?.(e);
        }}
        className={cn(
          'btn',
          variant && (variantMap[variant] || `btn-${variant}`),
          size && (sizeMap[size] || `btn-${size}`),
          className
        )}
        {...props}
      >
        {isSpinnerLoading && (
          <svg
            className="w-4 h-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}

        {!isLoading && iconLeft && (
          <span className="flex items-center justify-center">{iconLeft}</span>
        )}

        <Slottable>{asChild ? children : <span>{children}</span>}</Slottable>

        {!isLoading && iconRight && (
          <span className="flex items-center justify-center">{iconRight}</span>
        )}
      </Comp>
    );
  }
);

Button.displayName = 'Button';
