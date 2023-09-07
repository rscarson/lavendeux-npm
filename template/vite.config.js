import { defineConfig } from 'vite';
import { resolve } from 'path';
import { name, version } from './package.json';

export default defineConfig({
  define: {
    __VERSION__: `"${version}"`,
  },
  test: {
    coverage: {
      provider: 'c8'
    },
  },
  build: {
    minify: 'terser',
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      formats: ['es'],
      name: name,
      fileName() {
        return `${name}.js`;
      },
    },
  },
});