import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: ['konva', 'react-konva'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor:  ['react', 'react-dom', 'react-router-dom'],
          konva:   ['konva', 'react-konva'],
          zustand: ['zustand'],
          motion:  ['framer-motion'],
          radix: [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-tabs',
            '@radix-ui/react-tooltip',
            '@radix-ui/react-slider',
            '@radix-ui/react-switch',
            '@radix-ui/react-select',
          ],
        },
      },
    },
    sourcemap: false,
    minify: 'esbuild',
  },
  server: {
    port: 3000,
    open: true,
  },
});
