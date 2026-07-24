import postcss, { PluginCreator, Rule } from 'postcss';
import { loadConfig } from './config';
import { generateCSS, generateVariables } from '../engine/generator';
import fs from 'fs';
import { globSync } from 'glob';

const CLASS_REGEX = /[^<>"'`\s]+/g;

const plugin: PluginCreator<any> = (opts = {}) => {
  return {
    postcssPlugin: 'nuicss',
    async Once(root, { result }) {
      const config = await loadConfig();
      const contentFiles = config.content || ['src/**/*.{tsx,jsx,ts,js,vue,svelte,html}'];
      
      // Fast-glob is typically async, but globSync works for simplicity
      const files = globSync(contentFiles, { absolute: true });
      const classSet = new Set<string>();
      
      for (const file of files) {
        if (!fs.existsSync(file)) continue;
        const code = fs.readFileSync(file, 'utf-8');
        let match;
        while ((match = CLASS_REGEX.exec(code)) !== null) {
          classSet.add(match[0]);
        }
      }
      
      // We also need to scan the CSS file itself for `@apply` classes!
      root.walkAtRules('apply', (atRule) => {
        const classes = atRule.params.split(/\s+/);
        for (const cls of classes) {
          if (cls) classSet.add(cls);
        }
      });
      
      // Generate the raw CSS string for all found classes
      const rawCSS = generateCSS(Array.from(classSet), config);
      const generatedRoot = postcss.parse(rawCSS);
      
      const baseVars = generateVariables(config.theme);
      const baseRoot = postcss.parse(baseVars);
      
      // 1. Replace @nuicss base/utilities
      root.walkAtRules('nuicss', (atRule) => {
        if (atRule.params === 'utilities') {
           atRule.replaceWith(generatedRoot.clone());
        } else if (atRule.params === 'base') {
           atRule.replaceWith(baseRoot.clone());
        }
      });

      // 2. Process @apply
      root.walkAtRules('apply', (atRule) => {
         const classes = atRule.params.split(/\s+/).filter(Boolean);
         const applyCSS = generateCSS(classes, config);
         const applyRoot = postcss.parse(applyCSS);
         
         const parentRule = atRule.parent as Rule;
         if (!parentRule || parentRule.type !== 'rule') return;

         applyRoot.walkRules(rule => {
            let pseudo = '';
            // Match pseudo classes/elements, ignoring escaped colons (\:)
            const match = rule.selector.match(/(?<!\\)::?[a-zA-Z-]+/g);
            if (match) {
                pseudo = match.join(''); // e.g. ":hover"
            }
            
             if (pseudo) {
               // Create a new rule for the pseudo-class
               const newRule = new Rule({ selector: `${parentRule.selector}${pseudo}` });
               rule.walkDecls(decl => { newRule.append(decl.clone()); });
               parentRule.parent?.insertAfter(parentRule, newRule);
            } else {
               // Inline directly
               rule.walkDecls(decl => {
                 parentRule.insertBefore(atRule, decl.clone());
               });
            }
         });
         
         atRule.remove();
      });
    }
  };
};

plugin.postcss = true;
export default plugin;
