---
title: Configuration
parent: Guide
nav_order: 2
---

# Configuration

## Choosing an endpoint and transport

The default endpoint is `https://api.steemit.com` over HTTP (JSON-RPC). Change it with
`setOptions`:

```js
// HTTP / JSON-RPC (recommended)
steem.api.setOptions({ url: 'https://api.steemit.com' });

// WebSocket
steem.api.setOptions({ url: 'wss://some.node:port' });
```

The transport is chosen from the URL scheme:

| URL scheme | Transport |
|---|---|
| `http://` or `https://` | HTTP JSON-RPC |
| `ws://` or `wss://` | WebSocket |

A few capabilities are HTTP-only — notably the raw [`call` / `signedCall`](#raw-rpc-calls)
methods, which throw if you are connected over WebSocket.

**Transport details (isomorphic):**

- HTTP uses the runtime's **global `fetch`** (Node 18+, browsers, edge, Deno). Override it
  per instance with `setOptions({ fetchMethod })` — handy for proxies, custom headers, auth,
  or tests.
- WebSocket uses the **global `WebSocket`** where available (browsers, Deno, Node 22+),
  falling back to the optional [`ws`](https://www.npmjs.com/package/ws) package on older Node
  (`npm install ws`). Edge runtimes are HTTP-only — use the default transport there.

```js
// Custom fetch (e.g. inject an API key / proxy)
steem.api.setOptions({
  url: 'https://api.steemit.com',
  fetchMethod: (uri, options) => fetch(uri, { ...options, headers: { ...options.headers, 'x-api-key': KEY } }),
});

// Automatic retries on transient failures (non-broadcast calls)
steem.api.setOptions({ url: 'https://api.steemit.com', retry: true });
steem.api.setOptions({ url: 'https://api.steemit.com', retry: { retries: 3, minTimeout: 200 } });
```

## `config.get` / `config.set`

`steem.config` holds the chain parameters. The defaults target Steem mainnet:

```js
steem.config.get('address_prefix'); // 'STM'
steem.config.get('chain_id');       // mainnet chain id
steem.config.set('address_prefix', 'STM');
```

To target a different chain (for example, an alternative network), set its prefix and chain
id explicitly:

```js
steem.api.setOptions({ url: 'wss://ws.example.io' });
steem.config.set('address_prefix', 'XYZ');
steem.config.set('chain_id', '<chain id hex>');
```

## Testnet

```js
steem.api.setOptions({
  address_prefix: 'TST',
  chain_id: '46d82ab7d8db682eb1959aed0ada039a6d49afa1602491f93dde9cac3e8e6c32',
  useTestNet: true,
});
```

Passing `useTestNet: true` to `setOptions` also flips `address_prefix` to `TST`. The chain
id can change between testnet launches; check the relevant announcement if signing fails.

## Other `setOptions` keys

| Option | Purpose |
|---|---|
| `url` | Endpoint; also selects the transport |
| `useTestNet` | Convenience flag; sets the `TST` address prefix |
| `logger` | A function `(…args)` or an object with a `.log` method, used to trace requests/responses |
| `transport` | Force a transport: `'http'`, `'ws'`, or a custom transport class |
| `fetchMethod` | A `fetch`-compatible function used by the HTTP transport (defaults to the global `fetch`) |
| `retry` | `true` for default retries, or an options object (`{ retries, minTimeout, … }`); broadcast ops are never retried |
| `useAppbaseApi` | Route calls through `condenser_api` |

`steem.api.setWebSocket(url)` and `steem.api.setUri(url)` are thin shortcuts over
`setOptions`.

## Raw RPC calls

Over HTTP you can issue arbitrary JSON-RPC calls without a generated wrapper:

```js
steem.api.call('condenser_api.get_accounts', [['ned']], (err, res) => {});

// Signed (authenticated) RPC call:
steem.api.signedCall(method, params, account, wif, (err, res) => {});
```

Both have `…Async` promise variants (`callAsync`, `signedCallAsync`).

## Multiple instances

The default export is a ready-to-use singleton (`steem.api`). To run more than one
connection, construct your own with the `Steem` class (attached as `steem.api.Steem`):

```js
import steem from '@blazeapps/steem';

const Node = steem.api.Steem;
const node = new Node({ url: 'https://api.steemit.com' });
const [account] = await node.getAccountsAsync(['ned']);
```
