import type { NuicssConfig } from './config';
import * as presetWind4Module from '@unocss/preset-wind4';
import { componentShortcuts } from '../shortcuts';
import resetCssRaw from '../styles/reset.css?raw';
import themeCssRaw from '../styles/theme.css?raw';
import markonCssRaw from '../styles/components/markon.css?raw';
import chartsCssRaw from '../styles/components/charts.css?raw';
import kanbanCssRaw from '../styles/components/kanban.css?raw';
import mediaBridgeCssRaw from '../styles/components/media-bridge.css?raw';
import tableCssRaw from '../styles/components/table.css?raw';
import flagsCssRaw from '../styles/components/flags.css?raw';
import fs from 'node:fs';
import path from 'node:path';
let processorLightningCSSRaw: any = null;
try {
  const req = typeof require !== 'undefined' ? require : null;
  if (req) {
    processorLightningCSSRaw = req('@unocss/processor-lightningcss');
  }
} catch {
  // Gracefully fallback when running in standalone binary or browser
}

let resetCss =
  typeof resetCssRaw === 'string' && resetCssRaw.length > 0 ? resetCssRaw : '';
let themeCss =
  typeof themeCssRaw === 'string' && themeCssRaw.length > 0 ? themeCssRaw : '';
let markonCss =
  typeof markonCssRaw === 'string' && markonCssRaw.length > 0
    ? markonCssRaw
    : '';
let chartsCss =
  typeof chartsCssRaw === 'string' && chartsCssRaw.length > 0
    ? chartsCssRaw
    : '';
let kanbanCss =
  typeof kanbanCssRaw === 'string' && kanbanCssRaw.length > 0
    ? kanbanCssRaw
    : '';
let mediaBridgeCss =
  typeof mediaBridgeCssRaw === 'string' && mediaBridgeCssRaw.length > 0
    ? mediaBridgeCssRaw
    : '';
let tableCss =
  typeof tableCssRaw === 'string' && tableCssRaw.length > 0 ? tableCssRaw : '';
let flagsCss =
  typeof flagsCssRaw === 'string' && flagsCssRaw.length > 0 ? flagsCssRaw : '';

if (
  !resetCss ||
  !themeCss ||
  !markonCss ||
  !chartsCss ||
  !kanbanCss ||
  !mediaBridgeCss ||
  !tableCss ||
  !flagsCss
) {
  try {
    const stylesDir = path.resolve(__dirname, '../styles');
    const compDir = path.join(stylesDir, 'components');
    if (!resetCss && fs.existsSync(path.join(stylesDir, 'reset.css'))) {
      resetCss = fs.readFileSync(path.join(stylesDir, 'reset.css'), 'utf8');
    }
    if (!themeCss && fs.existsSync(path.join(stylesDir, 'theme.css'))) {
      themeCss = fs.readFileSync(path.join(stylesDir, 'theme.css'), 'utf8');
    }
    if (!markonCss && fs.existsSync(path.join(compDir, 'markon.css'))) {
      markonCss = fs.readFileSync(path.join(compDir, 'markon.css'), 'utf8');
    }
    if (!chartsCss && fs.existsSync(path.join(compDir, 'charts.css'))) {
      chartsCss = fs.readFileSync(path.join(compDir, 'charts.css'), 'utf8');
    }
    if (!kanbanCss && fs.existsSync(path.join(compDir, 'kanban.css'))) {
      kanbanCss = fs.readFileSync(path.join(compDir, 'kanban.css'), 'utf8');
    }
    if (
      !mediaBridgeCss &&
      fs.existsSync(path.join(compDir, 'media-bridge.css'))
    ) {
      mediaBridgeCss = fs.readFileSync(
        path.join(compDir, 'media-bridge.css'),
        'utf8'
      );
    }
    if (!tableCss && fs.existsSync(path.join(compDir, 'table.css'))) {
      tableCss = fs.readFileSync(path.join(compDir, 'table.css'), 'utf8');
    }
    if (!flagsCss && fs.existsSync(path.join(compDir, 'flags.css'))) {
      flagsCss = fs.readFileSync(path.join(compDir, 'flags.css'), 'utf8');
    }
  } catch {
    // Browser or bundler environment
  }
}

