/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/services': path.resolve(__dirname, './src/services'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/context': path.resolve(__dirname, './src/context'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    exclude: [
      'tests/e2e/**/*',
      'node_modules/**/*',
      '**/*.e2e.*',
      '**/*.spec.ts',
    ],
  },
});
