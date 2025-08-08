import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // include: ['test/**/*.test.ts'],
    // include: ['test/user.test.ts'],
    include: ['test/discovery.test.ts'],
  },
});
