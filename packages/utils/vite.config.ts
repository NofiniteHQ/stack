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
      entry: {
        index: 'src/index.ts',
        'env/index': 'src/env/index.ts',
        'jwt/index': 'src/jwt/index.ts',
        'otp/index': 'src/otp/index.ts',
        'server/index': 'src/server/index.ts',
        'password/index': 'src/password/index.ts',
        'uuid/index': 'src/uuid/index.ts',
        'zeptomail/index': 'src/zeptomail/index.ts',
      },
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
    pool: 'forks',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
    },
  },
});
