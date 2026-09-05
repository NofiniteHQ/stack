/* eslint-disable */
import { defineConfig } from 'unocss';
import { nuicssPreset } from '@nofinite/nuicss';

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
