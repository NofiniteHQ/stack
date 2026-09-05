/* eslint-disable */
import { defineConfig } from 'unocss';
import { nuicssPreset } from '../../nuicss/src/plugin/preset';

export default defineConfig({
  presets: [
    nuicssPreset(),
  ],
  content: {
    filesystem: [
      'src/**/*.{js,ts,jsx,tsx}',
    ],
  },
});
