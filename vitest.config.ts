/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
export default defineConfig({
  plugins: [solidPlugin()],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
  test: {
    environment: 'jsdom',
    globals: true,
    testTransformMode: { web: ['/.[jt]sx?$/'] },
    deps: {
      registerNodeLoader: true,
      inline: [/solid-js/],
    },
    setupFiles: ['./tests/setup.ts'],
  },
  resolve: {
    conditions: ['development', 'browser'],
  },
});
