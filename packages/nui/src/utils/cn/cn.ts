import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const customTwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'bg-color': [
        'bg-page', 'bg-surface', 'bg-surface-raised', 'bg-surface-overlay',
        'bg-subtle', 'bg-muted', 'bg-accent', 'bg-overlay', 'bg-glass'
      ],
      'text-color': [
        'text-default', 'text-subtle', 'text-muted', 'text-accent', 
        'text-inverse', 'text-disabled'
      ],
      'border-color': [
        'border-default', 'border-strong', 'border-subtle', 'border-hover', 
        'border-focus', 'border-disabled', 'border-glassBorder'
      ],
      'ring-color': ['ring-focus'],
      'ring-offset-color': ['ring-offset-surface', 'ring-offset-background']
    }
  }
});

/**
 * Conditionally joins class names together and cleanly resolves Tailwind utility conflicts.
 * Uses `clsx` for conditional logic and a custom `twMerge` to ensure custom Nui classes 
 * override predictably.
 *
 * @param inputs - A variadic list of class values to evaluate and merge.
 * @returns A space-separated string of the active, deduplicated class names.
 */
export function cn(...inputs: ClassValue[]): string {
  return customTwMerge(clsx(inputs));
}