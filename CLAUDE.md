# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

steem-js (`@steemit/steem-js`) is a JavaScript client library for the Steem blockchain. Source is written in ES modules under `src/` and compiled with Babel into two targets: a CommonJS build in `lib/` (Node) and a bundled `dist/steem.min.js` (browser, via webpack).

## Commands

```bash
npm run build          # build both browser (dist/) and node (lib/) targets
npm run build-browser  # webpack bundle -> dist/steem.min.js
npm run build-node     # babel src -> lib/
npm test               # run all mocha tests in test/*.js (via babel-node)
npm run test-auth      # run only the 'steem.auth' tests
npm run lint           # eslint src
```

Run a single test file or filter by name:

```bash
babel-node --presets @babel/preset-env node_modules/mocha/bin/mocha test/api.test.js
npm test -- --grep 'broadcast'   # filter all test files by description substring
```

Note: tests are run through `babel-node` (the source is not pre-compiled for tests). Many tests in `test/` hit the live `https://api.steemit.com` RPC node, so they require network access and can be flaky/slow.

## Architecture

The public API is a single object assembled in `src/index.js`, re-exporting the submodules: `api`, `auth`, `broadcast`, `formatter`, `memo`, `config`, `utils`. The package exports a **singleton** instance plus the `Steem` class (`exports.Steem`).

### `src/api/` — RPC client
- `index.js` defines the `Steem` class (extends `EventEmitter`). Its constructor dynamically generates a method for **every entry in `methods.js`**. For each method `foo` it creates `foo`, `fooWith` (takes an options object), and the bluebird-promisified `fooAsync` / `fooWithAsync`. So most read methods you'd expect (e.g. `getAccounts`, `getBlock`) are not written by hand — they come from `methods.js`.
- To add/change a read RPC call, edit `src/api/methods.js` (declares `api`, `method`, `params`). Do not hand-write wrappers.
- `transports/` selects between `http` (default, JSON-RPC over `cross-fetch`) and `ws` transports. `_setTransport` picks the transport from `options.url`/`options.transport`. RPC-style `call`/`signedCall` only work over http.
- `rpc-auth.js` signs authenticated RPC requests; `streamBlock*`/`streamOperations` poll `getDynamicGlobalProperties` to follow the chain.

### `src/broadcast/` — writing transactions
- `index.js` similarly **generates a broadcast helper for each entry in `operations.json`** (mirrored by `operations.js` which lists params + the key `roles` required). `send` builds the tx, sets `ref_block_num`/`ref_block_prefix`/`expiration` from dynamic global props, signs via `auth.signTransaction`, then calls `broadcastTransactionSynchronous`.
- `helpers.js` adds higher-level composed helpers (`addAccountAuth`, `removeKeyAuth`, etc.) that read the account, mutate its authority, and call `accountUpdate`.
- All broadcast methods accept either a trailing callback or return a Promise (`Promise.promisifyAll`).

### `src/auth/` — crypto, keys, serialization
- `index.js` (`steem.auth`): key derivation from username+password+role (`generateKeys`, `toWif`, `getPrivateKeys`), `verify`, `signTransaction`.
- `ecc/` low-level secp256k1 primitives (private/public keys, signatures, hashing, AES).
- `serializer/` binary serialization of operations/transactions. `serializer/src/operations.js` and `ChainTypes.js` define the wire format of every chain operation — these must match the blockchain's expected binary layout. `memo.js` handles encrypted memos.

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
