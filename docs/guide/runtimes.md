---
title: Runtimes
parent: Guide
nav_order: 1.5
---

# Runtimes

steem-js is **isomorphic** — one package, every JavaScript runtime. This page has copy-paste
setups for each. The crypto is pure-JS (`@noble`), networking uses the global `fetch`, and
`Buffer`/Node built-ins are not required at runtime, so nothing special is needed for edge or
Deno.

- [Node.js (ESM)](#nodejs-esm)
- [Node.js (CommonJS)](#nodejs-commonjs)
- [Vite / React / Vue / Svelte](#vite--react--vue--svelte)
- [Browser via `<script>` / CDN](#browser-via-script--cdn)
- [Cloudflare Workers](#cloudflare-workers)
- [Vercel Edge Functions](#vercel-edge-functions)
- [Deno](#deno)
- [WebSocket transport](#websocket-transport)

A note on async style: every `steem.api.*` method has a Promise variant (`…Async`) and a
callback variant; every `steem.broadcast.*` method returns a Promise when you omit the
callback. The examples below use `async/await`.

## Node.js (ESM)

`package.json` with `"type": "module"`, or a `.mjs` file:

```js
import steem from '@blazeapps/steem';

const [account] = await steem.api.getAccountsAsync(['ned']);
console.log(account.name, account.balance);

// Offline sign + broadcast
const wif = steem.auth.toWif('alice', process.env.STEEM_PASSWORD, 'posting');
const tx = await steem.broadcast.vote(wif, 'alice', 'ned', 'a-post-permlink', 10000);
console.log(tx.id);
```

## Node.js (CommonJS)

```js
const steem = require('@blazeapps/steem');

steem.api.getAccounts(['ned'], (err, accounts) => {
  if (err) throw err;
  console.log(accounts[0].balance);
});
```

## Vite / React / Vue / Svelte

Just import it — no polyfill config required (the old `Buffer`/`stream`/`crypto` shims are
gone).

```js
// src/steem.js
import steem from '@blazeapps/steem';
export default steem;
```

```jsx
// React example
import { useEffect, useState } from 'react';
import steem from '@blazeapps/steem';

export function Account({ name }) {
  const [acc, setAcc] = useState(null);
  useEffect(() => {
    let alive = true;
    steem.api.getAccountsAsync([name]).then(([a]) => alive && setAcc(a));
    return () => { alive = false; };
  }, [name]);
  return <pre>{acc ? acc.balance : 'loading…'}</pre>;
}
```

> If an older Vite/webpack config still injects Node polyfills for this package, you can
> remove them — they're no longer needed.

## Browser via `<script>` / CDN

The IIFE build exposes a global `steem`:

```html
<script src="https://cdn.jsdelivr.net/npm/@blazeapps/steem/dist/steem.min.js"></script>
<script>
  steem.api.getDynamicGlobalProperties(function (err, props) {
    console.log(props.head_block_number);
  });
</script>
```

## Cloudflare Workers

```js
// src/index.js
import steem from '@blazeapps/steem';

export default {
  async fetch(request) {
    // Point at an HTTP RPC node (edge runtimes are HTTP-only — no ws).
    steem.api.setOptions({ url: 'https://api.steemit.com' });
    const [account] = await steem.api.getAccountsAsync(['ned']);
    return new Response(JSON.stringify({ balance: account.balance }), {
      headers: { 'content-type': 'application/json' },
    });
  },
};
```

```toml
# wrangler.toml
name = "steem-worker"
main = "src/index.js"
compatibility_date = "2024-01-01"
```

No `node_compat` / `nodejs_compat` flag is required.

> **Full guide:** see [Cloudflare Workers](cloudflare-workers) for secrets, signing &
> broadcasting, Cache API / KV caching, cron-triggered Workers, and a complete vote endpoint.

## Vercel Edge Functions

```js
// app/api/account/route.js  (Next.js App Router)
import steem from '@blazeapps/steem';

export const runtime = 'edge';

export async function GET() {
  steem.api.setOptions({ url: 'https://api.steemit.com' });
  const [account] = await steem.api.getAccountsAsync(['ned']);
  return Response.json({ balance: account.balance });
}
```

## Deno

```ts
// main.ts  —  deno run --allow-net main.ts
import steem from 'npm:@blazeapps/steem';

steem.api.setOptions({ url: 'https://api.steemit.com' });
const [account] = await steem.api.getAccountsAsync(['ned']);
console.log(account.balance);
```

To pin a version: `import steem from 'npm:@blazeapps/steem@^1';`

> **Full guide:** see [Deno & Deno Deploy](deno) for the permissions model (no `--allow-env`
> needed), edge functions with `Deno.serve`, import maps, Deno KV caching, and testing.

## WebSocket transport

HTTP (JSON-RPC) is the default and works on every runtime. WebSocket is optional:

- **Browsers / Deno / Node 22+** use the global `WebSocket` automatically.
- **Older Node** falls back to the optional [`ws`](https://www.npmjs.com/package/ws) package —
  install it only if you need ws on Node: `npm install ws`.
- Edge runtimes are HTTP-only; use the default HTTP transport there.

```js
steem.api.setOptions({ url: 'wss://your-node:port' }); // selects the ws transport
```

See [Configuration](configuration) for transport and endpoint details.
