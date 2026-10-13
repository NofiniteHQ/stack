import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import dts from 'vite-plugin-dts';
import path from 'node:path';
import fs from 'node:fs';

const assetFileNamePattern = (assetInfo: { name?: string }) => {
  if (assetInfo.name && assetInfo.name.endsWith('.css')) {
    return 'styles.css';
  }
  return 'assets/[name]-[hash][extname]';
};

export default defineConfig({
  root: __dirname,

  plugins: [
    react(),
    nxViteTsPaths(),
    dts({
      tsconfigPath: path.resolve(__dirname, 'tsconfig.lib.json'),
      outDir: path.resolve(__dirname, 'dist/types'),
      insertTypesEntry: true,
    }),
    {
      name: 'emit-styles-shim',
      closeBundle() {
        const shim = `/**\n * @nofinite/charts - Backward Compatibility Stylesheet Shim\n * All vector charts and animations are styled natively via @nofinite/nuicss.\n */\n@import '@nofinite/nuicss/styles.css';\n`;
        fs.writeFileSync(
          path.resolve(__dirname, 'dist/styles.css'),
          shim,
          'utf8'
        );
      },
    },
  ],

  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
    sourcemap: true,
    lib: {
      entry: {
        index: path.resolve(__dirname, 'src/index.ts'),
        'react/index': path.resolve(__dirname, 'src/react/index.ts'),
      },
    },
    rollupOptions: {
      external: (id: string) => {
        if (id.endsWith('.css')) return false;
        if (
          [
            'react',
            'react-dom',
            'react/jsx-runtime',
            '@nofinite/nuicss',
          ].includes(id)
        ) {
          return true;
        }
        return false;
      },
      output: [
        {
          format: 'es',
          entryFileNames: '[name].js',
          chunkFileNames: 'chunks/[name]-[hash].js',
          assetFileNames: assetFileNamePattern,
        },
        {
          format: 'cjs',
          entryFileNames: '[name].cjs',
          chunkFileNames: 'chunks/[name]-[hash].cjs',
          exports: 'named',
          assetFileNames: assetFileNamePattern,
        },
      ],
    },
  },

  test: {
    globals: true,
    environment: 'happy-dom',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
});
