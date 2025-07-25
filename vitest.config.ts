import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/providers': path.resolve(__dirname, './src/providers'),
      '@/commands': path.resolve(__dirname, './src/commands'),
      '@/templates': path.resolve(__dirname, './src/templates'),
    },
  },
});
