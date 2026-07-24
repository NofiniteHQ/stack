import { defineConfig } from 'vitest/config';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import dts from 'vite-plugin-dts';

export default defineConfig({
  root: __dirname,

  plugins: [
    nxViteTsPaths(),

    dts({
      tsconfigPath: 'tsconfig.lib.json',
      outDir: './dist/types',
      insertTypesEntry: true,
    }),
  ],

  build: {
    outDir: './dist',
    emptyOutDir: true,
    sourcemap: true,
    reportCompressedSize: true,

    lib: {
      entry: 'src/index.ts',
      name: '@nofinite/utils',
    },

    target: 'node18',

    rollupOptions: {
      treeshake: true,

      external: [
        // Node built-ins
        'crypto',
        'node:crypto',
        'fs',
        'node:fs',
        'path',
        'node:path',
        'os',
        'node:os',
        'util',
        'node:util',
        'stream',
        'node:stream',
        'http',
        'node:http',
        'https',
        'node:https',
        'zlib',
        'node:zlib',
        'url',
        'node:url',

        // Runtime deps
        'argon2',
        'jose',
        'uuid',
        'zeptomail',
        'node-fetch',
      ],

      output: [
        {
          format: 'es',
          dir: './packages/utils/dist',
          preserveModules: true,
          preserveModulesRoot: 'src',
          entryFileNames: '[name].js',
        },
        {
          format: 'cjs',
          dir: './packages/utils/dist',
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
    environment: 'node',
    include: ['src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
    },
  },
});
