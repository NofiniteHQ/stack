import fs from 'node:fs';
import path from 'node:path';
import { bold, cyan, green, yellow, dim } from 'colorette';
import { migrateMarkupToNuicss } from '@nofinite/nuicss/migrate';

export interface MigrateOptions {
  dryRun?: boolean;
  cwd?: string;
}

const DEFAULT_EXTENSIONS = new Set([
  '.html',
  '.htm',
  '.tsx',
  '.jsx',
  '.vue',
  '.svelte',
  '.astro',
  '.php',
  '.templ',
]);

const IGNORED_DIRS = new Set([
  'node_modules',
  '.git',
  '.next',
  'dist',
  'temp',
  '.turbo',
  'build',
  'out',
]);

export async function migrateCommand(
  targetPath?: string,
  options: MigrateOptions = {}
): Promise<void> {
  const cwd = path.resolve(options.cwd || process.cwd());
  const isDryRun = Boolean(options.dryRun);

  console.log(`\n${bold(cyan('🚀 Starting NUICSS Codemod Migration...'))}`);
  if (isDryRun) {
    console.log(
      `  ${yellow('ℹ Running in dry-run mode (no files will be written).')}\n`
    );
  } else {
    console.log();
  }

  const filesToScan: string[] = [];

  if (targetPath) {
    const resolvedTarget = path.resolve(cwd, targetPath);
    if (fs.existsSync(resolvedTarget)) {
      const stat = fs.statSync(resolvedTarget);
      if (stat.isFile()) {
        filesToScan.push(resolvedTarget);
      } else if (stat.isDirectory()) {
        walkDirectory(resolvedTarget, filesToScan);
      }
    } else {
      // Try scanning current directory with glob filtering
      walkDirectory(cwd, filesToScan);
    }
  } else {
    walkDirectory(cwd, filesToScan);
  }

  console.log(
    `Found ${cyan(String(filesToScan.length))} candidate files to scan.`
  );

  let totalFilesChanged = 0;
  let totalReplacements = 0;

  for (const filePath of filesToScan) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const { result, replacementsCount } = migrateMarkupToNuicss(content);

      if (replacementsCount > 0) {
        totalFilesChanged++;
        totalReplacements += replacementsCount;
        const relPath = path.relative(cwd, filePath);
        console.log(
          `  ${green('✓')} ${relPath} ${dim(
            `(${replacementsCount} superclasses applied)`
          )}`
        );

        if (!isDryRun) {
          fs.writeFileSync(filePath, result, 'utf8');
        }
      }
    } catch (err: any) {
      console.warn(
        `  ${yellow('⚠')} Skipped ${filePath}: ${err?.message || err}`
      );
    }
  }

  console.log(`\n${bold(green('🎉 Migration Complete!'))}`);
  console.log(`Total files modified: ${bold(cyan(String(totalFilesChanged)))}`);
  console.log(
    `Total superclasses applied: ${bold(cyan(String(totalReplacements)))}\n`
  );
}

function walkDirectory(dir: string, outFiles: string[]): void {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (!IGNORED_DIRS.has(entry.name)) {
        walkDirectory(path.join(dir, entry.name), outFiles);
      }
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (DEFAULT_EXTENSIONS.has(ext)) {
        outFiles.push(path.join(dir, entry.name));
      }
    }
  }
}
