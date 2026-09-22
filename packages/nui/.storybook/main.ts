/* eslint-disable @nx/enforce-module-boundaries */
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import type { StorybookConfig } from '@storybook/react-vite';
import { nuicssVitePlugin } from '../../nuicss/dist/index.mjs';
import { mergeConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config: StorybookConfig = {
  stories: [
    '../src/**/*.@(mdx|stories.@(js|jsx|ts|tsx))',
    '../../charts/src/**/*.@(mdx|stories.@(js|jsx|ts|tsx))',
    '../../markon/src/**/*.@(mdx|stories.@(js|jsx|ts|tsx))',
    '../../media/src/**/*.@(mdx|stories.@(js|jsx|ts|tsx))',
    '../../kanban/src/**/*.@(mdx|stories.@(js|jsx|ts|tsx))',
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

// To customize your Vite configuration you can use the viteFinal field.
// Check https://storybook.js.org/docs/react/builders/vite#configuration
// and https://nx.dev/recipes/storybook/custom-builder-configs
config.viteFinal = async (viteConfig) => {
  return mergeConfig(viteConfig, {
    css: {
      transformer: 'postcss',
    },
    plugins: [
      tsconfigPaths({
        root: resolve(__dirname, '../../..'),
      }),
      nuicssVitePlugin({
        configFile: resolve(__dirname, '../nuicss.config.ts'),
      }),
    ],
  });
};
