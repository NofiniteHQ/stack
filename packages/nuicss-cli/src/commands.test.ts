import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { resolve } from 'node:path';
import { tokensCommand } from './commands/tokens.js';
import { checkCommand } from './commands/check.js';
import { compileCommand, isPathInside } from './commands/compile.js';
import { initCommand } from './commands/init.js';
import { listCommand } from './commands/list.js';
import { addCommand } from './commands/add.js';
import { migrateCommand } from './commands/migrate.js';
import { upgradeCommand } from './commands/upgrade.js';
import { runCli } from './index.js';

const cliBin = resolve(__dirname, '../bin/nuicss.js');
const tempBase = resolve(__dirname, '../../../temp');

function runCliCmd(
  cmdArgs: string,
  cwd = process.cwd()
): { stdout: string; stderr: string; status: number } {
  try {
    const stdout = execSync(`node "${cliBin}" ${cmdArgs}`, {
      cwd,
      encoding: 'utf8',
      stdio: 'pipe',
    });
    return { stdout, stderr: '', status: 0 };
  } catch (err: any) {
    return {
      stdout: err.stdout?.toString() || '',
      stderr: err.stderr?.toString() || '',
      status: err.status ?? 1,
    };
  }
}

describe('NUICSS CLI Commands Integration Suite', () => {
  const originalExitCode = process.exitCode;

  beforeEach(() => {
    process.exitCode = undefined;
  });

  afterEach(() => {
    process.exitCode = originalExitCode;
  });

  describe('tokens command', () => {
    it('outputs design tokens and superclasses in console mode', async () => {
      const logs: string[] = [];
      const origLog = console.log;
      console.log = (...args: any[]) => logs.push(args.join(' '));

      try {
        await tokensCommand({ json: false });
        const output = logs.join('\n');

        // Brand Blue / Primary
        expect(output).toContain('--color-primary');
        expect(output).toMatch(/Brand (?:core|Blue)/i);

        // Slate neutral / Secondary
        expect(output).toContain('--color-secondary');
        expect(output).toMatch(/Slate neutral/i);

        // Surfaces
        expect(output).toContain('--bg-surface');
        expect(output).toContain('--bg-overlay');

        // Spacing
        expect(output).toContain('--spacing');

        // Superclasses
        expect(output).toContain('.btn');
        expect(output).toContain('.card');
        expect(output).toContain('.badge');
        expect(output).toContain('.table-container');
      } finally {
        console.log = origLog;
      }
    });

    it('outputs structured JSON containing design tokens and superclasses in JSON mode', async () => {
      const logs: string[] = [];
      const origLog = console.log;
      console.log = (...args: any[]) => logs.push(args.join(' '));

      try {
        await tokensCommand({ json: true });
        const jsonStr = logs.join('\n');
        const parsed = JSON.parse(jsonStr);

        expect(parsed).toHaveProperty('tokens');
        expect(parsed).toHaveProperty('superclasses');
        expect(Array.isArray(parsed.tokens)).toBe(true);
        expect(Array.isArray(parsed.superclasses)).toBe(true);

        const tokenVars = parsed.tokens.map((t: any) => t.variable);
        expect(tokenVars).toContain('--color-primary');
        expect(tokenVars).toContain('--color-secondary');
        expect(tokenVars).toContain('--bg-surface');
        expect(tokenVars).toContain('--bg-overlay');
        expect(tokenVars).toContain('--spacing');

        expect(parsed.superclasses).toContain('btn');
        expect(parsed.superclasses).toContain('card');
        expect(parsed.superclasses).toContain('badge');
      } finally {
        console.log = origLog;
      }
    });

    it('executes nuicss tokens --json via CLI child_process cleanly', () => {
      const res = runCliCmd('tokens --json');
      expect(res.status).toBe(0);
      const parsed = JSON.parse(res.stdout);
      expect(
        parsed.tokens.some((t: any) => t.variable === '--color-primary')
      ).toBe(true);
      expect(parsed.tokens.some((t: any) => t.variable === '--spacing')).toBe(
        true
      );
    });

    it('executes nuicss tokens via CLI child_process in standard mode', () => {
      const res = runCliCmd('tokens');
      expect(res.status).toBe(0);
      expect(res.stdout).toContain('NUICSS Design System Tokens');
      expect(res.stdout).toContain('--color-primary');
      expect(res.stdout).toContain('--spacing');
    });
  });

  describe('check command (Token Validation & Superclasses)', () => {
    const testDir = path.join(tempBase, 'cli-test-check');

    beforeEach(() => {
      if (fs.existsSync(testDir)) {
        fs.rmSync(testDir, { recursive: true, force: true });
      }
      fs.mkdirSync(testDir, { recursive: true });
    });

    afterEach(() => {
      if (fs.existsSync(testDir)) {
        fs.rmSync(testDir, { recursive: true, force: true });
      }
    });

    it('accepts compliant files using valid NUICSS tokens and superclasses', async () => {
      const validCssPath = path.join(testDir, 'valid.css');
      const validCss = `
.card-metric {
  background-color: var(--bg-surface);
  color: var(--color-primary);
  border: 1px solid var(--border-default);
  padding: var(--spacing);
}
`;
      fs.writeFileSync(validCssPath, validCss, 'utf8');

      const logs: string[] = [];
      const origLog = console.log;
      console.log = (...args: any[]) => logs.push(args.join(' '));

      try {
        await checkCommand(validCssPath, { cwd: testDir });
        expect(process.exitCode).toBeFalsy();
        const combined = logs.join('\n');
        expect(combined).toContain('adhere to NUICSS design system tokens');
      } finally {
        console.log = origLog;
      }
    });

    it('detects deprecated tokens in CSS files and provides semantic replacements', async () => {
      const deprecatedCssPath = path.join(testDir, 'deprecated.css');
      const deprecatedCss = `
.box {
  color: var(--color-brand);
  background: var(--nui-primary);
  border-color: var(--border-color);
}
`;
      fs.writeFileSync(deprecatedCssPath, deprecatedCss, 'utf8');

      const logs: string[] = [];
      const origLog = console.log;
      console.log = (...args: any[]) => logs.push(args.join(' '));

      try {
        await checkCommand(deprecatedCssPath, { cwd: testDir });
        expect(process.exitCode).toBe(1);
        const combined = logs.join('\n');
        expect(combined).toContain('[deprecated-token]');
        expect(combined).toContain('--color-brand');
        expect(combined).toContain('--nui-primary');
        expect(combined).toContain('var(--color-primary)');
      } finally {
        console.log = origLog;
      }
    });

    it('detects unknown tokens in CSS snippets', async () => {
      const unknownCssPath = path.join(testDir, 'unknown.css');
      const unknownCss = `
.widget {
  color: var(--unknown-token);
}
`;
      fs.writeFileSync(unknownCssPath, unknownCss, 'utf8');

      const logs: string[] = [];
      const origLog = console.log;
      console.log = (...args: any[]) => logs.push(args.join(' '));

      try {
        await checkCommand(unknownCssPath, { cwd: testDir });
        expect(process.exitCode).toBe(1);
        const combined = logs.join('\n');
        expect(combined).toContain('[unknown-token]');
        expect(combined).toContain('--unknown-token');
      } finally {
        console.log = origLog;
      }
    });

    it('detects hardcoded hex colors in HTML and CSS templates', async () => {
      const hexHtmlPath = path.join(testDir, 'hex.html');
      const hexHtml = `<div class="bg-[#123456] text-[#ff0000]">Hardcoded</div>`;
      fs.writeFileSync(hexHtmlPath, hexHtml, 'utf8');

      const logs: string[] = [];
      const origLog = console.log;
      console.log = (...args: any[]) => logs.push(args.join(' '));

      try {
        await checkCommand(hexHtmlPath, { cwd: testDir });
        expect(process.exitCode).toBe(1);
        const combined = logs.join('\n');
        expect(combined).toContain('[no-hardcoded-hex]');
      } finally {
        console.log = origLog;
      }
    });

    it('detects legacy utility clusters and suggests NUICSS superclasses', async () => {
      const soupHtmlPath = path.join(testDir, 'soup.html');
      const soupHtml = `<button class="items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Submit</button>`;
      fs.writeFileSync(soupHtmlPath, soupHtml, 'utf8');

      const logs: string[] = [];
      const origLog = console.log;
      console.log = (...args: any[]) => logs.push(args.join(' '));

      try {
        await checkCommand(soupHtmlPath, { cwd: testDir });
        expect(process.exitCode).toBe(1);
        const combined = logs.join('\n');
        expect(combined).toContain('[prefer-nuicss-superclass]');
      } finally {
        console.log = origLog;
      }
    });

    it('handles non-existent target path safely with error reporting', async () => {
      const errLogs: string[] = [];
      const origErr = console.error;
      console.error = (...args: any[]) => errLogs.push(args.join(' '));

      try {
        await checkCommand('does-not-exist.html', { cwd: testDir });
        expect(process.exitCode).toBe(1);
        expect(errLogs.join('\n')).toContain('Path not found');
      } finally {
        console.error = origErr;
      }
    });

    it('executes nuicss check via CLI child_process detecting violations', () => {
      const badFile = path.join(testDir, 'bad.html');
      fs.writeFileSync(badFile, `<div class="bg-[#333333]">Test</div>`, 'utf8');

      const res = runCliCmd(`check bad.html`, testDir);
      expect(res.status).toBe(1);
      expect(res.stdout).toContain('no-hardcoded-hex');
    });
  });

  describe('compile command', () => {
    const testDir = path.join(tempBase, 'cli-test-compile');

    beforeEach(() => {
      if (fs.existsSync(testDir)) {
        fs.rmSync(testDir, { recursive: true, force: true });
      }
      fs.mkdirSync(testDir, { recursive: true });
    });

    afterEach(() => {
      if (fs.existsSync(testDir)) {
        fs.rmSync(testDir, { recursive: true, force: true });
      }
    });

    it('compiles sample HTML templates into output CSS file', async () => {
      const htmlPath = path.join(testDir, 'index.html');
      fs.writeFileSync(
        htmlPath,
        `
<div class="card p-4">
  <button class="btn btn-primary">Save Changes</button>
  <span class="badge badge-success">Online</span>
</div>
`,
        'utf8'
      );

      const outCss = path.join(testDir, 'dist/output.css');
      await compileCommand(['index.html'], {
        cwd: testDir,
        output: 'dist/output.css',
      });

      expect(fs.existsSync(outCss)).toBe(true);
      const generated = fs.readFileSync(outCss, 'utf8');
      expect(generated).toContain('.btn');
      expect(generated).toContain('.btn-primary');
      expect(generated).toContain('.card');
      expect(generated).toContain('.badge');
      expect(generated).toContain('.badge-success');
    });

    it('compiles with minification enabled, producing compact CSS', async () => {
      const htmlPath = path.join(testDir, 'index.html');
      fs.writeFileSync(
        htmlPath,
        `<button class="btn btn-primary">Minify Me</button>`,
        'utf8'
      );

      const standardOut = path.join(testDir, 'dist/standard.css');
      await compileCommand(['index.html'], {
        cwd: testDir,
        output: 'dist/standard.css',
        minify: false,
      });

      const minifiedOut = path.join(testDir, 'dist/minified.css');
      await compileCommand(['index.html'], {
        cwd: testDir,
        output: 'dist/minified.css',
        minify: true,
      });

      expect(fs.existsSync(minifiedOut)).toBe(true);
      const minCss = fs.readFileSync(minifiedOut, 'utf8');
      const standardCss = fs.readFileSync(standardOut, 'utf8');

      expect(minCss.length).toBeLessThan(standardCss.length);
      expect(minCss).not.toContain('\n\n');
      expect(minCss).toContain('.btn-primary');
    });

    it('streams generated CSS directly to stdout when output is -', () => {
      const htmlPath = path.join(testDir, 'stdout.html');
      fs.writeFileSync(
        htmlPath,
        `<div class="btn btn-secondary">Streamed</div>`,
        'utf8'
      );

      const res = runCliCmd(`compile stdout.html -o -`, testDir);
      expect(res.status).toBe(0);
      expect(res.stdout).toContain('.btn-secondary');
      expect(fs.existsSync(path.join(testDir, 'dist/output.css'))).toBe(false);
    });

    it('expands custom input.css with @nuicss directives', async () => {
      const inputCssPath = path.join(testDir, 'input.css');
      fs.writeFileSync(
        inputCssPath,
        `
@nuicss tokens;

.custom-brand {
  color: var(--color-primary);
}
`,
        'utf8'
      );

      const outCss = path.join(testDir, 'dist/custom.css');
      await compileCommand([], {
        cwd: testDir,
        input: 'input.css',
        output: 'dist/custom.css',
      });

      expect(fs.existsSync(outCss)).toBe(true);
      const generated = fs.readFileSync(outCss, 'utf8');
      expect(generated).toContain('--color-primary');
      expect(generated).toContain('.custom-brand');
    });
  });

  describe('init command (Scaffolding)', () => {
    const testDir = path.join(tempBase, 'cli-test-init');

    beforeEach(() => {
      if (fs.existsSync(testDir)) {
        fs.rmSync(testDir, { recursive: true, force: true });
      }
      fs.mkdirSync(testDir, { recursive: true });
    });

    afterEach(() => {
      if (fs.existsSync(testDir)) {
        fs.rmSync(testDir, { recursive: true, force: true });
      }
    });

    it('scaffolds complete configuration and IDE custom data in empty directory', async () => {
      await initCommand({ cwd: testDir });

      // 1. input.css
      const inputCss = path.join(testDir, 'input.css');
      expect(fs.existsSync(inputCss)).toBe(true);
      expect(fs.readFileSync(inputCss, 'utf8')).toContain('@nuicss;');

      // 2. nuicss.config.ts
      const configTs = path.join(testDir, 'nuicss.config.ts');
      expect(fs.existsSync(configTs)).toBe(true);
      expect(fs.readFileSync(configTs, 'utf8')).toContain('nuicssPreset()');

      // 3. .vscode/nuicss.html-data.json and css-data.json
      const htmlData = path.join(testDir, '.vscode/nuicss.html-data.json');
      const cssData = path.join(testDir, '.vscode/nuicss.css-data.json');
      expect(fs.existsSync(htmlData)).toBe(true);
      expect(fs.existsSync(cssData)).toBe(true);

      // 4. .vscode/settings.json
      const settingsJson = path.join(testDir, '.vscode/settings.json');
      expect(fs.existsSync(settingsJson)).toBe(true);
      const settingsContent = fs.readFileSync(settingsJson, 'utf8');
      expect(settingsContent).toContain('html.customData');
      expect(settingsContent).toContain('css.customData');
    });

    it('preserves existing settings and creates backup on re-initialization', async () => {
      // First run
      await initCommand({ cwd: testDir });

      // Mutate settings with custom user config
      const settingsPath = path.join(testDir, '.vscode/settings.json');
      const userSettings = {
        'editor.fontSize': 14,
        'html.customData': ['./.vscode/nuicss.html-data.json'],
        'css.customData': ['./.vscode/nuicss.css-data.json'],
      };
      fs.writeFileSync(
        settingsPath,
        JSON.stringify(userSettings, null, 2),
        'utf8'
      );

      // Second run
      await initCommand({ cwd: testDir });

      // Assert backup exists
      const backupPath = path.join(testDir, '.vscode/settings.json.bak');
      expect(fs.existsSync(backupPath)).toBe(true);
      expect(fs.readFileSync(backupPath, 'utf8')).toContain(
        '"editor.fontSize": 14'
      );

      // Assert existing input.css and config were not wiped
      expect(fs.existsSync(path.join(testDir, 'input.css'))).toBe(true);
    });

    it('executes nuicss init via CLI child_process cleanly', () => {
      const res = runCliCmd('init', testDir);
      expect(res.status).toBe(0);
      expect(res.stdout).toContain('Initializing NUICSS project');
      expect(fs.existsSync(path.join(testDir, 'input.css'))).toBe(true);
      expect(fs.existsSync(path.join(testDir, 'nuicss.config.ts'))).toBe(true);
    });
  });

  describe('Path Traversal & Boundary Safety', () => {
    const testDir = path.join(tempBase, 'cli-test-boundary');
    const outsideDir = path.join(tempBase, 'cli-test-outside');

    beforeEach(() => {
      if (fs.existsSync(testDir)) {
        fs.rmSync(testDir, { recursive: true, force: true });
      }
      if (fs.existsSync(outsideDir)) {
        fs.rmSync(outsideDir, { recursive: true, force: true });
      }
      fs.mkdirSync(testDir, { recursive: true });
      fs.mkdirSync(outsideDir, { recursive: true });
    });

    afterEach(() => {
      if (fs.existsSync(testDir)) {
        fs.rmSync(testDir, { recursive: true, force: true });
      }
      if (fs.existsSync(outsideDir)) {
        fs.rmSync(outsideDir, { recursive: true, force: true });
      }
    });

    it('rejects relative traversal in --output (../../outside.css) and does not write file', async () => {
      const outsideTarget = path.resolve(testDir, '../../outside.css');
      if (fs.existsSync(outsideTarget)) fs.unlinkSync(outsideTarget);

      await compileCommand([], {
        cwd: testDir,
        output: '../../outside.css',
      });

      expect(process.exitCode).toBe(1);
      expect(fs.existsSync(outsideTarget)).toBe(false);
    });

    it('rejects deeper relative traversal in --output (../../../outside.css)', async () => {
      const outsideTarget = path.resolve(testDir, '../../../outside.css');
      if (fs.existsSync(outsideTarget)) fs.unlinkSync(outsideTarget);

      await compileCommand([], {
        cwd: testDir,
        output: '../../../outside.css',
      });

      expect(process.exitCode).toBe(1);
      expect(fs.existsSync(outsideTarget)).toBe(false);
    });

    it('rejects path traversal in --output via CLI child_process', () => {
      const res = runCliCmd('compile -o "../../../outside.css"', testDir);
      expect(res.status).toBe(1);
      const combined = res.stdout + res.stderr;
      expect(combined).toMatch(/Path traversal detected|unsafe output path/i);
    });

    it('rejects absolute paths pointing outside project boundaries', async () => {
      const outsideAbsPath = path.join(outsideDir, 'forbidden.css');

      await compileCommand([], {
        cwd: testDir,
        output: outsideAbsPath,
      });

      expect(process.exitCode).toBe(1);
      expect(fs.existsSync(outsideAbsPath)).toBe(false);
    });

    it('accepts valid absolute paths that reside strictly inside project root', async () => {
      const validAbsOutput = path.join(testDir, 'dist/valid-abs.css');
      fs.writeFileSync(
        path.join(testDir, 'index.html'),
        '<div class="btn"></div>',
        'utf8'
      );

      await compileCommand([], {
        cwd: testDir,
        output: validAbsOutput,
      });

      expect(process.exitCode).toBeUndefined();
      expect(fs.existsSync(validAbsOutput)).toBe(true);
    });

    it('accepts valid paths with mixed separators and normalized subpaths inside root', async () => {
      const validMixedOutput = 'dist/../dist/nested\\output.css';
      fs.writeFileSync(
        path.join(testDir, 'index.html'),
        '<div class="card"></div>',
        'utf8'
      );

      await compileCommand([], {
        cwd: testDir,
        output: validMixedOutput,
      });

      expect(process.exitCode).toBeUndefined();
      expect(fs.existsSync(path.join(testDir, 'dist/nested/output.css'))).toBe(
        true
      );
    });

    it('rejects input and output paths escaping through symlinks/junctions', () => {
      const linkPath = path.join(testDir, 'link-to-outside');
      try {
        const symlinkType = process.platform === 'win32' ? 'junction' : 'dir';
        fs.symlinkSync(outsideDir, linkPath, symlinkType);
      } catch {
        // If symlinks cannot be created in environment, skip gracefully
        return;
      }

      // 1. Output escaping through symlink
      expect(isPathInside(testDir, 'link-to-outside/leak.css')).toBe(false);

      // 2. Input escaping through symlink
      fs.writeFileSync(
        path.join(outsideDir, 'secret.css'),
        '/* secret */',
        'utf8'
      );
      expect(isPathInside(testDir, 'link-to-outside/secret.css')).toBe(false);

      // 3. Compile command rejection
      compileCommand([], {
        cwd: testDir,
        output: 'link-to-outside/leak.css',
      });
      expect(process.exitCode).toBe(1);
      expect(fs.existsSync(path.join(outsideDir, 'leak.css'))).toBe(false);
    });

    it('unit: isPathInside correctly verifies containment across POSIX and Windows path semantics', () => {
      expect(isPathInside(testDir, 'dist/output.css')).toBe(true);
      expect(isPathInside(testDir, './valid.css')).toBe(true);
      expect(isPathInside(testDir, 'sub/../sub/valid.css')).toBe(true);
      expect(isPathInside(testDir, '../../outside.css')).toBe(false);
      expect(isPathInside(testDir, '../../../outside.css')).toBe(false);

      // Test POSIX root
      expect(isPathInside('/app', '/app/src/style.css')).toBe(true);
      expect(isPathInside('/app', '/etc/passwd')).toBe(false);
      expect(isPathInside('/app', '../../etc/passwd')).toBe(false);
      expect(isPathInside('/app', '/app/../outside.css')).toBe(false);
    });

    it('rejects unsafe input path traversal attempts and does not read external files', async () => {
      await compileCommand([], {
        cwd: testDir,
        input: '../../../secret-outside.css',
      });

      expect(process.exitCode).toBe(1);
    });

    it('safely handles non-existent input files without crashing', async () => {
      await compileCommand([], {
        cwd: testDir,
        input: 'missing-input-file.css',
      });

      expect(process.exitCode).toBe(1);
    });
  });

  describe('list, add, and migrate commands', () => {
    const testDir = path.join(tempBase, 'cli-test-misc');

    beforeEach(() => {
      if (fs.existsSync(testDir)) {
        fs.rmSync(testDir, { recursive: true, force: true });
      }
      fs.mkdirSync(testDir, { recursive: true });
    });

    afterEach(() => {
      if (fs.existsSync(testDir)) {
        fs.rmSync(testDir, { recursive: true, force: true });
      }
    });

    it('list outputs complete ecosystem component catalog', async () => {
      const logs: string[] = [];
      const origLog = console.log;
      console.log = (...args: any[]) => logs.push(args.join(' '));

      try {
        await listCommand();
        const output = logs.join('\n');
        expect(output).toContain('button');
        expect(output).toContain('dialog');
        expect(output).toContain('card');
        expect(output).toContain('table');
        expect(output).toContain('kanban');
        expect(output).toContain('editor');
      } finally {
        console.log = origLog;
      }
    });

    it('add outputs component specification and starter markup', async () => {
      const logs: string[] = [];
      const origLog = console.log;
      console.log = (...args: any[]) => logs.push(args.join(' '));

      try {
        await addCommand('button');
        const output = logs.join('\n');
        expect(output).toContain('Button');
        expect(output).toContain('@nofinite/nui');
        expect(output).toContain('btn btn-primary');
      } finally {
        console.log = origLog;
      }
    });

    it('add with invalid component name reports warning and exits safely', async () => {
      const errLogs: string[] = [];
      const origErr = console.error;
      console.error = (...args: any[]) => errLogs.push(args.join(' '));

      try {
        await addCommand('non-existent-comp');
        expect(process.exitCode).toBe(1);
        expect(errLogs.join('\n')).toContain('is not in the registry');
      } finally {
        console.error = origErr;
      }
    });

    it('add without arguments lists available components for scaffolding', async () => {
      const logs: string[] = [];
      const origLog = console.log;
      console.log = (...args: any[]) => logs.push(args.join(' '));

      try {
        await addCommand();
        const output = logs.join('\n');
        expect(output).toContain('Specify a component to add');
        expect(output).toContain('button');
        expect(output).toContain('card');
      } finally {
        console.log = origLog;
      }
    });

    it('migrate transforms legacy utility markup into NUICSS superclasses', async () => {
      const legacyFile = path.join(testDir, 'legacy.html');
      fs.writeFileSync(
        legacyFile,
        `<button class="items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Submit</button>`,
        'utf8'
      );

      // Dry run first
      await migrateCommand('legacy.html', { cwd: testDir, dryRun: true });
      let content = fs.readFileSync(legacyFile, 'utf8');
      expect(content).toContain('bg-blue-600'); // Unchanged in dry run

      // Actual run
      await migrateCommand('legacy.html', { cwd: testDir, dryRun: false });
      content = fs.readFileSync(legacyFile, 'utf8');
      expect(content).toContain('btn btn-primary');
    });

    it('upgrade command handles 404 response gracefully', async () => {
      const originalFetch = global.fetch;
      global.fetch = (async () => ({
        status: 404,
        ok: false,
      })) as any;

      const logs: string[] = [];
      const origLog = console.log;
      console.log = (...args: any[]) => logs.push(args.join(' '));

      try {
        await upgradeCommand({ check: true });
        expect(logs.join('\n')).toContain(
          'No published GitHub releases found yet'
        );
      } finally {
        global.fetch = originalFetch;
        console.log = origLog;
      }
    });

    it('upgrade command reports when already on latest version', async () => {
      const originalFetch = global.fetch;
      global.fetch = (async () => ({
        status: 200,
        ok: true,
        json: async () => ({
          tag_name: 'v0.1.0',
          assets: [],
        }),
      })) as any;

      const logs: string[] = [];
      const origLog = console.log;
      console.log = (...args: any[]) => logs.push(args.join(' '));

      try {
        await upgradeCommand({ check: true });
        expect(logs.join('\n')).toContain('already on the latest version');
      } finally {
        global.fetch = originalFetch;
        console.log = origLog;
      }
    });

    it('upgrade command reports warning on network error', async () => {
      const originalFetch = global.fetch;
      global.fetch = (async () => {
        throw new Error('Connection refused');
      }) as any;

      const warns: string[] = [];
      const origWarn = console.warn;
      console.warn = (...args: any[]) => warns.push(args.join(' '));

      try {
        await upgradeCommand({ check: true });
        expect(warns.join('\n')).toContain(
          'Could not fetch latest release info'
        );
      } finally {
        global.fetch = originalFetch;
        console.warn = origWarn;
      }
    });
  });

  describe('runCli programmatic execution', () => {
    it('executes version command programmatically', async () => {
      const logs: string[] = [];
      const origLog = console.log;
      console.log = (...args: any[]) => logs.push(args.join(' '));

      try {
        await runCli(['node', 'nuicss', 'version']);
        expect(logs.join('\n')).toContain('NUICSS CLI v0.1.0');
      } finally {
        console.log = origLog;
      }
    });

    it('executes tokens command programmatically through runCli', async () => {
      const logs: string[] = [];
      const origLog = console.log;
      console.log = (...args: any[]) => logs.push(args.join(' '));

      try {
        await runCli(['node', 'nuicss', 'tokens', '--json']);
        const combined = logs.join('\n');
        expect(combined).toContain('--color-primary');
        expect(combined).toContain('--spacing');
        const parsed = JSON.parse(combined);
        expect(Array.isArray(parsed.tokens)).toBe(true);
      } finally {
        console.log = origLog;
      }
    });

    it('handles typo command and provides suggestion programmatically', async () => {
      const errLogs: string[] = [];
      const origErr = console.error;
      console.error = (...args: any[]) => errLogs.push(args.join(' '));

      try {
        await runCli(['node', 'nuicss', 'tokn']);
        expect(process.exitCode).toBe(1);
        const combined = errLogs.join('\n');
        expect(combined).toMatch(/Unknown command:.*tokn/i);
        expect(combined).toContain('tokens');
      } finally {
        console.error = origErr;
      }
    });
  });
});
