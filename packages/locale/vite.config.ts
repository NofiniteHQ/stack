import { defineConfig } from 'vitest/config';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import dts from 'vite-plugin-dts';
import type { PreRenderedAsset } from 'rollup'; 

// Shared asset logic to perfectly recreate your folders and clear the CSS
const sharedAssetFileNames = (assetInfo: PreRenderedAsset) => {
  const name = assetInfo.names?.[0] ?? '';
  
  // Force the CSS file to be cleanly named
  if (name.endsWith('.css')) return 'style.css';

  // Catch the SVGs before they get hashed
  if (name.endsWith('.svg')) {
    const originalPath = assetInfo.originalFileNames?.[0] || '';
    
    // Rollup 4 tracks the original path, allowing us to drop them
    // perfectly back into their 1x1 and 4x3 folders!
    if (originalPath.includes('1x1')) return 'flags/1x1/[name][extname]';
    if (originalPath.includes('4x3')) return 'flags/4x3/[name][extname]';
    
    return 'flags/[name][extname]';
  }
  
  return '[name]-[hash][extname]'; // Default fallback
};

export default defineConfig({
  root: import.meta.dirname,

  plugins: [
    nxViteTsPaths(),
    dts({
      tsconfigPath: 'tsconfig.lib.json',
      outDir: './dist',
      insertTypesEntry: true,
    }),
  ],

  build: {
    outDir: './dist',
    emptyOutDir: true,
    sourcemap: true,
    reportCompressedSize: true,

    // Because build.lib is gone, Vite will actually respect this!
    assetsInlineLimit: 0, 

    rollupOptions: {
      // Instead of build.lib, we explicitly tell Rollup what the entry point is
      input: 'src/index.ts',
      external: [], 

      output: [
        {
          format: 'es',
          entryFileNames: 'index.js',
          assetFileNames: sharedAssetFileNames, 
        },
        {
          format: 'cjs',
          entryFileNames: 'index.cjs',
          exports: 'named',
          assetFileNames: sharedAssetFileNames, 
        },
        {
          format: 'iife',
          name: 'NofiniteLocale',
          entryFileNames: 'index.global.js',
          assetFileNames: sharedAssetFileNames, 
        },
      ],
    },
  },

  test: {
    watch: false,
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});