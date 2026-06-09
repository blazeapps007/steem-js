---
title: Home
layout: home
nav_order: 0
---

# Steem.js

The JavaScript API for the [Steem blockchain](https://steem.com) — now **isomorphic**: the
same package runs unchanged on **Node 18+, browsers, edge runtimes (Cloudflare Workers /
Vercel Edge), and Deno**. Pure-JS crypto (`@noble`), ESM + CJS + a CDN bundle, and shipped
TypeScript types.

```sh
npm install @steemit/steem-js
```

> Installing the modernized build before it's published to npm? Pull it straight from the
> fork branch:
> ```sh
> npm install github:blazeapps007/steem-js#BlazeDevelopment
> ```

```js
import steem from '@steemit/steem-js';

// Read (Promise or callback)
const [account] = await steem.api.getAccountsAsync(['ned']);

// Sign offline + broadcast (works on every runtime, no Node polyfills)
const wif = steem.auth.toWif(username, password, 'posting');
await steem.broadcast.vote(wif, voter, author, permlink, 10000);
```

## What's new

This release is a ground-up modernization that keeps the **public API identical** while
making the library fast, small, typed, and runnable everywhere. See
**[What's New](whats-new)** for the full story, and **[Runtimes](guide/runtimes)** for
copy-paste setups for Node, Vite, the browser, Cloudflare Workers, Vercel Edge, and Deno.

- **Isomorphic** — no `Buffer`/`window`/Node-builtin assumptions; runs on edge & Deno.
- **Modern crypto** — `@noble/curves` + `@noble/hashes` + `@noble/ciphers` (zero native deps).
  Signatures, keys, and memos are **byte-for-byte identical** to the previous version.
- **ESM + CJS + IIFE** builds with an `exports` map; tree-shakeable.
- **TypeScript types** shipped (`dist/index.d.ts`) with full method autocomplete.
- **Leaner** — ~25 legacy dependencies removed (`bigi`, `ecurve`, `bytebuffer`,
  `browserify-aes`, `cross-fetch`, `bluebird`, …).

## The library at a glance

`import steem from '@steemit/steem-js'` (or `const steem = require(...)`) gives an object
with these namespaces:

| Namespace | What it does | Docs |
|---|---|---|
| `steem.api` | Read calls to an RPC node (accounts, posts, blocks, market, witnesses…) | [API reference](reference/api) |
| `steem.broadcast` | Sign and broadcast write operations (vote, transfer, comment…) | [Broadcast reference](reference/broadcast) · [Broadcasting guide](guide/broadcasting) |
| `steem.auth` | Key derivation, WIF handling, transaction signing | [Auth guide](guide/auth) |
| `steem.memo` | Encrypt and decrypt transfer memos | [Memo guide](guide/memo) |
| `steem.formatter` | Reputation, VESTS↔STEEM, amounts, account value | [Formatter guide](guide/formatter) |
| `steem.utils` | Account-name validation, string helpers | [Utils guide](guide/utils) |
| `steem.config` | Endpoint, chain id, address prefix, testnet | [Configuration guide](guide/configuration) |

The `api` and `broadcast` references are **generated from the library's own source**
([`methods.js`](https://github.com/blazeapps007/steem-js/blob/master/src/api/methods.js) and
[`operations.js`](https://github.com/blazeapps007/steem-js/blob/master/src/broadcast/operations.js)),
so they always list every method in the installed version.

## Where to go next

- **[What's New](whats-new)** — everything that changed and why.
- **[Install](guide/install)** & **[Runtimes](guide/runtimes)** — set up on your platform.
- **[TypeScript](guide/typescript)** — typed usage.
- Reading data → **[API reference](reference/api)**.
- Writing to the chain → **[Broadcasting](guide/broadcasting)** + **[Broadcast reference](reference/broadcast)**.
- Following the chain live → **[Streaming](guide/streaming)**.
