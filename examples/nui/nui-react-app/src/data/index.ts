import type { SelectOption } from '@nofinite/nui';
import type { StatItem, TabItem } from '../types';


export { featureCards } from './featureCards';
export { users } from './users';
export { faqItems } from './faqItems';

export const showcaseTabs: TabItem[] = [
  { value: 'overview', label: 'Overview' },
  { value: 'forms', label: 'Forms' },
  { value: 'feedback', label: 'Feedback' },
  { value: 'data', label: 'Data' },
];

export const frameworkOptions: SelectOption[] = [
  { value: 'nextjs', label: 'Next.js' },
  { value: 'vite', label: 'Vite' },
  { value: 'remix', label: 'Remix' },
  { value: 'astro', label: 'Astro' },
];

export const heroStats: StatItem[] = [
  { label: 'Forms', value: 'Input · Select' },
  { label: 'Feedback', value: 'Dialogs · Toasts' },
  { label: 'Flows', value: 'Stepper · Accordion' },
  { label: 'Data', value: 'Table' },
];

export const preferredSetupOptions: SelectOption[] = [
  { value: 'next', label: 'Next.js' },
  { value: 'vite', label: 'Vite' },
  { value: 'remix', label: 'Remix' },
];
