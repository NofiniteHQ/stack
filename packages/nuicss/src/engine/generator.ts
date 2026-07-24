import { breakpoints, colorsBg, colorsText, colorsBorder } from './tokens';
import { Rule } from './types';
import { layoutRules } from './rules/layout';
import { spacingRules } from './rules/spacing';
import { typographyRules } from './rules/typography';
import { colorsRules } from './rules/colors';
import { bordersRules } from './rules/borders';
import { effectsRules } from './rules/effects';
import { animationRules } from './rules/animations';

const allRules: Rule[] = [
  ...layoutRules,
  ...spacingRules,
  ...typographyRules,
  ...colorsRules,
  ...bordersRules,
  ...effectsRules,
  ...animationRules,
];

const breakpointMediaQueries: Record<string, string> = {};
for (const [bp, width] of Object.entries(breakpoints)) {
  breakpointMediaQueries[bp] = `@media (min-width: ${width})`;
}

export interface GeneratorOptions {
  prefix?: string;
  theme?: Record<string, any>;
  components?: Record<string, string[]>;
  rules?: Rule[];
}

export function generateVariables(themeOptions?: Record<string, any>): string {
  let vars = ':root {\n';
  
  const merge = (prefix: string, defaultTokens: Record<string, string>, userTokens?: Record<string, string>) => {
    const merged = { ...defaultTokens, ...userTokens };
    for (const [k, v] of Object.entries(merged)) {
      vars += `  --nui-${prefix}-${k}: ${v};\n`;
    }
  };

  merge('bg', colorsBg, themeOptions?.colorsBg);
  merge('fg', { default: colorsText.default, subtle: colorsText.subtle, muted: colorsText.muted, inverse: colorsText.inverse }, themeOptions?.colorsText);
  merge('color', { primary: colorsText.primary, danger: colorsText.danger, success: colorsText.success, warning: colorsText.warning, info: colorsText.info }, themeOptions?.colorsText);
  merge('border', colorsBorder, themeOptions?.colorsBorder);
  
  vars += '}\n\n/* NUI Base Reset */\n*, ::before, ::after { box-sizing: border-box; border-width: 0; border-style: solid; }\nhtml { line-height: 1.5; -webkit-text-size-adjust: 100%; tab-size: 4; }\nbody { margin: 0; line-height: inherit; }\nbutton, input, optgroup, select, textarea { font-family: inherit; font-size: 100%; font-weight: inherit; line-height: inherit; color: inherit; margin: 0; padding: 0; }\nbutton, select { text-transform: none; }\nbutton, [type="button"], [type="reset"], [type="submit"] { -webkit-appearance: button; background-color: transparent; background-image: none; cursor: pointer; }\na { color: inherit; text-decoration: inherit; }\n';
  return vars;
}

interface ParsedRule {
  bp: string;
  css: string;
  order: number;
}

/**
 * Generates raw CSS strings from a list of utility classes.
 * This is the core JIT compiler function for NUI CSS.
 * 
 * @param classes An array of raw class strings extracted from the DOM (e.g. ['md:flex', 'bg-primary'])
 * @param options Generator options including custom rules, prefix, and theme overrides
 * @returns A fully compiled CSS string ready for injection
 */
