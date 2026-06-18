---
title: Memo
parent: Guide
nav_order: 6
---

# Memo

`steem.memo` encrypts and decrypts transfer memos. A memo is encrypted when it begins with a
`#`. Encryption uses the sender's private memo key and the recipient's public memo key;
decryption uses the recipient's (or sender's) private memo key.

All examples below assume:

```js
import steem from '@blazeapps/steem';
// CommonJS: const steem = require('@blazeapps/steem');
```

Memo crypto is AES-256-CBC via `@noble/ciphers` — pure JS, so encode/decode work on every
runtime and remain byte-compatible with the previous version.

## encode

```js
const encrypted = steem.memo.encode(privateMemoWif, recipientPublicMemoKey, '#a secret memo');
```

| Parameter | Description |
|---|---|
| `private_key` | The sender's private memo key (WIF or key object) |
| `public_key` | The recipient's public memo key (`STM…`) |
| `memo` | The plaintext memo; it must start with `#` to be encrypted |
| `testNonce` | *(optional)* fixed nonce, for deterministic testing |

Returns the encrypted memo string (begins with `#`). If the memo does not start with `#` it
is returned unchanged.

## decode

```js
const plaintext = steem.memo.decode(privateMemoWif, encryptedMemo);
```

| Parameter | Description |
|---|---|
| `private_key` | A private memo key that can decrypt the memo (WIF or key object) |
| `memo` | The encrypted memo string (begins with `#`) |

Returns the decrypted memo (with its leading `#` preserved). A memo that does not start with
`#` is returned unchanged.

## Example: send an encrypted transfer memo

```js
const senderKeys = steem.auth.getPrivateKeys('alice', 'master-password', ['memo']);
const [bob] = await steem.api.getAccountsAsync(['bob']);

const encrypted = steem.memo.encode(senderKeys.memo, bob.memo_key, '#thanks!');

await steem.broadcast.transfer(activeWif, 'alice', 'bob', '1.000 STEEM', encrypted);
```
