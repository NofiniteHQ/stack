/* eslint-disable @nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import type { StorybookConfig } from '@storybook/react-vite';
import { nuicssVitePlugin } from '../packages/nuicss/dist/index.mjs';
import { mergeConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config: StorybookConfig = {
  stories: [
    {
      directory: '../packages/nui/src',
      titlePrefix: 'NUI',
      files: '**/*.@(mdx|stories.@(js|jsx|ts|tsx))',
    },
    {
      directory: '../packages/charts/src',
      titlePrefix: 'Charts',
      files: '**/*.@(mdx|stories.@(js|jsx|ts|tsx))',
    },
    {
      directory: '../packages/markon/src',
      titlePrefix: 'Markon',
      files: '**/*.@(mdx|stories.@(js|jsx|ts|tsx))',
    },
    {
      directory: '../packages/media/src',
      titlePrefix: 'Media',
      files: '**/*.@(mdx|stories.@(js|jsx|ts|tsx))',
    },
    {
      directory: '../packages/kanban/src',
      titlePrefix: 'Kanban',
      files: '**/*.@(mdx|stories.@(js|jsx|ts|tsx))',
    },
  ],
  addons: [getAbsolutePath('@storybook/addon-docs')],
  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
};

function getAbsolutePath(value: string): any {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}

export default config;

config.viteFinal = async (viteConfig) => {
  return mergeConfig(viteConfig, {
    css: {
      transformer: 'postcss',
    },
    plugins: [
      tsconfigPaths({
        root: resolve(__dirname, '..'),
      }),
      nuicssVitePlugin({
        configFile: resolve(__dirname, '../packages/nui/nuicss.config.ts'),
      }),
    ],
  });
};
