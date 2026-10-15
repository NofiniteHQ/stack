import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import dts from 'vite-plugin-dts';
import path from 'node:path';
import fs from 'node:fs';

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
        const shim = `/**\n * @nofinite/media - Backward Compatibility Stylesheet Shim\n * All media player layout chrome and OKLCH design tokens are natively\n * compiled and provided by @nofinite/nuicss.\n *\n * For new applications, simply import:\n *   import '@nofinite/nuicss/styles.css';\n */\n@import '@nofinite/nuicss/styles.css';\n`;
        fs.writeFileSync(
          path.resolve(__dirname, 'dist/styles.css'),
          shim,
          'utf8'
        );
        fs.writeFileSync(
          path.resolve(__dirname, 'dist/styles.js'),
          `import './styles.css';\n`,
          'utf8'
        );
        fs.writeFileSync(
          path.resolve(__dirname, 'dist/styles.cjs'),
          `'use strict';\nrequire('./styles.css');\n`,
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
        styles: path.resolve(__dirname, 'src/styles.ts'),
      },
    },
    rollupOptions: {
      external: (id) => {
        if (id.includes('@nofinite/nuicss')) return true;
        if (id.endsWith('.css')) return false;
        if (
          [
            'react',
            'react-dom',
            'react/jsx-runtime',
            '@nofinite/nuicss',
          ].includes(id)
        )
          return true;
        if (id.startsWith('@vidstack/react') || id.startsWith('vidstack'))
          return true;
        return false;
      },
      output: [
        {
          format: 'es',
          entryFileNames: '[name].js',
          chunkFileNames: 'chunks/[name]-[hash].js',
          banner: (chunk) => {
            if (
              chunk.name === 'react/index' ||
              chunk.fileName?.startsWith('react/')
            ) {
              return "'use client';";
            }
            return '';
          },
          assetFileNames: (assetInfo) => {
            if (assetInfo.name && assetInfo.name.endsWith('.css')) {
              return 'styles.css';
            }
            return 'assets/[name]-[hash][extname]';
          },
        },
        {
          format: 'cjs',
          entryFileNames: '[name].cjs',
          chunkFileNames: 'chunks/[name]-[hash].cjs',
          exports: 'named',
          banner: (chunk) => {
            if (
              chunk.name === 'react/index' ||
              chunk.fileName?.startsWith('react/')
            ) {
              return "'use client';";
            }
            return '';
          },
          assetFileNames: (assetInfo) => {
            if (assetInfo.name && assetInfo.name.endsWith('.css')) {
              return 'styles.css';
            }
            return 'assets/[name]-[hash][extname]';
          },
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
