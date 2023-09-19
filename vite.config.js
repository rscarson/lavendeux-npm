import { resolve } from 'path';
import { defineConfig } from 'vite';
import { configDefaults } from 'vitest/config'
import { name, version } from './package.json';

export default defineConfig({
  define: {
    __VERSION__: `"${version}"`,
  },
  esbuild: {
    minifyIdentifiers: false
  },
  build: {
    minify: 'esbuild',
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      formats: ['es'],
      name: name,
      fileName() {
        return `${name}.min.js`;
      },
    },
  },
  test: {
    exclude: [
      ...configDefaults.exclude, 
      "**/template/**", 
      "**/example/**",
      "**/template_ts/**", 
      "**/example_ts/**"
    ],
    coverage: {
      provider: 'v8'
    },
  },
});