export interface NuicssPresetOptions {
  /**
   * Whether to inject base resets and design tokens as preflights.
   * Defaults to true.
   */
  preflights?: boolean;
}

const resolveFunction = (mod: any, fallbackKey?: string) => {
  if (typeof mod === 'function') return mod;
  if (fallbackKey && typeof mod?.[fallbackKey] === 'function')
    return mod[fallbackKey];
  if (typeof mod?.default === 'function') return mod.default;
  return mod;
};

const getPresetWind4 = resolveFunction(presetWind4Module, 'presetWind4');
const getProcessorLightningCSS = resolveFunction(processorLightningCSSRaw);

const borderDirectionMap: Record<string, string[]> = {
  't-': ['border-top-color'],
  'b-': ['border-bottom-color'],
  'l-': ['border-left-color'],
  'r-': ['border-right-color'],
  'x-': ['border-left-color', 'border-right-color'],
  'y-': ['border-top-color', 'border-bottom-color'],
  '': ['border-color'],
};

const protectedShortcutPrefixes = [
  'empty-state',
  'link-muted',
  'link-hover',
  'hover-card',
  'link-preview',
  'file-list',
  'file-item',
];

const DANGEROUS_CSS_PATTERNS = [
  /expression\s*\(/i,
  /javascript\s*:/i,
  /vbscript\s*:/i,
  /-moz-binding\s*:/i,
  /behavior\s*:/i,
  /;\s*}/,
  /}\s*[^{;]+\s*\{/,
];

function isDangerousCss(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  return DANGEROUS_CSS_PATTERNS.some((pat) => pat.test(value));
}

export type NuicssPreset = NuicssConfig & { name?: string };

export function nuicssPreset(options: NuicssPresetOptions = {}): NuicssPreset {
  const wind = getPresetWind4();
  for (const v of (wind as any).variants || []) {
    if (v && (v as any).name === 'pseudo') {
      const origMatch = (v as any).match;
      (v as any).match = (matcher: string, ctx: any) => {
        for (const prefix of protectedShortcutPrefixes) {
          if (matcher.startsWith(prefix)) return undefined;
        }
        return origMatch(matcher, ctx);
      };
    }
  }

  const preflights =
    options.preflights !== false
      ? [
          {
            layer: 'base',
            getCSS: () =>
              `@layer base, components, utilities;\n\n${themeCss}\n\n${resetCss}`,
          },
        ]
      : [];

  let processor: any = null;
  try {
    if (typeof getProcessorLightningCSS === 'function') {
      processor = getProcessorLightningCSS();
    }
  } catch {
    // Graceful fallback when native addon is missing
  }

  return {
    name: 'nuicss-preset',
    presets: [wind],
    processors: processor ? [processor] : [],
    preflights,
    postprocess: [
      (util: any) => {
        if (!util || !Array.isArray(util.entries)) return;
        const hasDangerousEntry = util.entries.some(
          ([prop, val]: [any, any]) =>
            (typeof prop === 'string' &&
              (/^behavior$/i.test(prop) || isDangerousCss(prop))) ||
            isDangerousCss(val)
        );
        if (hasDangerousEntry) {
          util.entries = [];
        }
      },
    ],
    rules: [
      // Semantic background tokens with native opacity modifier support (e.g. bg-surface/80, bg-card, bg-selected)
      [
        /^bg-(page|canvas|surface|surface-raised|surface-overlay|subtle|muted|accent|overlay|glass|inset|card|selected|selected-hover)(?:\/(\d+))?$/,
        ([, name, opacity]) => {
          const varName =
            name === 'glass'
              ? '--glass-bg'
              : name === 'accent'
              ? '--bg-accent'
              : `--bg-${name}`;
          const val = opacity
            ? `color-mix(in oklch, var(${varName}) ${opacity}%, transparent)`
            : `var(${varName})`;
          return { 'background-color': val };
        },
      ],
      // Semantic text foreground tokens with native opacity modifier support (e.g. text-default, text-subtle/70)
      [
        /^text-(default|subtle|muted|accent|inverse|disabled|card)(?:\/(\d+))?$/,
        ([, name, opacity]) => {
          const varName = `--fg-${name}`;
          const val = opacity
            ? `color-mix(in oklch, var(${varName}) ${opacity}%, transparent)`
            : `var(${varName})`;
          return { color: val };
        },
      ],
      // Semantic border tokens with directional & opacity modifier support (e.g. border-default, border-t-subtle, border-x-strong/60)
      [
        /^border-([trblxy]-)?(default|subtle|strong|hover|focus|disabled|glass|glassBorder)(?:\/(\d+))?$/,
        ([, dir = '', name, opacity]) => {
          const props = borderDirectionMap[dir] || ['border-color'];
          const varName =
            name === 'glass' || name === 'glassBorder'
              ? '--glass-border'
              : `--border-${name}`;
          const val = opacity
            ? `color-mix(in oklch, var(${varName}) ${opacity}%, transparent)`
            : `var(${varName})`;
          const res: Record<string, string> = {};
          for (const p of props) {
            res[p] = val;
          }
          return res;
        },
      ],
      // Fluid Typography (clamp scaling from 375px to 1440px)
      [
        /^text-fluid-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|hero)$/,
        ([, size]) => ({ 'font-size': `var(--text-fluid-${size})` }),
      ],
      // Fluid Spacing Scale (clamp scaling from 375px to 1440px)
      [
        /^p-fluid-(xs|sm|md|lg|xl)$/,
        ([, size]) => ({ padding: `var(--space-fluid-${size})` }),
      ],
      [
        /^px-fluid-(xs|sm|md|lg|xl)$/,
        ([, size]) => ({
          'padding-left': `var(--space-fluid-${size})`,
          'padding-right': `var(--space-fluid-${size})`,
        }),
      ],
      [
        /^py-fluid-(xs|sm|md|lg|xl)$/,
        ([, size]) => ({
          'padding-top': `var(--space-fluid-${size})`,
          'padding-bottom': `var(--space-fluid-${size})`,
        }),
      ],
      [
        /^gap-fluid-(xs|sm|md|lg|xl)$/,
        ([, size]) => ({ gap: `var(--space-fluid-${size})` }),
      ],
      // Container Query Rules
      [/^cq$/, () => ({ 'container-type': 'inline-size' })],
      [/^cq-normal$/, () => ({ 'container-type': 'normal' })],
      // Physics-based Spring and Easing Utilities
      [
        /^ease-(spring|bounce|smooth|out-expo)$/,
        ([, name]) => ({ 'transition-timing-function': `var(--ease-${name})` }),
      ],
      // Semantic SVG fill tokens
      [
        /^fill-(muted|default|subtle|accent|primary|danger|success|warning|info)$/,
        ([, name]) => {
          const varName =
            name === 'muted' || name === 'default' || name === 'subtle'
              ? `--fg-${name}`
              : `--color-${name}`;
          return { fill: `var(${varName})` };
        },
      ],
      // Semantic SVG stroke tokens
      [
        /^stroke-(default|subtle|strong|muted)$/,
        ([, name]) => {
          const varName = name === 'muted' ? '--fg-muted' : `--border-${name}`;
          return { stroke: `var(${varName})` };
        },
      ],
      // On-demand Domain Component Rules (Emitted into layer: 'components' only when referenced)
      [
        /^__table-styles$|^(?:nui-)?table-container$/,
        () => tableCss,
        { layer: 'components' },
      ],
      [
        /^(?:nui-)?kanban(?:-[a-z0-9-]+)?$/,
        () => kanbanCss,
        { layer: 'components' },
      ],
      [
        /^(?:nui-)?markon(?:-[a-z0-9-]+)?$|^tiptap-wrapper$|^editor-content$|^prose-markon$/,
        () => markonCss,
        { layer: 'components' },
      ],
      [
        /^(?:nui-)?chart(?:-[a-z0-9-]+)?$|^(?:nui-)?charts?$/,
        () => chartsCss,
        { layer: 'components' },
      ],
      [
        /^(?:nui-)?(?:vidstack-player|vidstack-audio-player|media-container|media-player)$/,
        () => mediaBridgeCss,
        { layer: 'components' },
      ],
      [
        /^(?:nui-|nf-)?flag(?:-[a-z0-9-]+)?$/,
        () => flagsCss,
        { layer: 'components' },
      ],
    ],
    shortcuts: [
      ...(Array.isArray(componentShortcuts) ? componentShortcuts : []),
      ['animate-in', 'animate-zoom-in', { layer: 'components' }],
      ['fade-in', 'animate-fade-in', { layer: 'components' }],
      ['zoom-in-95', 'animate-zoom-in', { layer: 'components' }],
      ['ring-focus', 'ring-[color:var(--focus-ring)]', { layer: 'components' }],
      [
        'ring-offset-surface',
        'ring-offset-[color:var(--bg-surface)]',
        { layer: 'components' },
      ],
      [
        'ring-offset-background',
        'ring-offset-[color:var(--bg-page)]',
        { layer: 'components' },
      ],
      [
        'card-responsive',
        '@container flex flex-col @sm:flex-row @sm:items-center',
        { layer: 'components' },
      ],
      [
        'stat-card-responsive',
        '@container flex flex-col justify-between p-5 rounded-xl border border-default bg-surface shadow-sm @sm:flex-row @sm:items-center',
        { layer: 'components' },
      ],
    ],
    layers: {
      components: 10,
      default: 20,
      utilities: 30,
    },
    content: {
      pipeline: {
        include: [
          /\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html)($|\?)/,
          'src/**/*.{html,js,ts,jsx,tsx,vue,svelte}',
          '**/node_modules/@nofinite/nui/**/*.{js,mjs,cjs,jsx,tsx}',
        ],
      },
    },
    theme: {
      colors: {
        primary: 'var(--color-primary)',
        'primary-hover': 'var(--color-primary-hover)',
        'primary-active': 'var(--color-primary-active)',
        'primary-fg': 'var(--color-primary-fg)',
        'primary-subtle': 'var(--color-primary-subtle)',
        secondary: 'var(--color-secondary)',
        'secondary-hover': 'var(--color-secondary-hover)',
        'secondary-active': 'var(--color-secondary-active)',
        'secondary-fg': 'var(--color-secondary-fg)',
        'secondary-subtle': 'var(--color-secondary-subtle)',
        danger: 'var(--color-danger)',
        'danger-hover': 'var(--color-danger-hover)',
        'danger-active': 'var(--color-danger-active)',
        'danger-fg': 'var(--color-danger-fg)',
        'danger-subtle': 'var(--color-danger-subtle)',
        success: 'var(--color-success)',
        'success-hover': 'var(--color-success-hover)',
        'success-active': 'var(--color-success-active)',
        'success-fg': 'var(--color-success-fg)',
        'success-subtle': 'var(--color-success-subtle)',
        warning: 'var(--color-warning)',
        'warning-hover': 'var(--color-warning-hover)',
        'warning-active': 'var(--color-warning-active)',
        'warning-fg': 'var(--color-warning-fg)',
        'warning-subtle': 'var(--color-warning-subtle)',
        info: 'var(--color-info)',
        'info-hover': 'var(--color-info-hover)',
        'info-active': 'var(--color-info-active)',
        'info-fg': 'var(--color-info-fg)',
        'info-subtle': 'var(--color-info-subtle)',
        accent: 'var(--bg-accent)',
        'accent-fg': 'var(--fg-accent)',
        canvas: 'var(--bg-canvas)',
        surface: 'var(--bg-surface)',
        card: 'var(--bg-card)',
        overlay: 'var(--bg-overlay)',
      },
      spacing: {
        DEFAULT: 'var(--spacing, 0.25rem)',
      },
      borderRadius: {
        none: 'var(--radius-none)',
        sm: 'var(--radius-sm)',
        DEFAULT: 'var(--radius-md)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        '3xl': 'var(--radius-3xl)',
        full: 'var(--radius-full)',
        control: 'var(--radius-control)',
        container: 'var(--radius-container)',
      },
      radius: {
        none: 'var(--radius-none)',
        sm: 'var(--radius-sm)',
        DEFAULT: 'var(--radius-md)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        '3xl': 'var(--radius-3xl)',
        full: 'var(--radius-full)',
        control: 'var(--radius-control)',
        container: 'var(--radius-container)',
      },
      boxShadow: {
        none: 'var(--shadow-none)',
        xs: 'var(--shadow-xs)',
        sm: 'var(--shadow-sm)',
        DEFAULT: 'var(--shadow-md)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
        '2xl': 'var(--shadow-2xl)',
        inner: 'var(--shadow-inner)',
        popover: 'var(--shadow-popover)',
      },
      shadow: {
        none: 'var(--shadow-none)',
        xs: 'var(--shadow-xs)',
        sm: 'var(--shadow-sm)',
        DEFAULT: 'var(--shadow-md)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
        '2xl': 'var(--shadow-2xl)',
        inner: 'var(--shadow-inner)',
        popover: 'var(--shadow-popover)',
      },
      fontFamily: {
        sans: 'var(--font-sans, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif)',
        serif:
          'var(--font-serif, ui-serif, Georgia, Cambria, "Times New Roman", Times, serif)',
        mono: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace)',
      },
      font: {
        sans: 'var(--font-sans, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif)',
        serif:
          'var(--font-serif, ui-serif, Georgia, Cambria, "Times New Roman", Times, serif)',
        mono: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace)',
      },
      animation: {
        keyframes: {
          'fade-in': '{ from { opacity: 0; } to { opacity: 1; } }',
          'fade-out': '{ from { opacity: 1; } to { opacity: 0; } }',
          'zoom-in':
            '{ from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }',
          'zoom-out':
            '{ from { opacity: 1; transform: scale(1); } to { opacity: 0; transform: scale(0.95); } }',
          'slide-in-up':
            '{ from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }',
          'slide-in-down':
            '{ from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }',
          'slide-out-up':
            '{ from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(-10px); } }',
          'slide-out-down':
            '{ from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(10px); } }',
          shimmer: '{ 100% { transform: translateX(100%); } }',
        },
        durations: {
          'fade-in': '200ms',
          'fade-out': '150ms',
          'zoom-in': '200ms',
          'zoom-out': '150ms',
          'slide-in-up': '200ms',
          'slide-in-down': '200ms',
          'slide-out-up': '150ms',
          'slide-out-down': '150ms',
          shimmer: '1.8s',
        },
        counts: {
          shimmer: 'infinite',
        },
        timingFns: {
          'fade-in': 'cubic-bezier(0.4, 0, 0.2, 1)',
          'fade-out': 'cubic-bezier(0.4, 0, 1, 1)',
          'zoom-in': 'cubic-bezier(0.4, 0, 0.2, 1)',
          'zoom-out': 'cubic-bezier(0.4, 0, 1, 1)',
          'slide-in-up': 'cubic-bezier(0.4, 0, 0.2, 1)',
          'slide-in-down': 'cubic-bezier(0.4, 0, 0.2, 1)',
          'slide-out-up': 'cubic-bezier(0.4, 0, 1, 1)',
          'slide-out-down': 'cubic-bezier(0.4, 0, 1, 1)',
        },
      },
    },
  };
}
