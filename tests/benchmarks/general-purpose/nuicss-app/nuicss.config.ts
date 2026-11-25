import { defineConfig } from '@nofinite/nuicss';

export default defineConfig({
  content: {
    filesystem: ['./index.html', './src/**/*.{ts,tsx}'],
  },
});
