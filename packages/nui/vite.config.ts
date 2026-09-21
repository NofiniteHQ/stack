import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import dts from 'vite-plugin-dts';
import fs from 'node:fs';
import path from 'node:path';
import UnoCSS from 'unocss/vite';

const packageJson = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8')
);
const externalDeps = [
  ...Object.keys(packageJson.dependencies || {}),
  ...Object.keys(packageJson.peerDependencies || {}),
  'react/jsx-runtime',
].map((dep) => new RegExp(`^${dep}(\\/.*)?$`));

export default defineConfig({
  root: __dirname,

  css: {
    transformer: 'lightningcss',
  },

  plugins: [
    UnoCSS({
      configFile: path.resolve(__dirname, 'nuicss.config.ts'),
    }),
    react(),
    nxViteTsPaths(),

    dts({
      tsconfigPath: path.resolve(__dirname, 'tsconfig.lib.json'),
      outDir: path.resolve(__dirname, 'dist/types'),
      insertTypesEntry: true,
    }),
    {
      name: 'add-use-client',
      renderChunk(code, chunk) {
        if (chunk.fileName.includes('.js') || chunk.fileName.includes('.cjs')) {
          if (
            chunk.fileName.includes('components/') ||
            chunk.fileName === 'index.js' ||
            chunk.fileName === 'index.cjs'
          ) {
            if (
              !code.startsWith('"use client";') &&
              !code.startsWith("'use client';")
            ) {
              return { code: '"use client";\n' + code, map: null };
            }
          }
        }
        return null;
      },
    },
    {
      name: 'wrap-styles-in-layer',
      closeBundle() {
        const cssPath = path.resolve(__dirname, 'dist/styles.css');
        const themePath = path.resolve(
          __dirname,
          '../nuicss/src/styles/theme.css'
        );
        if (fs.existsSync(cssPath)) {
          let raw = fs.readFileSync(cssPath, 'utf8');
          const themeCss = fs.existsSync(themePath)
            ? fs.readFileSync(themePath, 'utf8')
            : '';

          let vidstackCss = '';
          try {
            const v1 = require.resolve(
              '@vidstack/react/player/styles/default/theme.css',
              { paths: [__dirname] }
            );
            const v2 = require.resolve(
              '@vidstack/react/player/styles/default/layouts/video.css',
              { paths: [__dirname] }
            );
            vidstackCss = `${fs.readFileSync(v1, 'utf8')}\n${fs.readFileSync(
              v2,
              'utf8'
            )}`;
          } catch {
            /* optional vidstack styles */
          }

          let katexCss = '';
          try {
            const k1 = require.resolve('katex/dist/katex.min.css', {
              paths: [__dirname],
            });
            katexCss = fs.readFileSync(k1, 'utf8');
          } catch {
            /* optional katex styles */
          }

          const baseBlock = `/* Design Tokens & Theme (Standalone NUI) */\n${themeCss}\n\n/* Video Player Styles */\n${vidstackCss}\n\n/* KaTeX Math Styles */\n${katexCss}`;

          // Ensure layer preamble and theme tokens are present
          if (!raw.includes('@layer base, components, utilities;')) {
            raw = `@layer base, components, utilities;\n\n${baseBlock}\n\n@layer components {\n${raw}\n}`;
            fs.writeFileSync(cssPath, raw, 'utf8');
          } else if (!raw.includes('--bg-surface:')) {
            raw = raw.replace(
              '@layer base, components, utilities;',
              `@layer base, components, utilities;\n\n${baseBlock}`
            );
            fs.writeFileSync(cssPath, raw, 'utf8');
          }
        }
      },
    },
  ],

  build: {
    outDir: path.resolve(__dirname, 'dist'),
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
      name: 'nui',
      cssFileName: 'styles',
    },

    rollupOptions: {
      external: [
        /^react(\/.*)?$/,
        /^unocss(\/.*)?$/,
        /^@nofinite\/nuicss(\/.*)?$/,
        ...externalDeps,
      ],
      treeshake: true,
      output: [
        {
          format: 'es',
          dir: path.resolve(__dirname, 'dist'),
          preserveModules: true,
          preserveModulesRoot: path.resolve(__dirname, 'src'),
          entryFileNames: '[name].js',
        },
        {
          format: 'cjs',
          dir: path.resolve(__dirname, 'dist'),
          preserveModules: true,
          preserveModulesRoot: path.resolve(__dirname, 'src'),
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
