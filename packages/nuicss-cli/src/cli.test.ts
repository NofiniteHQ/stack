import { describe, it, expect } from 'vitest';
import { execSync } from 'node:child_process';
import { resolve } from 'node:path';
import { VERSION } from './index.js';

const cliBin = resolve(__dirname, '../bin/nuicss.js');

describe('nuicss CLI', () => {
  it('exports valid semantic version matching package.json', () => {
    expect(VERSION).toBe('0.1.0');
  });

  it('prints version banner when invoked with --version', () => {
    const output = execSync(`node "${cliBin}" --version`, {
      encoding: 'utf8',
    });
    expect(output).toContain('nuicss/0.1.0');
  });

  it('prints complete help documentation when invoked with --help', () => {
    const output = execSync(`node "${cliBin}" --help`, {
      encoding: 'utf8',
    });
    expect(output).toContain('nuicss/0.1.0');
    expect(output).toContain('compile');
    expect(output).toContain('init');
    expect(output).toContain('migrate');
    expect(output).toContain('check');
    expect(output).toContain('tokens');
    expect(output).toContain('list');
    expect(output).toContain('add');
    expect(output).toContain('upgrade');
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
