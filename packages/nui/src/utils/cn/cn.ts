import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Conditionally joins class names together and cleanly resolves Tailwind utility conflicts.
 * Uses `clsx` for conditional logic and `twMerge` to ensure classes like `p-4` and `p-8` 
 * override predictably.
 *
 * @param inputs - A variadic list of class values to evaluate and merge.
 * @returns A space-separated string of the active, deduplicated class names.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}