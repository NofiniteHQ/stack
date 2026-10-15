import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import dts from 'vite-plugin-dts';
import path from 'node:path';

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
      external: (id) => {
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
