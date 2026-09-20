import type { DynamicShortcut, StaticShortcut } from 'unocss';

export const overlayShortcuts: (StaticShortcut | DynamicShortcut)[] = [
  // ==========================================
  // 1. Modals & Dialogs
  // ==========================================
  [
    'modal',
    'fixed inset-0 m-auto p-0 bg-transparent border-none max-w-lg w-[calc(100%-2rem)] backdrop:bg-overlay backdrop:backdrop-blur-sm outline-none overflow-visible z-50 aria-hidden:hidden',
  ],
  ['modal-sm', 'max-w-sm'],
  ['modal-md', 'max-w-lg'],
  ['modal-lg', 'max-w-2xl'],
  ['modal-xl', 'max-w-4xl'],
  [
    'modal-full',
    'max-w-[calc(100%-2rem)] max-h-[calc(100%-2rem)] h-[calc(100%-2rem)]',
  ],
  [
    'modal-box',
    'relative bg-surface text-default border border-default rounded-xl shadow-2xl p-6 font-sans flex flex-col max-h-[90vh] overflow-y-auto',
  ],
  [
    'modal-header',
    'flex items-center justify-between pb-3 border-b border-default mb-4',
  ],
  ['modal-title', 'text-lg font-semibold text-default m-0 leading-tight'],
  ['modal-description', 'text-sm text-muted mt-1 m-0 leading-relaxed'],
  ['modal-body', 'text-default leading-relaxed flex-1 py-2'],
  [
    'modal-footer',
    'flex items-center justify-end gap-3 pt-4 border-t border-default mt-4',
  ],
  [
    'modal-close',
    'text-muted hover:text-default p-1 rounded-md hover:bg-subtle transition-colors cursor-pointer inline-flex items-center justify-center',
  ],

  // Dialog aliases & helpers
  [
    'dialog',
    'fixed inset-0 m-auto p-0 bg-transparent border-none max-w-md w-[calc(100%-2rem)] backdrop:bg-overlay backdrop:backdrop-blur-sm outline-none overflow-visible z-50 aria-hidden:hidden',
  ],
  [
    'dialog-box',
    'relative bg-surface text-default border border-default rounded-xl shadow-2xl p-6 font-sans flex flex-col',
  ],
  [
    'dialog-icon',
    'w-12 h-12 rounded-full flex items-center justify-center mb-4 shrink-0',
  ],
  ['dialog-icon-danger', 'bg-danger/10 text-danger'],
  ['dialog-icon-warning', 'bg-warning/10 text-warning'],
  ['dialog-icon-info', 'bg-info/10 text-info'],
  ['dialog-icon-success', 'bg-success/10 text-success'],

  // ==========================================
  // 2. Drawers
  // ==========================================
  [
    'drawer',
    'fixed m-0 p-0 bg-transparent border-none backdrop:bg-overlay backdrop:backdrop-blur-sm outline-none z-50 transition-transform duration-300 [&:is(dialog):not([open])]:hidden [&:not(dialog):not([data-state=open])]:hidden aria-hidden:hidden',
  ],
  ['drawer-right', 'right-0 top-0 bottom-0 h-full max-h-none max-w-md w-full'],
  ['drawer-left', 'left-0 top-0 bottom-0 h-full max-h-none max-w-md w-full'],
  ['drawer-top', 'top-0 left-0 right-0 w-full max-w-none max-h-[50vh]'],
  ['drawer-bottom', 'bottom-0 left-0 right-0 w-full max-w-none max-h-[50vh]'],
  [
    'drawer-box',
    'h-full bg-surface text-default border-default p-6 flex flex-col overflow-y-auto font-sans shadow-2xl',
  ],
  [
    'drawer-header',
    'flex items-center justify-between pb-4 border-b border-default mb-4',
  ],
  ['drawer-title', 'text-lg font-semibold text-default m-0'],
  ['drawer-body', 'flex-1 py-2 text-default leading-relaxed overflow-y-auto'],
  [
    'drawer-footer',
    'flex items-center justify-end gap-3 pt-4 border-t border-default mt-auto',
  ],
  [
    'drawer-close',
    'text-muted hover:text-default p-1 rounded-md hover:bg-subtle cursor-pointer bg-transparent border-none text-xl leading-none',
  ],

  // ==========================================
  // 3. Dropdowns
  // ==========================================
  ['dropdown', 'relative inline-block font-sans'],
  [
    'dropdown-menu',
    'z-50 min-w-[180px] overflow-hidden rounded-lg border border-default bg-surface p-1 font-sans shadow-xl outline-none hidden data-[state=open]:block',
  ],
  [
    'dropdown-item',
    'w-full border-none bg-transparent text-left flex cursor-pointer select-none items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-default outline-none transition-colors duration-200 hover:bg-subtle focus-visible:bg-subtle aria-disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:pointer-events-none font-normal',
  ],
  [
    'dropdown-item-danger',
    'w-full border-none bg-transparent text-left flex cursor-pointer select-none items-center gap-2 rounded-md px-2.5 py-1.5 text-sm outline-none transition-colors duration-200 text-danger hover:bg-danger/10 focus-visible:bg-danger/10 aria-disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:pointer-events-none font-normal',
  ],
  ['dropdown-divider', 'my-1 h-px bg-[var(--border-default,#cbd5e1)]'],
  [
    'dropdown-header',
    'px-2.5 py-1 text-xs font-semibold text-muted uppercase tracking-wider',
  ],

  // ==========================================
  // 4. Context Menu
  // ==========================================
  [
    'context-menu',
    'fixed z-50 min-w-[180px] overflow-hidden rounded-lg border border-default bg-surface p-1 font-sans shadow-xl outline-none hidden data-[state=open]:block',
  ],
  [
    'context-menu-item',
    'w-full border-none bg-transparent text-left flex cursor-pointer select-none items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-default outline-none transition-colors duration-200 hover:bg-subtle focus-visible:bg-subtle aria-disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:pointer-events-none font-normal',
  ],
  ['context-menu-divider', 'my-1 h-px bg-[var(--border-default,#cbd5e1)]'],
  [
    'context-menu-header',
    'px-2.5 py-1 text-xs font-semibold text-muted uppercase tracking-wider',
  ],

  // ==========================================
  // 5. Popovers
  // ==========================================
  ['popover-wrapper', 'relative inline-block font-sans'],
  [
    'popover',
    'z-50 min-w-[240px] max-w-sm rounded-xl border border-default bg-surface p-4 font-sans shadow-xl outline-none hidden data-[state=open]:block aria-hidden:hidden',
  ],
  [
    'popover-content',
    'z-50 min-w-[240px] max-w-sm rounded-xl border border-default bg-surface p-4 font-sans shadow-xl outline-none hidden data-[state=open]:block aria-hidden:hidden',
  ],
  [
    'popover-header',
    'flex items-center justify-between pb-2 mb-2 border-b border-default',
  ],
  ['popover-body', 'py-1 text-sm text-default leading-relaxed'],
  ['popover-title', 'text-sm font-semibold text-default m-0 mb-1'],
  ['popover-description', 'text-xs text-muted m-0 leading-relaxed'],
  [
    'popover-close',
    'text-muted hover:text-default p-1 rounded-md hover:bg-subtle cursor-pointer bg-transparent border-none leading-none',
  ],

  // ==========================================
  // 6. Tooltips (with 4-way placement)
  // ==========================================
  [
    'tooltip',
    'fixed z-50 rounded-md bg-[var(--fg-default,#0f172a)] px-2.5 py-1 text-xs font-medium text-[var(--bg-surface,#ffffff)] shadow-md pointer-events-none transition-opacity duration-150 font-sans aria-hidden:hidden',
  ],
  ['tooltip-top', 'bottom-full left-1/2 -translate-x-1/2 mb-2'],
  ['tooltip-bottom', 'top-full left-1/2 -translate-x-1/2 mt-2'],
  ['tooltip-left', 'right-full top-1/2 -translate-y-1/2 mr-2'],
  ['tooltip-right', 'left-full top-1/2 -translate-y-1/2 ml-2'],
  [
    'tooltip-arrow',
    'absolute w-2 h-2 bg-[var(--fg-default,#0f172a)] rotate-45',
  ],

  // ==========================================
  // 7. Hover Card
  // ==========================================
  ['hover-card', 'relative inline-block font-sans'],
  [
    'hover-card-content',
    'z-50 min-w-[280px] max-w-sm rounded-xl border border-default bg-surface p-4 font-sans shadow-xl outline-none hidden data-[state=open]:block transition-all duration-200',
  ],

  // ==========================================
  // 8. Command Palette
  // ==========================================
  [
    'command-palette',
    'modal fixed inset-0 z-50 p-0 m-auto bg-transparent backdrop:bg-overlay backdrop:backdrop-blur-sm',
  ],
  [
    'command-palette-box',
    'modal-box w-full max-w-lg rounded-2xl border border-default bg-surface text-default shadow-2xl overflow-hidden font-sans p-0',
  ],
  [
    'command-input',
    'w-full bg-transparent text-default placeholder:text-muted border-none outline-none text-sm font-medium',
  ],
  [
    'command-item',
    'flex items-center justify-between px-3 py-2 rounded-lg text-sm text-default cursor-pointer transition-colors hover:bg-subtle',
  ],

  // ==========================================
  // 9. Link Preview
  // ==========================================
  [
    'link-preview-card',
    'w-full max-w-sm rounded-xl border border-default bg-surface shadow-md overflow-hidden font-sans text-default transition-all hover:shadow-lg hover:border-primary/40 block no-underline',
  ],
  [
    'link-preview-image-wrapper',
    'h-36 w-full overflow-hidden bg-subtle relative',
  ],
  ['link-preview-popup', 'fixed z-50 animate-zoom-in duration-150'],
];
