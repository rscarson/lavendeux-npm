import { defineConfig } from 'vite';
import { configDefaults } from 'vitest/config'
import { version } from './package.json';

export default defineConfig({
  define: {
    __VERSION__: `"${version}"`,
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
  }
});