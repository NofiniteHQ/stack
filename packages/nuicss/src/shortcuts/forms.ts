import type { DynamicShortcut, StaticShortcut } from 'unocss';

export const formShortcuts: (StaticShortcut | DynamicShortcut)[] = [
  // ==========================================
  // 1. Text Inputs
  // ==========================================
  [
    'input',
    'h-9 w-full rounded-md border border-solid border-default bg-surface px-3 py-1 text-sm text-default shadow-sm outline-none transition-all placeholder:text-muted focus-visible:outline-none focus-visible:border-focus focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fg-default,#0f172a)] disabled:cursor-not-allowed disabled:opacity-50 font-sans',
  ],
  ['input-sm', 'h-8 px-2.5 text-xs'],
  ['input-md', 'h-9 px-3 text-sm'],
  ['input-lg', 'h-11 px-4 text-base'],
  [
    'input-error',
    'border-danger focus-visible:border-danger focus-visible:outline-danger',
  ],
  ['input-group', 'relative flex items-center w-full font-sans'],
  [
    'input-addon-left',
    'absolute left-3 text-muted pointer-events-none flex items-center justify-center',
  ],
  [
    'input-addon-right',
    'absolute right-3 text-muted flex items-center justify-center',
  ],
  ['input-has-addon-left', 'pl-9'],
  ['input-has-addon-right', 'pr-9'],

  // ==========================================
  // 2. Textarea
  // ==========================================
  [
    'textarea',
    'w-full rounded-md border border-solid border-default bg-surface px-3 py-2 text-sm text-default shadow-sm outline-none transition-all placeholder:text-muted focus-visible:outline-none focus-visible:border-focus focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fg-default,#0f172a)] disabled:cursor-not-allowed disabled:opacity-50 font-sans min-h-[80px]',
  ],
  [
    'textarea-error',
    'border-danger focus-visible:border-danger focus-visible:outline-danger',
  ],

  // ==========================================
  // 3. Checkbox
  // ==========================================
  [
    'checkbox',
    'h-4 w-4 rounded border border-solid border-strong bg-surface text-primary accent-primary cursor-pointer transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fg-default,#0f172a)] disabled:cursor-not-allowed disabled:opacity-50',
  ],
  ['checkbox-sm', 'h-3.5 w-3.5'],
  ['checkbox-md', 'h-4 w-4'],
  ['checkbox-lg', 'h-5 w-5'],
  [
    'checkbox-label',
    'flex items-center gap-2.5 text-sm font-sans font-medium text-default select-none cursor-pointer',
  ],

  // ==========================================
  // 4. Radio
  // ==========================================
  [
    'radio',
    'h-4 w-4 rounded-full border border-solid border-strong bg-surface text-primary accent-primary cursor-pointer transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fg-default,#0f172a)] disabled:cursor-not-allowed disabled:opacity-50',
  ],
  ['radio-group', 'flex flex-col gap-2.5 font-sans'],
  ['radio-group-horizontal', 'flex flex-row items-center gap-4 font-sans'],
  [
    'radio-label',
    'flex items-center gap-2.5 text-sm font-sans font-medium text-default select-none cursor-pointer',
  ],

  // ==========================================
  // 5. Switch
  // ==========================================
  [
    'switch',
    'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fg-default,#0f172a)] bg-subtle data-[state=checked]:bg-primary p-0.5',
  ],
  [
    'switch-thumb',
    'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-surface shadow-md ring-0 transition-transform duration-200 ease-in-out translate-x-0 data-[state=checked]:translate-x-5',
  ],
  [
    'switch-label',
    'flex items-center gap-3 text-sm font-sans font-medium text-default select-none cursor-pointer',
  ],

  // ==========================================
  // 6. Select
  // ==========================================
  [
    'select',
    'h-9 w-full rounded-md border border-solid border-default bg-surface px-3 py-1 text-sm text-default shadow-sm outline-none transition-all focus-visible:outline-none focus-visible:border-focus focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fg-default,#0f172a)] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer font-sans',
  ],
  ['select-sm', 'h-8 px-2.5 text-xs'],
  ['select-lg', 'h-11 px-4 text-base'],

  // ==========================================
  // 7. Number Input
  // ==========================================
  [
    'number-input',
    'inline-flex items-center h-9 rounded-lg border border-default bg-surface shadow-sm overflow-hidden font-sans w-32',
  ],
  [
    'number-input-field',
    'w-full h-full text-center px-2 text-sm font-semibold bg-transparent border-none text-default outline-none appearance-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
  ],
  [
    'number-input-stepper',
    'absolute right-1 flex flex-col items-center justify-center gap-0.5',
  ],
  [
    'number-input-btn',
    'w-9 h-full flex items-center justify-center text-muted hover:text-default bg-transparent hover:bg-subtle border-none cursor-pointer text-base font-bold select-none transition-colors shrink-0',
  ],

  // ==========================================
  // 8. Pin Input
  // ==========================================
  ['pin-input', 'flex items-center gap-2 font-sans'],
  [
    'pin-input-field',
    'w-10 h-12 text-center text-lg font-bold font-mono rounded-lg border border-solid border-default bg-surface text-default shadow-sm outline-none transition-all focus-visible:border-focus focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fg-default,#0f172a)]',
  ],
  [
    'pin-input-box',
    'w-10 h-12 text-center text-lg font-bold font-mono rounded-lg border border-solid border-default bg-surface text-default shadow-sm outline-none transition-all focus-visible:border-focus focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fg-default,#0f172a)]',
  ],

  // ==========================================
  // 9. Password Input
  // ==========================================
  ['password-input', 'relative flex items-center w-full font-sans'],
  [
    'password-toggle-btn',
    'absolute right-2.5 p-1 text-muted hover:text-default bg-transparent border-none cursor-pointer rounded hover:bg-subtle flex items-center justify-center',
  ],

  // ==========================================
  // 10. Slider
  // ==========================================
  [
    'slider',
    'w-full h-2 bg-subtle rounded-lg appearance-none cursor-pointer accent-primary outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fg-default,#0f172a)]',
  ],

  // ==========================================
  // 11. Rating
  // ==========================================
  ['rating', 'inline-flex items-center gap-1 font-sans select-none'],
  [
    'rating-star',
    'cursor-pointer text-muted transition-colors hover:text-warning data-[state=active]:text-warning p-0.5 border-none bg-transparent text-lg leading-none',
  ],

  // ==========================================
  // 12. Segmented Control
  // ==========================================
  [
    'segmented-control',
    'relative inline-flex p-1 rounded-lg bg-subtle border border-default font-sans select-none',
  ],
  [
    'segmented-control-item',
    'relative z-10 px-3 py-1.5 text-xs font-semibold text-muted transition-all rounded-md cursor-pointer select-none border-none bg-transparent data-[state=active]:text-default data-[state=active]:bg-surface data-[state=active]:shadow-sm',
  ],

  // ==========================================
  // 13. Alert
  // ==========================================
  [
    'alert',
    'relative flex items-start gap-3.5 p-4 rounded-xl border border-default bg-surface text-default font-sans shadow-sm',
  ],
  ['alert-success', 'border-success/30 bg-success/10 text-success'],
  ['alert-danger', 'border-danger/30 bg-danger/10 text-danger'],
  ['alert-warning', 'border-warning/30 bg-warning/10 text-warning'],
  ['alert-info', 'border-info/30 bg-info/10 text-info'],
  ['alert-icon', 'shrink-0 w-5 h-5 mt-0.5'],
  ['alert-content', 'flex-1 min-w-0'],
  ['alert-title', 'text-sm font-semibold text-default m-0 leading-tight'],
  ['alert-description', 'text-sm text-muted mt-1 m-0 leading-relaxed'],
  [
    'alert-close',
    'text-muted hover:text-default p-1 rounded-md hover:bg-subtle cursor-pointer ml-auto shrink-0 inline-flex items-center justify-center border-none bg-transparent',
  ],

  // ==========================================
  // 14. Toast
  // ==========================================
  [
    'toast-container',
    'fixed bottom-5 right-5 flex flex-col items-end gap-3 z-50 pointer-events-none',
  ],
  [
    'toast',
    'pointer-events-auto flex items-start justify-between gap-3 w-full min-w-[320px] max-w-sm p-4 rounded-xl bg-surface text-default backdrop-blur-md font-sans border border-default shadow-xl transition-all duration-300',
  ],
  ['toast-title', 'text-sm font-semibold text-default m-0'],
  ['toast-description', 'text-xs text-muted mt-1 m-0 leading-relaxed'],
  [
    'toast-close',
    'text-muted hover:text-default p-1 rounded-md hover:bg-subtle cursor-pointer ml-auto shrink-0 inline-flex items-center justify-center border-none bg-transparent',
  ],

  // ==========================================
  // 15. Form Control Helpers
  // ==========================================
  ['form-control', 'flex flex-col gap-1.5 w-full font-sans'],
  ['form-label', 'text-xs font-semibold text-default flex items-center gap-1'],
  ['form-label-required', "after:content-['*'] after:text-danger after:ml-0.5"],
  ['form-helper-text', 'text-xs text-muted leading-relaxed'],
  [
    'form-error-message',
    'text-xs font-medium text-danger leading-relaxed flex items-center gap-1 mt-0.5',
  ],

  // ==========================================
  // 16. Rich Text Editor
  // ==========================================
  [
    'editor',
    'w-full rounded-xl border border-default bg-surface shadow-sm overflow-hidden font-sans focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all',
  ],
  [
    'editor-toolbar',
    'flex flex-wrap items-center gap-1 p-2 border-b border-default bg-subtle/40 select-none',
  ],
  [
    'editor-content',
    'p-4 outline-none text-default leading-relaxed text-sm overflow-y-auto',
  ],
];
