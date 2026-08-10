import unocssVitePlugin from '@unocss/vite';
import type { PluginOption } from 'vite';

export function nuicssVitePlugin(options: any = {}): PluginOption {
  const finalOptions = {
    configFile: './nuicss.config.ts',
    ...options
  };
  const unoPlugin = unocssVitePlugin(finalOptions);
  const aliasPlugin = {
    name: 'nuicss-alias',
    enforce: 'pre' as const,
    resolveId(id: string, importer?: string, options?: any) {
      if (id === '@nofinite/nuicss/virtual.css' || id === 'virtual:nuicss.css') {
        return this.resolve('virtual:uno.css', importer, { skipSelf: true, ...options });
      }
      return null;
    }
  };
  
  return [aliasPlugin, ...unoPlugin];
}
