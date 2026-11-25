import { bold, cyan, green, yellow, dim } from 'colorette';
import { REGISTRY } from './list.js';

const TEMPLATES: Record<string, string> = {
  button: `<button class="btn btn-primary">\n  Click me\n</button>`,
  dialog: `<div class="modal fixed inset-0 z-50 bg-overlay backdrop-blur-sm">\n  <div class="modal-box">\n    <div class="modal-header">\n      <h2 class="modal-title">Modal Title</h2>\n      <p class="modal-description">Modal content goes here.</p>\n    </div>\n    <div class="modal-body">\n      <p>Modal body content.</p>\n    </div>\n    <div class="modal-footer">\n      <button class="btn btn-outline">Cancel</button>\n      <button class="btn btn-primary">Confirm</button>\n    </div>\n  </div>\n</div>`,
  card: `<div class="card">\n  <h3 class="card-title">Card Header</h3>\n  <p class="card-description">Card surface with standard NUICSS tokens.</p>\n</div>`,
  badge: `<span class="badge badge-primary">New</span>`,
  table: `<div class="table-container">\n  <table class="table">\n    <thead class="table-head">\n      <tr class="table-row"><th class="table-th">Header</th></tr>\n    </thead>\n    <tbody class="table-body">\n      <tr class="table-row"><td class="table-cell">Data</td></tr>\n    </tbody>\n  </table>\n</div>`,
  tabs: `<div class="tabs">\n  <div class="tab-list" role="tablist">\n    <button class="tab" role="tab" aria-selected="true">Tab 1</button>\n    <button class="tab" role="tab" aria-selected="false">Tab 2</button>\n  </div>\n  <div class="tab-panel" role="tabpanel">Tab 1 content</div>\n</div>`,
  dropdown: `<div class="dropdown">\n  <div class="dropdown-menu">\n    <button class="dropdown-item">Action 1</button>\n    <button class="dropdown-item">Action 2</button>\n    <div class="dropdown-divider"></div>\n    <button class="dropdown-item dropdown-item-danger">Delete</button>\n  </div>\n</div>`,
  chart: `<div class="chart-container">\n  <!-- SVG chart with CSS superclasses -->\n</div>`,
  sparkline: `<svg class="sparkline-svg">\n  <!-- Sparkline trend path -->\n</svg>`,
  kanban: `<div class="kanban-board">\n  <div class="kanban-column">\n    <div class="kanban-card card">Task 1</div>\n  </div>\n</div>`,
  editor: `<div class="markon-editor">\n  <div class="markon-toolbar"></div>\n  <div class="editor-content"></div>\n</div>`,
  media: `<div class="nui-media-container">\n  <media-player class="nui-vidstack-player" src="https://media-files.vidstack.io/720p.mp4">\n    <media-provider></media-provider>\n  </media-player>\n</div>`,
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
