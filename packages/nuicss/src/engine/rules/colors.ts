import { Rule } from '../types';
import { colorsBg, colorsText, colorsBorder, extendedColors } from '../tokens';

export const colorsRules: Rule[] = [
  // Background Colors
  {
    pattern: /^bg-(.+?)(?:\/(\d+))?$/,
    generator: ({ match, theme }) => {
      const val = match[1];
      const opacity = match[2];
      
      let baseVal = '';
      const tBg = { ...colorsBg, ...theme?.colorsBg };
      const tText = { ...colorsText, ...theme?.colorsText };

      if (tBg[val]) baseVal = `var(--nui-bg-${val}, ${tBg[val]})`;
      else if (tText[val]) baseVal = `var(--nui-color-${val}, ${tText[val]})`;
      else if (extendedColors[val]) baseVal = extendedColors[val];
      else return null;

      if (opacity) {
        return `background-color: color-mix(in srgb, ${baseVal} ${opacity}%, transparent);`;
      }
      return `background-color: ${baseVal};`;
    }
  },

  // Text Colors
  {
    pattern: /^text-(.+?)(?:\/(\d+))?$/,
    generator: ({ match }) => {
      const val = match[1];
      const opacity = match[2];
      
      let baseVal = '';
      if (colorsText[val]) baseVal = `var(--nui-color-${val}, ${colorsText[val]})`;
      else if (colorsBg[val]) baseVal = `var(--nui-bg-${val}, ${colorsBg[val]})`;
      else if (extendedColors[val]) baseVal = extendedColors[val];
      else return null;

      if (opacity) {
        return `color: color-mix(in srgb, ${baseVal} ${opacity}%, transparent);`;
      }
      return `color: ${baseVal};`;
    }
  },

  // Border Colors
  {
    pattern: /^border-(.+)$/,
    generator: ({ match }) => {
      const val = match[1];
      if (colorsBorder[val]) {
        return `border-color: var(--nui-border-${val}, ${colorsBorder[val]});`;
      }
      // If it's a structural border (e.g. border-t), return null to let borders.ts handle it
      return null;
    }
  },
  
  // Focus Rings
  {
    pattern: /^ring(?:-(.+?))?(?:\/(\d+))?$/,
    generator: ({ match }) => {
      const val = match[1];
      const opacity = match[2];
      
      // Base ring widths/colors logic
      if (!val) {
        // Just 'ring' defaults to 3px blue
        return 'box-shadow: var(--nui-ring-offset-shadow, 0 0 #0000), var(--nui-ring-shadow, 0 0 0 calc(3px + var(--nui-ring-offset-width, 0px)) rgba(37, 99, 235, 0.5)), var(--nui-shadow, 0 0 #0000);';
      }
      
      // Check if val is a number (ring size)
      if (['0', '1', '2', '4', '8'].includes(val)) {
         return `box-shadow: var(--nui-ring-offset-shadow, 0 0 #0000), var(--nui-ring-shadow, 0 0 0 calc(${val}px + var(--nui-ring-offset-width, 0px)) var(--nui-ring-color, rgba(37, 99, 235, 0.5))), var(--nui-shadow, 0 0 #0000);`;
      }
      
      // Otherwise it's a color
      let baseVal = '';
      if (colorsText[val]) baseVal = `var(--nui-color-${val}, ${colorsText[val]})`;
      else if (colorsBg[val]) baseVal = `var(--nui-bg-${val}, ${colorsBg[val]})`;
      else if (colorsBorder[val]) baseVal = `var(--nui-border-${val}, ${colorsBorder[val]})`;
      else if (extendedColors[val]) baseVal = extendedColors[val];
      else return null;

      const colorVal = opacity ? `color-mix(in srgb, ${baseVal} ${opacity}%, transparent)` : baseVal;
      return `--nui-ring-color: ${colorVal}; box-shadow: var(--nui-ring-offset-shadow, 0 0 #0000), var(--nui-ring-shadow, 0 0 0 calc(3px + var(--nui-ring-offset-width, 0px)) var(--nui-ring-color)), var(--nui-shadow, 0 0 #0000);`;
    }
  },

  // Outline Colors
  {
    pattern: /^outline-(.+?)(?:\/(\d+))?$/,
    generator: ({ match }) => {
      const val = match[1];
      const opacity = match[2];
      
      if (val === 'none' || val === 'solid' || val === 'dashed' || val === 'dotted') return null;
      
      let baseVal = '';
      if (colorsBorder[val]) baseVal = `var(--nui-border-${val}, ${colorsBorder[val]})`;
      else if (colorsBg[val]) baseVal = `var(--nui-bg-${val}, ${colorsBg[val]})`;
      else if (colorsText[val]) baseVal = `var(--nui-color-${val}, ${colorsText[val]})`;
      else if (extendedColors[val]) baseVal = extendedColors[val];
      else return null;

      const colorVal = opacity ? `color-mix(in srgb, ${baseVal} ${opacity}%, transparent)` : baseVal;
      return `outline-color: ${colorVal};`;
    }
  },

  // Placeholder Colors
  {
    pattern: /^placeholder-(.+?)(?:\/(\d+))?$/,
    selectorModifier: '::placeholder',
    generator: ({ match }) => {
      const val = match[1];
      const opacity = match[2];
      
      let baseVal = '';
      if (colorsText[val]) baseVal = `var(--nui-color-${val}, ${colorsText[val]})`;
      else if (colorsBg[val]) baseVal = `var(--nui-bg-${val}, ${colorsBg[val]})`;
      else if (extendedColors[val]) baseVal = extendedColors[val];
      else return null;

      const colorVal = opacity ? `color-mix(in srgb, ${baseVal} ${opacity}%, transparent)` : baseVal;
      return `color: ${colorVal};`;
    }
  },

  // Gradients
  { pattern: /^bg-gradient-to-t$/, generator: () => 'background-image: linear-gradient(to top, var(--nui-gradient-stops));' },
  { pattern: /^bg-gradient-to-tr$/, generator: () => 'background-image: linear-gradient(to top right, var(--nui-gradient-stops));' },
  { pattern: /^bg-gradient-to-r$/, generator: () => 'background-image: linear-gradient(to right, var(--nui-gradient-stops));' },
  { pattern: /^bg-gradient-to-br$/, generator: () => 'background-image: linear-gradient(to bottom right, var(--nui-gradient-stops));' },
  { pattern: /^bg-gradient-to-b$/, generator: () => 'background-image: linear-gradient(to bottom, var(--nui-gradient-stops));' },
  { pattern: /^bg-gradient-to-bl$/, generator: () => 'background-image: linear-gradient(to bottom left, var(--nui-gradient-stops));' },
  { pattern: /^bg-gradient-to-l$/, generator: () => 'background-image: linear-gradient(to left, var(--nui-gradient-stops));' },
  { pattern: /^bg-gradient-to-tl$/, generator: () => 'background-image: linear-gradient(to top left, var(--nui-gradient-stops));' },
  
  { pattern: /^from-(.+)$/, generator: ({ match }) => {
    const val = match[1];
    if (colorsBg[val]) return `--nui-gradient-from: var(--nui-bg-${val}, ${colorsBg[val]}); --nui-gradient-stops: var(--nui-gradient-from), var(--nui-gradient-to, transparent);`;
    if (colorsText[val]) return `--nui-gradient-from: var(--nui-color-${val}, ${colorsText[val]}); --nui-gradient-stops: var(--nui-gradient-from), var(--nui-gradient-to, transparent);`;
    if (extendedColors[val]) return `--nui-gradient-from: ${extendedColors[val]}; --nui-gradient-stops: var(--nui-gradient-from), var(--nui-gradient-to, transparent);`;
    return null;
  }},
  { pattern: /^via-(.+)$/, generator: ({ match }) => {
    const val = match[1];
    if (colorsBg[val]) return `--nui-gradient-stops: var(--nui-gradient-from), var(--nui-bg-${val}, ${colorsBg[val]}), var(--nui-gradient-to, transparent);`;
    if (colorsText[val]) return `--nui-gradient-stops: var(--nui-gradient-from), var(--nui-color-${val}, ${colorsText[val]}), var(--nui-gradient-to, transparent);`;
    if (extendedColors[val]) return `--nui-gradient-stops: var(--nui-gradient-from), ${extendedColors[val]}, var(--nui-gradient-to, transparent);`;
    return null;
  }},
  { pattern: /^to-(.+)$/, generator: ({ match }) => {
    const val = match[1];
    if (colorsBg[val]) return `--nui-gradient-to: var(--nui-bg-${val}, ${colorsBg[val]});`;
    if (colorsText[val]) return `--nui-gradient-to: var(--nui-color-${val}, ${colorsText[val]});`;
    if (extendedColors[val]) return `--nui-gradient-to: ${extendedColors[val]};`;
    return null;
  }},
  
  // Background Clip (useful for text gradients)
  { pattern: /^bg-clip-text$/, generator: () => '-webkit-background-clip: text; background-clip: text;' },
];
