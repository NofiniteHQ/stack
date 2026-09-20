import type { NuicssConfig } from './config';
import * as presetWind4Module from '@unocss/preset-wind4';
import processorLightningCSSRaw from '@unocss/processor-lightningcss';
import { componentShortcuts } from '../shortcuts';

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

export function nuicssPreset(): NuicssConfig {
  return {
    presets: [getPresetWind4()],
    processors: [getProcessorLightningCSS()],
    rules: [
      // Semantic background tokens with native opacity modifier support (e.g. bg-surface/80, bg-card)
      [
        /^bg-(page|canvas|surface|surface-raised|surface-overlay|subtle|muted|accent|overlay|glass|inset|card)(?:\/(\d+))?$/,
        ([, name, opacity]) => {
          const varName =
            name === 'glass'
              ? '--glass-bg'
              : name === 'accent'
              ? '--bg-accent'
              : `--bg-${name}`;
          const val = opacity
            ? `color-mix(in srgb, var(${varName}) ${opacity}%, transparent)`
            : `color-mix(in srgb, var(${varName}) var(--un-bg-opacity, 100%), transparent)`;
          return { 'background-color': val };
        },
      ],
      // Semantic text foreground tokens with native opacity modifier support (e.g. text-default, text-subtle/70)
      [
        /^text-(default|subtle|muted|accent|inverse|disabled|card)(?:\/(\d+))?$/,
        ([, name, opacity]) => {
          const varName = `--fg-${name}`;
          const val = opacity
            ? `color-mix(in srgb, var(${varName}) ${opacity}%, transparent)`
            : `color-mix(in srgb, var(${varName}) var(--un-text-opacity, 100%), transparent)`;
          return { color: val };
        },
      ],
      // Semantic border tokens with directional & opacity modifier support (e.g. border-default, border-t-subtle, border-x-strong/60)
      [
        /^border-([trblxy]-)?(default|subtle|strong|hover|focus|disabled|glassBorder)(?:\/(\d+))?$/,
        ([, dir = '', name, opacity]) => {
          const props = borderDirectionMap[dir] || ['border-color'];
          const varName =
            name === 'glassBorder' ? '--glass-border' : `--border-${name}`;
          const val = opacity
            ? `color-mix(in srgb, var(${varName}) ${opacity}%, transparent)`
            : `color-mix(in srgb, var(${varName}) var(--un-border-opacity, 100%), transparent)`;
          const res: Record<string, string> = {};
          for (const p of props) {
            res[p] = val;
          }
          return res;
        },
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
          'src/**/*.{js,ts,jsx,tsx}',
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
        default: 'var(--border-default)',
        subtle: 'var(--border-subtle)',
        strong: 'var(--border-strong)',
        muted: 'var(--fg-muted)',
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
