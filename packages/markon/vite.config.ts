import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import dts from 'vite-plugin-dts';
import { builtinModules } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';

const NODE_BUILTINS = new Set([
  ...builtinModules,
  ...builtinModules.map((m) => `node:${m}`),
]);

const packageJson = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8')
);
const EXTERNAL_PATTERNS = [
  ...Object.keys(packageJson.dependencies || {}),
  ...Object.keys(packageJson.peerDependencies || {}),
  'react/jsx-runtime',
  '@nofinite/nuicss',
  'highlight.js',
  'prosemirror-state',
  'prosemirror-view',
  'prosemirror-model',
  'prosemirror-transform',
  'jsdom',
  'happy-dom',
  'canvas',
  'parse5',
].map(
  (dep) => new RegExp(`^${dep.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:/.*)?$`)
);

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
        const shim = `/**\n * @nofinite/markon - Backward Compatibility Stylesheet Shim\n * All Markon editor and typography styles are natively provided by @nofinite/nuicss.\n */\n@import '@nofinite/nuicss/styles.css';\n`;
        fs.writeFileSync(
          path.resolve(__dirname, 'dist/markon.css'),
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
        if (NODE_BUILTINS.has(id) || id.startsWith('node:')) {
          return true;
        }
        return EXTERNAL_PATTERNS.some((re) => re.test(id));
      },
      output: [
        {
          format: 'es',
          entryFileNames: '[name].js',
          chunkFileNames: 'chunks/[name]-[hash].js',
        },
        {
          format: 'cjs',
          entryFileNames: '[name].cjs',
          chunkFileNames: 'chunks/[name]-[hash].cjs',
          exports: 'named',
        },
      ],
    },
  },

  test: {
    globals: true,
    environment: 'happy-dom',
    testTimeout: 30000,
    hookTimeout: 30000,
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
});
