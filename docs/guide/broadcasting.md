---
title: Broadcasting
parent: Guide
nav_order: 3
---

# Broadcasting

`steem.broadcast.*` methods sign a transaction with your private key and send it to the
network. **They cause permanent changes on the blockchain.** For the full list of operations
and their signatures, see the [Broadcast reference](../reference/broadcast).

All examples below assume:

```js
import steem from '@blazeapps/steem';
// CommonJS: const steem = require('@blazeapps/steem');
```

## Callbacks or Promises

Every broadcast method works both ways. Omit the callback to get a Promise.

```js
const wif = steem.auth.toWif(username, password, 'posting');

// Promise (recommended)
steem.broadcast.vote(wif, voter, author, permlink, weight)
  .then(result => console.log(result))
  .catch(err => console.error(err));

// async / await
const result = await steem.broadcast.vote(wif, voter, author, permlink, weight);

// Callback (legacy)
steem.broadcast.vote(wif, voter, author, permlink, weight, (err, result) => {
  console.log(err, result);
});
```

An `Async`-suffixed variant (e.g. `voteAsync`) also exists for backwards compatibility, but
the plain method already returns a Promise when you skip the callback.

## Keys and roles

The first argument to every broadcast method is the signing key (`wif`). Each operation
requires a particular key **role** — the [Broadcast reference](../reference/broadcast) lists
the accepted roles per operation. Most social actions (vote, comment) accept `posting`;
moving funds requires `active`; account recovery and a few others require `owner`.

Derive a WIF from a username + master password with `steem.auth.toWif`, or use a stored
private key directly. See the [Auth guide](auth).

## How a transaction is built

`steem.broadcast.send` (which the per-operation methods call for you) does the following:

1. Fetches `getDynamicGlobalProperties` to set `ref_block_num`, `ref_block_prefix`, and a
   10-minute `expiration`.
2. Signs the transaction with your key(s) via `steem.auth.signTransaction`.
3. Calls `broadcast_transaction_synchronous` and resolves with the node's result merged with
   the signed transaction.

## Multisignature

Call `send` directly with an array of keys to sign with more than one:

```js
steem.broadcast.send(
  {
    extensions: [],
    operations: [
      ['vote', { voter: 'guest123', author: 'fabien', permlink: 'test', weight: 1000 }],
    ],
  },
  [privPostingWif1, privPostingWif2],
  (err, result) => console.log(err, result)
);
```

`send` also accepts a keys object keyed by role, e.g. `{ posting: wif }`.

## Account auth helpers

Four convenience methods read an account, modify one of its authorities, and broadcast the
`accountUpdate` for you — handy for granting posting access to another account or key:

```js
steem.broadcast.addAccountAuth(
  { signingKey, username: 'alice', authorizedUsername: 'someapp', role: 'posting' },
  (err, result) => console.log(err, result)
);
```

The full set — `addAccountAuth`, `removeAccountAuth`, `addKeyAuth`, `removeKeyAuth` — is
documented in the [Broadcast reference](../reference/broadcast#account-auth-helpers).
