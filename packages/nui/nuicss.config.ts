/* eslint-disable */
import { defineConfig } from 'unocss';
import { nuicssPreset } from '../../nuicss/src/plugin/preset';

export default defineConfig({
  presets: [nuicssPreset()],
  content: {
    filesystem: [
      'src/**/*.{js,ts,jsx,tsx}',
      '../../.storybook/**/*.{js,ts,jsx,tsx}',
      '../../markon/src/**/*.{js,ts,jsx,tsx}',
      '../../media/src/**/*.{js,ts,jsx,tsx}',
      '../../charts/src/**/*.{js,ts,jsx,tsx}',
      '../../kanban/src/**/*.{js,ts,jsx,tsx}',
    ],
  },
});
