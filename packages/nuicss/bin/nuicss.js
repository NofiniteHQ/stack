#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { globSync } = require('glob');

const args = process.argv.slice(2);
const command = args[0];

if (!command || command === '--help' || command === '-h') {
  console.log(`
NUICSS CLI Toolkit

Usage:
  npx @nofinite/nuicss <command> [options]

Commands:
  init              Initialize NUICSS configuration and VS Code / Cursor IntelliSense
  migrate [path]    Migrate legacy Tailwind/utility markup to NUICSS superclasses

Options:
  --dry-run         Preview changes without modifying files
  --help, -h        Show this help message
`);
  process.exit(0);
}

if (command === 'init') {
  console.log('\n🚀 Initializing NUICSS project...\n');
  const cwd = process.cwd();

  // 1. Check/create nuicss.config.ts
  const configTsPath = path.join(cwd, 'nuicss.config.ts');
  const configJsPath = path.join(cwd, 'nuicss.config.js');
  const configMjsPath = path.join(cwd, 'nuicss.config.mjs');

  if (
    !fs.existsSync(configTsPath) &&
    !fs.existsSync(configJsPath) &&
    !fs.existsSync(configMjsPath)
  ) {
    const defaultConfig = `import { defineConfig, nuicssPreset } from '@nofinite/nuicss';

export default defineConfig({
  presets: [
    nuicssPreset(),
  ],
});
`;
    fs.writeFileSync(configTsPath, defaultConfig, 'utf8');
    console.log('  ✓ Created nuicss.config.ts');
  } else {
    console.log('  ℹ Configuration file already exists.');
  }

  // 2. Configure .vscode/settings.json for native IntelliSense
  const vscodeDir = path.join(cwd, '.vscode');
  if (!fs.existsSync(vscodeDir)) {
    fs.mkdirSync(vscodeDir, { recursive: true });
  }

  const settingsPath = path.join(vscodeDir, 'settings.json');
  let settings = {};

  if (fs.existsSync(settingsPath)) {
    try {
      const raw = fs.readFileSync(settingsPath, 'utf8');
      settings = JSON.parse(raw);
    } catch {
      settings = {};
    }
  }

  const customDataEntry =
    './node_modules/@nofinite/nuicss/dist/nuicss.html-data.json';
  const cssCustomDataEntry =
    './node_modules/@nofinite/nuicss/dist/nuicss.css-data.json';

  if (!Array.isArray(settings['html.customData'])) {
    settings['html.customData'] = [];
  }
  if (!settings['html.customData'].includes(customDataEntry)) {
    settings['html.customData'].push(customDataEntry);
  }

  if (!Array.isArray(settings['css.customData'])) {
    settings['css.customData'] = [];
  }
  if (!settings['css.customData'].includes(cssCustomDataEntry)) {
    settings['css.customData'].push(cssCustomDataEntry);
  }

  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2), 'utf8');
  console.log(
    '  ✓ Configured .vscode/settings.json (Native VS Code & Cursor IntelliSense enabled)'
  );

  console.log(
    '\n🎉 NUICSS is ready! Enjoy instant autocomplete and hover previews for all 50+ superclasses.\n'
  );
  process.exit(0);
}

if (command === 'migrate') {
  const isDryRun = args.includes('--dry-run');
  const targetPattern =
    args[1] && !args[1].startsWith('--')
      ? args[1]
      : '**/*.{tsx,jsx,vue,svelte,astro,html,php}';

  console.log(`\n🚀 Starting NUICSS Codemod Migration...`);
  if (isDryRun) {
    console.log(`ℹ️  Running in dry-run mode (no files will be written).\n`);
  }

  // Load migration rules
  let migrateMarkupToNuicss;
  try {
    const migratePkg = require('../dist/migrate.js');
    migrateMarkupToNuicss = migratePkg.migrateMarkupToNuicss;
  } catch (_) {
    // Fallback if running directly from source
    const { DEFAULT_MIGRATION_RULES } = require('../src/migrate/index');
    migrateMarkupToNuicss = (content) => {
      let transformed = content;
      let count = 0;
      for (const rule of DEFAULT_MIGRATION_RULES) {
        const matches = transformed.match(rule.pattern);
        if (matches) {
          count += matches.length;
          transformed = transformed.replace(rule.pattern, rule.replacement);
        }
      }
      return { result: transformed, replacementsCount: count };
    };
  }

  const files = globSync(targetPattern, {
    ignore: ['**/node_modules/**', '**/dist/**', '**/.next/**', '**/.git/**'],
    nodir: true,
  });

  console.log(`Found ${files.length} candidate files to scan.`);

  let totalFilesChanged = 0;
  let totalReplacements = 0;

  for (const file of files) {
    const fullPath = path.resolve(process.cwd(), file);
    const content = fs.readFileSync(fullPath, 'utf8');
    const { result, replacementsCount } = migrateMarkupToNuicss(content);

    if (replacementsCount > 0) {
      totalFilesChanged++;
      totalReplacements += replacementsCount;
      console.log(`  ✓ ${file} (${replacementsCount} superclasses applied)`);

      if (!isDryRun) {
        fs.writeFileSync(fullPath, result, 'utf8');
      }
    }
  }

  console.log(`\n🎉 Migration Complete!`);
  console.log(`Total files modified: ${totalFilesChanged}`);
  console.log(`Total superclasses applied: ${totalReplacements}\n`);
  process.exit(0);
}

console.error(
  `Unknown command: ${command}. Run "npx @nofinite/nuicss --help" for available commands.`
);
process.exit(1);
