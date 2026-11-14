import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: { alias: { '@': path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'src') } },
  test: { include: ['src/**/*.test.ts'], exclude: ['**/*.int.test.ts', '**/node_modules/**'] },
})
