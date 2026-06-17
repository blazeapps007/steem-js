---
title: Cloudflare Workers
parent: Guide
nav_order: 1.6
---

# Cloudflare Workers

A complete guide to running `@blazeapps/steem` on [Cloudflare Workers](https://workers.cloudflare.com/).
The library is isomorphic and pure-JS, so it runs on the Workers runtime **without
`nodejs_compat`** — the crypto is `@noble` (no `Buffer`/Node built-ins), networking uses the
global `fetch`, and nothing reads `process` at import time.

All examples assume:

```js
import steem from '@blazeapps/steem';
```

- [Why it works with no compat flags](#why-it-works-with-no-compat-flags)
- [Quick start](#quick-start)
- [Configuration (wrangler)](#configuration-wrangler)
- [Reading from the chain](#reading-from-the-chain)
- [Concurrency: per-request clients](#concurrency-per-request-clients)
- [Secrets: storing a signing key](#secrets-storing-a-signing-key)
- [Signing & broadcasting](#signing--broadcasting)
- [Caching RPC reads (Cache API & KV)](#caching-rpc-reads-cache-api--kv)
- [Scheduled Workers (cron)](#scheduled-workers-cron)
- [Full example: a vote endpoint](#full-example-a-vote-endpoint)
- [Deploy](#deploy)
- [Runtime limits to know](#runtime-limits-to-know)

## Why it works with no compat flags

| Concern | How the library handles it |
|---|---|
| `Buffer` / Node built-ins | Not used at runtime — crypto is pure-JS `@noble`, bytes are `Uint8Array` |
| Networking | Uses the global `fetch` (native on Workers) |
| `process.env` reads | Guarded — the serializer's optional debug flag is wrapped in try/catch |
| WebSockets | Optional and lazy; Workers use the default **HTTP** transport |

So a Worker just needs to `import` the package. You do **not** need
`compatibility_flags = ["nodejs_compat"]`.

## Quick start

```bash
npm create cloudflare@latest steem-worker   # choose "Hello World" Worker
cd steem-worker
npm install @blazeapps/steem
```

Minimal Worker:

```js
// src/index.js
import steem from '@blazeapps/steem';

steem.api.setOptions({ url: 'https://api.steemit.com' });

export default {
  async fetch(request, env, ctx) {
    const [account] = await steem.api.getAccountsAsync(['ned']);
    return Response.json({ name: account.name, balance: account.balance });
  },
};
```

```bash
npx wrangler dev      # local
npx wrangler deploy   # ship it
```

## Configuration (wrangler)

`wrangler.toml`:

```toml
name = "steem-worker"
main = "src/index.js"
compatibility_date = "2024-09-23"
# No node_compat / nodejs_compat needed.

# Public, non-secret config can go here:
[vars]
STEEM_RPC_NODE = "https://api.steemit.com"
```

Or `wrangler.jsonc`:

```jsonc
{
  "name": "steem-worker",
  "main": "src/index.js",
  "compatibility_date": "2024-09-23",
  "vars": { "STEEM_RPC_NODE": "https://api.steemit.com" }
}
```

Read non-secret vars from the `env` argument: `env.STEEM_RPC_NODE`.

## Reading from the chain

Read-only endpoints only need an RPC node. Every `steem.api.*` method has an `Async` (Promise)
form:

```js
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const name = url.searchParams.get('account') || 'ned';

    const client = new steem.api.Steem({ url: env.STEEM_RPC_NODE });
    const [account] = await client.getAccountsAsync([name]);
    if (!account) return new Response('not found', { status: 404 });

    const props = await client.getDynamicGlobalPropertiesAsync();
    const sp = steem.formatter.vestingSteem(account, props);

    return Response.json({ name: account.name, steem_power: sp });
  },
};
```

## Concurrency: reads vs. broadcasting

The default `steem.api` is a **module-global singleton**, and **`steem.broadcast.*` always sends
through it** (broadcast internally imports `steem.api`). So configure the broadcast node once, at
the top of your handler:

```js
steem.api.setOptions({ url: env.STEEM_RPC_NODE });
```

Because every request targets the same node, this is idempotent and safe under concurrency.
Signing keys are **never** global — you pass the WIF to each `broadcast.*` call — so there is no
key bleed between in-flight requests.

For **reads**, you can use the global (`steem.api.getAccountsAsync`) or, if different requests
need different read nodes, construct an isolated client per request (this does **not** affect
broadcasting, which still uses the global node):

```js
const reader = new steem.api.Steem({ url: someNode });
const [account] = await reader.getAccountsAsync(['ned']);
```

Stateless crypto helpers (`steem.auth.*`, `steem.memo.*`, `steem.formatter.*`) hold no shared
state and are always safe to call directly.

## Secrets: storing a signing key

**Never** hard-code a private key or master password. Store it as an encrypted Worker secret:

```bash
npx wrangler secret put STEEM_POSTING_WIF
# paste the posting WIF (5...) when prompted
```

It arrives as `env.STEEM_POSTING_WIF` in the handler and is never bundled into your code.

> Security note: broadcasting from an edge endpoint means a key lives in your Worker's
> environment. Scope it to the **lowest** role you need (usually `posting`), put an auth check in
> front of write endpoints, and rate-limit them.

## Signing & broadcasting

Signing is offline (pure crypto); broadcasting makes one HTTP subrequest to the RPC node.

```js
export default {
  async fetch(request, env) {
    if (request.method !== 'POST') return new Response('use POST', { status: 405 });

    // Simple shared-secret gate (replace with real auth).
    if (request.headers.get('authorization') !== `Bearer ${env.API_SECRET}`)
      return new Response('unauthorized', { status: 401 });

    const { author, permlink, weight = 10000 } = await request.json();

    // broadcast.* sends through the global steem.api — point it at your node first.
    steem.api.setOptions({ url: env.STEEM_RPC_NODE });
    const tx = await steem.broadcast.vote(
      env.STEEM_POSTING_WIF, 'mybot', author, permlink, weight
    );

    return Response.json({ id: tx.id });
  },
};
```

> `steem.broadcast.*` returns a Promise when you omit the callback.

## Caching RPC reads (Cache API & KV)

Cut RPC subrequests by caching slow-changing reads.

**Cache API** (per-colo, great for `getDynamicGlobalProperties`-style data):

```js
async function cachedGlobalProps(client, ctx) {
  const key = new Request('https://cache/global-props');
  const hit = await caches.default.match(key);
  if (hit) return hit.json();

  const props = await client.getDynamicGlobalPropertiesAsync();
  const res = Response.json(props, { headers: { 'cache-control': 'max-age=3' } });
  ctx.waitUntil(caches.default.put(key, res.clone()));
  return props;
}
```

**KV** (global, for account snapshots, feed price, etc.) — bind a namespace in `wrangler.toml`:

```toml
[[kv_namespaces]]
binding = "STEEM_KV"
id = "<your-namespace-id>"
```

```js
let props = await env.STEEM_KV.get('global-props', 'json');
if (!props) {
  props = await client.getDynamicGlobalPropertiesAsync();
  ctx.waitUntil(env.STEEM_KV.put('global-props', JSON.stringify(props), { expirationTtl: 5 }));
}
```

## Scheduled Workers (cron)

Add a cron trigger and a `scheduled` handler — useful for periodic posting, reward claims, or
witness tasks.

```toml
# wrangler.toml
[triggers]
crons = ["*/15 * * * *"]   # every 15 minutes
```

```js
export default {
  async scheduled(event, env, ctx) {
    const client = new steem.api.Steem({ url: env.STEEM_RPC_NODE });
    const props = await client.getDynamicGlobalPropertiesAsync();
    // e.g. claim rewards, publish a scheduled post, etc.
    console.log('tick at block', props.head_block_number);
  },
};
```

Test locally: `npx wrangler dev --test-scheduled` then hit `/__scheduled`.

## Full example: a vote endpoint

A single Worker that reads on `GET` and votes on authenticated `POST`, with a fresh per-request
client and a cached global-props read.

```js
// src/index.js
import steem from '@blazeapps/steem';

export default {
  async fetch(request, env, ctx) {
    // Point the global client (used by both api reads and broadcast) at your node.
    steem.api.setOptions({ url: env.STEEM_RPC_NODE });

    if (request.method === 'GET') {
      const name = new URL(request.url).searchParams.get('account') || 'ned';
      const [account] = await steem.api.getAccountsAsync([name]);
      return account
        ? Response.json({ name: account.name, balance: account.balance })
        : new Response('not found', { status: 404 });
    }

    if (request.method === 'POST') {
      if (request.headers.get('authorization') !== `Bearer ${env.API_SECRET}`)
        return new Response('unauthorized', { status: 401 });

      const { author, permlink, weight = 10000 } = await request.json();
      try {
        const tx = await steem.broadcast.vote(
          env.STEEM_POSTING_WIF, 'mybot', author, permlink, weight
        );
        return Response.json({ ok: true, id: tx.id });
      } catch (err) {
        return Response.json({ ok: false, error: String(err.message || err) }, { status: 502 });
      }
    }

    return new Response('method not allowed', { status: 405 });
  },
};
```

```toml
# wrangler.toml
name = "steem-vote"
main = "src/index.js"
compatibility_date = "2024-09-23"
[vars]
STEEM_RPC_NODE = "https://api.steemit.com"
# secrets: API_SECRET, STEEM_POSTING_WIF  (set via `wrangler secret put`)
```

## Deploy

```bash
npx wrangler deploy            # deploy to *.workers.dev or your route
npx wrangler deploy --dry-run  # bundle check without deploying (CI-friendly)
npx wrangler tail              # live logs
```

## Runtime limits to know

- **CPU time** — signing a transaction is a few milliseconds of `@noble` work; comfortably under
  the free plan's 10 ms CPU limit, and far under the paid 30 s. (Wall-clock time waiting on RPC
  doesn't count against CPU time.)
- **Subrequests** — each RPC call is one `fetch` subrequest (50 on free, 1000 on paid per
  invocation). Cache hot reads (above) to stay well under.
- **No WebSockets outbound** — use the default HTTP transport; don't pass a `wss://` URL.
- **Statelessness** — never store keys in module globals; read them from `env` per request.

See also: [Runtimes overview](runtimes) · [Configuration](configuration) ·
[Broadcasting](broadcasting) · [Deno](deno).
