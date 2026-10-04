import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createGenerator } from '@unocss/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { nuicssPreset } from '@nofinite/nuicss';
import { watch } from 'chokidar';
import { cyan, green, dim } from 'colorette';
import { getBaseStyles } from '../embedded/index.js';
import { installBrandShield, logger } from '../utils/shield.js';
import { minifyCss } from '../utils/minifier.js';

export interface CompileOptions {
  input?: string;
  output?: string;
  watch?: boolean;
  minify?: boolean;
  config?: string;
  patterns?: string[];
  cwd?: string;
}

function getDirectiveRegex(): RegExp {
  return /@(?:nuicss(?:\s+([a-zA-Z0-9_-]+))?|import\s+["'](?:@nofinite\/)?nuicss(?:\/([a-zA-Z0-9_-]+))?["'])\s*;?/g;
}

function extractCssLayers(fullBaseCss: string): {
  tokens: string;
  components: string;
} {
  const layerDecl = '@layer base, components, utilities;\n\n';
  const compMarker = '@layer components';
  const compIndex = fullBaseCss.indexOf(compMarker);
  if (compIndex === -1) {
    return { tokens: fullBaseCss, components: '' };
  }
  const tokensPart = fullBaseCss.slice(0, compIndex).trim();
  const compPart = fullBaseCss.slice(compIndex).trim();
  return {
    tokens: tokensPart.startsWith('@layer')
      ? tokensPart
      : layerDecl + tokensPart,
    components: compPart.startsWith('@layer base')
      ? compPart
      : layerDecl + compPart,
  };
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
  '.blade.php',
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

async function loadConfig(cwd: string, customConfigPath?: string) {
  if (customConfigPath) {
    const absPath = path.resolve(cwd, customConfigPath);
    if (fs.existsSync(absPath)) {
      try {
        const mod = await import(pathToFileURL(absPath).href);
        return mod.default || mod;
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        logger.warn(
          `Could not load custom config ${customConfigPath}: ${message}`
        );
      }
    }
  }

  // Look for standard nuicss configs
  const candidateConfigs = [
    'nuicss.config.ts',
    'nuicss.config.js',
    'nuicss.config.mjs',
  ];
  for (const name of candidateConfigs) {
    const full = path.join(cwd, name);
    if (fs.existsSync(full)) {
      try {
        const mod = await import(pathToFileURL(full).href);
        return mod.default || mod;
      } catch {
        // Fallback to default preset
      }
    }
  }

  // Fallback to default preset
  return {
    presets: [nuicssPreset()],
  };
}

function collectTemplateFiles(dir: string, outFiles: string[]): void {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (!IGNORED_DIRS.has(entry.name)) {
        collectTemplateFiles(path.join(dir, entry.name), outFiles);
      }
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (DEFAULT_EXTENSIONS.has(ext)) {
        outFiles.push(path.join(dir, entry.name));
      }
    }
  }
}

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks).toString('utf8');
}

