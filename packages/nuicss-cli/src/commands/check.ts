import fs from 'node:fs';
import path from 'node:path';
import { bold, cyan, green, red, yellow, dim } from 'colorette';

export interface DiagnosticIssue {
  filePath: string;
  line: number;
  rule: string;
  message: string;
  suggestion: string;
}

const HEX_COLOR_REGEX = /#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/;

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

export async function checkCommand(
  targetPath?: string,
  options: { cwd?: string } = {}
): Promise<void> {
  const cwd = path.resolve(options.cwd || process.cwd());

  console.log(
    `\n${bold(
      cyan('🔍 Checking codebase for NUICSS design system compliance...')
    )}\n`
  );

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
      walkDirectory(cwd, filesToScan);
    }
  } else {
    walkDirectory(cwd, filesToScan);
  }

  const issues: DiagnosticIssue[] = [];

  for (const filePath of filesToScan) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split(/\r?\n/);

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const lineNum = i + 1;

        // Skip comments
        const trimmed = line.trim();
        if (
          trimmed.startsWith('//') ||
          trimmed.startsWith('/*') ||
          trimmed.startsWith('*')
        ) {
          continue;
        }

        // 1. Check for hardcoded hex colors
        const hexMatch = line.match(HEX_COLOR_REGEX);
        if (hexMatch) {
          issues.push({
            filePath,
            line: lineNum,
            rule: 'no-hardcoded-hex',
            message: `Hardcoded hex color literal ${yellow(
              hexMatch[0]
            )} detected`,
            suggestion:
              'Use a semantic NUICSS token (e.g. var(--color-primary), var(--bg-surface))',
          });
        }

        // 2. Check for unmigrated legacy primary button utility clusters
        if (
          line.includes('bg-blue-600') &&
          line.includes('text-white') &&
          (line.includes('px-4') || line.includes('px-3'))
        ) {
          issues.push({
            filePath,
            line: lineNum,
            rule: 'prefer-nuicss-superclass',
            message: 'Legacy button utility cluster detected',
            suggestion: "Run 'nuicss migrate' to convert to 'btn btn-primary'",
          });
        }
      }
    } catch {
      // Skip unreadable files
    }
  }

  if (issues.length === 0) {
    console.log(
      `  ${green('✓')} All ${cyan(
        String(filesToScan.length)
      )} scanned files adhere to NUICSS design system tokens and superclasses.\n`
    );
    return;
  }

  console.log(
    `${red(
      bold(
        `Found ${issues.length} violation${
          issues.length > 1 ? 's' : ''
        } across ${filesToScan.length} scanned files:`
      )
    )}\n`
  );

  for (const issue of issues) {
    const rel = path.relative(cwd, issue.filePath);
    console.log(
      `  ${red('✖')} ${cyan(rel)}:${yellow(String(issue.line))} ${dim(
        `[${issue.rule}]`
      )}`
    );
    console.log(`    ${issue.message}`);
    console.log(`    ${dim('Suggestion:')} ${green(issue.suggestion)}\n`);
  }

  process.exitCode = 1;
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
