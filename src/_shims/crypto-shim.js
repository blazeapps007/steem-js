// Ensure a Web Crypto global (`globalThis.crypto`) so `@noble/hashes` `randomBytes`
// works on every runtime. Browsers, Deno, Cloudflare/Vercel edge, and Node >= 19
// already expose it, so this is a no-op there. Node 18 does NOT expose it as a
// default global — this wires it up from the built-in crypto module.
//
// `process.getBuiltinModule` (Node 18.20.4+, 20.16+, 22.3+) gives synchronous access
// to a built-in without a static/dynamic `node:` import, so edge/Deno bundles never
// reference `node:crypto` (the branch isn't reached there anyway).
//
// Exported and *called* (not a bare side-effect import) so it survives tree-shaking
// under the package's `sideEffects: false` setting. Idempotent.
let done = false;

export function ensureWebCrypto() {
  if (done) return;
  done = true;
  const g = globalThis;
  if (g.crypto && typeof g.crypto.getRandomValues === 'function') return;
  try {
    const proc = typeof process !== 'undefined' ? process : null;
    if (proc && typeof proc.getBuiltinModule === 'function') {
      const nodeCrypto = proc.getBuiltinModule('node:crypto');
      if (nodeCrypto && nodeCrypto.webcrypto) {
        g.crypto = nodeCrypto.webcrypto;
      }
    }
  } catch (e) {
    // Leave crypto undefined; randomBytes will surface a clear error if actually used.
  }
}
