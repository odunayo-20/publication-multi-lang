import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: { alias: { '@': path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'src') } },
  test: {
    include: ['src/**/*.int.test.ts'],
    setupFiles: ['src/test/setup-env.ts'],
    testTimeout: 120_000,
    hookTimeout: 300_000,
    fileParallelism: false,
  },
})
