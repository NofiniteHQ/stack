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
  migrate [path]    Migrate legacy Tailwind/utility markup to NUICSS superclasses

Options:
  --dry-run         Preview changes without modifying files
  --help, -h        Show this help message
`);
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
