---
title: Auth
parent: Guide
nav_order: 5
---

# Auth

`steem.auth` derives keys from a username + master password, validates WIFs, and signs
transactions. On Steem, the four key roles — `owner`, `active`, `posting`, `memo` — are each
derived deterministically from the account name, the role, and the master password.

## Deriving keys

```js
// One WIF (private key) for a role:
const postingWif = steem.auth.toWif('username', 'master-password', 'posting');

// Public keys for several roles:
const pubKeys = steem.auth.generateKeys('username', 'master-password', ['owner', 'active', 'posting', 'memo']);
// => { owner: 'STM…', active: 'STM…', posting: 'STM…', memo: 'STM…' }

// Private keys (and their matching public keys) for several roles:
const keys = steem.auth.getPrivateKeys('username', 'master-password', ['posting']);
// => { posting: '5J…', postingPubkey: 'STM…' }
```

`getPrivateKeys` defaults to all four roles when none are passed.

## Validating keys

```js
steem.auth.isWif(privWif);             // is this a structurally valid WIF?
steem.auth.wifToPublic(privWif);       // 'STM…' public key for a WIF
steem.auth.wifIsValid(privWif, pubWif); // does this WIF correspond to this public key?
steem.auth.isPubkey(pubkey, prefix);   // is this a valid public key for the address prefix?
```

## Verifying account authority

`verify` checks whether a username + password produces a key present in the given authority
object (for example, the `posting` authority from `getAccounts`):

```js
const [account] = await steem.api.getAccountsAsync(['username']);
const ok = steem.auth.verify('username', 'master-password', { posting: account.posting.key_auths });
```

## Signing a transaction

Most code never calls this directly — `steem.broadcast.*` signs for you. When you build a
transaction by hand:

```js
const signed = steem.auth.signTransaction(trx, [postingWif]);
```

It hashes the transaction with the configured `chain_id`, signs with each key, and returns
the transaction with `signatures` attached.

> **Security:** never send a master password or private key to a remote service. Derive
> keys locally and broadcast signed transactions.
