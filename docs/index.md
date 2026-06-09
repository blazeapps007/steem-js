---
title: Home
layout: home
nav_order: 0
---

# Steem.js

The JavaScript API for the [Steem blockchain](https://steem.com). Works in Node.js and the
browser, over HTTP (JSON-RPC) or WebSocket.

```sh
npm install @steemit/steem-js --save
```

```js
const steem = require('@steemit/steem-js');

steem.api.getAccounts(['ned', 'dan'], (err, accounts) => {
  console.log(err, accounts);
});

// Promises work too:
const [account] = await steem.api.getAccountsAsync(['ned']);
```

## The library at a glance

`require('@steemit/steem-js')` returns a single object with these namespaces:

| Namespace | What it does | Docs |
|---|---|---|
| `steem.api` | Read calls to an RPC node (accounts, posts, blocks, market, witnesses…) | [API reference](reference/api) |
| `steem.broadcast` | Sign and broadcast write operations (vote, transfer, comment…) | [Broadcast reference](reference/broadcast) · [Broadcasting guide](guide/broadcasting) |
| `steem.auth` | Key derivation, WIF handling, transaction signing | [Auth guide](guide/auth) |
| `steem.memo` | Encrypt and decrypt transfer memos | [Memo guide](guide/memo) |
| `steem.formatter` | Reputation, VESTS↔STEEM, amounts, account value | [Formatter guide](guide/formatter) |
| `steem.utils` | Account-name validation, string helpers | [Utils guide](guide/utils) |
| `steem.config` | Endpoint, chain id, address prefix, testnet | [Configuration guide](guide/configuration) |

The `api` and `broadcast` references are **generated directly from the library's source**
([`methods.js`](https://github.com/blazeapps007/steem-js/blob/master/src/api/methods.js) and
[`operations.js`](https://github.com/blazeapps007/steem-js/blob/master/src/broadcast/operations.js)),
so they always list every method the installed version supports.

## Where to go next

- New here? Start with [Install](guide/install) and [Configuration](guide/configuration).
- Reading data → [API reference](reference/api).
- Writing to the chain → [Broadcasting guide](guide/broadcasting) and the
  [Broadcast reference](reference/broadcast).
- Following the chain in real time → [Streaming](guide/streaming).
