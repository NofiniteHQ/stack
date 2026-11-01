import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import nuicss from '@nofinite/nuicss/vite';

export default defineConfig({
  plugins: [react(), nuicss()],
  server: {
    port: 5201,
    strictPort: true,
  },
});
