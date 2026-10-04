import { bold, cyan, green, yellow, dim } from 'colorette';
import { REGISTRY } from './list.js';

const TEMPLATES: Record<string, string> = {
  button: `<button class="btn btn-primary">\n  Click me\n</button>`,
  dialog: `<div class="modal-backdrop bg-overlay backdrop-blur-sm">\n  <div class="modal-dialog card">\n    <h2 class="card-title">Modal Title</h2>\n    <p class="card-description">Modal content goes here.</p>\n  </div>\n</div>`,
  card: `<div class="card">\n  <h3 class="card-title">Card Header</h3>\n  <p class="card-description">Card surface with standard NUICSS tokens.</p>\n</div>`,
  badge: `<span class="badge badge-primary">New</span>`,
  table: `<div class="table-container">\n  <table>\n    <thead>\n      <tr class="table-row"><th>Header</th></tr>\n    </thead>\n    <tbody>\n      <tr class="table-row"><td class="table-cell">Data</td></tr>\n    </tbody>\n  </table>\n</div>`,
  tabs: `<div class="tabs-list">\n  <button class="tabs-trigger active">Tab 1</button>\n  <button class="tabs-trigger">Tab 2</button>\n</div>`,
  dropdown: `<div class="menu-dropdown">\n  <button class="menu-item">Action 1</button>\n  <button class="menu-item">Action 2</button>\n</div>`,
  chart: `<div class="chart-container">\n  <!-- SVG chart with CSS superclasses -->\n</div>`,
  sparkline: `<svg class="sparkline-svg">\n  <!-- Sparkline trend path -->\n</svg>`,
  kanban: `<div class="kanban-board">\n  <div class="kanban-column">\n    <div class="kanban-card card">Task 1</div>\n  </div>\n</div>`,
  editor: `<div class="markon-editor">\n  <div class="markon-toolbar"></div>\n  <div class="editor-content"></div>\n</div>`,
};

export async function addCommand(componentName?: string): Promise<void> {
  if (!componentName) {
    console.log(
      `\n${bold(cyan('📦 NUICSS Add Component: Specify a component to add'))}\n`
    );
    console.log(`Available components:`);
    for (const key of Object.keys(REGISTRY)) {
      console.log(`  • ${cyan(key)}`);
    }
    console.log(`\nUsage: ${dim('nuicss add <component>')}\n`);
    return;
  }

  const normalized = componentName.toLowerCase().trim();
  const item = REGISTRY[normalized];

  if (!item) {
    console.error(
      `\n${yellow('⚠')} Component ${cyan(
        componentName
      )} is not in the registry.`
    );
    console.log('Available components:');
    for (const key of Object.keys(REGISTRY)) {
      console.log(`  • ${cyan(key)}`);
    }
    console.log();
    process.exitCode = 1;
    return;
  }

  console.log(`\n${bold(green('✓'))} Component: ${bold(cyan(item.name))}`);
  console.log(`  ${dim('Package:')}      ${item.pkg}`);
  console.log(`  ${dim('Description:')}  ${item.description}`);
  console.log(`  ${dim('Superclasses:')} ${cyan(item.superclass)}\n`);

  console.log(bold('Install dependency:'));
  console.log(`  ${dim('$')} pnpm add ${item.pkg}\n`);

  const template = TEMPLATES[normalized];
  if (template) {
    console.log(bold('Starter Markup:'));
    console.log(dim('---'));
    console.log(template);
    console.log(dim('---\n'));
  }
}
