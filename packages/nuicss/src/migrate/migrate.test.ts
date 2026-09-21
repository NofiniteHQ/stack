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

  it('migrates responsive container clusters to card-responsive', () => {
    const input =
      '<div class="@container flex flex-col @sm:flex-row @sm:items-center">Content</div>';
    const { result, replacementsCount } = migrateMarkupToNuicss(input);

    expect(replacementsCount).toBe(1);
    expect(result).toBe('<div class="card-responsive">Content</div>');
  });

  it('migrates active scale interactions to press-scale', () => {
    const input =
      '<button class="btn active:scale-[0.98] transition-transform duration-150 ease-out">Click</button>';
    const { result, replacementsCount } = migrateMarkupToNuicss(input);

    expect(replacementsCount).toBe(1);
    expect(result).toBe('<button class="btn press-scale">Click</button>');
  });

  it('migrates hover lift interactions to hover-lift', () => {
    const input =
      '<div class="card hover:-translate-y-1 hover:shadow-lg transition-all">Card</div>';
    const { result, replacementsCount } = migrateMarkupToNuicss(input);

    expect(replacementsCount).toBe(1);
    expect(result).toBe('<div class="card hover-lift">Card</div>');
  });

  it('migrates skeleton pulses to skeleton-shimmer rounded', () => {
    const input =
      '<div class="animate-pulse bg-slate-200 rounded h-6 w-24"></div>';
    const { result, replacementsCount } = migrateMarkupToNuicss(input);

    expect(replacementsCount).toBe(1);
    expect(result).toBe(
      '<div class="skeleton-shimmer rounded h-6 w-24"></div>'
    );
  });

  it('migrates verbose table wrappers to table-container', () => {
    const input =
      '<div class="w-full overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm"><table>...</table></div>';
    const { result, replacementsCount } = migrateMarkupToNuicss(input);

    expect(replacementsCount).toBe(1);
    expect(result).toBe(
      '<div class="table-container"><table>...</table></div>'
    );
  });

  it('leaves clean or unmatched markup unchanged', () => {
    const input =
      '<div class="btn btn-primary flex justify-between p-4">Clean</div>';
    const { result, replacementsCount } = migrateMarkupToNuicss(input);

    expect(replacementsCount).toBe(0);
    expect(result).toBe(input);
  });
});
