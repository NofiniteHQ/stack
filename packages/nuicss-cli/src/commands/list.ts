import { bold, cyan, dim } from 'colorette';

export interface ComponentInfo {
  name: string;
  pkg: string;
  description: string;
  superclass: string;
}

export const REGISTRY: Record<string, ComponentInfo> = {
  button: {
    name: 'Button',
    pkg: '@nofinite/nui',
    description:
      'Accessible polymorphic button with press-scale and loading states',
    superclass: 'btn, btn-primary, btn-secondary, btn-ghost, btn-outline',
  },
  dialog: {
    name: 'Dialog / Modal',
    pkg: '@nofinite/nui',
    description:
      'Accessible modal dialog with glassmorphic backdrop-blur-sm and focus lock',
    superclass: 'modal-dialog, modal-backdrop, bg-overlay',
  },
  card: {
    name: 'Card',
    pkg: '@nofinite/nuicss',
    description: 'Semantic surface container with border-default and shadow-sm',
    superclass: 'card, card-responsive, metric-card',
  },
  badge: {
    name: 'Badge',
    pkg: '@nofinite/nuicss',
    description:
      'Status and indicator badge with primary, success, danger variants',
    superclass: 'badge, badge-primary, badge-success, badge-danger',
  },
  table: {
    name: 'Table',
    pkg: '@nofinite/nui',
    description: 'Responsive data table with sticky headers and zebra striping',
    superclass: 'table-container, table-row, table-cell',
  },
  tabs: {
    name: 'Tabs',
    pkg: '@nofinite/nui',
    description:
      'Keyboard-navigable accessible tabs with animated active indicators',
    superclass: 'tabs-list, tabs-trigger, tabs-content',
  },
  dropdown: {
    name: 'DropdownMenu',
    pkg: '@nofinite/nui',
    description:
      'Accessible popup menu with keyboard roving-tabindex and submenu support',
    superclass: 'menu-dropdown, menu-item',
  },
  chart: {
    name: 'Chart',
    pkg: '@nofinite/charts',
    description: 'Zero-JS / low-overhead SVG & CSS performance charts',
    superclass: 'chart-container, chart-bar, chart-line',
  },
  sparkline: {
    name: 'Sparkline',
    pkg: '@nofinite/charts',
    description: 'Micro inline trend indicator for KPI cards and tables',
    superclass: 'sparkline-svg, sparkline-path',
  },
  kanban: {
    name: 'Kanban',
    pkg: '@nofinite/kanban',
    description: 'Fluid drag-and-drop task workflow board',
    superclass: 'kanban-board, kanban-column, kanban-card',
  },
  editor: {
    name: 'Markon Editor',
    pkg: '@nofinite/markon',
    description: 'Modern Markdown WYSIWYG editor engine',
    superclass: 'markon-editor, markon-toolbar, markon-preview',
  },
};

export async function listCommand(): Promise<void> {
  console.log(
    `\n${bold(
      cyan('📦 Available Components & Modules in Nofinite Ecosystem:')
    )}`
  );
  console.log('==========================================================');

  for (const [key, item] of Object.entries(REGISTRY)) {
    const keyStr = `• ${key}`.padEnd(14);
    console.log(`  ${bold(keyStr)} ${dim(`[${item.pkg}]`)}`);
    console.log(`    ${item.description}`);
    console.log(`    ${dim('Classes:')} ${cyan(item.superclass)}\n`);
  }

  console.log(`${dim('Usage:')} nuicss add <component-name>\n`);
}
