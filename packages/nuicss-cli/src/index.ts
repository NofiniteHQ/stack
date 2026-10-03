import { cac } from 'cac';
import { bold, cyan, green, dim, yellow } from 'colorette';
import { compileCommand } from './commands/compile.js';
import { initCommand } from './commands/init.js';
import { migrateCommand } from './commands/migrate.js';
import { checkCommand } from './commands/check.js';
import { tokensCommand } from './commands/tokens.js';
import { listCommand } from './commands/list.js';
import { installBrandShield } from './utils/shield.js';

export const VERSION = '0.2.0';

export async function runCli(argv = process.argv): Promise<void> {
  installBrandShield();

  const cli = cac('nuicss');

  // Default command: Compile
  cli
    .command('[...patterns]', 'Compile stylesheets into production-ready CSS')
    .option('-i, --input <file>', 'Input CSS file path (use - for stdin)', {
      default: 'input.css',
    })
    .option('-o, --output <file>', 'Output CSS file path (use - for stdout)', {
      default: 'dist/output.css',
    })
    .option('-w, --watch', 'Watch for file changes and recompile instantly')
    .option('-m, --minify', 'Minify output CSS adhering to specifications')
    .option('-c, --config <file>', 'Config file (default: nuicss.config.ts)')
    .action(async (patterns, flags) => {
      await compileCommand(patterns, flags);
    });

  // Explicit compile command
  cli
    .command(
      'compile [...patterns]',
      'Compile stylesheets into production-ready CSS'
    )
    .option('-i, --input <file>', 'Input CSS file path (use - for stdin)', {
      default: 'input.css',
    })
    .option('-o, --output <file>', 'Output CSS file path (use - for stdout)', {
      default: 'dist/output.css',
    })
    .option('-w, --watch', 'Watch for file changes and recompile instantly')
    .option('-m, --minify', 'Minify output CSS adhering to specifications')
    .option('-c, --config <file>', 'Config file (default: nuicss.config.ts)')
    .action(async (patterns, flags) => {
      await compileCommand(patterns, flags);
    });

  // Alias build command
  cli
    .command('build [...patterns]', 'Alias for compile')
    .option('-i, --input <file>', 'Input CSS file path (use - for stdin)', {
      default: 'input.css',
    })
    .option('-o, --output <file>', 'Output CSS file path (use - for stdout)', {
      default: 'dist/output.css',
    })
    .option('-w, --watch', 'Watch for file changes and recompile instantly')
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

// Auto-run if executed directly as entrypoint
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  runCli().catch((err) => {
    console.error(
      `\n${bold(cyan('[NUICSS]'))} ✖ Error: ${err?.message || err}\n`
    );
    process.exit(1);
  });
}
