import { describe, it, expect } from 'vitest';
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { VERSION } from './index.js';

const cliBin = resolve(__dirname, '../bin/nuicss.js');
const expectedVersion = (
  JSON.parse(readFileSync(resolve(__dirname, '../package.json'), 'utf8')) as {
    version: string;
  }
).version;

describe('nuicss CLI', () => {
  it('exports valid semantic version matching package.json', () => {
    expect(VERSION).toBe(expectedVersion);
  });

  it('prints version banner when invoked with --version', () => {
    const output = execSync(`node "${cliBin}" --version`, {
      encoding: 'utf8',
    });
    expect(output).toContain(`nuicss/${expectedVersion}`);
  });

  it('prints complete help documentation when invoked with --help', () => {
    const output = execSync(`node "${cliBin}" --help`, {
      encoding: 'utf8',
    });
    expect(output).toContain(`nuicss/${expectedVersion}`);
    expect(output).toContain('compile');
    expect(output).toContain('init');
    expect(output).toContain('migrate');
    expect(output).toContain('check');
    expect(output).toContain('tokens');
    expect(output).toContain('list');
    expect(output).toContain('add');
    expect(output).toContain('upgrade');
  });

  it('prints matching version for the version subcommand', () => {
    const output = execSync(`node "${cliBin}" version`, {
      encoding: 'utf8',
    });
    expect(output).toContain(`NUICSS CLI v${expectedVersion}`);
  });

  it('suggests closest match when an unknown command is invoked', () => {
    try {
      execSync(`node "${cliBin}" tokn`, {
        encoding: 'utf8',
        stdio: 'pipe',
      });
      expect.fail('Should have failed for invalid command');
    } catch (err: any) {
      const stderr = err.stderr?.toString() || err.stdout?.toString() || '';
      expect(stderr).toMatch(/Did you mean.*tokens/i);
    }
  });
});
