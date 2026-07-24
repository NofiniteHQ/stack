import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// @ts-ignore
import { nuicssVitePlugin } from '@nofinite/nuicss'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nuicssVitePlugin()
  ],
});
