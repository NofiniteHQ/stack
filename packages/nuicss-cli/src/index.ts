import { existsSync } from 'node:fs';
import { cac } from 'cac';
import { bold, cyan } from 'colorette';
import { compileCommand } from './commands/compile.js';
import { initCommand } from './commands/init.js';
import { migrateCommand } from './commands/migrate.js';
import { checkCommand } from './commands/check.js';
import { tokensCommand } from './commands/tokens.js';
import { listCommand } from './commands/list.js';
import { addCommand } from './commands/add.js';
import { upgradeCommand } from './commands/upgrade.js';
import { installBrandShield } from './utils/shield.js';

export const VERSION = '0.1.0';

const KNOWN_COMMANDS = [
  'compile',
  'build',
  'init',
  'migrate',
  'check',
  'tokens',
  'list',
  'add',
  'upgrade',
  'update',
  'version',
];

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    Array(n + 1).fill(0)
  );
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[m][n];
}

function findSimilarCommand(
  cmd: string,
  candidates: string[]
): string | undefined {
  for (const c of candidates) {
    if (c.startsWith(cmd) || cmd.startsWith(c)) return c;
  }
  let bestMatch: string | undefined;
  let minDistance = 3;
  for (const c of candidates) {
    const d = levenshtein(cmd, c);
    if (d < minDistance) {
      minDistance = d;
      bestMatch = c;
    }
  }
  return bestMatch;
}

export async function runCli(argv = process.argv): Promise<void> {
  installBrandShield();

  const cli = cac('nuicss');

  // Default command: Compile
  cli
    .command('[...patterns]', 'Compile stylesheets into production-ready CSS')
    .option('-i, --input <file>', 'Input CSS file path (use - for stdin)')
    .option('-o, --output <file>', 'Output CSS file path (use - for stdout)', {
      default: 'dist/output.css',
    })
    .option('-w, --watch', 'Watch for file changes and recompile instantly')
    .option(
      '--watch-files <files>',
      'Additional files or glob patterns to watch (comma-separated)'
    )
    .option('-m, --minify', 'Minify output CSS adhering to specifications')
    .option('-c, --config <file>', 'Config file (default: nuicss.config.ts)')
    .action(async (patterns: string[], flags) => {
      if (
        patterns &&
        patterns.length === 1 &&
        !flags.input &&
        !flags.i &&
        !existsSync(patterns[0]) &&
        !/[*?{}.\\/]/.test(patterns[0])
      ) {
        const candidate = patterns[0].toLowerCase();
        const suggestion = findSimilarCommand(candidate, KNOWN_COMMANDS);
        console.error(
          `\n${bold(cyan('[NUICSS]'))} ✖ Unknown command: ${bold(patterns[0])}`
        );
        if (suggestion) {
          console.error(`\n  Did you mean: ${cyan(`nuicss ${suggestion}`)}?\n`);
        } else {
          console.error(
            `\n  Run ${cyan(
              'nuicss --help'
            )} for a list of available commands.\n`
          );
        }
        process.exitCode = 1;
        return;
      }
      await compileCommand(patterns, flags);
    });

  // Explicit compile command
  cli
    .command(
      'compile [...patterns]',
      'Compile stylesheets into production-ready CSS'
    )
    .option('-i, --input <file>', 'Input CSS file path (use - for stdin)')
    .option('-o, --output <file>', 'Output CSS file path (use - for stdout)', {
      default: 'dist/output.css',
    })
    .option('-w, --watch', 'Watch for file changes and recompile instantly')
    .option(
      '--watch-files <files>',
      'Additional files or glob patterns to watch (comma-separated)'
    )
    .option('-m, --minify', 'Minify output CSS adhering to specifications')
    .option('-c, --config <file>', 'Config file (default: nuicss.config.ts)')
    .action(async (patterns, flags) => {
      await compileCommand(patterns, flags);
    });

  // Alias build command
  cli
    .command('build [...patterns]', 'Alias for compile')
    .option('-i, --input <file>', 'Input CSS file path (use - for stdin)')
    .option('-o, --output <file>', 'Output CSS file path (use - for stdout)', {
      default: 'dist/output.css',
    })
    .option('-w, --watch', 'Watch for file changes and recompile instantly')
    .option(
      '--watch-files <files>',
      'Additional files or glob patterns to watch (comma-separated)'
    )
    .option('-m, --minify', 'Minify output CSS adhering to specifications')
    .option('-c, --config <file>', 'Config file (default: nuicss.config.ts)')
    .action(async (patterns, flags) => {
      await compileCommand(patterns, flags);
    });

  // Init command
  cli
    .command(
      'init',
      'Initialize project configuration and IDE custom data non-destructively'
    )
    .action(async () => {
      await initCommand();
    });

  // Migrate command
  cli
    .command(
      'migrate [path]',
      'Migrate legacy utility markup to clean NUICSS superclasses'
    )
    .option('--dry-run', 'Preview changes without modifying files')
    .action(async (targetPath, flags) => {
      await migrateCommand(targetPath, flags);
    });

  // Check command
  cli
    .command(
      'check [path]',
      'Lint codebase for hardcoded hex colors and legacy utility soup'
    )
    .action(async (targetPath) => {
      await checkCommand(targetPath);
    });

  // Tokens command
  cli
    .command('tokens', 'Inspect OKLCH color palettes and semantic tokens')
    .action(async () => {
      await tokensCommand();
    });

  // List command
  cli
    .command('list', 'List available components across Nofinite ecosystem')
    .action(async () => {
      await listCommand();
    });

  // Add command
  cli
    .command(
      'add [component]',
      'Scaffold ecosystem UI component and view starter markup'
    )
    .action(async (component) => {
      await addCommand(component);
    });

  // Upgrade command
  cli
    .command('upgrade', 'Check and self-update nuicss to the latest release')
    .alias('update')
    .option('--check', 'Only check for updates without installing')
    .action(async (flags) => {
      await upgradeCommand(flags);
    });

  // Version command
  cli.command('version', 'Print NUICSS CLI version').action(() => {
    console.log(`NUICSS CLI v${VERSION}`);
  });

  cli.usage('<command> [options]');
  cli.help();

  cli.version(VERSION);

  // If no args provided, print help
  if (argv.length <= 2) {
    cli.outputHelp();
    return;
  }

  cli.parse(argv, { run: false });
  await cli.runMatchedCommand();
}

const isMain =
  (typeof import.meta !== 'undefined' &&
    Boolean((import.meta as unknown as Record<string, unknown>).main)) ||
  Boolean(
    process.argv[1] &&
      (process.argv[1].endsWith('dist/index.js') ||
        process.argv[1].endsWith('dist\\index.js') ||
        process.argv[1].endsWith('src/index.ts') ||
        process.argv[1].endsWith('src\\index.ts'))
  );

if (isMain) {
  runCli().catch((err) => {
    console.error(
      `\n${bold(cyan('[NUICSS]'))} ✖ Error: ${err?.message || err}\n`
    );
    process.exit(1);
  });
}
