# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

steem-js (`@steemit/steem-js`) is an **isomorphic** JavaScript client library for the Steem blockchain — it runs unchanged on Node 18+, browsers, edge runtimes (Cloudflare Workers / Vercel Edge), and Deno. Source is ES-module JavaScript under `src/`, bundled with **tsup (esbuild)** into ESM (`dist/index.mjs`), CJS (`dist/index.js`), a minified IIFE (`dist/steem.min.js`, global `steem`), and generated types (`dist/index.d.ts`). Crypto is pure-JS via `@noble/*`/`@scure/base`; the serializer uses an in-repo `bytebuffer-lite` shim. There are no native modules and no Node-builtin imports in the shipped bundle (`Buffer` is injected from the pure-JS polyfill; `assert`/`events`/`debug` are aliased to tiny shims at build time; `ws` is an optional, lazily-imported dependency).

## Commands

```bash
npm run build          # tsup -> dist/{index.mjs,index.js,steem.min.js} + gen-types -> dist/index.d.ts
npm run dev            # tsup --watch
npm test               # vitest run (offline; live-network suites skipped)
STEEM_LIVE=1 npm test  # also run the live-network integration suites
npm run test-auth      # vitest filtered to 'steem.auth'
npm run gen-types      # regenerate dist/index.d.ts from methods.js/operations.js
npm run docs:generate  # regenerate docs/reference/*.md (babel-node; crypto-free path)
npm run lint           # eslint src
node scripts/smoke.mjs # byte-exact smoke test of the built bundle (Node + Deno)
```

Run a single test file or filter by name:

```bash
npx vitest run test/golden.test.js
npx vitest run -t 'memo'
```

Notes: tests run under **Vitest** (esbuild — handles the mixed ESM/CJS source and ESM-only `@noble`). `test/golden.test.js` freezes byte-exact crypto/serializer vectors and is the regression gate for any change to `auth/`. Live-network suites (`api`, `broadcast`, `comment`, `hf20`, `hf21`, `promise-broadcast`, `smt`) are gated behind `STEEM_LIVE=1` via the shim in `test/setup.js`. `docs:generate` still uses `babel-node` because it only imports the crypto-free descriptor/util files.

## Architecture

The public API is a single object assembled in `src/index.js`, re-exporting the submodules: `api`, `auth`, `broadcast`, `formatter`, `memo`, `config`, `utils`. The package exports a **singleton** instance plus the `Steem` class (`exports.Steem`).

### `src/api/` — RPC client
- `index.js` defines the `Steem` class (extends `EventEmitter`). Its constructor dynamically generates a method for **every entry in `methods.js`**. For each method `foo` it creates `foo`, `fooWith` (takes an options object), and the bluebird-promisified `fooAsync` / `fooWithAsync`. So most read methods you'd expect (e.g. `getAccounts`, `getBlock`) are not written by hand — they come from `methods.js`.
- To add/change a read RPC call, edit `src/api/methods.js` (declares `api`, `method`, `params`). Do not hand-write wrappers. After changing it, run `npm run gen-types` (and `npm run docs:generate`).
- `transports/` selects between `http` (default, JSON-RPC over the **native global `fetch`**) and `ws` transports. `ws.js` resolves a WebSocket via `globalThis.WebSocket`, falling back to a lazy `import('ws')` (optional dependency). `_setTransport` picks the transport from `options.url`/`options.transport`. RPC-style `call`/`signedCall` only work over http.
- `rpc-auth.js` signs authenticated RPC requests (hashing via `@noble`); `streamBlock*`/`streamOperations` poll `getDynamicGlobalProperties` to follow the chain.

