import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import dts from 'vite-plugin-dts';

import path from 'node:path';

export default defineConfig({
  root: __dirname,
  // cacheDir: '../../node_modules/.vite/packages/nui',

  css: {
    transformer: 'lightningcss', // High-performance transformation
  },

  plugins: [
    react(),
    nxViteTsPaths(), // Essential for resolving workspace paths

    dts({
      tsconfigPath: 'tsconfig.lib.json',
      outDir: './dist/types',
      insertTypesEntry: true,
    }),
    {
      name: 'add-use-client',
      renderChunk(code, chunk) {
        if (chunk.fileName.includes('.js') || chunk.fileName.includes('.cjs')) {
          // If it's a component or the main index file, inject the directive
          if (chunk.fileName.includes('components/') || chunk.fileName === 'index.js' || chunk.fileName === 'index.cjs') {
            if (!code.startsWith('"use client";') && !code.startsWith("'use client';")) {
              return { code: '"use client";\n' + code, map: null };
            }
          }
        }
        return null;
      }
    }
  ],

  build: {
    outDir: './dist',
    cssMinify: 'lightningcss', // Faster and better compression
    emptyOutDir: true,
    sourcemap: true,
    cssCodeSplit: false,
    reportCompressedSize: true,
    commonjsOptions: { transformMixedEsModules: true },

    lib: {
      // The key 'index' forces the output chunk to be named 'index'
      // regardless of what the actual file is called.
      entry: {
        index: 'src/index.build.ts',
      },
      cssFileName: 'index',
    },

    rollupOptions: {
      // Externalize deps that shouldn't be bundled into your library
      external: ['react', 'react-dom', 'react/jsx-runtime', 'unocss', '@nofinite/nuicss'],
      treeshake: true,
      output: [
        {
          format: 'es',
          dir: './dist',
          preserveModules: true,
          preserveModulesRoot: 'src',
          entryFileNames: '[name].js',
        },
        {
          format: 'cjs',
          dir: './dist',
          preserveModules: true,
          preserveModulesRoot: 'src',
          entryFileNames: '[name].cjs',
          exports: 'named',
        },
      ],
    },
  },

  test: {
    watch: false,
    globals: true,
    environment: 'happy-dom',
    setupFiles: './vitest.setup.ts',
    pool: 'forks',
  },
});
