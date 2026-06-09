// Build config: produces ESM + CJS for bundlers/Node, and a minified IIFE for <script>/CDN.
// esbuild (via tsup) bundles the mixed CJS/ESM source and resolves extensionless imports.
const { defineConfig } = require('tsup');

module.exports = defineConfig([
  {
    entry: { index: 'src/index.js' },
    format: ['esm', 'cjs'],
    target: 'es2020',
    platform: 'neutral', // isomorphic: don't assume node or browser globals
    outDir: 'dist',
    sourcemap: true,
    clean: true,
    // `ws` is an optional, lazily-imported dep; never bundle it.
    external: ['ws'],
  },
  {
    // Browser global build for <script src> / CDN — preserves window.steem usage.
    entry: { 'steem.min': 'src/browser.js' },
    format: ['iife'],
    globalName: 'steem',
    target: 'es2020',
    platform: 'browser',
    outDir: 'dist',
    minify: true,
    sourcemap: true,
    external: ['ws'],
  },
]);
