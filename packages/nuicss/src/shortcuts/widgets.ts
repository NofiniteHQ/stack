import type { StaticShortcut, DynamicShortcut } from 'unocss';

export const widgetShortcuts: (StaticShortcut | DynamicShortcut)[] = [
  // ==========================================
  // 1. Accordion
  // ==========================================
  [
    'accordion',
    'flex flex-col divide-y divide-default border border-default rounded-xl overflow-hidden font-sans bg-surface shadow-sm',
  ],
  ['accordion-item', 'overflow-hidden'],
  [
    'accordion-header',
    'flex items-center justify-between w-full px-5 py-4 text-sm font-semibold text-default hover:bg-subtle/50 transition-colors cursor-pointer bg-transparent border-none text-left select-none',
  ],
  [
    'accordion-icon',
    'w-4 h-4 text-muted transition-transform duration-200 data-[state=open]:rotate-180 shrink-0 inline-flex items-center justify-center',
  ],
  [
    'accordion-content',
    'overflow-hidden grid grid-rows-[0fr] transition-all duration-200 ease-out data-[state=open]:grid-rows-[1fr]',
  ],
  [
    'accordion-body',
    'min-h-0 overflow-hidden px-5 py-0 data-[state=open]:py-4 transition-all duration-200 text-sm text-muted leading-relaxed',
  ],

  // ==========================================
  // 2. Collapsible
  // ==========================================
  ['collapsible', 'flex flex-col font-sans'],
  [
    'collapsible-trigger',
    'cursor-pointer select-none inline-flex items-center justify-between',
  ],
  [
    'collapsible-content',
    'grid grid-rows-[0fr] transition-all duration-200 ease-out data-[state=open]:grid-rows-[1fr]',
  ],
  ['collapsible-body', 'overflow-hidden text-sm text-muted'],

  // ==========================================
  // 3. Tabs
  // ==========================================
  ['tabs', 'flex flex-col w-full font-sans'],
  [
    'tab-list',
    'flex items-center gap-1 border-b border-default pb-px select-none',
  ],
  [
    'tab-list-pills',
    'p-1 rounded-lg bg-subtle border border-default inline-flex gap-1 select-none',
  ],
  [
    'tab',
    'px-4 py-2 text-sm font-medium text-muted hover:text-default transition-all cursor-pointer select-none rounded-t-md relative -mb-px data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:font-semibold outline-none focus-visible:ring-2 focus-visible:ring-primary border-none bg-transparent',
  ],
  [
    'tab-pill',
    'px-3 py-1.5 text-xs font-semibold text-muted hover:text-default transition-all cursor-pointer select-none rounded-md data-[state=active]:text-default data-[state=active]:bg-surface data-[state=active]:shadow-sm outline-none border-none bg-transparent',
  ],
  [
    'tab-panel',
    'pt-4 outline-none focus-visible:ring-2 focus-visible:ring-primary',
  ],

  // ==========================================
  // 4. Stepper
  // ==========================================
  ['stepper', 'flex items-center w-full font-sans'],
  ['step', 'flex-1 relative flex items-center gap-3 select-none'],
  [
    'step-indicator',
    'flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold border-2 border-default bg-surface text-muted transition-colors group-data-[state=active]:border-primary group-data-[state=active]:text-primary group-data-[state=completed]:border-primary group-data-[state=completed]:bg-primary group-data-[state=completed]:text-white shrink-0',
  ],
  ['step-content', 'flex flex-col min-w-0'],
  [
    'step-title',
    'text-xs font-semibold text-muted group-data-[state=active]:text-default group-data-[state=completed]:text-default',
  ],
  ['step-description', 'text-[10px] text-muted truncate'],
  [
    'step-connector',
    'flex-1 h-0.5 bg-subtle mx-3 transition-colors group-data-[state=completed]:bg-primary',
  ],

  // ==========================================
  // 5. Pagination
  // ==========================================
  ['pagination', 'flex items-center gap-1 font-sans select-none'],
  [
    'pagination-item',
    'inline-flex items-center justify-center min-w-[32px] h-8 px-2.5 text-xs font-medium rounded-md text-muted hover:text-default hover:bg-subtle transition-colors cursor-pointer border border-transparent data-[state=active]:border-default data-[state=active]:bg-surface data-[state=active]:text-default data-[state=active]:shadow-sm',
  ],
  [
    'pagination-prev',
    'inline-flex items-center justify-center h-8 px-2.5 text-xs font-medium rounded-md text-muted hover:text-default hover:bg-subtle transition-colors cursor-pointer border border-default bg-surface shadow-sm disabled:opacity-50 disabled:cursor-not-allowed',
  ],
  [
    'pagination-next',
    'inline-flex items-center justify-center h-8 px-2.5 text-xs font-medium rounded-md text-muted hover:text-default hover:bg-subtle transition-colors cursor-pointer border border-default bg-surface shadow-sm disabled:opacity-50 disabled:cursor-not-allowed',
  ],
  [
    'pagination-ellipsis',
    'inline-flex items-center justify-center w-8 h-8 text-xs text-muted pointer-events-none select-none',
  ],

  // ==========================================
  // 6. Table
  // ==========================================
  [
    'table-container',
    'w-full overflow-x-auto rounded-xl border border-default bg-surface shadow-sm',
  ],
  ['table', 'w-full text-left border-collapse text-sm font-sans'],
  ['table-head', 'border-b border-default bg-subtle/50'],
  ['table-header', 'border-b border-default bg-subtle/50'],
  [
    'table-th',
    'px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider select-none text-left align-middle',
  ],
  ['table-body', 'divide-y divide-default'],
  [
    'table-row',
    'border-b border-default last:border-0 hover:bg-subtle/40 transition-colors',
  ],
  ['table-cell', 'px-4 py-3 text-default align-middle'],
  [
    'table-sortable',
    'cursor-pointer select-none hover:text-default transition-colors',
  ],

  // ==========================================
  // 7. TreeView
  // ==========================================
  ['treeview', 'flex flex-col gap-0.5 font-sans select-none'],
  ['tree-item', 'flex flex-col'],
  [
    'tree-node',
    'flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-sm text-muted hover:text-default hover:bg-subtle cursor-pointer transition-colors data-[state=selected]:bg-subtle data-[state=selected]:text-default font-medium',
  ],
  [
    'tree-branch',
    'pl-4 flex flex-col gap-0.5 border-l border-default ml-3 hidden group-data-[state=open]:flex',
  ],
  [
    'tree-toggle',
    'w-4 h-4 flex items-center justify-center text-muted transition-transform group-data-[state=open]:rotate-90 shrink-0',
  ],

  // ==========================================
  // 8. TransferList
  // ==========================================
  ['transfer-list', 'flex items-center gap-4 font-sans'],
  [
    'transfer-list-panel',
    'flex flex-col w-64 h-80 rounded-xl border border-default bg-surface shadow-sm overflow-hidden',
  ],
  [
    'transfer-list-header',
    'px-3.5 py-2.5 border-b border-default bg-subtle/40 text-xs font-semibold text-default flex items-center justify-between select-none',
  ],
  ['transfer-list-body', 'flex-1 overflow-y-auto p-1.5 flex flex-col gap-0.5'],
  [
    'transfer-list-item',
    'flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-default hover:bg-subtle cursor-pointer transition-colors select-none data-[state=selected]:bg-primary/10 data-[state=selected]:text-primary',
  ],
  ['transfer-list-actions', 'flex flex-col gap-2'],

  // ==========================================
  // 9. FileUploader / Dropzone
  // ==========================================
  [
    'dropzone',
    'flex flex-col items-center justify-center p-6 border-2 border-dashed border-default hover:border-primary/50 rounded-2xl bg-surface hover:bg-subtle/30 transition-all cursor-pointer text-center font-sans',
  ],
  ['dropzone-input', 'hidden'],
  ['dropzone-icon', 'w-10 h-10 text-muted mb-2 shrink-0'],
  ['dropzone-title', 'text-sm font-semibold text-default mb-1'],
  ['dropzone-subtitle', 'text-xs text-muted'],
  ['file-list', 'flex flex-col gap-2 mt-3 w-full font-sans'],
  [
    'file-item',
    'flex items-center justify-between p-3 rounded-xl border border-default bg-surface shadow-sm text-xs text-default',
  ],
  ['dropzone-list', 'flex flex-col gap-2 mt-3 w-full font-sans'],
  [
    'dropzone-item',
    'flex items-center justify-between p-3 rounded-xl border border-default bg-surface shadow-sm text-xs text-default',
  ],

  // ==========================================
  // 10. Resizable / SplitPane
  // ==========================================
  [
    'resizable',
    'flex overflow-hidden relative font-sans select-none w-full h-full',
  ],
  ['resizable-horizontal', 'flex-row'],
  ['resizable-vertical', 'flex-col'],
  ['resizable-panel', 'overflow-auto min-w-[50px] min-h-[50px]'],
  [
    'resizable-handle',
    'relative flex items-center justify-center bg-subtle hover:bg-primary transition-colors cursor-col-resize w-1.5 z-10 select-none',
  ],
  ['resizable-handle-vertical', 'cursor-row-resize h-1.5 w-full'],

  // ==========================================
  // 11. ScrollArea
  // ==========================================
  ['scroll-area', 'relative overflow-hidden font-sans'],
  [
    'scroll-area-viewport',
    'w-full h-full overflow-auto [scrollbar-width:thin] [scrollbar-color:var(--border-default,#cbd5e1)_transparent]',
  ],

  // ==========================================
  // 12. ColorPicker
  // ==========================================
  ['color-picker', 'inline-flex items-center gap-2 font-sans relative'],
  [
    'color-picker-swatch',
    'w-8 h-8 rounded-lg border border-default shadow-sm cursor-pointer p-0 overflow-hidden relative shrink-0 flex items-center justify-center',
  ],
  ['color-picker-input', 'w-24 text-xs font-mono font-medium input input-sm'],
  [
    'color-picker-palette',
    'grid grid-cols-5 gap-1.5 p-2 bg-surface rounded-xl border border-default shadow-lg z-50',
  ],
  [
    'color-picker-item',
    'w-6 h-6 rounded-md border border-default/50 cursor-pointer transition-transform hover:scale-110',
  ],

  // ==========================================
  // 13. Chart & Sparklines
  // ==========================================
  ['chart-container', 'relative w-full overflow-hidden font-sans'],
  ['chart-grid', 'stroke-default opacity-50'],
  ['chart-axes', 'fill-muted text-xs select-none'],
  ['sparkline', 'inline-block align-middle overflow-visible'],

  // ==========================================
  // 14. DataGrid
  // ==========================================
  [
    'datagrid',
    'w-full rounded-xl border border-default bg-surface shadow-sm overflow-hidden font-sans',
  ],
  ['datagrid-row', 'transition-colors hover:bg-subtle/70'],
  [
    'datagrid-pagination',
    'flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-default bg-subtle/30 text-xs text-muted',
  ],

  // ==========================================
  // 15. Kanban Board
  // ==========================================
  [
    'kanban-board',
    'flex items-start gap-4 overflow-x-auto pb-4 pt-1 font-sans select-none',
  ],
  [
    'kanban-column',
    'flex flex-col shrink-0 w-72 rounded-2xl border border-default bg-subtle/40 font-sans p-3',
  ],
  [
    'kanban-card',
    'p-3 rounded-xl border border-default bg-surface text-default shadow-sm cursor-grab active:cursor-grabbing hover:border-primary/40 hover:shadow-md transition-all select-none',
  ],
];
