import type { FAQItem } from "../types";

export const faqItems: FAQItem[] = [
  {
    id: 'components',
    title: 'What kind of interfaces can I build with NUI?',
    content:
      'NUI covers common product interface needs such as forms, tables, badges, drawers, dialogs, steppers, accordions, and selection controls.',
  },
  {
    id: 'accessibility',
    title: 'Is NUI suited for accessible application UI?',
    content:
      'Yes. The component docs highlight accessible patterns such as WAI-ARIA compliance, keyboard navigation, focus handling, and interaction guidance.',
  },
  {
    id: 'feedback',
    title: 'How does feedback work in NUI?',
    content:
      'NUI supports imperative alerts, confirmations, success messages, and toast bridging through its dialog infrastructure.',
  },
];
