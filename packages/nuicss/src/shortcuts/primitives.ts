import type { DynamicShortcut, StaticShortcut } from 'unocss';

export const primitiveShortcuts: (StaticShortcut | DynamicShortcut)[] = [
  // ==========================================
  // 1. Button Variants & Sizes
  // ==========================================
  [
    'btn',
    'inline-flex items-center justify-center whitespace-nowrap gap-2 font-sans font-medium transition-all duration-200 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fg-default,#0f172a)] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none rounded-md cursor-pointer select-none',
  ],
  [
    'btn-default',
    'bg-surface text-default border border-solid border-default hover:bg-subtle',
  ],
  [
    'btn-primary',
    'bg-primary text-primary-fg border border-solid border-transparent hover:bg-primary-hover',
  ],
  [
    'btn-secondary',
    'bg-secondary text-secondary-fg border border-solid border-default hover:bg-subtle',
  ],
  [
    'btn-outline',
    'bg-transparent border border-solid border-strong text-default hover:bg-subtle',
  ],
  [
    'btn-ghost',
    'bg-transparent text-default border border-solid border-transparent hover:bg-subtle',
  ],
  [
    'btn-danger',
    'bg-danger text-danger-fg border border-solid border-transparent hover:bg-danger-hover',
  ],
  [
    'btn-link',
    'text-primary border border-solid border-transparent underline-offset-4 hover:underline',
  ],
  ['btn-sm', 'h-8 px-3 text-xs'],
  ['btn-md', 'h-9 px-4 text-sm'],
  ['btn-lg', 'h-11 px-8 text-sm font-semibold'],
  ['btn-icon', 'h-9 w-9 p-0'],
  [
    'btn-loading',
    "relative !text-transparent pointer-events-none after:content-[''] after:absolute after:inset-0 after:m-auto after:w-4 after:h-4 after:border-2 after:border-solid after:border-white after:border-t-transparent after:rounded-full after:animate-spin",
  ],

  // ==========================================
  // 2. Badges
  // ==========================================
  [
    'badge',
    'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold font-sans select-none',
  ],
  ['badge-default', 'bg-subtle text-default border border-default'],
  ['badge-primary', 'bg-primary-subtle text-primary border border-primary/20'],
  ['badge-success', 'bg-success-subtle text-success border border-success/20'],
  ['badge-warning', 'bg-warning-subtle text-warning border border-warning/20'],
  ['badge-danger', 'bg-danger-subtle text-danger border border-danger/20'],
  ['badge-info', 'bg-info-subtle text-info border border-info/20'],
  ['badge-subtle', 'bg-muted text-muted'],
  ['badge-sm', 'text-[10px] px-2 py-0.2'],
  ['badge-md', 'text-xs px-2.5 py-0.5'],
  ['badge-lg', 'text-sm px-3 py-1'],
  ['badge-pill', 'rounded-full'],
  [
    'badge-dot',
    "relative pl-5 before:content-[''] before:absolute before:left-2 before:top-1/2 before:-translate-y-1/2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-current",
  ],

  // ==========================================
  // 3. Cards
  // ==========================================
  [
    'card',
    'rounded-xl border border-default bg-surface text-default p-6 shadow-sm hover:shadow-md transition-shadow font-sans flex flex-col',
  ],
  ['card-bordered', 'border-2 border-strong'],
  ['card-header', 'flex flex-col gap-1.5 pb-4 border-b border-default'],
  [
    'card-title',
    'text-lg font-semibold tracking-tight text-default m-0 leading-tight',
  ],
  ['card-description', 'text-sm text-muted m-0 leading-relaxed'],
  ['card-body', 'py-4 text-default leading-relaxed flex-1'],
  ['card-footer', 'flex items-center pt-4 border-t border-default gap-2'],

  // ==========================================
  // 4. Avatars
  // ==========================================
  [
    'avatar',
    'relative inline-flex items-center justify-center shrink-0 w-10 h-10 rounded-full overflow-hidden bg-subtle text-muted font-medium font-sans select-none border border-default',
  ],
  ['avatar-sm', 'w-8 h-8 text-xs'],
  ['avatar-md', 'w-10 h-10 text-sm'],
  ['avatar-lg', 'w-12 h-12 text-base'],
  ['avatar-xl', 'w-16 h-16 text-lg'],
  ['avatar-circle', 'rounded-full'],
  ['avatar-square', 'rounded-lg'],
  ['avatar-image', 'w-full h-full object-cover'],
  [
    'avatar-online',
    "relative after:content-[''] after:absolute after:bottom-0 after:right-0 after:w-2.5 after:h-2.5 after:rounded-full after:bg-success after:border-2 after:border-surface",
  ],
  [
    'avatar-busy',
    "relative after:content-[''] after:absolute after:bottom-0 after:right-0 after:w-2.5 after:h-2.5 after:rounded-full after:bg-danger after:border-2 after:border-surface",
  ],
  [
    'avatar-away',
    "relative after:content-[''] after:absolute after:bottom-0 after:right-0 after:w-2.5 after:h-2.5 after:rounded-full after:bg-warning after:border-2 after:border-surface",
  ],
  [
    'avatar-group',
    'flex -space-x-2 overflow-hidden hover:space-x-1 transition-all',
  ],

  // ==========================================
  // 5. Dividers
  // ==========================================
  ['divider', 'flex items-center w-full my-4 border-t border-default'],
  [
    'divider-text',
    "flex items-center gap-4 my-4 before:content-[''] before:flex-1 before:border-t before:border-default after:content-[''] after:flex-1 after:border-t after:border-default text-xs text-muted uppercase tracking-wider font-sans select-none",
  ],
  [
    'divider-vertical',
    'inline-flex h-full min-h-[1.5rem] w-[1px] bg-[var(--border-default,#cbd5e1)] mx-3 self-stretch',
  ],

  // ==========================================
  // 6. Kbd
  // ==========================================
  [
    'kbd',
    'inline-flex items-center justify-center px-2 py-0.5 font-mono text-xs font-medium text-muted bg-subtle border border-default rounded shadow-[0_1px_0_1px_rgba(0,0,0,0.05)] select-none',
  ],
  ['kbd-sm', 'text-[10px] px-1.5 py-0.2'],
  ['kbd-md', 'text-xs px-2 py-0.5'],
  ['kbd-lg', 'text-sm px-2.5 py-1'],

  // ==========================================
  // 7. Skeletons
  // ==========================================
  ['skeleton', 'animate-pulse bg-muted rounded-md pointer-events-none'],
  ['skeleton-text', 'h-4 w-full rounded'],
  ['skeleton-circle', 'rounded-full shrink-0'],
  ['skeleton-rect', 'w-full h-32 rounded-lg'],

  // ==========================================
  // 8. Spinners
  // ==========================================
  [
    'spinner',
    'inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]',
  ],
  ['spinner-sm', 'w-4 h-4 border-2'],
  ['spinner-md', 'w-6 h-6 border-2'],
  ['spinner-lg', 'w-8 h-8 border-3'],
  ['spinner-primary', 'text-primary'],

  // ==========================================
  // 9. Empty State
  // ==========================================
  [
    'empty-state',
    'flex flex-col items-center justify-center p-8 text-center bg-surface border border-dashed border-default rounded-xl font-sans',
  ],
  [
    'empty-state-icon',
    'flex items-center justify-center w-12 h-12 rounded-full bg-subtle text-muted mb-4',
  ],
  ['empty-state-title', 'text-base font-semibold text-default mb-1'],
  [
    'empty-state-description',
    'text-sm text-muted max-w-sm mb-4 leading-relaxed',
  ],
  ['empty-state-actions', 'flex items-center gap-3'],

  // ==========================================
  // 10. Stat Cards
  // ==========================================
  [
    'stat-card',
    'p-5 bg-surface text-default border border-default rounded-xl shadow-sm hover:shadow-md transition-shadow font-sans flex flex-col justify-between',
  ],
  [
    'stat-card-label',
    'text-xs font-semibold text-muted uppercase tracking-wider',
  ],
  ['stat-card-value', 'text-2xl font-bold tracking-tight mt-2 text-default'],
  ['stat-card-trend', 'flex items-center gap-1 text-xs font-medium mt-2'],
  ['stat-card-trend-up', 'text-success'],
  ['stat-card-trend-down', 'text-danger'],

  // ==========================================
  // 11. Links
  // ==========================================
  [
    'link',
    'font-medium text-primary underline-offset-4 hover:underline transition-colors cursor-pointer',
  ],
  ['link-muted', 'text-muted hover:text-default'],
  ['link-hover', 'no-underline hover:underline'],

  // ==========================================
  // 12. Layout Helpers
  // ==========================================
  ['container-center', 'w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl'],
  ['stack', 'flex flex-col gap-4'],
  ['stack-sm', 'flex flex-col gap-2'],
  ['stack-lg', 'flex flex-col gap-6'],
  ['flex-center', 'flex items-center justify-center'],
  ['flex-between', 'flex items-center justify-between'],

  // ==========================================
  // 13. Breadcrumbs
  // ==========================================
  ['breadcrumbs', 'flex items-center gap-2 text-sm font-sans text-muted'],
  ['breadcrumb-list', 'flex items-center gap-2 list-none p-0 m-0'],
  [
    'breadcrumb-item',
    'inline-flex items-center gap-2 hover:text-default transition-colors list-none',
  ],
  ['breadcrumb-separator', 'text-muted/50 select-none'],
  ['breadcrumb-active', 'text-default font-medium pointer-events-none'],
  ['breadcrumb-current', 'text-default font-medium pointer-events-none'],

  // ==========================================
  // 14. Timeline
  // ==========================================
  [
    'timeline',
    'relative border-l border-default ml-3 font-sans space-y-6 my-4 list-none p-0',
  ],
  ['timeline-item', 'relative pl-6'],
  [
    'timeline-point',
    'absolute -left-1.5 top-1.5 w-3 h-3 rounded-full border-2 border-surface bg-primary',
  ],
  ['timeline-time', 'text-xs font-medium text-muted uppercase tracking-wider'],
  ['timeline-title', 'text-sm font-semibold text-default mt-1'],
  ['timeline-content', 'text-sm text-muted mt-1 leading-relaxed'],

  // ==========================================
  // 15. Progress
  // ==========================================
  ['progress', 'relative w-full overflow-hidden rounded-full bg-subtle'],
  ['progress-sm', 'h-1.5'],
  ['progress-md', 'h-2.5'],
  ['progress-lg', 'h-4'],
  [
    'progress-bar',
    'h-full rounded-full transition-all duration-300 ease-out bg-primary',
  ],
  ['progress-primary', 'bg-primary'],
  ['progress-success', 'bg-success'],
  ['progress-danger', 'bg-danger'],
  [
    'progress-indeterminate',
    "relative after:content-[''] after:absolute after:inset-0 after:bg-primary after:rounded-full after:animate-[pulse_1.5s_ease-in-out_infinite]",
  ],

  // ==========================================
  // 16. Attachments
  // ==========================================
  [
    'attachment',
    'flex items-center justify-between p-3 rounded-xl border border-default bg-surface font-sans transition-all hover:border-primary/50 shadow-sm',
  ],
  [
    'attachment-icon',
    'flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary shrink-0 border border-primary/20',
  ],
  ['attachment-details', 'flex flex-col min-w-0 pr-3 flex-1'],
  ['attachment-name', 'text-sm font-medium text-default truncate'],
  ['attachment-size', 'text-xs text-muted mt-0.5'],
  [
    'attachment-action',
    'text-muted hover:text-default transition-colors p-1.5 rounded-md hover:bg-subtle cursor-pointer',
  ],

  // ==========================================
  // 17. Watermarks
  // ==========================================
  ['watermark', 'relative overflow-hidden'],
  [
    'watermark-pattern',
    'absolute inset-0 pointer-events-none select-none opacity-5 flex items-center justify-center rotate-[-25deg] text-4xl font-bold tracking-widest text-default uppercase',
  ],

  // ==========================================
  // 18. NUI Provider
  // ==========================================
  ['nuix-provider', 'contents font-sans text-default bg-page'],
  ['nui-provider', 'contents font-sans text-default bg-page'],
  ['provider', 'contents font-sans text-default bg-page'],
];