### `src/broadcast/` — writing transactions
- `index.js` similarly **generates a broadcast helper for each entry in `operations.json`** (mirrored by `operations.js` which lists params + the key `roles` required). `send` builds the tx, sets `ref_block_num`/`ref_block_prefix`/`expiration` from dynamic global props, signs via `auth.signTransaction`, then calls `broadcastTransactionSynchronous`.
- `helpers.js` adds higher-level composed helpers (`addAccountAuth`, `removeKeyAuth`, etc.) that read the account, mutate its authority, and call `accountUpdate`.
- All broadcast methods accept either a trailing callback or return a Promise. The dual callback/Promise behavior comes from the tiny native-Promise helpers in `src/_promise.js` (`promisify`/`promisifyAll`/`nodeify`/`delay`) — the library no longer depends on `bluebird`.

### `src/auth/` — crypto, keys, serialization
- `index.js` (`steem.auth`): key derivation from username+password+role (`generateKeys`, `toWif`, `getPrivateKeys`), `verify`, `signTransaction`.
- `ecc/` low-level secp256k1 primitives on `@noble/curves`/`@noble/hashes`/`@noble/ciphers`: `curve.js` (shared point/order + bigint↔bytes helpers), `key_private.js`, `key_public.js`, `signature.js` (graphene RFC6979 nonce-retry signing — **must stay byte-exact**, guarded by `test/golden.test.js`), `hash.js`, `aes.js` (memo), `key_utils.js`, `address.js`. Keys use native `BigInt`, not `bigi`.
- `serializer/` binary serialization of operations/transactions. `serializer/src/operations.js` and `ChainTypes.js` define the wire format of every chain operation — these must match the blockchain's expected binary layout. `bytebuffer-lite.js` is the in-repo `Uint8Array`/`DataView` + BigInt `Long` replacement for the old `bytebuffer` dep. `memo.js` handles encrypted memos.
- **Any change here must keep `test/golden.test.js` green** (byte-exact WIFs, public keys, canonical signature, serialized tx hex, memo roundtrip).

### Config
- `src/config.js` wraps `config.json` (default RPC node `https://api.steemit.com`, `address_prefix` `STM`, `chain_id`). Change at runtime via `steem.api.setOptions({...})`. Setting `useTestNet: true` flips `address_prefix` to `TST`; testnet also needs a matching `chain_id` and `address_prefix` set explicitly.

## Code generation pattern (important)

The two core surfaces — read methods and broadcast operations — are **data-driven**. New chain calls are added by editing the JSON-like descriptor arrays (`api/methods.js`, `broadcast/operations.js`), not by writing per-method functions. When something is missing, check those descriptors first.

## Docs

The documentation site lives in `/docs` (Jekyll + just-the-docs) and is published to GitHub
Pages by GitHub's built-in branch build (Pages Source = "Deploy from a branch", folder
`/docs`) — there is no docs CI workflow.

The `steem.api` and `steem.broadcast` reference pages are **generated** by
`npm run docs:generate` ([scripts/gen-docs.js](scripts/gen-docs.js)). The generator drives
the complete method/operation list (and signatures, roles, RPC names) from the same
`methods.js`/`operations.js` descriptors, then splices in per-entry prose from
`docs/_details/api.md` and `docs/_details/broadcast.md` (blocks separated by `=== name`
lines, each containing a description, parameter table, example, and returns).

- **Never hand-edit** `docs/reference/api.md` or `docs/reference/broadcast.md` — they are
  generated and committed; regenerate and commit after changes.
- To enrich an entry, edit its `=== name` block in `docs/_details/`.
- To add a method/op, edit the descriptor array, add a matching `=== name` block, then run
  `npm run docs:generate` (it prints any entries still missing a detail block).
- Hand-written conceptual pages are in `docs/guide/`.

## Conventions

- Source uses ES module `import`/`export`; the older `auth/` and serializer code uses CommonJS `require` — match the style of the file you're editing.
- camelCase JS method names map to snake_case chain methods/operations via `camelCase` in `src/utils.js`.
- Lint config (`.eslintrc`) only errors on a few rules (`no-undef`, `no-const-assign`, etc.); most style issues are warnings.
