import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import dts from 'vite-plugin-dts';
import fs from 'node:fs';
import path from 'node:path';

const packageJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8'));
const externalDeps = [
  ...Object.keys(packageJson.dependencies || {}),
  ...Object.keys(packageJson.peerDependencies || {}),
  'react/jsx-runtime'
].map(dep => new RegExp(`^${dep}(\\/.*)?$`));

export default defineConfig({
  root: __dirname,

  css: {
    transformer: 'lightningcss',
  },

  plugins: [
    react(),
    nxViteTsPaths(),

    dts({
      tsconfigPath: 'tsconfig.lib.json',
      outDir: './dist/types',
      insertTypesEntry: true,
    }),
    {
      name: 'add-use-client',
      renderChunk(code, chunk) {
        if (chunk.fileName.includes('.js') || chunk.fileName.includes('.cjs')) {
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
    cssMinify: 'lightningcss',
    emptyOutDir: true,
    sourcemap: true,
    cssCodeSplit: false,
    reportCompressedSize: true,
    commonjsOptions: { transformMixedEsModules: true },

    lib: {
      entry: {
        index: 'src/index.build.ts',
      },
      cssFileName: 'index',
    },

    rollupOptions: {
      external: [
        /^react(\/.*)?$/,
        /^unocss(\/.*)?$/,
        /^@nofinite\/nuicss(\/.*)?$/,
        ...externalDeps
      ],
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
