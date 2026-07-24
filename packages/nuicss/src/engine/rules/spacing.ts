import { Rule } from '../types';
import { spacings } from '../tokens';

const spacingProperties = {
  p: 'padding',
  px: ['padding-left', 'padding-right'],
  py: ['padding-top', 'padding-bottom'],
  pt: 'padding-top',
  pr: 'padding-right',
  pb: 'padding-bottom',
  pl: 'padding-left',
  m: 'margin',
  mx: ['margin-left', 'margin-right'],
  my: ['margin-top', 'margin-bottom'],
  mt: 'margin-top',
  mr: 'margin-right',
  mb: 'margin-bottom',
  ml: 'margin-left',
  gap: 'gap',
  'gap-x': 'column-gap',
  'gap-y': 'row-gap',
};

export const spacingRules: Rule[] = [
  {
    pattern: /^(p|px|py|pt|pr|pb|pl|m|mx|my|mt|mr|mb|ml|gap|gap-x|gap-y)-(.+)$/,
    generator: ({ match }) => {
      const type = match[1] as keyof typeof spacingProperties;
      const val = match[2];

      if (type === 'gap' && val === 'auto') return null; // gap-auto doesn't make sense

      if (spacings[val] !== undefined) {
        const cssVal = val === 'auto' ? 'auto' : `var(--nui-space-${val}, ${spacings[val]})`;
        const props = spacingProperties[type];
        
        if (Array.isArray(props)) {
          return `${props[0]}: ${cssVal}; ${props[1]}: ${cssVal};`;
        } else {
          return `${props}: ${cssVal};`;
        }
      }

      // Handle negative margins like -m-4 (Wait, the regex above doesn't capture leading -. 
      // We'll need a separate rule for negative values or modify regex).
      return null;
    }
  },
  // Negative Margins
  {
    pattern: /^-m(x|y|t|r|b|l)?-(.+)$/,
    generator: ({ match }) => {
      const axis = match[1] || '';
      const type = `m${axis}` as keyof typeof spacingProperties;
      const val = match[2];

      if (spacings[val] !== undefined && val !== 'auto') {
        const cssVal = `calc(var(--nui-space-${val}, ${spacings[val]}) * -1)`;
        const props = spacingProperties[type];
        
        if (Array.isArray(props)) {
          return `${props[0]}: ${cssVal}; ${props[1]}: ${cssVal};`;
        } else {
          return `${props}: ${cssVal};`;
        }
      }
      return null;
    }
  }
];
