import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import dts from 'vite-plugin-dts';
import path from 'node:path';

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
