// Build config: ESM + CJS for bundlers/Node, and a minified IIFE for <script>/CDN.
// Isomorphic output: Buffer injected from the pure-JS `buffer` polyfill; `ws` external
// (optional, lazily imported); node built-in names redirected to tiny pure-JS shims.
const { defineConfig } = require('tsup');
const path = require('path');

const bufferShim = path.resolve(__dirname, 'src/_shims/buffer-shim.js');
const shims = {
  assert: path.resolve(__dirname, 'src/_shims/assert.js'),
  events: path.resolve(__dirname, 'src/_shims/events.js'),
  debug: path.resolve(__dirname, 'src/_shims/debug.js'),
};

// onResolve runs before esbuild's builtin handling, so it reliably redirects bare
// `assert`/`events`/`debug` (including CJS require()) to the local shims.
const shimPlugin = {
  name: 'builtin-shims',
  setup(build) {
    build.onResolve({ filter: /^(assert|events|debug)$/ }, (args) => ({ path: shims[args.path] }));
  },
};

const common = {
  target: 'es2020',
  sourcemap: true,
  external: ['ws'],
  // Force-bundle these builtin names (tsup externalizes node builtins by default);
  // the shimPlugin then redirects them to the local pure-JS shims.
  noExternal: [/^(assert|events|debug)$/],
  esbuildPlugins: [shimPlugin],
  esbuildOptions(options) {
    options.inject = [bufferShim];
    options.define = { ...(options.define || {}), 'process.env.NODE_DEBUG': 'undefined' };
  },
};

module.exports = defineConfig([
  {
    ...common,
    entry: { index: 'src/index.js' },
    format: ['esm', 'cjs'],
    platform: 'neutral',
    outDir: 'dist',
    clean: true,
  },
  {
    ...common,
    entry: { 'steem.min': 'src/browser.js' },
    format: ['iife'],
    globalName: 'steem',
    platform: 'browser',
    outDir: 'dist',
    minify: true,
    outExtension() { return { js: '.js' }; },
  },
]);
