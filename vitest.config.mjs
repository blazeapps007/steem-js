import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['test/**/*.{test,spec}.{js,mjs,ts}'],
    // Live-network tests opt in via STEEM_LIVE=1.
    testTimeout: 30000,
  },
});
