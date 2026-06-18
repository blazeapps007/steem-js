---
title: What's New
nav_order: 3
---

# What's New — the modernization

This release is a ground-up modernization of steem-js. The **public API is unchanged** —
`steem.api.*`, `steem.broadcast.*`, `steem.auth`, `steem.memo`, `steem.formatter`,
`steem.utils`, `steem.config`, callbacks **and** Promises all work exactly as before — but
the internals, build, and dependency stack were rebuilt so the library runs everywhere and
ships small and typed.

> **Compatibility guarantee:** all cryptography and serialization is **byte-for-byte
> identical** to the previous version — WIFs, public keys, transaction signatures, serialized
> transaction hex, and encrypted memos. This is enforced by a frozen golden-vector test suite,
> so existing accounts, keys, and signed transactions keep working.

## Highlights

| Area | Before | Now |
|---|---|---|
| Runtimes | Node + bundled browser | **Node 18+, browser, edge (Workers/Vercel), Deno** |
| Crypto | `bigi` + `ecurve` + `create-hash`/`browserify-aes` | **`@noble/curves` + `@noble/hashes` + `@noble/ciphers`** |
| Serialization | `bytebuffer` (+ `Long`) | in-repo `Uint8Array` writer + native `BigInt` |
| Build | webpack 4 + Babel → CJS only | **tsup (esbuild) → ESM + CJS + IIFE** |
| Types | none | **shipped `.d.ts`** |
| Network | `cross-fetch`, `ws` (required) | native `fetch`; `ws` **optional**, lazy |
| Promises | `bluebird` | native Promises |
| Dependencies | ~30 | **6** runtime deps |

## Isomorphic by design

The library no longer assumes Node. It avoids Node-builtin module imports at runtime, uses
the global `fetch`/`WebSocket`, and bundles a pure-JS `Buffer` so it works where there is no
`Buffer` global. The result: the **same package** runs on Node, browsers, Cloudflare Workers,
Vercel Edge, and Deno. See [Runtimes](guide/runtimes) for per-platform examples, plus the
dedicated [Cloudflare Workers](guide/cloudflare-workers) and [Deno & Deno Deploy](guide/deno)
guides for edge deployments.

```js
// identical code on Node, Vite, a Worker, or Deno:
import steem from '@blazeapps/steem';
steem.api.setOptions({ url: 'https://api.steemit.com' });
const [account] = await steem.api.getAccountsAsync(['ned']);
```

## Modern, audited crypto (`@noble`)

The old `bigi`/`ecurve` elliptic-curve math and the `create-hash`/`browserify-aes` Node shims
were replaced with the zero-dependency, pure-JS [`@noble`](https://paulmillr.com/noble/) suite:

- `@noble/curves/secp256k1` — keys, signing, recovery
- `@noble/hashes` — sha256/sha512/ripemd160/hmac, WebCrypto-backed randomness
- `@noble/ciphers` — AES-256-CBC for memos
- `@scure/base` — base58 (alongside `bs58`)

The graphene-specific canonical signing (RFC6979 with the nonce-retry loop) was ported
verbatim, so signatures match exactly:

```js
const wif = steem.auth.toWif('alice', 'password123', 'active');
// → 5HsARJZiSjTxTQhjbAeZgD1KLhqUvewkfWWPAMBiCTZvhBvL1Qp   (same as before)
const pub = steem.auth.wifToPublic(wif);
// → STM7rn5ss3AdWAKMasVVFLWwn8J9MzawCAwkG9YA7FueZK8iaxQUB (same as before)
```

## ESM + CJS + CDN, with an `exports` map

```js
import steem from '@blazeapps/steem';            // ESM (bundlers, Node, edge, Deno)
import { api, broadcast } from '@blazeapps/steem'; // named, tree-shakeable
const steem = require('@blazeapps/steem');         // CommonJS
```

```html
<script src="https://cdn.jsdelivr.net/npm/@blazeapps/steem/dist/steem.min.js"></script>
```

## Native fetch, optional WebSocket

- HTTP transport uses the global `fetch` (override per call via `options.fetchMethod`).
- WebSocket uses the global `WebSocket`, falling back to the optional `ws` package on older
  Node. `ws` is an `optionalDependency` — install it only if you need ws on Node.

## Types included

```ts
import steem, { type SteemOptions } from '@blazeapps/steem';
const opts: SteemOptions = { url: 'https://api.steemit.com', useAppbaseApi: true };
steem.api.setOptions(opts);
const a = await steem.api.getAccountsAsync(['ned']); // autocompleted
```

See [TypeScript](guide/typescript).

## Leaner dependency tree

Removed: `bigi`, `ecurve`, `secp256k1`, `noble-secp256k1`, `bytebuffer`, `create-hash`,
`create-hmac`, `ripemd160`, `browserify-aes`, `secure-random`, `randombytes`, `safe-buffer`,
`cross-fetch`, `bluebird`, `detect-node`, `is-hex`, and the `*-browserify` / `stream-http` /
`util` / `assert` polyfills, plus webpack & Babel build tooling.

Remaining runtime dependencies: `@noble/ciphers`, `@noble/curves`, `@noble/hashes`,
`@scure/base`, `bs58`, `retry` (+ optional `ws`).

## Migrating

For almost everyone: **nothing to change** — same imports, same methods, same outputs.

- **Edge/Deno/Vite users:** remove any Node-polyfill plugins you added for this package; they
  are no longer needed.
- **WebSocket on older Node:** add `ws` to your dependencies (`npm install ws`).
- **Node version:** Node **18+** is required (for global `fetch`/`WebCrypto`).
- **`bluebird`-specific behavior:** methods now return **native** Promises. If you relied on
  bluebird-only methods (e.g. `.spread`, `instanceof BluebirdPromise`), switch to native
  equivalents (`Promise.all` + destructuring, etc.).

## Verified

Every change is gated by `test/golden.test.js` (byte-exact keys/signatures/serialization/memo)
and a cross-runtime smoke test (`scripts/smoke.mjs`) run in CI on Node 18/20/22 and Deno.
