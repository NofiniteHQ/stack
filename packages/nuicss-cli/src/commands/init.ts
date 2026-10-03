import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { bold, green, cyan } from 'colorette';
import { getHtmlData, getCssData } from '../embedded/index.js';

import * as jsonc from 'jsonc-parser';

const { parse, modify, applyEdits } = (jsonc as any).default || jsonc;

export interface InitOptions {
  cwd?: string;
}

function addToArrayIfMissing(
  jsonText: string,
  key: string,
  item: string
): string {
  const obj = parse(jsonText) || {};
  const currentArray = obj[key];
  if (Array.isArray(currentArray)) {
    if (currentArray.includes(item)) return jsonText;
    const edits = modify(jsonText, [key, currentArray.length], item, {
      isArrayInsertion: true,
      formattingOptions: { insertSpaces: true, tabSize: 2 },
    });
    return applyEdits(jsonText, edits);
  } else {
    const edits = modify(jsonText, [key], [item], {
      formattingOptions: { insertSpaces: true, tabSize: 2 },
    });
    return applyEdits(jsonText, edits);
  }
}

export async function initCommand(options: InitOptions = {}): Promise<void> {
  const cwd = path.resolve(options.cwd || process.cwd());

  console.log(`\n${bold(cyan('🚀 Initializing NUICSS project...'))}\n`);

  // 1. Create input.css if it doesn't exist
  const inputCssPath = path.join(cwd, 'input.css');
  if (!fs.existsSync(inputCssPath)) {
    const defaultInput = `@nuicss;

/* Add your project-specific overrides or custom components below */
`;
    fs.writeFileSync(inputCssPath, defaultInput, 'utf8');
    console.log(
      `  ${green('✓')} Created ${cyan('input.css')} with @nuicss; directive`
    );
  } else {
    console.log(`  ${cyan('ℹ')} ${cyan('input.css')} already exists.`);
  }

  // 2. Create nuicss.config.ts if no config exists
  const configTsPath = path.join(cwd, 'nuicss.config.ts');
  const configJsPath = path.join(cwd, 'nuicss.config.js');
  const configMjsPath = path.join(cwd, 'nuicss.config.mjs');

  if (
    !fs.existsSync(configTsPath) &&
    !fs.existsSync(configJsPath) &&
    !fs.existsSync(configMjsPath)
  ) {
    const defaultConfig = `import { defineConfig, nuicssPreset } from '@nofinite/nuicss';

export default defineConfig({
  presets: [
    nuicssPreset(),
  ],
});
`;
    fs.writeFileSync(configTsPath, defaultConfig, 'utf8');
    console.log(`  ${green('✓')} Created ${cyan('nuicss.config.ts')}`);
  } else {
    console.log(`  ${cyan('ℹ')} Configuration file already exists.`);
  }

  // 3. Setup .vscode directory and custom data files
  const vscodeDir = path.join(cwd, '.vscode');
  if (!fs.existsSync(vscodeDir)) {
    fs.mkdirSync(vscodeDir, { recursive: true });
  }

  const htmlDataPath = path.join(vscodeDir, 'nuicss.html-data.json');
  const htmlContent = getHtmlData();
  if (htmlContent) {
    fs.writeFileSync(htmlDataPath, htmlContent, 'utf8');
    console.log(
      `  ${green('✓')} Generated ${cyan(
        '.vscode/nuicss.html-data.json'
      )} (50+ superclasses autocomplete)`
    );
  }

  const cssDataPath = path.join(vscodeDir, 'nuicss.css-data.json');
  const cssContent = getCssData();
  if (cssContent) {
    fs.writeFileSync(cssDataPath, cssContent, 'utf8');
    console.log(
      `  ${green('✓')} Generated ${cyan(
        '.vscode/nuicss.css-data.json'
      )} (OKLCH design tokens autocomplete)`
    );
  }

  // 4. Update .vscode/settings.json non-destructively
  const settingsPath = path.join(vscodeDir, 'settings.json');
  let settingsText = '{\n}\n';

  if (fs.existsSync(settingsPath)) {
    settingsText = fs.readFileSync(settingsPath, 'utf8');
    // Save backup to protect user's configuration
    const bakPath = path.join(vscodeDir, 'settings.json.bak');
    fs.writeFileSync(bakPath, settingsText, 'utf8');
  }

  let updated = addToArrayIfMissing(
    settingsText,
    'html.customData',
    './.vscode/nuicss.html-data.json'
  );
  updated = addToArrayIfMissing(
    updated,
    'css.customData',
    './.vscode/nuicss.css-data.json'
  );

  fs.writeFileSync(settingsPath, updated, 'utf8');
  console.log(
    `  ${green('✓')} Configured ${cyan(
      '.vscode/settings.json'
    )} (Native VS Code & Cursor IntelliSense enabled)`
  );

  console.log(
    `\n${bold(green('🎉 NUICSS is ready!'))} Compile your stylesheet with:`
  );
  console.log(`   ${cyan('nuicss -i input.css -o dist/output.css --watch')}\n`);
}
