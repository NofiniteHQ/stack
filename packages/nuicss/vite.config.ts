/// <reference types='vitest' />
import { defineConfig } from 'vite';
import * as path from 'path';

export default defineConfig(() => ({
  root: __dirname,
  // cacheDir: '../node_modules/.vite/nuicss',

  // Plugin array is empty because we don't need the 'vite-plugin-dts' (TypeScript types)
  // for a pure CSS framework.
  plugins: [],

  build: {
    outDir: './dist',
    emptyOutDir: false,
    reportCompressedSize: true,
    lib: {
      entry: path.resolve(__dirname, 'src/plugin/index.ts'),
      name: 'Nuicss',
      fileName: 'index',
      formats: ['es', 'cjs'] as any,
    },
    rollupOptions: {
      external: [
        'fs', 'path', 'vite', 'postcss', 'glob', 'jiti', 
        /^node:/, 'os', 'crypto', 'util', 'assert', 'url', 'process', 'tty', 'vm', 'perf_hooks'
      ],
    },
  },

  // Vitest Configuration (This stays the same so your snapshot tests work)
  test: {
    name: '@nofinite/nuicss',
    watch: false,
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts'],
    reporters: ['default'],
  },
}));
