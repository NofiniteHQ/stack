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
    emptyOutDir: true,
    reportCompressedSize: true,

    // Instead of a single JS library entry, we tell Rollup (Vite's bundler)
    // to specifically compile our two master SCSS files.
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, 'src/index.scss'),
        prefixed: path.resolve(__dirname, 'src/prefixed.scss'),
      },
      output: {
        // This ensures the final output is literally 'index.css' and 'prefixed.css'
        // without any weird Vite hashes or nested folders.
        assetFileNames: '[name][extname]',
      },
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
