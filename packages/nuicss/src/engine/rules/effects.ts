import { Rule } from '../types';
import { shadows, zIndex, opacities } from '../tokens';

export const effectsRules: Rule[] = [
  // Shadows
  {
    pattern: /^shadow-(none|sm|md|lg|xl|2xl|inner)$/,
    generator: ({ match }) => {
      const val = match[1];
      if (shadows[val]) {
        return `box-shadow: var(--nui-shadow-${val}, ${shadows[val]});`;
      }
      return null;
    }
  },

  // Z-Index
  {
    pattern: /^z-(hide|auto|base|docked|dropdown|sticky|modal|tooltip|max)$/,
    generator: ({ match }) => {
      const val = match[1];
      if (zIndex[val]) {
        return `z-index: var(--nui-z-${val}, ${zIndex[val]});`;
      }
      return null;
    }
  },

  // Opacity
  {
    pattern: /^opacity-(0|5|10|25|50|75|90|95|100)$/,
    generator: ({ match }) => {
      const val = match[1];
      if (opacities[val]) {
        return `opacity: var(--nui-opacity-${val}, ${opacities[val]});`;
      }
      return null;
    }
  },

  // Transform Origin
  { pattern: /^origin-center$/, generator: () => 'transform-origin: center;' },
  { pattern: /^origin-top$/, generator: () => 'transform-origin: top;' },
  { pattern: /^origin-top-right$/, generator: () => 'transform-origin: top right;' },
  { pattern: /^origin-right$/, generator: () => 'transform-origin: right;' },
  { pattern: /^origin-bottom-right$/, generator: () => 'transform-origin: bottom right;' },
  { pattern: /^origin-bottom$/, generator: () => 'transform-origin: bottom;' },
  { pattern: /^origin-bottom-left$/, generator: () => 'transform-origin: bottom left;' },
  { pattern: /^origin-left$/, generator: () => 'transform-origin: left;' },
  { pattern: /^origin-top-left$/, generator: () => 'transform-origin: top left;' },

  // Cursors & Interactivity
  { pattern: /^cursor-auto$/, generator: () => 'cursor: auto;' },
  { pattern: /^cursor-default$/, generator: () => 'cursor: default;' },
  { pattern: /^cursor-pointer$/, generator: () => 'cursor: pointer;' },
  { pattern: /^cursor-wait$/, generator: () => 'cursor: wait;' },
  { pattern: /^cursor-text$/, generator: () => 'cursor: text;' },
  { pattern: /^cursor-move$/, generator: () => 'cursor: move;' },
  { pattern: /^cursor-not-allowed$/, generator: () => 'cursor: not-allowed;' },
  { pattern: /^pointer-events-none$/, generator: () => 'pointer-events: none;' },
  { pattern: /^pointer-events-auto$/, generator: () => 'pointer-events: auto;' },
  { pattern: /^select-none$/, generator: () => 'user-select: none;' },
  { pattern: /^select-text$/, generator: () => 'user-select: text;' },
  
  // Transforms
  { pattern: /^scale-(0|50|75|90|95|100|105|110|125|150)$/, generator: ({ match }) => `transform: scale(${parseInt(match[1]) / 100});` },
  { pattern: /^-?translate-x-(.+)$/, generator: ({ match, className }) => {
      const isNegative = className.startsWith('-') || className.startsWith(':-') || className.includes(':-translate-') || className.match(/(^|:)-nui-translate/);
      let val = match[1];
      let cssVal = val;
      if (val === 'full') cssVal = '100%';
      else if (val.includes('/')) {
        const [n, d] = val.split('/');
        cssVal = `${(Number(n) / Number(d)) * 100}%`;
      } else {
        cssVal = `var(--nui-space-${val}, ${val === '0' ? '0px' : val + 'rem'})`;
      }
      return `transform: translateX(${isNegative ? '-' : ''}${cssVal});`;
  }},
  { pattern: /^-?translate-y-(.+)$/, generator: ({ match, className }) => {
      const isNegative = className.startsWith('-') || className.startsWith(':-') || className.includes(':-translate-') || className.match(/(^|:)-nui-translate/);
      let val = match[1];
      let cssVal = val;
      if (val === 'full') cssVal = '100%';
      else if (val.includes('/')) {
        const [n, d] = val.split('/');
        cssVal = `${(Number(n) / Number(d)) * 100}%`;
      } else {
        cssVal = `var(--nui-space-${val}, ${val === '0' ? '0px' : val + 'rem'})`;
      }
      return `transform: translateY(${isNegative ? '-' : ''}${cssVal});`;
  }},

  // Shadow Colors
  { pattern: /^shadow-(primary|danger|success|warning|info|default|subtle|muted)(?:\/(\d+))?$/, generator: ({ match }) => {
      const color = match[1];
      const opacity = match[2];
      const cssColor = opacity ? `color-mix(in srgb, var(--nui-color-${color}, #000) ${opacity}%, transparent)` : `var(--nui-color-${color}, #000)`;
      return `--nui-shadow-color: ${cssColor}; box-shadow: 0 10px 15px -3px var(--nui-shadow-color), 0 4px 6px -4px var(--nui-shadow-color);`;
  }},

  // Rings
  { pattern: /^ring$/, generator: () => `--nui-ring-width: 3px; --nui-ring-color: color-mix(in srgb, var(--nui-color-primary, #3b82f6) 50%, transparent); box-shadow: var(--nui-ring-offset-shadow, 0 0 #0000), 0 0 0 calc(var(--nui-ring-width) + var(--nui-ring-offset-width, 0px)) var(--nui-ring-color), var(--nui-shadow, 0 0 #0000);` },
  { pattern: /^ring-(\d+)$/, generator: ({ match }) => `--nui-ring-width: ${match[1]}px; box-shadow: var(--nui-ring-offset-shadow, 0 0 #0000), 0 0 0 calc(var(--nui-ring-width) + var(--nui-ring-offset-width, 0px)) var(--nui-ring-color, color-mix(in srgb, var(--nui-color-primary, #3b82f6) 50%, transparent)), var(--nui-shadow, 0 0 #0000);` },
  { pattern: /^ring-(primary|danger|success|warning|info|default|subtle|muted)(?:\/(\d+))?$/, generator: ({ match }) => {
      const color = match[1];
      const opacity = match[2];
      const cssColor = opacity ? `color-mix(in srgb, var(--nui-color-${color}) ${opacity}%, transparent)` : `var(--nui-color-${color})`;
      return `--nui-ring-color: ${cssColor};`;
  }},
  { pattern: /^ring-\[(.+)\]$/, generator: ({ match }) => `--nui-ring-color: ${match[1]};` },

  // Ring Offsets
  { pattern: /^ring-offset-(0|1|2|4|8)$/, generator: ({ match }) => `--nui-ring-offset-width: ${match[1]}px; --nui-ring-offset-shadow: 0 0 0 var(--nui-ring-offset-width) var(--nui-ring-offset-color, #fff); box-shadow: var(--nui-ring-offset-shadow), 0 0 0 calc(var(--nui-ring-width, 3px) + var(--nui-ring-offset-width)) var(--nui-ring-color, color-mix(in srgb, var(--nui-color-primary, #3b82f6) 50%, transparent)), var(--nui-shadow, 0 0 #0000);` },
  { pattern: /^ring-offset-(transparent|current|white|black)$/, generator: ({ match }) => {
      const colors: Record<string, string> = { transparent: 'transparent', current: 'currentColor', white: '#fff', black: '#000' };
      return `--nui-ring-offset-color: ${colors[match[1]]};`;
  }},
  { pattern: /^ring-offset-(primary|danger|success|warning|info|default|subtle|muted)$/, generator: ({ match }) => `--nui-ring-offset-color: var(--nui-color-${match[1]});` },
  { pattern: /^ring-offset-\[(.+)\]$/, generator: ({ match }) => `--nui-ring-offset-color: ${match[1]};` },
  { pattern: /^blur-sm$/, generator: () => 'filter: blur(4px);' },
  { pattern: /^blur$/, generator: () => 'filter: blur(8px);' },
  { pattern: /^backdrop-blur-sm$/, generator: () => 'backdrop-filter: blur(4px);' },
  { pattern: /^backdrop-blur-md$/, generator: () => 'backdrop-filter: blur(12px);' },

  // Blend Modes
  { pattern: /^mix-blend-(normal|multiply|screen|overlay|darken|lighten|color-dodge|color-burn|hard-light|soft-light|difference|exclusion|hue|saturation|color|luminosity)$/, generator: ({ match }) => `mix-blend-mode: ${match[1]};` },
  { pattern: /^bg-blend-(normal|multiply|screen|overlay|darken|lighten|color-dodge|color-burn|hard-light|soft-light|difference|exclusion|hue|saturation|color|luminosity)$/, generator: ({ match }) => `background-blend-mode: ${match[1]};` },

  // View Transitions
  { pattern: /^view-transition-\[(.+)\]$/, generator: ({ match }) => `view-transition-name: ${match[1]};` },
  { pattern: /^view-transition-(.+)$/, generator: ({ match }) => `view-transition-name: ${match[1]};` },

  // Advanced Backdrop Filters
  { pattern: /^backdrop-brightness-(\d+)$/, generator: ({ match }) => `backdrop-filter: brightness(${parseInt(match[1]) / 100}); -webkit-backdrop-filter: brightness(${parseInt(match[1]) / 100});` },
  { pattern: /^backdrop-contrast-(\d+)$/, generator: ({ match }) => `backdrop-filter: contrast(${parseInt(match[1]) / 100}); -webkit-backdrop-filter: contrast(${parseInt(match[1]) / 100});` },
  { pattern: /^backdrop-saturate-(\d+)$/, generator: ({ match }) => `backdrop-filter: saturate(${parseInt(match[1]) / 100}); -webkit-backdrop-filter: saturate(${parseInt(match[1]) / 100});` },
  { pattern: /^backdrop-grayscale$/, generator: () => `backdrop-filter: grayscale(100%); -webkit-backdrop-filter: grayscale(100%);` },
  { pattern: /^backdrop-invert$/, generator: () => `backdrop-filter: invert(100%); -webkit-backdrop-filter: invert(100%);` },
  { pattern: /^backdrop-sepia$/, generator: () => `backdrop-filter: sepia(100%); -webkit-backdrop-filter: sepia(100%);` },

  // Masks
  { pattern: /^mask-image-\[(.+)\]$/, generator: ({ match }) => {
      // Need to convert underscores to spaces for gradients, e.g., mask-image-[linear-gradient(to_bottom,black,transparent)]
      const val = match[1].replace(/_/g, ' ');
      return `mask-image: ${val}; -webkit-mask-image: ${val};`;
  }},

  // Text Shadows
  { pattern: /^text-shadow-sm$/, generator: () => `text-shadow: 1px 1px 2px var(--nui-shadow-color, rgba(0,0,0,0.1));` },
  { pattern: /^text-shadow-md$/, generator: () => `text-shadow: 1px 2px 4px var(--nui-shadow-color, rgba(0,0,0,0.15));` },
  { pattern: /^text-shadow-lg$/, generator: () => `text-shadow: 2px 4px 8px var(--nui-shadow-color, rgba(0,0,0,0.2));` },
  { pattern: /^text-shadow-none$/, generator: () => `text-shadow: none;` },

  // Transition Delays
  { pattern: /^delay-(75|100|150|200|300|500|700|1000)$/, generator: ({ match }) => `transition-delay: ${match[1]}ms; animation-delay: ${match[1]}ms;` },
  { pattern: /^delay-\[(.+)\]$/, generator: ({ match }) => `transition-delay: ${match[1]}; animation-delay: ${match[1]};` },
];