export async function compileCommand(
  patterns: string[] = [],
  options: CompileOptions = {}
): Promise<void> {
  installBrandShield();

  const cwd = path.resolve(options.cwd || process.cwd());
  const isStdout = options.output === '-';
  const isStdin = options.input === '-';
  const isWatch = Boolean(options.watch);
  const isMinify = Boolean(options.minify);

  let inputPath: string | null = null;
  if (options.input && !isStdin) {
    inputPath = path.resolve(cwd, options.input);
    if (!fs.existsSync(inputPath)) {
      logger.error(`Input file not found: ${cyan(options.input)}`);
      process.exitCode = 1;
      return;
    }
  } else if (!isStdin) {
    const defaultInput = path.resolve(cwd, 'input.css');
    if (fs.existsSync(defaultInput)) {
      inputPath = defaultInput;
    }
  }

  const outputPath =
    options.output && !isStdout
      ? path.resolve(cwd, options.output || 'dist/output.css')
      : null;

  // Load configuration
  const config = await loadConfig(cwd, options.config);
  const uno = await createGenerator(config);

  const baseCss = getBaseStyles();

  async function performBuild(): Promise<{
    durationMs: number;
    matchedCount: number;
    outputSize: number;
  }> {
    const start = performance.now();

    // 1. Read input CSS
    let inputCss = '@nuicss;\n';
    if (isStdin) {
      inputCss = await readStdin();
    } else if (inputPath && fs.existsSync(inputPath)) {
      inputCss = fs.readFileSync(inputPath, 'utf8');
    }

    // 2. Discover and scan template files
    const templateFiles: string[] = [];
    if (patterns && patterns.length > 0) {
      for (const p of patterns) {
        const full = path.resolve(cwd, p);
        if (fs.existsSync(full)) {
          const stat = fs.statSync(full);
          if (stat.isFile()) templateFiles.push(full);
          else if (stat.isDirectory())
            collectTemplateFiles(full, templateFiles);
        }
      }
    } else {
      collectTemplateFiles(cwd, templateFiles);
    }

    // 3. Extract tokens from templates
    const tokens = new Set<string>();
    for (const file of templateFiles) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        const res = await uno.generate(content, { preflights: false });
        res.matched.forEach((t) => tokens.add(t));
      } catch {
        // Skip unreadable files
      }
    }

    // 4. Generate utilities
    const genResult = await uno.generate(tokens, {
      preflights: false,
      minify: isMinify,
    });

    const generatedUtilities = genResult.css;

    // 5. Expand directives into final CSS
    let finalCss = '';
    const hasDirective = getDirectiveRegex().test(inputCss);
    if (hasDirective) {
      const layers = extractCssLayers(baseCss);

      finalCss = inputCss.replace(
        getDirectiveRegex(),
        (_match, group1, group2) => {
          const directive = group1 || group2 || '';
          if (directive === 'utilities') {
            return generatedUtilities;
          } else if (directive === 'tokens') {
            return layers.tokens;
          } else if (directive === 'components') {
            return layers.components;
          }
          return baseCss + '\n\n' + generatedUtilities;
        }
      );
    } else if (inputCss.trim() === '') {
      finalCss = baseCss + '\n\n' + generatedUtilities;
    } else {
      finalCss = baseCss + '\n\n' + inputCss + '\n\n' + generatedUtilities;
    }

    // Apply full CSS minification when requested
    if (isMinify) {
      finalCss = minifyCss(finalCss);
    }

    // 6. Write output
    if (isStdout) {
      process.stdout.write(finalCss);
    } else if (outputPath) {
      const outDir = path.dirname(outputPath);
      if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
      }
      fs.writeFileSync(outputPath, finalCss, 'utf8');
    }

    const durationMs = performance.now() - start;
    return {
      durationMs,
      matchedCount: tokens.size,
      outputSize: Buffer.byteLength(finalCss, 'utf8'),
    };
  }

  // Initial build
  try {
    const res = await performBuild();

    if (!isStdout) {
      const outRel = outputPath ? path.relative(cwd, outputPath) : 'stdout';
      logger.success(
        `${res.matchedCount} utilities generated to ${cyan(outRel)} in ${green(
          res.durationMs.toFixed(2)
        )}ms`
      );
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    logger.error(`Build failed: ${message}`);
    if (!isWatch) {
      process.exitCode = 1;
      return;
    }
  }

  // Watch mode
  if (isWatch && !isStdout && !isStdin) {
    const watchPaths: string[] = [];
    if (inputPath && fs.existsSync(inputPath)) {
      watchPaths.push(inputPath);
    }
    // Watch template directory
    watchPaths.push(cwd);

    logger.info(
      `Watching for changes in ${cyan(
        path.relative(process.cwd(), cwd) || '.'
      )}`
    );

    const watcher = watch(watchPaths, {
      ignored: Array.from(IGNORED_DIRS).map((d) => `**/${d}/**`),
      ignoreInitial: true,
      persistent: true,
    });

    let isRebuilding = false;

    watcher.on('all', async (event, filePath) => {
      if (outputPath && path.resolve(filePath) === outputPath) return;
      if (isRebuilding) return;

      const ext = path.extname(filePath).toLowerCase();
      if (!DEFAULT_EXTENSIONS.has(ext) && filePath !== inputPath) {
        return;
      }

      isRebuilding = true;
      try {
        const res = await performBuild();
        const outRel = outputPath ? path.relative(cwd, outputPath) : 'stdout';
        const fileRel = path.relative(cwd, filePath);
        logger.log(
          `⚡ Rebuilt ${cyan(outRel)} on ${dim(fileRel)} (${green(
            res.durationMs.toFixed(2)
          )}ms)`
        );
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        logger.error(`Rebuild failed: ${message}`);
      } finally {
        isRebuilding = false;
      }
    });

    process.on('SIGINT', () => {
      watcher.close();
      process.exit(0);
    });
  }
}
