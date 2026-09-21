const fs = require('fs');
const path = require('path');
const { rawShortcuts } = require('./dist/index.js');

function buildCustomData() {
  console.log('Generating VS Code & Cursor Custom Data for IntelliSense...');

  let componentsMeta = [];
  try {
    const metaFile = fs.readFileSync(
      path.resolve(__dirname, 'llms-components.json'),
      'utf8'
    );
    componentsMeta = JSON.parse(metaFile).components || [];
  } catch (err) {
    console.warn('Could not read llms-components.json:', err.message);
  }

  // Create lookup by class or baseClass
  const metaMap = new Map();
  for (const comp of componentsMeta) {
    if (comp.baseClass) metaMap.set(comp.baseClass, comp);
    if (Array.isArray(comp.variants)) {
      for (const v of comp.variants) metaMap.set(v, comp);
    }
    if (Array.isArray(comp.anatomy)) {
      for (const a of comp.anatomy) metaMap.set(a, comp);
    }
    if (Array.isArray(comp.superclasses)) {
      for (const s of comp.superclasses) metaMap.set(s, comp);
    }
  }

  const classValues = [];
  const seenClasses = new Set();

  // 1. Process all shortcuts
  if (Array.isArray(rawShortcuts)) {
    for (const [key, value] of rawShortcuts) {
      if (typeof key === 'string' && !seenClasses.has(key)) {
        seenClasses.add(key);

        const meta = metaMap.get(key);
        let description = '';

        if (meta) {
          description = `**NUICSS ${meta.name}** (${meta.category})\n\n${meta.description}`;
          if (meta.htmlSnippet) {
            description += `\n\n**Example:**\n\`\`\`html\n${meta.htmlSnippet}\n\`\`\``;
          }
          if (typeof value === 'string') {
            description += `\n\n**Expanded utilities:**\n\`${value}\``;
          }
        } else if (typeof value === 'string') {
          description = `**NUICSS Superclass**\n\nExpanded utilities:\n\`${value}\``;
        } else {
          description = `**NUICSS Superclass**`;
        }

        classValues.push({
          name: key,
          description: {
            kind: 'markdown',
            value: description,
          },
        });

        // Also add nui- prefix version
        const nuiPrefixed = `nui-${key}`;
        if (!seenClasses.has(nuiPrefixed)) {
          seenClasses.add(nuiPrefixed);
          classValues.push({
            name: nuiPrefixed,
            description: {
              kind: 'markdown',
              value: `**NUICSS Isolated Superclass** (alias for \`${key}\`)\n\n${description}`,
            },
          });
        }
      }
    }
  }

  // Sort class values alphabetically
  classValues.sort((a, b) => a.name.localeCompare(b.name));

  // Build HTML Custom Data JSON conforming to VS Code spec
  const htmlCustomData = {
    version: 1.1,
    globalAttributes: [
      {
        name: 'class',
        description: 'NUICSS Semantic Superclasses & Utilities',
        valueSet: 'nuicss-classes',
      },
      {
        name: 'className',
        description: 'NUICSS Semantic Superclasses & Utilities (JSX/TSX)',
        valueSet: 'nuicss-classes',
      },
    ],
    valueSets: [
      {
        name: 'nuicss-classes',
        values: classValues,
      },
    ],
  };

  // Build CSS Custom Data JSON
  // Extract CSS variables from theme.css
  const cssVariables = [];
  try {
    const themeCss = fs.readFileSync(
      path.resolve(__dirname, 'src/styles/theme.css'),
      'utf8'
    );
    const varRegex = /(--[\w-]+)\s*:\s*([^;]+);/g;
    const seenVars = new Set();
    let match;
    while ((match = varRegex.exec(themeCss)) !== null) {
      const varName = match[1];
      const val = match[2].trim();
      if (!seenVars.has(varName)) {
        seenVars.add(varName);
        cssVariables.push({
          name: varName,
          description: {
            kind: 'markdown',
            value: `**NUICSS Design Token**\n\nDefault value: \`${val}\``,
          },
        });
      }
    }
  } catch (err) {
    console.warn('Could not parse theme.css:', err.message);
  }

  const cssCustomData = {
    version: 1.1,
    properties: cssVariables,
    atDirectives: [
      {
        name: '@nuicss',
        description: {
          kind: 'markdown',
          value:
            'Injects NUICSS preflights, OKLCH design tokens, and utility classes into stylesheets.',
        },
      },
    ],
  };

  fs.writeFileSync(
    'dist/nuicss.html-data.json',
    JSON.stringify(htmlCustomData, null, 2),
    'utf8'
  );
  fs.writeFileSync(
    'dist/nuicss.css-data.json',
    JSON.stringify(cssCustomData, null, 2),
    'utf8'
  );

  console.log(
    `Generated dist/nuicss.html-data.json (${classValues.length} classes)`
  );
  console.log(
    `Generated dist/nuicss.css-data.json (${cssVariables.length} tokens)`
  );
}

module.exports = { buildCustomData };

if (require.main === module) {
  buildCustomData();
}
