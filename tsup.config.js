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

// Ensure a Web Crypto global (`globalThis.crypto`) so `@noble`'s `randomBytes` works on
// runtimes that don't expose one — chiefly Node 18 (it became a default global in Node 19+).
// Browsers, Deno, Cloudflare/Vercel edge, and Node 19+ already have it, so the guard makes
// this a no-op there and the `node:crypto` access never runs. Emitted as a raw build banner
// (esbuild does NOT transform banner text) with a NON-LITERAL specifier (`'node:'+'crypto'`)
// plus bundler-ignore comments, so no bundler ever statically resolves `node:crypto` — keeping
// edge/Deno bundles clean. ESM uses top-level await; CJS uses a synchronous require.
const cryptoBannerEsm =
  "if(!(globalThis.crypto&&globalThis.crypto.getRandomValues)){" +
  "try{globalThis.crypto=(await import(/* @vite-ignore */ /* webpackIgnore: true */ 'node:'+'crypto')).webcrypto;}catch(e){}}";
const cryptoBannerCjs =
  "if(!(globalThis.crypto&&globalThis.crypto.getRandomValues)){" +
  "try{globalThis.crypto=require('node:'+'crypto').webcrypto;}catch(e){}}";

const common = {
  target: 'es2020',
  sourcemap: true,
  external: ['ws'],
  // Bundle runtime deps into a self-contained dist. tsup externalizes `dependencies`
  // by default, which leaves `require("@noble/...")` in the CJS output — and @noble v2
  // is ESM-only, so that `require()` throws ERR_REQUIRE_ESM on Node 18 (Node 20.19+ only
  // allows require-of-ESM). Inlining them (esbuild transpiles @noble/@scure to CJS) makes
  // the CJS build work on Node 18 and keeps the bundle dependency-free at runtime.
  // Also force-bundle the builtin names (the shimPlugin redirects them to pure-JS shims).
  noExternal: [/^@noble\//, /^@scure\//, 'bs58', 'retry', /^(assert|events|debug)$/],
  esbuildPlugins: [shimPlugin],
  esbuildOptions(options, context) {
    options.inject = [bufferShim];
    options.define = { ...(options.define || {}), 'process.env.NODE_DEBUG': 'undefined' };
    if (context.format === 'esm') options.banner = { js: cryptoBannerEsm };
    else if (context.format === 'cjs') options.banner = { js: cryptoBannerCjs };
    // iife (browser) needs no banner — browsers always provide globalThis.crypto.
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
