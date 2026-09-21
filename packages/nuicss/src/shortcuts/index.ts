import type { DynamicShortcut, StaticShortcut, UserShortcuts } from 'unocss';
import { primitiveShortcuts } from './primitives';
import { formShortcuts } from './forms';
import { overlayShortcuts } from './overlays';
import { widgetShortcuts } from './widgets';
import { mediaShortcuts } from './media';

export {
  primitiveShortcuts,
  formShortcuts,
  overlayShortcuts,
  widgetShortcuts,
  mediaShortcuts,
};

export const rawShortcuts: (StaticShortcut | DynamicShortcut)[] = [
  ...primitiveShortcuts,
  ...formShortcuts,
  ...overlayShortcuts,
  ...widgetShortcuts,
  ...mediaShortcuts,
];

/**
 * Transforms shortcuts into layered shortcuts and attaches dual `nui-*` aliases
 * so that both concise names (e.g. `btn`, `card`) and namespace-safe names
 * (e.g. `nui-btn`, `nui-card`) are seamlessly recognized.
 */
export function createLayeredShortcuts(
  shortcuts: (StaticShortcut | DynamicShortcut)[],
  layer = 'components'
): (StaticShortcut | DynamicShortcut)[] {
  const result: (StaticShortcut | DynamicShortcut)[] = [];

  for (const item of shortcuts) {
    if (Array.isArray(item)) {
      const [name, template, meta] = item;
      const opts = { ...(meta || {}), layer };

      result.push([name, template, opts] as any);

      // Add dual alias if name is string and does not already start with 'nui-'
      if (typeof name === 'string' && !name.startsWith('nui-')) {
        result.push([`nui-${name}`, template, opts] as any);
      }
    } else {
      result.push(item);
    }
  }

  return result;
}

/**
 * Precompiled component shortcuts with dual aliasing and W3C @layer components
 */
export const componentShortcuts: UserShortcuts = createLayeredShortcuts(
  rawShortcuts,
  'components'
);
