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
  watchFiles?: string | string[];
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

export function globToRegExp(glob: string): RegExp {
  const normalized = glob.replace(/\\/g, '/');
  let re = '';
  let inGroup = false;
  for (let i = 0; i < normalized.length; i++) {
    const c = normalized[i];
    if (c === '*' && normalized[i + 1] === '*') {
      if (normalized[i + 2] === '/') {
        re += '(?:.*/)?';
        i += 2;
      } else {
        re += '.*';
        i++;
      }
    } else if (c === '*') {
      re += '[^/]*';
    } else if (c === '?') {
      re += '[^/]';
    } else if (c === '{') {
      re += '(';
      inGroup = true;
    } else if (c === '}' && inGroup) {
      re += ')';
      inGroup = false;
    } else if (c === ',' && inGroup) {
      re += '|';
    } else if (['.', '+', '^', '$', '(', ')', '[', ']', '|'].includes(c)) {
      re += '\\' + c;
    } else {
      re += c;
    }
  }
  return new RegExp(`^${re}$`, 'i');
}

export const DEFAULT_EXTENSIONS = new Set([
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
  '.jinja',
  '.jinja2',
  '.liquid',
  '.twig',
  '.ejs',
  '.erb',
  '.hbs',
  '.handlebars',
  '.mdx',
  '.md',
  '.markdown',
  '.pug',
  '.haml',
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
  let jitiLoader: { import: (id: string) => Promise<unknown> } | null = null;
  try {
    const { createJiti } = await import('jiti');
    jitiLoader = createJiti(import.meta.url) as unknown as {
      import: (id: string) => Promise<unknown>;
    };
  } catch {
    // Fallback to native dynamic import if jiti is unavailable
  }

  const tryLoad = async (filePath: string) => {
    if (jitiLoader) {
      try {
        const mod = (await jitiLoader.import(filePath)) as Record<
          string,
          unknown
        >;
        return mod.default || mod;
      } catch {
        // Fallback to native import
      }
    }
    const mod = await import(pathToFileURL(filePath).href);
    return mod.default || mod;
  };

  if (customConfigPath) {
    const absPath = path.resolve(cwd, customConfigPath);
    if (fs.existsSync(absPath)) {
      try {
        return await tryLoad(absPath);
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
    'nuicss.config.cjs',
  ];
  for (const name of candidateConfigs) {
    const full = path.join(cwd, name);
    if (fs.existsSync(full)) {
      try {
        return await tryLoad(full);
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

function collectTemplateFiles(
  dir: string,
  cwd: string,
  outFiles: Set<string>,
  userRegexes: RegExp[] = []
): void {
  let entries: fs.Dirent[] = [];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (!IGNORED_DIRS.has(entry.name)) {
        collectTemplateFiles(
          path.join(dir, entry.name),
          cwd,
          outFiles,
          userRegexes
        );
      }
    } else if (entry.isFile()) {
      const fullPath = path.join(dir, entry.name);
      const ext = path.extname(entry.name).toLowerCase();
      const normPath = fullPath.replace(/\\/g, '/');
      const relPath = path.relative(cwd, fullPath).replace(/\\/g, '/');

      if (
        DEFAULT_EXTENSIONS.has(ext) ||
        userRegexes.some(
          (re) => re.test(relPath) || re.test(normPath) || re.test(entry.name)
        )
      ) {
        outFiles.add(fullPath);
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

  // Aggregate user patterns from CLI args, --watch-files, and config
  const allUserPatterns: string[] = [...(patterns || [])];
  if (options.watchFiles) {
    const extra = Array.isArray(options.watchFiles)
      ? options.watchFiles
      : options.watchFiles
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
    allUserPatterns.push(...extra);
  }
  if (Array.isArray(config?.content)) {
    allUserPatterns.push(...config.content);
  }
  if (Array.isArray(config?.watchFiles)) {
    allUserPatterns.push(...config.watchFiles);
  }

  const userRegexes = allUserPatterns.map(globToRegExp);
  const fileCache = new Map<string, string>();
  const templateFiles = new Set<string>();

  function discoverFiles(): void {
    templateFiles.clear();
    if (allUserPatterns.length > 0) {
      for (const p of allUserPatterns) {
        const full = path.resolve(cwd, p);
        if (fs.existsSync(full)) {
          const stat = fs.statSync(full);
          if (stat.isFile()) {
            templateFiles.add(full);
          } else if (stat.isDirectory()) {
            collectTemplateFiles(full, cwd, templateFiles, userRegexes);
          }
        } else {
          // Glob pattern: extract root folder before first wildcard character
          const basePart = p.split(/[*?{[]/)[0] || '.';
          const resolvedBase = path.resolve(cwd, basePart);
          if (fs.existsSync(resolvedBase)) {
            const stat = fs.statSync(resolvedBase);
            if (stat.isDirectory()) {
              collectTemplateFiles(
                resolvedBase,
                cwd,
                templateFiles,
                userRegexes
              );
            }
          }
        }
      }
    } else {
      collectTemplateFiles(cwd, cwd, templateFiles, userRegexes);
    }
  }

  // Initial file discovery
  discoverFiles();

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

    // 2. Extract tokens from discovered templates using in-memory fileCache and applyExtractors
    const tokens = new Set<string>();
    for (const file of templateFiles) {
      try {
        let content = fileCache.get(file);
        if (content === undefined) {
          content = fs.readFileSync(file, 'utf8');
          fileCache.set(file, content);
        }
        await uno.applyExtractors(content, file, tokens);
      } catch {
        // Skip unreadable files
      }
    }

    // 3. Generate utilities
    const genResult = await uno.generate(tokens, {
      preflights: false,
      minify: isMinify,
    });

    const generatedUtilities = genResult.css;

    // 4. Expand directives into final CSS
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

    // 5. Write output
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
    if (allUserPatterns.length > 0) {
      for (const p of allUserPatterns) {
        const full = path.resolve(cwd, p);
        if (fs.existsSync(full)) {
          watchPaths.push(full);
        } else {
          const basePart = p.split(/[*?{[]/)[0] || '.';
          const resolvedBase = path.resolve(cwd, basePart);
          if (fs.existsSync(resolvedBase)) {
            watchPaths.push(resolvedBase);
          }
        }
      }
    }
    if (
      watchPaths.length === 0 ||
      !watchPaths.some((p) => p === cwd || cwd.startsWith(p))
    ) {
      watchPaths.push(cwd);
    }

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
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;
    const pendingChanges = new Set<string>();

    const triggerRebuild = async () => {
      if (isRebuilding) {
        if (!debounceTimer) {
          debounceTimer = setTimeout(triggerRebuild, 50);
        }
        return;
      }
      isRebuilding = true;
      try {
        const changedFiles = Array.from(pendingChanges);
        pendingChanges.clear();
        const res = await performBuild();
        const outRel = outputPath ? path.relative(cwd, outputPath) : 'stdout';
        const changedRel = changedFiles
          .map((f) => path.relative(cwd, f))
          .filter(Boolean)
          .join(', ');
        logger.log(
          `⚡ Rebuilt ${cyan(outRel)} on ${dim(
            changedRel || 'file changes'
          )} (${green(res.durationMs.toFixed(2))}ms)`
        );
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        logger.error(`Rebuild failed: ${message}`);
      } finally {
        isRebuilding = false;
        if (pendingChanges.size > 0) {
          debounceTimer = setTimeout(triggerRebuild, 50);
        }
      }
    };

    watcher.on('all', async (event, filePath) => {
      const absPath = path.resolve(filePath);
      if (outputPath && absPath === outputPath) return;

      const normPath = absPath.replace(/\\/g, '/');
      const relPath = path.relative(cwd, absPath).replace(/\\/g, '/');
      const ext = path.extname(absPath).toLowerCase();

      const isMatch =
        absPath === inputPath ||
        DEFAULT_EXTENSIONS.has(ext) ||
        userRegexes.some((re) => re.test(relPath) || re.test(normPath));

      if (!isMatch) return;

      if (event === 'unlink') {
        fileCache.delete(absPath);
        templateFiles.delete(absPath);
      } else if (event === 'add' || event === 'change') {
        try {
          if (absPath !== inputPath) {
            fileCache.set(absPath, fs.readFileSync(absPath, 'utf8'));
            templateFiles.add(absPath);
          }
        } catch {
          // Skip unreadable files
        }
      }

      pendingChanges.add(absPath);
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      debounceTimer = setTimeout(triggerRebuild, 50);
    });

    process.on('SIGINT', () => {
      watcher.close();
      process.exit(0);
    });
  }
}
