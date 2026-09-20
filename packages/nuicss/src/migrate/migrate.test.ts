import { describe, it, expect } from 'vitest';
import { migrateMarkupToNuicss } from './index';

describe('NUICSS Migration Codemod', () => {
  it('migrates verbose button clusters to btn btn-primary', () => {
    const input =
      '<button class="items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium">Save</button>';
    const { result, replacementsCount } = migrateMarkupToNuicss(input);

    expect(replacementsCount).toBe(1);
    expect(result).toBe('<button class="btn btn-primary">Save</button>');
  });

  it('migrates verbose secondary button clusters to btn btn-secondary', () => {
    const input =
      '<button class="items-center px-4 py-2 bg-slate-100 text-slate-900 rounded-md hover:bg-slate-200">Cancel</button>';
    const { result, replacementsCount } = migrateMarkupToNuicss(input);

    expect(replacementsCount).toBe(1);
    expect(result).toBe('<button class="btn btn-secondary">Cancel</button>');
  });

  it('migrates badge clusters to badge badge-primary', () => {
    const input =
      '<span class="items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">New</span>';
    const { result, replacementsCount } = migrateMarkupToNuicss(input);

    expect(replacementsCount).toBe(1);
    expect(result).toBe('<span class="badge badge-primary">New</span>');
  });

  it('migrates text input clusters to input', () => {
    const input =
      '<input class="h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm" />';
    const { result, replacementsCount } = migrateMarkupToNuicss(input);

    expect(replacementsCount).toBe(1);
    expect(result).toBe('<input class="input" />');
  });

  it('migrates metric card clusters to metric-card', () => {
    const input =
      '<div class="flex flex-col p-5 rounded-xl border border-slate-200 bg-white shadow-sm">Metrics</div>';
    const { result, replacementsCount } = migrateMarkupToNuicss(input);

    expect(replacementsCount).toBe(1);
    expect(result).toBe('<div class="metric-card">Metrics</div>');
  });

  it('leaves clean or unmatched markup unchanged', () => {
    const input =
      '<div class="btn btn-primary flex justify-between p-4">Clean</div>';
    const { result, replacementsCount } = migrateMarkupToNuicss(input);

    expect(replacementsCount).toBe(0);
    expect(result).toBe(input);
  });
});
