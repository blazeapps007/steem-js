---
title: Streaming
parent: Guide
nav_order: 4
---

# Streaming

The library can follow the chain in real time by polling dynamic global properties. Each
stream method returns a **release function** — call it to stop streaming.

All four accept an optional `mode` of `'head'` (default) or `'irreversible'`. All examples
below assume:

```js
import steem from '@steemit/steem-js';
// CommonJS: const steem = require('@steemit/steem-js');
```

## streamBlockNumber

Fires for each new block number.

```js
const release = steem.api.streamBlockNumber((err, blockNum) => {
  console.log(blockNum);
});

// later
release();
```

You can also tune the poll interval (ms): `streamBlockNumber(mode, callback, ts)`.

## streamBlock

Fires with each full block object.

```js
const release = steem.api.streamBlock((err, block) => {
  console.log(block);
});
```

## streamTransactions

Fires once per transaction within each block.

```js
const release = steem.api.streamTransactions('head', (err, tx) => {
  console.log(tx);
});
```

## streamOperations

Fires once per operation — the most granular stream.

```js
const release = steem.api.streamOperations('head', (err, operation) => {
  const [opName, opPayload] = operation;
  if (opName === 'vote') console.log('vote', opPayload);
});
```

## Choosing a mode

- `'head'` — newest blocks, may still be reversed by a fork.
- `'irreversible'` — only blocks confirmed by enough witnesses; lags head but is final.
