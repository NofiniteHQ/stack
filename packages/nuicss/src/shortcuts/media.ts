import type { StaticShortcut, DynamicShortcut } from 'unocss';

export const mediaShortcuts: (StaticShortcut | DynamicShortcut)[] = [
  // ==========================================
  // 1. Calendar
  // ==========================================
  [
    'calendar',
    'flex flex-col p-4 rounded-xl border border-default bg-surface shadow-sm font-sans w-[280px] select-none',
  ],
  ['calendar-header', 'flex items-center justify-between mb-3'],
  ['calendar-title', 'text-sm font-semibold text-default'],
  [
    'calendar-nav',
    'p-1 rounded-md text-muted hover:text-default hover:bg-subtle cursor-pointer border-none bg-transparent flex items-center justify-center transition-colors',
  ],
  [
    'calendar-nav-btn',
    'p-1 rounded-md text-muted hover:text-default hover:bg-subtle cursor-pointer border-none bg-transparent flex items-center justify-center transition-colors',
  ],
  [
    'calendar-weekdays',
    'grid grid-cols-7 text-center text-xs font-medium text-muted mb-1',
  ],
  ['calendar-grid', 'grid grid-cols-7 gap-1 text-center'],
  [
    'calendar-day',
    'w-8 h-8 border-none bg-transparent flex items-center justify-center text-xs rounded-lg cursor-pointer transition-colors text-default hover:bg-subtle select-none data-[state=selected]:bg-primary data-[state=selected]:text-white data-[state=in-range]:bg-primary/10 data-[state=in-range]:text-primary data-[today=true]:font-bold data-[disabled=true]:opacity-30 data-[disabled=true]:pointer-events-none',
  ],

  // ==========================================
  // 2. DatePicker & DateRangePicker
  // ==========================================
  ['date-picker', 'relative inline-flex flex-col font-sans w-full max-w-xs'],
  [
    'date-picker-trigger',
    'input cursor-pointer flex items-center justify-between',
  ],
  [
    'date-picker-popover',
    'absolute top-full left-0 mt-2 p-0 border border-default rounded-xl shadow-xl z-50 bg-surface hidden data-[state=open]:block',
  ],
  ['date-range-picker', 'relative inline-flex items-center gap-2 font-sans'],

  // ==========================================
  // 3. TimePicker & TimeRangePicker
  // ==========================================
  [
    'time-picker',
    'inline-flex items-center gap-1.5 p-1 rounded-lg border border-default bg-surface font-sans',
  ],
  [
    'time-picker-select',
    'bg-transparent text-xs font-medium text-default border-none outline-none cursor-pointer p-1',
  ],
  ['time-range-picker', 'inline-flex items-center gap-2 font-sans'],

  // ==========================================
  // 4. Combobox
  // ==========================================
  ['combobox', 'relative flex flex-col font-sans w-full'],
  ['combobox-input', 'input pr-8'],
  [
    'combobox-options',
    'absolute top-full left-0 right-0 mt-1 max-h-60 overflow-y-auto rounded-xl border border-default bg-surface shadow-xl z-50 p-1 flex flex-col gap-0.5',
  ],
  [
    'combobox-option',
    'px-3 py-2 text-xs font-medium rounded-lg text-default hover:bg-subtle cursor-pointer select-none transition-colors data-[state=selected]:bg-primary/10 data-[state=selected]:text-primary data-[state=active]:bg-subtle',
  ],

  // ==========================================
  // 5. MultiSelect
  // ==========================================
  [
    'multiselect',
    'relative flex flex-wrap items-center gap-1.5 min-h-[2.25rem] p-1.5 rounded-lg border border-default bg-surface font-sans cursor-text',
  ],
  ['multiselect-tags', 'flex flex-wrap items-center gap-1.5'],
  [
    'multiselect-tag',
    'inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-subtle text-default text-xs font-medium select-none',
  ],
  [
    'multiselect-tag-remove',
    'cursor-pointer text-muted hover:text-danger border-none bg-transparent p-0 leading-none text-sm',
  ],
  [
    'multiselect-input',
    'flex-1 min-w-[60px] bg-transparent border-none outline-none text-xs text-default placeholder:text-muted',
  ],

  // ==========================================
  // 6. VirtualList
  // ==========================================
  ['virtual-list', 'relative overflow-y-auto w-full font-sans'],
  ['virtual-list-container', 'relative w-full'],
  ['virtual-list-item', 'absolute top-0 left-0 right-0 w-full'],

  // ==========================================
  // 7. Carousel
  // ==========================================
  [
    'carousel',
    'relative overflow-hidden w-full font-sans select-none rounded-xl',
  ],
  [
    'carousel-viewport',
    'w-full overflow-x-auto snap-x snap-mandatory flex scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
  ],
  [
    'carousel-slide',
    'w-full shrink-0 snap-center relative flex items-center justify-center',
  ],
  [
    'carousel-nav',
    'absolute top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-surface/80 hover:bg-surface border border-default shadow-md cursor-pointer text-default transition-all z-10 border-none',
  ],
  ['carousel-prev', 'left-3'],
  ['carousel-next', 'right-3'],
  [
    'carousel-dots',
    'absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10',
  ],
  [
    'carousel-dot',
    'w-2 h-2 rounded-full bg-muted/40 transition-all cursor-pointer border-none p-0 data-[state=active]:w-6 data-[state=active]:bg-primary',
  ],

  // ==========================================
  // 8. CodeBlock
  // ==========================================
  [
    'code-block',
    'relative flex flex-col rounded-xl border border-default bg-subtle overflow-hidden font-mono text-xs shadow-sm',
  ],
  [
    'code-header',
    'flex items-center justify-between px-4 py-2 border-b border-default bg-surface/50 text-xs font-sans text-muted',
  ],
  ['code-lang', 'font-mono text-[10px] uppercase font-bold text-muted'],
  [
    'code-copy-btn',
    'px-2 py-1 text-xs rounded-md border border-default bg-surface hover:bg-subtle text-muted hover:text-default cursor-pointer font-sans transition-colors',
  ],
  [
    'code-pre',
    'p-4 overflow-x-auto text-default m-0 leading-relaxed font-mono',
  ],
  ['code-token-keyword', 'text-primary font-semibold'],
  ['code-token-string', 'text-success'],
  ['code-token-comment', 'text-muted italic'],
  ['code-token-number', 'text-warning'],
  ['code-token-function', 'text-info font-medium'],

  // ==========================================
  // 9. VideoPlayer
  // ==========================================
  [
    'video-player',
    'relative overflow-hidden rounded-2xl border border-default bg-black font-sans aspect-video flex items-center justify-center',
  ],
  [
    'video-controls',
    'absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent flex items-center gap-3 transition-opacity opacity-0 group-hover:opacity-100 z-10',
  ],
  [
    'video-play-btn',
    'text-white bg-transparent border-none cursor-pointer p-1 hover:text-primary transition-colors flex items-center justify-center',
  ],
  [
    'video-progress',
    'flex-1 h-1 bg-white/30 rounded-full cursor-pointer overflow-hidden relative',
  ],
  ['video-progress-bar', 'h-full bg-primary rounded-full transition-all'],

  // ==========================================
  // 10. MegaMenu
  // ==========================================
  ['mega-menu', 'relative inline-flex font-sans'],
  ['mega-menu-trigger', 'btn btn-ghost inline-flex items-center gap-1'],
  [
    'mega-menu-content',
    'absolute top-full left-0 mt-2 p-6 rounded-2xl border border-default bg-surface shadow-2xl z-50 grid grid-cols-3 gap-6 min-w-[540px] hidden group-data-[state=open]:grid',
  ],
  ['mega-menu-column', 'flex flex-col gap-2'],
  [
    'mega-menu-title',
    'text-xs font-bold uppercase tracking-wider text-muted mb-1',
  ],
  [
    'mega-menu-link',
    'text-sm font-medium text-default hover:text-primary transition-colors flex items-center gap-2 py-1 rounded-md px-2 hover:bg-subtle',
  ],

  // ==========================================
  // 11. Chip
  // ==========================================
  [
    'chip',
    'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-subtle text-default border border-default/50 shadow-sm',
  ],
  [
    'chip-remove',
    'cursor-pointer text-muted hover:text-danger ml-0.5 border-none bg-transparent p-0 leading-none text-sm',
  ],

  // ==========================================
  // 12. Image
  // ==========================================
  [
    'image-container',
    'relative overflow-hidden rounded-xl border border-default bg-subtle inline-flex items-center justify-center',
  ],
  ['image-blur', 'filter blur-sm scale-105 transition-all duration-300'],
  ['image-preview-modal', 'modal'],
];
