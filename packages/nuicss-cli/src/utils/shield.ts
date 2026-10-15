import { cyan, green, yellow, red, bold } from 'colorette';

let isShieldInstalled = false;

/**
 * Filter text to eliminate any UnoCSS brand leakage.
 */
export function filterBrandLeakage(text: string): string {
  let str = text;

  // Silence internal @unocss/config missing file warnings when using default presets
  if (str.includes('@unocss/config') && str.includes('Config file not found')) {
    return '';
  }

  // Shield brand names
  str = str.replace(/UnoCSS\s+v[0-9.]+/gi, 'NUICSS CLI v0.1.0');
  str = str.replace(
    /UnoCSS\s+in\s+watch\s+mode/gi,
    'NUICSS watching for changes'
  );
  str = str.replace(
    /UnoCSS\s+for\s+production/gi,
    'NUICSS compiling for production'
  );
  str = str.replace(/uno\.config/gi, 'nuicss.config');
  str = str.replace(/uno\.css/gi, 'dist/output.css');
  str = str.replace(
    /https:\/\/unocss\.dev[^\s]*/gi,
    'https://opensource.nofinite.com/nuicss'
  );
  str = str.replace(/@unocss\/cli/gi, 'nuicss');
  str = str.replace(/@unocss\/core/gi, 'nuicss');
  str = str.replace(/@unocss\/config/gi, 'nuicss');
  str = str.replace(/\bunocss\b/gi, 'nuicss');
  str = str.replace(/\bUnoCSS\b/g, 'NUICSS');

  return str;
}

/**
 * Installs stream interception on process.stdout and process.stderr.
 */
export function installBrandShield(): void {
  if (isShieldInstalled) return;
  isShieldInstalled = true;

  const originalStdoutWrite = process.stdout.write.bind(process.stdout);
  const originalStderrWrite = process.stderr.write.bind(process.stderr);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (process.stdout as any).write = (
    chunk: string | Uint8Array,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...args: any[]
  ) => {
    const text =
      typeof chunk === 'string' ? chunk : Buffer.from(chunk).toString('utf8');
    const filtered = filterBrandLeakage(text);
    if (!filtered) return true;
    return originalStdoutWrite(filtered, ...args);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (process.stderr as any).write = (
    chunk: string | Uint8Array,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...args: any[]
  ) => {
    const text =
      typeof chunk === 'string' ? chunk : Buffer.from(chunk).toString('utf8');
    const filtered = filterBrandLeakage(text);
    if (!filtered) return true;
    return originalStderrWrite(filtered, ...args);
  };
}

export const logger = {
  prefix: bold(cyan('[NUICSS]')),
  log(msg: string) {
    console.log(`${this.prefix} ${msg}`);
  },
  info(msg: string) {
    console.log(`${this.prefix} ${cyan(msg)}`);
  },
  success(msg: string) {
    console.log(`${this.prefix} ${green('✓')} ${msg}`);
  },
  warn(msg: string) {
    console.warn(`${this.prefix} ${yellow('⚠')} ${msg}`);
  },
  error(msg: string) {
    console.error(`${this.prefix} ${red('✖')} ${msg}`);
  },
};
