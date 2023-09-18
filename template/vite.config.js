import { defineConfig } from 'vite';
import { resolve } from 'path';
import { name, version } from './package.json';

export default defineConfig({
  define: {
    __VERSION__: `"${version}"`,
  },
  test: {
  },
  build: {
    minify: 'esbuild',
    rollupOptions: {
      output: {
        banner: () => [
          '/*!',
          ' * ',
          ' * This file is an extension for the Lavendeux parser',
          ' * https://rscarson.github.io/lavendeux/',
          ' * ',
          ' * The contents below were autogenerated using the lavendeux npm package:',
          ' * https://www.npmjs.com/package/lavendeux',
          ' * ',
          ' */',
        ].join('\n')
      }
    },
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      formats: ['umd'],
      name: name,
      fileName() {
        return `${name}.js`;
      },
    },
  },
});