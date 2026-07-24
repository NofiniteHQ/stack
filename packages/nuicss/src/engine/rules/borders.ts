import { Rule } from '../types';
import { radii, colorsBg, colorsText, extendedColors } from '../tokens';

export const bordersRules: Rule[] = [
  // Border Radius
  {
    pattern: /^rounded-(none|sm|md|lg|xl|2xl|3xl|full)$/,
    generator: ({ match }) => {
      const val = match[1];
      if (radii[val]) {
        return `border-radius: var(--nui-radius-${val}, ${radii[val]});`;
      }
      return null;
    }
  },
  
  // Color (All sides & Directional)
  { pattern: /^border-(?:(t|r|b|l|x|y)-)?(.+?)(?:\/(\d+))?$/, generator: ({ match }) => {
      const dir = match[1];
      const val = match[2];
      const opacity = match[3];
      
      let baseVal = '';
      if (colorsBg[val]) baseVal = `var(--nui-border-${val}, ${colorsBg[val]})`;
      else if (colorsText[val]) baseVal = `var(--nui-color-${val}, ${colorsText[val]})`;
      else if (val === 'default') baseVal = `var(--nui-border-default, #e2e8f0)`;
      else if (val === 'transparent') baseVal = `transparent`;
      else if (extendedColors[val]) baseVal = extendedColors[val];
      else return null;

      const colorVal = opacity ? `color-mix(in srgb, ${baseVal} ${opacity}%, transparent)` : baseVal;

      if (!dir) return `border-color: ${colorVal};`;
      if (dir === 'x') return `border-left-color: ${colorVal}; border-right-color: ${colorVal};`;
      if (dir === 'y') return `border-top-color: ${colorVal}; border-bottom-color: ${colorVal};`;
      
      const propMap: Record<string, string> = { t: 'top', r: 'right', b: 'bottom', l: 'left' };
      return `border-${propMap[dir]}-color: ${colorVal};`;
  }},

  // Specific border radii
  { pattern: /^rounded-t-(.+)$/, generator: ({ match }) => radii[match[1]] ? `border-top-left-radius: var(--nui-radius-${match[1]}, ${radii[match[1]]}); border-top-right-radius: var(--nui-radius-${match[1]}, ${radii[match[1]]});` : null },
  { pattern: /^rounded-b-(.+)$/, generator: ({ match }) => radii[match[1]] ? `border-bottom-left-radius: var(--nui-radius-${match[1]}, ${radii[match[1]]}); border-bottom-right-radius: var(--nui-radius-${match[1]}, ${radii[match[1]]});` : null },
  { pattern: /^rounded-l-(.+)$/, generator: ({ match }) => radii[match[1]] ? `border-top-left-radius: var(--nui-radius-${match[1]}, ${radii[match[1]]}); border-bottom-left-radius: var(--nui-radius-${match[1]}, ${radii[match[1]]});` : null },
  { pattern: /^rounded-r-(.+)$/, generator: ({ match }) => radii[match[1]] ? `border-top-right-radius: var(--nui-radius-${match[1]}, ${radii[match[1]]}); border-bottom-right-radius: var(--nui-radius-${match[1]}, ${radii[match[1]]});` : null },

  // Border Widths
  { pattern: /^border(?:-(t|r|b|l|x|y))?(?:-(0|2|4|8))?$/, generator: ({ match }) => {
      const dir = match[1];
      const widthVal = match[2] || '1'; // default to 1px if border or border-t
      
      // We don't want to match border-primary here, which is caught by color rule.
      // But if color rule returns null, it might fall through. 
      // The regex requires the value to be 0, 2, 4, 8 OR empty. So it won't match "primary".
      
      const cssWidth = `${widthVal}px`;

      if (!dir) return `border-width: ${cssWidth};`;
      if (dir === 'x') return `border-left-width: ${cssWidth}; border-right-width: ${cssWidth};`;
      if (dir === 'y') return `border-top-width: ${cssWidth}; border-bottom-width: ${cssWidth};`;
      
      const propMap: Record<string, string> = { t: 'top', r: 'right', b: 'bottom', l: 'left' };
      return `border-${propMap[dir]}-width: ${cssWidth};`;
  }},

  // Border Style
  { pattern: /^border-solid$/, generator: () => 'border-style: solid;' },
  { pattern: /^border-dashed$/, generator: () => 'border-style: dashed;' },
  { pattern: /^border-dotted$/, generator: () => 'border-style: dotted;' },
  { pattern: /^border-none$/, generator: () => 'border-style: none;' },

  // Divide Widths
  { pattern: /^divide-(x|y)(?:-(0|2|4|8))?$/, selectorModifier: ' > :not([hidden]) ~ :not([hidden])', generator: ({ match }) => {
      const dir = match[1];
      const widthVal = match[2] || '1';
      const cssWidth = `${widthVal}px`;

      if (dir === 'x') return `border-left-width: calc(${cssWidth} * calc(1 - var(--nui-divide-x-reverse, 0))); border-right-width: calc(${cssWidth} * var(--nui-divide-x-reverse, 0));`;
      if (dir === 'y') return `border-top-width: calc(${cssWidth} * calc(1 - var(--nui-divide-y-reverse, 0))); border-bottom-width: calc(${cssWidth} * var(--nui-divide-y-reverse, 0));`;
      return null;
  }},
  
  // Divide Color
  { pattern: /^divide-(.+?)(?:\/(\d+))?$/, selectorModifier: ' > :not([hidden]) ~ :not([hidden])', generator: ({ match }) => {
      const val = match[1];
      const opacity = match[2];
      
      if (val === 'x' || val === 'y' || val === 'solid' || val === 'dashed' || val === 'dotted' || val === 'none') return null;
      
      let baseVal = '';
      if (colorsBg[val]) baseVal = `var(--nui-border-${val}, ${colorsBg[val]})`;
      else if (colorsText[val]) baseVal = `var(--nui-color-${val}, ${colorsText[val]})`;
      else if (val === 'default') baseVal = `var(--nui-border-default, #e2e8f0)`;
      else if (val === 'transparent') baseVal = `transparent`;
      else if (extendedColors[val]) baseVal = extendedColors[val];
      else return null;

      const colorVal = opacity ? `color-mix(in srgb, ${baseVal} ${opacity}%, transparent)` : baseVal;
      return `border-color: ${colorVal};`;
  }},

  // Outlines
  { pattern: /^outline-none$/, generator: () => 'outline: 2px solid transparent; outline-offset: 2px;' },
  { pattern: /^outline$/, generator: () => 'outline-style: solid;' },
];
