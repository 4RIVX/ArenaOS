import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    // Run tests sequentially to avoid any state cross-contamination
    pool: 'forks',
    // Include all test files
    include: ['src/__tests__/**/*.test.ts'],
    // Coverage (optional, run with --coverage)
    coverage: {
      provider: 'v8',
      include: ['src/data/**', 'src/routes/gemini/systemPrompt.ts'],
    },
  },
});
