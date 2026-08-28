"use client";

import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '../../utils';
import { Input, InputProps } from '../input/Input';

export type PasswordInputProps = Omit<InputProps, 'type'>

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePassword = () => setShowPassword((prev) => !prev);

    const toggleButton = (
      <button
        type="button"
        onClick={togglePassword}
        className="appearance-none bg-transparent border-0 m-0 p-0 flex items-center justify-center h-6 w-6 rounded-md text-muted hover:text-default hover:bg-subtle focus-visible:outline-none focus-visible:bg-subtle transition-colors cursor-pointer"
        aria-label={showPassword ? 'Hide password' : 'Show password'}
      >
        {showPassword ? <EyeOff size={15} strokeWidth={2} /> : <Eye size={15} strokeWidth={2} />}
      </button>
    );

    return (
      <div className="relative inline-block w-full font-sans nui-password-input">
        <Input
          {...props}
          ref={ref}
          type={showPassword ? 'text' : 'password'}
          rightIcon={toggleButton}
          rightIconClassName="right-2 pointer-events-auto"
          className={cn(className)}
        />
      </div>
    );
  }
);
PasswordInput.displayName = 'PasswordInput';
