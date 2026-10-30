import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import dts from 'vite-plugin-dts';
import type { PreRenderedAsset } from 'rollup';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Shared asset logic to perfectly recreate your folders and clear the CSS
const sharedAssetFileNames = (assetInfo: PreRenderedAsset) => {
  const name = assetInfo.names?.[0] ?? '';

  // Force the CSS file to be cleanly named
  if (name.endsWith('.css')) return 'style.css';

  // Catch the SVGs before they get hashed
  if (name.endsWith('.svg')) {
    const originalPath = assetInfo.originalFileNames?.[0] || '';

    // Rollup 4 tracks the original path, allowing us to drop them
    // perfectly back into their 1x1 and 4x3 folders!
    if (originalPath.includes('1x1')) return 'flags/1x1/[name][extname]';
    if (originalPath.includes('4x3')) return 'flags/4x3/[name][extname]';

    return 'flags/[name][extname]';
  }

  return '[name]-[hash][extname]'; // Default fallback
};

export default defineConfig({
  root: import.meta.dirname,

  plugins: [
    nxViteTsPaths(),
    dts({
      tsconfigPath: 'tsconfig.lib.json',
      outDir: './dist',
      insertTypesEntry: true,
    }),
    {
      name: 'locale-style-shim',
      generateBundle() {
        this.emitFile({
          type: 'asset',
          fileName: 'style.css',
          source: `/**\n * @nofinite/locale - Stylesheet Compatibility Shim\n * Canonical flag and component styling is provided by @nofinite/nuicss.\n */\n@import '@nofinite/nuicss/styles.css';\n`,
        });
      },
    },
  ],

  build: {
    outDir: './dist',
    emptyOutDir: true,
    sourcemap: true,
    reportCompressedSize: true,
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'NofiniteLocale',
      formats: ['es', 'cjs', 'iife'],
      fileName: (format) => {
        if (format === 'es') return 'index.js';
        if (format === 'cjs') return 'index.cjs';
        return 'index.global.js';
      },
    },

    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],

      output: [
        {
          format: 'es',
          entryFileNames: 'index.js',
          assetFileNames: sharedAssetFileNames,
        },
        {
          format: 'cjs',
          entryFileNames: 'index.cjs',
          exports: 'named',
          assetFileNames: sharedAssetFileNames,
        },
        {
          format: 'iife',
          name: 'NofiniteLocale',
          entryFileNames: 'index.global.js',
          assetFileNames: sharedAssetFileNames,
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
            'react/jsx-runtime': 'ReactJSXRuntime',
          },
        },
      ],
    },
  },

  test: {
    watch: false,
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
