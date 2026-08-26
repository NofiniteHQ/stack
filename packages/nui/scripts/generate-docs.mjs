import fs from 'fs/promises';
import path from 'path';
import docgen from 'react-docgen-typescript';

const componentsDir = './src/components';
const docsDir = './docs/components';

async function generateDocs() {
  await fs.mkdir(docsDir, { recursive: true });
  
  const folders = await fs.readdir(componentsDir, { withFileTypes: true });
  
  const componentLinks = [];
  let llmsFullContent = `# NUI (@nofinite/nui) - Full AI Context\n\n`;
  llmsFullContent += `## Core Philosophy & Strict Styling\n- NEVER use absolute Tailwind colors like bg-white or text-blue-500.\n- ALWAYS use nuicss semantic tokens: bg-surface, text-default, border-subtle, bg-primary-subtle, text-danger, etc.\n- Ensure strict TypeScript, WAI-ARIA accessibility, and keyboard navigation.\n- Use focus-visible for focus rings: focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--nui-fg-default)]\n\n`;

  // We will collect all tsx files to parse at once for better performance
  const allFilesToParse = [];
  const folderMap = new Map();

  for (const folder of folders) {
    if (!folder.isDirectory()) continue;
    const compName = folder.name;
    const dirPath = path.join(componentsDir, compName);
    const subfiles = await fs.readdir(dirPath);
    
    const tsxFiles = subfiles.filter(f => f.endsWith('.tsx') && !f.includes('.test.') && !f.includes('.stories.'));
    if (tsxFiles.length === 0) continue;
    
    const filePaths = tsxFiles.map(f => path.join(dirPath, f));
    allFilesToParse.push(...filePaths);
    folderMap.set(compName, filePaths);
  }

  console.log(`Parsing ${allFilesToParse.length} files using react-docgen-typescript...`);

  // Configure parser to ignore node_modules props (like native HTML props) to avoid massive noise, 
  // unless we specifically want them. For LLMs, it's better to exclude standard HTML props and just mention it extends them.
  const options = {
    savePropValueAsString: true,
    shouldExtractLiteralValuesFromEnum: true,
    shouldExtractValuesFromUnion: true,
    propFilter: (prop) => {
      if (prop.declarations !== undefined && prop.declarations.length > 0) {
        // Exclude props that ONLY come from @types/react (node_modules)
        const isFromReact = prop.declarations.every(d => d.fileName.includes('node_modules'));
        return !isFromReact;
      }
      return true;
    },
  };

  const parsedDocs = docgen.parse(allFilesToParse, options);
  
  // Group parsed docs by folder
  for (const [compName, filePaths] of folderMap.entries()) {
    const compTitle = compName.charAt(0).toUpperCase() + compName.slice(1);
    
    // Normalize paths to match docgen output
    const folderDocs = parsedDocs.filter(d => 
      filePaths.some(fp => d.filePath.includes(fp.replace(/\\/g, '/')) || d.filePath.includes(fp))
    );
    
    if (folderDocs.length === 0) continue;

    let propsDefinitions = '';
    let exportedNames = folderDocs.map(d => d.displayName).filter(Boolean);
    if (exportedNames.length === 0) exportedNames.push(compTitle);
    
    // Deduplicate
    exportedNames = [...new Set(exportedNames)];

    for (const doc of folderDocs) {
      if (Object.keys(doc.props).length === 0) continue;
      
      propsDefinitions += `### \`${doc.displayName}\` Props\n\n`;
      propsDefinitions += `| Prop | Type | Default | Description |\n`;
      propsDefinitions += `| ---- | ---- | ------- | ----------- |\n`;
      
      for (const [propName, propDetails] of Object.entries(doc.props)) {
        let typeName = propDetails.type.name;
        if (typeName === 'enum' && propDetails.type.raw) {
          typeName = propDetails.type.raw;
        } else if (typeName === 'enum' && propDetails.type.value) {
          typeName = propDetails.type.value.map(v => v.value).join(' | ');
        }
        typeName = typeName.replace(/\\/g, '\\\\').replace(/\|/g, '\\|').replace(/\n/g, ' ');
        const defaultValue = propDetails.defaultValue ? String(propDetails.defaultValue.value).replace(/\n/g, ' ') : '-';
        const description = propDetails.description ? propDetails.description.replace(/\n/g, ' ') : '-';
        const required = propDetails.required ? '**Yes**' : 'No';
        
        propsDefinitions += `| \`${propName}\`${propDetails.required ? '*' : ''} | \`${typeName}\` | \`${defaultValue}\` | ${description} |\n`;
      }
      propsDefinitions += `\n`;
    }

    const mdContent = `# ${compTitle} (${compName})

## Import
\`\`\`tsx
import { ${exportedNames.join(', ')} } from '@nofinite/nui';
\`\`\`

## Architecture & Styling Rules
- **Semantic Tokens ONLY:** Use \`bg-surface\`, \`text-default\`, \`border-subtle\`, \`bg-primary-subtle\`, \`text-danger\`, etc. DO NOT USE raw tailwind colors (no \`bg-blue-500\`, no \`text-gray-900\`).
- **Accessibility:** Must adhere to strict WAI-ARIA standards. Ensure proper \`role\` and \`aria-*\` attributes.

## API / Props
${propsDefinitions || '*This component inherits standard HTML props or has no custom props documented.*'}
`;
    
    const docPath = path.join(docsDir, `${compName}.md`);
    await fs.writeFile(docPath, mdContent);
    
    componentLinks.push(`- [${compTitle}](docs/components/${compName}.md)`);
    llmsFullContent += `\n\n---\n\n${mdContent}`;
  }

  const llmsTxtContent = `# NUI (@nofinite/nui) AI Overview

## Strict Guidelines
1. **Semantic Styling**: NEVER use absolute colors (e.g. bg-white, text-blue-500, gray-900). ALWAYS use nuicss semantic tokens (e.g. bg-surface, text-default, border-subtle, bg-primary-subtle).
2. **TypeScript**: Strict typing required. Avoid 'any'.
3. **Accessibility**: Use appropriate ARIA roles, states, and keyboard support for all interactive elements.

## Component Documentation
${componentLinks.join('\n')}

For the complete context bundle, refer to \`llms-full.txt\`.
`;

  await fs.writeFile('llms.txt', llmsTxtContent);
  await fs.writeFile('llms-full.txt', llmsFullContent);
  
  console.log('Successfully generated world-class docs using react-docgen-typescript!');
}

generateDocs().catch(console.error);
