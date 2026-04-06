import type { FeatureCardData } from "../types";


export const featureCards: FeatureCardData[] = [
  {
    title: 'Accessible by default',
    desc: 'Use components built around documented WAI-ARIA patterns, keyboard support, and focus management.',
    badge: 'Accessibility',
    variant: 'success',
  },
  {
    title: 'Built for product UI',
    desc: 'Cover forms, structured data, overlays, navigation, and feedback with a consistent component set.',
    badge: 'Application UI',
    variant: 'danger',
  },
  {
    title: 'Composable workflows',
    desc: 'Combine dialogs, toasts, step flows, selects, tables, and drawers into real user journeys.',
    badge: 'Composable',
    variant: 'warning',
  },
  {
    title: 'Structured data ready',
    desc: 'Present tabular content with theme-aware rendering, sorting support, and responsive overflow handling.',
    badge: 'Table',
    variant: 'default',
  },
  {
    title: 'Flexible overlays',
    desc: 'Use drawers and imperative dialog flows for confirmations, alerts, and guided actions.',
    badge: 'Overlays',
    variant: 'danger',
  },
  {
    title: 'Practical feedback',
    desc: 'Pair promise-driven dialogs with toast notifications for transactional flows and status feedback.',
    badge: 'Feedback',
    variant: 'success',
  },
];
