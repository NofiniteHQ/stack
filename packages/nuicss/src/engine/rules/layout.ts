import { Rule } from '../types';
import { spacings } from '../tokens';

export const layoutRules: Rule[] = [
  // Container Queries
  { pattern: /^@container$/, generator: () => 'container-type: inline-size;' },
  { pattern: /^@container-normal$/, generator: () => 'container-type: normal;' },
  { pattern: /^@container-size$/, generator: () => 'container-type: size;' },

  // Display
  { pattern: /^block$/, generator: () => 'display: block;' },
  { pattern: /^inline-block$/, generator: () => 'display: inline-block;' },
  { pattern: /^inline$/, generator: () => 'display: inline;' },
  { pattern: /^flex$/, generator: () => 'display: flex;' },
  { pattern: /^inline-flex$/, generator: () => 'display: inline-flex;' },
  { pattern: /^grid$/, generator: () => 'display: grid;' },
  { pattern: /^hidden$/, generator: () => 'display: none;' },
  
  // Appearance
  { pattern: /^appearance-none$/, generator: () => 'appearance: none; -webkit-appearance: none;' },

  // Flexbox & Alignment
  { pattern: /^flex-row$/, generator: () => 'flex-direction: row;' },
  { pattern: /^flex-row-reverse$/, generator: () => 'flex-direction: row-reverse;' },
  { pattern: /^flex-col$/, generator: () => 'flex-direction: column;' },
  { pattern: /^flex-col-reverse$/, generator: () => 'flex-direction: column-reverse;' },
  { pattern: /^flex-wrap$/, generator: () => 'flex-wrap: wrap;' },
  { pattern: /^flex-nowrap$/, generator: () => 'flex-wrap: nowrap;' },
  
  { pattern: /^items-start$/, generator: () => 'align-items: flex-start;' },
  { pattern: /^items-center$/, generator: () => 'align-items: center;' },
  { pattern: /^items-end$/, generator: () => 'align-items: flex-end;' },
  { pattern: /^items-stretch$/, generator: () => 'align-items: stretch;' },
  
  { pattern: /^justify-start$/, generator: () => 'justify-content: flex-start;' },
  { pattern: /^justify-center$/, generator: () => 'justify-content: center;' },
  { pattern: /^justify-end$/, generator: () => 'justify-content: flex-end;' },
  { pattern: /^justify-between$/, generator: () => 'justify-content: space-between;' },

  { pattern: /^place-items-start$/, generator: () => 'place-items: start;' },
  { pattern: /^place-items-end$/, generator: () => 'place-items: end;' },
  { pattern: /^place-items-center$/, generator: () => 'place-items: center;' },
  { pattern: /^place-items-stretch$/, generator: () => 'place-items: stretch;' },
  
  { pattern: /^place-content-start$/, generator: () => 'place-content: start;' },
  { pattern: /^place-content-end$/, generator: () => 'place-content: end;' },
  { pattern: /^place-content-center$/, generator: () => 'place-content: center;' },
  { pattern: /^place-content-stretch$/, generator: () => 'place-content: stretch;' },
  { pattern: /^place-content-between$/, generator: () => 'place-content: space-between;' },
  
  { pattern: /^place-self-auto$/, generator: () => 'place-self: auto;' },
  { pattern: /^place-self-start$/, generator: () => 'place-self: start;' },
  { pattern: /^place-self-end$/, generator: () => 'place-self: end;' },
  { pattern: /^place-self-center$/, generator: () => 'place-self: center;' },
  { pattern: /^place-self-stretch$/, generator: () => 'place-self: stretch;' },

  // New Flex Utilities (Grow/Shrink)
  { pattern: /^flex-1$/, generator: () => 'flex: 1 1 0%;' },
  { pattern: /^flex-auto$/, generator: () => 'flex: 1 1 auto;' },
  { pattern: /^flex-none$/, generator: () => 'flex: none;' },
  { pattern: /^grow$/, generator: () => 'flex-grow: 1;' },
  { pattern: /^grow-0$/, generator: () => 'flex-grow: 0;' },
  { pattern: /^shrink$/, generator: () => 'flex-shrink: 1;' },
  { pattern: /^shrink-0$/, generator: () => 'flex-shrink: 0;' },

  // New Grid Utilities
  { pattern: /^grid-cols-(\d+)$/, generator: ({ match }) => `grid-template-columns: repeat(${match[1]}, minmax(0, 1fr));` },
  { pattern: /^grid-cols-subgrid$/, generator: () => 'grid-template-columns: subgrid;' },
  { pattern: /^col-span-(\d+)$/, generator: ({ match }) => `grid-column: span ${match[1]} / span ${match[1]};` },
  { pattern: /^grid-rows-(\d+)$/, generator: ({ match }) => `grid-template-rows: repeat(${match[1]}, minmax(0, 1fr));` },
  { pattern: /^grid-rows-subgrid$/, generator: () => 'grid-template-rows: subgrid;' },
  { pattern: /^row-span-(\d+)$/, generator: ({ match }) => `grid-row: span ${match[1]} / span ${match[1]};` },

  // Sizing (Width & Height)
  { pattern: /^w-(.+)$/, generator: ({ match }) => {
      const val = match[1];
      if (val === 'full') return 'width: 100%;';
      if (val === 'screen') return 'width: 100vw;';
      if (val.includes('/')) {
        const [n, d] = val.split('/');
        return `width: ${(Number(n) / Number(d)) * 100}%;`;
      }
      if (spacings[val]) {
         return val === 'auto' ? 'width: auto;' : `width: var(--nui-space-${val}, ${spacings[val]});`;
      }
      return null;
  }},
  { pattern: /^h-(.+)$/, generator: ({ match }) => {
      const val = match[1];
      if (val === 'full') return 'height: 100%;';
      if (val === 'screen') return 'height: 100vh;';
      if (val === 'dvh') return 'height: 100dvh;';
      if (val === 'svh') return 'height: 100svh;';
      if (val === 'lvh') return 'height: 100lvh;';
      if (val.includes('/')) {
        const [n, d] = val.split('/');
        return `height: ${(Number(n) / Number(d)) * 100}%;`;
      }
      if (spacings[val]) {
         return val === 'auto' ? 'height: auto;' : `height: var(--nui-space-${val}, ${spacings[val]});`;
      }
      return null;
  }},

  // New Sizing (Min/Max Width & Height)
  { pattern: /^max-w-xs$/, generator: () => 'max-width: 20rem;' },
  { pattern: /^max-w-sm$/, generator: () => 'max-width: 24rem;' },
  { pattern: /^max-w-md$/, generator: () => 'max-width: 28rem;' },
  { pattern: /^max-w-lg$/, generator: () => 'max-width: 32rem;' },
  { pattern: /^max-w-xl$/, generator: () => 'max-width: 36rem;' },
  { pattern: /^max-w-full$/, generator: () => 'max-width: 100%;' },
  { pattern: /^max-w-screen-([a-z2]+)$/, generator: ({ match }) => {
      return `max-width: var(--nui-screen-${match[1]}, 100%);`; 
  }},
  { pattern: /^min-w-full$/, generator: () => 'min-width: 100%;' },
  { pattern: /^min-h-screen$/, generator: () => 'min-height: 100vh;' },
  { pattern: /^min-h-dvh$/, generator: () => 'min-height: 100dvh;' },
  { pattern: /^min-h-svh$/, generator: () => 'min-height: 100svh;' },
  { pattern: /^min-h-lvh$/, generator: () => 'min-height: 100lvh;' },

  // New Positioning
  { pattern: /^relative$/, generator: () => 'position: relative;' },
  { pattern: /^absolute$/, generator: () => 'position: absolute;' },
  { pattern: /^fixed$/, generator: () => 'position: fixed;' },
  { pattern: /^sticky$/, generator: () => 'position: sticky;' },
  { pattern: /^-?(inset|inset-x|inset-y|top|right|bottom|left)-(.+)$/, generator: ({ match, className }) => {
    const isNegative = className.startsWith('-') || className.startsWith(':-') || className.includes(':-') || className.match(/(^|:)-nui-(inset|top|right|bottom|left)/);
    const propMap: Record<string, string> = {
      'inset': 'inset',
      'inset-x': 'left,right', // Not actual css prop, will expand below
      'inset-y': 'top,bottom',
      'top': 'top',
      'right': 'right',
      'bottom': 'bottom',
      'left': 'left',
    };
    
    let val = match[2];
    let cssVal = val;
    if (val === 'full') cssVal = '100%';
    else if (val.includes('/')) {
      const [n, d] = val.split('/');
      cssVal = `${(Number(n) / Number(d)) * 100}%`;
    } else {
      cssVal = `var(--nui-space-${val}, ${val === '0' ? '0px' : val + 'rem'})`;
    }
    
    const finalVal = `${isNegative ? '-' : ''}${cssVal}`;
    const mapped = propMap[match[1]];
    
    if (mapped === 'left,right') {
      return `left: ${finalVal}; right: ${finalVal};`;
    } else if (mapped === 'top,bottom') {
      return `top: ${finalVal}; bottom: ${finalVal};`;
    } else {
      return `${mapped}: ${finalVal};`;
    }
  }},
  { pattern: /^z-(.+)$/, generator: ({ match }) => {
      // already handled hide/auto etc in effects.ts, but standard numeric z-index here
      if (!isNaN(Number(match[1]))) return `z-index: ${match[1]};`;
      return null;
  }},

  // Overflow
  { pattern: /^overflow-(auto|hidden|visible|scroll)$/, generator: ({ match }) => `overflow: ${match[1]};` },
  { pattern: /^overflow-x-(auto|hidden|visible|scroll)$/, generator: ({ match }) => `overflow-x: ${match[1]};` },
  { pattern: /^overflow-y-(auto|hidden|visible|scroll)$/, generator: ({ match }) => `overflow-y: ${match[1]};` },

  // Scroll Snapping
  { pattern: /^snap-none$/, generator: () => 'scroll-snap-type: none;' },
  { pattern: /^snap-(x|y|both)$/, generator: ({ match }) => `scroll-snap-type: ${match[1]} var(--nui-scroll-snap-strictness, proximity);` },
  { pattern: /^snap-(mandatory|proximity)$/, generator: ({ match }) => `--nui-scroll-snap-strictness: ${match[1]};` },
  { pattern: /^snap-(start|end|center)$/, generator: ({ match }) => `scroll-snap-align: ${match[1]};` },
  { pattern: /^snap-align-none$/, generator: () => 'scroll-snap-align: none;' },
  { pattern: /^snap-(normal|always)$/, generator: ({ match }) => `scroll-snap-stop: ${match[1]};` },

  // Space Between
  { pattern: /^space-y-(.+)$/, selectorModifier: ' > :not([hidden]) ~ :not([hidden])', generator: ({ match }) => {
    const val = match[1];
    if (spacings[val]) {
      return `margin-top: calc(var(--nui-space-${val}, ${spacings[val]}) * calc(1 - var(--nui-space-y-reverse, 0))); margin-bottom: calc(var(--nui-space-${val}, ${spacings[val]}) * var(--nui-space-y-reverse, 0));`;
    }
    return null;
  }},
  { pattern: /^space-x-(.+)$/, selectorModifier: ' > :not([hidden]) ~ :not([hidden])', generator: ({ match }) => {
    const val = match[1];
    if (spacings[val]) {
      return `margin-left: calc(var(--nui-space-${val}, ${spacings[val]}) * calc(1 - var(--nui-space-x-reverse, 0))); margin-right: calc(var(--nui-space-${val}, ${spacings[val]}) * var(--nui-space-x-reverse, 0));`;
    }
    return null;
  }},
];