export function generateCSS(classes: string[], options: GeneratorOptions = {}): string {
  const { prefix = '' } = options;
  // Deduplicate classes to optimize compilation speed
  const uniqueClasses = Array.from(new Set(classes));

  const parsedRules: ParsedRule[] = [];
  const globalKeyframes = new Set<string>();

  for (const cls of uniqueClasses) {
    let bpPrefix = 'base';
    let pseudoClass = '';
    let isDark = false;
    
    const parts: string[] = [];
    let currentPart = '';
    let depth = 0;
    for (let i = 0; i < cls.length; i++) {
      const c = cls[i];
      if (c === '[') depth++;
      else if (c === ']') depth--;
      
      if (c === ':' && depth === 0) {
        parts.push(currentPart);
        currentPart = '';
      } else {
        currentPart += c;
      }
    }
    parts.push(currentPart);

    let coreClass = parts.pop() || '';
    let isImportant = false;

    // Strip !important modifier from the core class if present
    if (coreClass.startsWith('!')) {
      isImportant = true;
      coreClass = coreClass.slice(1);
    }

    let groupHasSelector = '';
    let peerHasSelector = '';

    // Phase 1: Parse pseudo-classes, modifiers, and breakpoints from the parts array
    // E.g., 'md:hover:bg-primary' -> parts = ['md', 'hover']
    for (const part of parts) {
      if (breakpoints[part]) {
        bpPrefix = part;
      } else if (part.startsWith('@') && breakpoints[part.slice(1)]) {
        bpPrefix = part; // e.g. @sm
      } else if (part === 'dark') {
        isDark = true;
      } else if (part.startsWith('has-[')) {
        pseudoClass += `:has(${part.slice(5, -1).replace(/_/g, ' ')})`;
      } else if (part.startsWith('group-has-[')) {
        groupHasSelector = `:has(${part.slice(11, -1).replace(/_/g, ' ')})`;
      } else if (part.startsWith('peer-has-[')) {
        peerHasSelector = `:has(${part.slice(10, -1).replace(/_/g, ' ')})`;
      } else if (part.startsWith('data-[')) {
        const dataMatch = part.match(/^data-\[([^=]+)(?:=([^\]]+))?\]$/);
        if (dataMatch) {
            pseudoClass += `[data-${dataMatch[1]}${dataMatch[2] ? `="${dataMatch[2].replace(/"/g, '\\"')}"` : ''}]`;
        } else {
            pseudoClass += `[${part.slice(1, -1)}]`;
        }
      } else if (part.startsWith('aria-[')) {
        const ariaMatch = part.match(/^aria-\[([^=]+)(?:=([^\]]+))?\]$/);
        if (ariaMatch) {
            pseudoClass += `[aria-${ariaMatch[1]}${ariaMatch[2] ? `="${ariaMatch[2].replace(/"/g, '\\"')}"` : ''}]`;
        }
      } else if (part === 'open') {
        pseudoClass += `[open]`;
      } else {
        if (part === 'selection' || part === 'before' || part === 'after' || part === 'placeholder' || part === 'backdrop' || part === 'marker') {
          pseudoClass += `::${part}`;
        } else {
          pseudoClass += `:${part}`;
        }
      }
    }

    let searchClass = coreClass;
    let isNegativePrefix = false;

    if (prefix) {
      if (coreClass.startsWith(`-${prefix}`)) {
        searchClass = coreClass.slice(prefix.length + 1);
        isNegativePrefix = true;
      } else if (coreClass.startsWith(prefix)) {
        searchClass = coreClass.slice(prefix.length);
      } else {
        continue;
      }
    } else {
      if (coreClass.startsWith('-')) {
        searchClass = coreClass.slice(1);
        isNegativePrefix = true;
      }
    }

    let cssContent = null;
    let componentExpansion = null;
    let ruleOrder = 999;

    // Check if it's a component
    const defaultComponentsMap: Record<string, string[]> = {
      'btn': ['inline-flex', 'items-center', 'justify-center', 'px-4', 'py-2', 'rounded-md', 'font-medium', 'transition-colors', 'border', 'border-transparent', 'no-underline'],
      'btn-primary': ['inline-flex', 'items-center', 'justify-center', 'px-4', 'py-2', 'rounded-md', 'font-medium', 'transition-colors', 'bg-primary', 'text-inverse', 'hover:opacity-90', 'focus:ring', 'focus:ring-primary', 'border', 'border-transparent', 'no-underline'],
      'btn-lg': ['px-6', 'py-3', 'text-lg'],
      'card': ['bg-surface', 'rounded-lg', 'shadow-md', 'border', 'border-default', 'overflow-hidden'],
      'input': ['flex', 'w-full', 'rounded-md', 'border', 'border-default', 'bg-transparent', 'px-3', 'py-2', 'text-sm', 'shadow-sm', 'transition-colors', 'focus:outline-none', 'focus:ring-1', 'focus:ring-primary', 'placeholder-transparent'],
      'badge': ['inline-flex', 'items-center', 'rounded-full', 'px-2-5', 'py-0-5', 'text-xs', 'font-semibold', 'transition-colors'],
    };

    const componentsMap = { ...defaultComponentsMap, ...options.components };

    if (componentsMap[searchClass]) {
      componentExpansion = componentsMap[searchClass];
      ruleOrder = 0; // Components first
    } else {
      // Phase 2: Attempt to parse arbitrary values (e.g. w-[300px])
      // We extract the property prefix and the raw value inside the brackets
      const arbitraryMatch = searchClass.match(/^(-?[a-z-]+)-\[(.+)\](?:\/(\d+))?$/);
      if (arbitraryMatch) {
        let propPrefix = arbitraryMatch[1];
        if (isNegativePrefix && !propPrefix.startsWith('-')) {
           propPrefix = '-' + propPrefix;
        }
        const val = arbitraryMatch[2].replace(/_/g, ' '); 
        const opacity = arbitraryMatch[3];
        
        // Property map maps NUI prefixes to standard CSS properties
        const propMap: Record<string, string> = {
          'w': 'width', 'h': 'height',
          'min-w': 'min-width', 'min-h': 'min-height',
          'max-w': 'max-width', 'max-h': 'max-height',
          'm': 'margin', 'mt': 'margin-top', 'mr': 'margin-right', 'mb': 'margin-bottom', 'ml': 'margin-left',
          'p': 'padding', 'pt': 'padding-top', 'pr': 'padding-right', 'pb': 'padding-bottom', 'pl': 'padding-left',
          'gap': 'gap', 'gap-x': 'column-gap', 'gap-y': 'row-gap',
          'bg': 'background-color', 'text': 'color', 'border': 'border-color',
          'rounded': 'border-radius', 'z': 'z-index', 'opacity': 'opacity',
          'top': 'top', 'right': 'right', 'bottom': 'bottom', 'left': 'left',
          'translate-x': 'transform', 'translate-y': 'transform',
          'scale': 'transform', 'scale-x': 'transform', 'scale-y': 'transform',
          'tracking': 'letter-spacing', 'leading': 'line-height',
          'grid-cols': 'grid-template-columns', 'grid-rows': 'grid-template-rows',
          'basis': 'flex-basis', 'flex': 'flex', 'aspect': 'aspect-ratio',
          'stroke': 'stroke', 'fill': 'fill', 'shadow': 'box-shadow'
        };
        
        let realPrefix = propPrefix;
        let isArbitraryNegative = false;
        if (propPrefix.startsWith('-')) {
          realPrefix = propPrefix.slice(1);
          isArbitraryNegative = true;
        }

        if (propMap[realPrefix]) {
          let cssVal = isArbitraryNegative ? (val.startsWith('-') ? val.slice(1) : `-${val}`) : val;
          let property = propMap[realPrefix];
          
          if (realPrefix === 'text') {
            const isColor = /^(#|var\(|rgb|hsl|transparent|currentColor)/.test(cssVal);
            if (!isColor) property = 'font-size';
          }
          
          if (opacity && (realPrefix === 'bg' || (realPrefix === 'text' && property === 'color') || realPrefix === 'border')) {
             cssVal = `color-mix(in srgb, ${cssVal} ${opacity}%, transparent)`;
          }
          if (realPrefix.startsWith('translate')) {
            cssContent = `transform: ${realPrefix.replace('translate-', 'translate').replace('x', 'X').replace('y', 'Y')}(${cssVal});`;
          } else if (realPrefix.startsWith('scale')) {
            const scaleFn = realPrefix === 'scale-x' ? 'scaleX' : realPrefix === 'scale-y' ? 'scaleY' : 'scale';
            cssContent = `transform: ${scaleFn}(${cssVal});`;
          } else {
            cssContent = `${property}: ${cssVal};`;
          }
          ruleOrder = 1000;
        }
      }

      // Phase 3: Evaluate against regex pattern rules
      if (!cssContent) {
        const matchClass = (isNegativePrefix ? '-' : '') + searchClass;
        // Merge user custom rules at the top priority so they can override core rules
        const combinedRules = options.rules ? [...options.rules, ...allRules] : allRules;
        for (let i = 0; i < combinedRules.length; i++) {
          const rule = combinedRules[i];
          const match = rule.pattern.exec(matchClass);
          if (match) {
            cssContent = rule.generator({ match, className: matchClass, theme: options.theme });
            if (cssContent) {
              ruleOrder = i + 1; // Preserve the order based on the rules array
              break;
            }
          }
        }
      }
    }

    let baseSelector = cls.replace(/([:./\[\]#%()!=\\"@,])/g, '\\$1');
    
    // Support peer and group selectors
    if (pseudoClass.includes(':peer-')) {
      const match = pseudoClass.match(/:peer-([a-z-]+)/);
      if (match) {
        baseSelector = `.peer:${match[1]} ~ .${baseSelector}`;
        pseudoClass = pseudoClass.replace(match[0], '');
      }
    } else if (peerHasSelector) {
      baseSelector = `.peer${peerHasSelector} ~ .${baseSelector}`;
    }

    if (pseudoClass.includes(':group-')) {
      const match = pseudoClass.match(/:group-([a-z-]+)/);
      if (match) {
        baseSelector = `.group:${match[1]} .${baseSelector}`;
        pseudoClass = pseudoClass.replace(match[0], '');
      }
    } else if (groupHasSelector) {
      baseSelector = `.group${groupHasSelector} .${baseSelector}`;
    }
    
    if (!baseSelector.includes(' ~ ') && !baseSelector.includes(' .')) {
      baseSelector = `.${baseSelector}`;
    }

    if (isDark) {
      baseSelector = `.dark ${baseSelector}`;
    }

    const extractAndAppend = (selector: string, content: string, order: number) => {
       let body = content;
       if (isImportant) {
          body = body.replace(/;/g, ' !important;');
       }
       const kfIndex = body.indexOf('@keyframes');
       if (kfIndex !== -1) {
          globalKeyframes.add(body.slice(kfIndex));
          body = body.slice(0, kfIndex).trim();
       }
       if (body) {
          parsedRules.push({ bp: bpPrefix, css: `${selector} { ${body} }`, order });
       }
    };

    if (componentExpansion) {
      const componentStyles: Record<string, string[]> = { '': [] };
      for (const util of componentExpansion) {
        let utilPseudo = '';
        let utilCore = util;
        if (util.includes(':')) {
          const parts = util.split(':');
          utilCore = parts.pop() || '';
          utilPseudo = `:${parts.join(':')}`;
        }
        for (const rule of options.rules ? [...options.rules, ...allRules] : allRules) {
          const match = rule.pattern.exec(utilCore);
          if (match) {
            const content = rule.generator({ match, className: utilCore, theme: options.theme });
            if (content) {
              if (!componentStyles[utilPseudo]) componentStyles[utilPseudo] = [];
              componentStyles[utilPseudo].push(content + (rule.selectorModifier ? ` /* modifier not supported in components */` : ''));
              break;
            }
          }
        }
      }
      for (const [pseudo, styles] of Object.entries(componentStyles)) {
        if (styles.length > 0) {
          extractAndAppend(`${baseSelector}${pseudoClass}${pseudo}`, styles.join(' '), ruleOrder);
        }
      }
    } else if (cssContent) {
      // we don't have selector modifier easily accessible here because we optimized the loop, but let's parse it if needed
      let mod = '';
      if (!isImportant) {
        const combinedRules = options.rules ? [...options.rules, ...allRules] : allRules;
        for (const r of combinedRules) if (r.pattern.exec((isNegativePrefix ? '-' : '') + searchClass) && r.selectorModifier) mod = r.selectorModifier;
      }
      extractAndAppend(`${baseSelector}${pseudoClass}${mod}`, cssContent, ruleOrder);
    }
  }

  // Sort rules
  parsedRules.sort((a, b) => a.order - b.order);

  const generated: Record<string, string[]> = { base: [] };
  for (const bp of Object.keys(breakpoints)) generated[bp] = [];

  for (const rule of parsedRules) {
     if (!generated[rule.bp]) generated[rule.bp] = [];
     generated[rule.bp].push(rule.css);
  }

  let finalCSS = generated.base ? generated.base.join('\n') : '';

  for (const bp of Object.keys(breakpoints)) {
    if (generated[bp] && generated[bp].length > 0) {
      finalCSS += `\n${breakpointMediaQueries[bp]} {\n  ${generated[bp].join('\n  ')}\n}`;
    }
    const containerBp = '@' + bp;
    if (generated[containerBp] && generated[containerBp].length > 0) {
      finalCSS += `\n@container (min-width: ${breakpoints[bp]}) {\n  ${generated[containerBp].join('\n  ')}\n}`;
    }
  }
  
  if (globalKeyframes.size > 0) {
     finalCSS += `\n${Array.from(globalKeyframes).join('\n')}`;
  }

  return finalCSS;
}
