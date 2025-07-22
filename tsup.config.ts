import { defineConfig } from 'tsup';
import { TsconfigPathsPlugin } from '@esbuild-plugins/tsconfig-paths';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  minify: true,
  clean: true,
  outDir: 'dist',
  // Especifica el nombre del archivo de salida para CommonJS
  outExtension({ format }) {
    return {
      js: format === 'cjs' ? '.cjs' : '.mjs',
    };
  },
  // Configuración para el binario
  banner: {
    js: '#!/usr/bin/env node',
  },
  esbuildPlugins: [TsconfigPathsPlugin({})],
});
