import type { BadgeVariant } from "@nofinite/nui";

export type Theme = 'light' | 'dark';

export type ButtonVariant = 'default' | 'outline' | 'ghost' | 'destructive';

export type ButtonSize = 'sm' | 'md' | 'lg';

export interface FeatureCardData {
  title: string;
  desc: string;
  badge: string;
  variant: BadgeVariant;
}

export interface User {
  id: number;
  name: string;
  role: string;
  status: 'Active' | 'Pending' | 'Inactive';
  plan: 'Core' | 'Starter' | 'Team';
}

export interface FAQItem {
  id: string;
  title: string;
  content: string;
}

export interface TabItem {
  value: string;
  label: string;
}

export interface StatItem {
  label: string;
  value: string;
}

export interface TableColumn<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
}
