import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import dts from 'vite-plugin-dts';
import type { PreRenderedAsset } from 'rollup';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Shared asset logic to name the CSS shim cleanly
const sharedAssetFileNames = (assetInfo: PreRenderedAsset) => {
  const name = assetInfo.names?.[0] ?? '';
  if (name.endsWith('.css')) return 'style.css';
  return '[name]-[hash][extname]';
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
      entry: {
        index: path.resolve(__dirname, 'src/index.ts'),
        'data/countries': path.resolve(__dirname, 'src/data/countries.ts'),
        'react/index': path.resolve(__dirname, 'src/react/index.ts'),
      },
      name: 'NofiniteLocale',
    },

    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],

      output: [
        {
          format: 'es',
          entryFileNames: '[name].js',
          chunkFileNames: 'chunks/[name]-[hash].js',
          assetFileNames: sharedAssetFileNames,
        },
        {
          format: 'cjs',
          entryFileNames: '[name].cjs',
          chunkFileNames: 'chunks/[name]-[hash].cjs',
          exports: 'named',
          assetFileNames: sharedAssetFileNames,
        },
      ],
    },
  },

  test: {
    watch: false,
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts', 'tests/**/*.test.ts'],
  },
});
