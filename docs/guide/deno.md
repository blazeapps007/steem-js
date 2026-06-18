---
title: Deno & Deno Deploy
parent: Guide
nav_order: 1.7
---

# Deno & Deno Deploy

A complete guide to running `@blazeapps/steem` on [Deno](https://deno.com/) — locally, in scripts,
and as **Deno Deploy** edge functions. The library is ESM-first and pure-JS, so Deno needs no
shims: crypto is `@noble` (no `Buffer`/Node built-ins), networking uses the global `fetch`, and
the serializer's optional `process.env` read is guarded, so **no `--allow-env` is required**.

- [Importing](#importing)
- [Permissions model](#permissions-model)
- [Quick start (script)](#quick-start-script)
- [Reading from the chain](#reading-from-the-chain)
- [Signing offline & broadcasting](#signing-offline--broadcasting)
- [Deno Deploy (edge functions)](#deno-deploy-edge-functions)
- [Concurrency: per-request clients](#concurrency-per-request-clients)
- [Secrets & environment](#secrets--environment)
- [Caching with Deno KV](#caching-with-deno-kv)
- [WebSocket transport](#websocket-transport)
- [Testing](#testing)
- [Permissions cheat-sheet](#permissions-cheat-sheet)

## Importing

Deno consumes the package straight from npm via the `npm:` specifier.

```ts
import steem from 'npm:@blazeapps/steem';
```

Pin a version (recommended for reproducible deploys):

```ts
import steem from 'npm:@blazeapps/steem@^1';
```

Or centralize it in an **import map** (`deno.json`):

```jsonc
// deno.json
{
  "imports": {
    "steem": "npm:@blazeapps/steem@^1"
  }
}
```

```ts
import steem from 'steem';
```

## Permissions model

Deno is deny-by-default. This library only ever needs **network** access, and only when it
talks to an RPC node:

| Flag | Needed? | Why |
|---|---|---|
| `--allow-net` | **For RPC calls** | `getAccounts`, `broadcast.*`, streaming, etc. hit an HTTP node. Scope it: `--allow-net=api.steemit.com` |
| `--allow-env` | **No** | The serializer's optional debug flag read is wrapped in try/catch, so it never trips the env permission |
| `--allow-read` | **No** | Nothing reads the filesystem at runtime |

Pure-crypto work — `steem.auth.toWif`, `signTransaction`, `steem.memo.encode/decode`,
`steem.formatter.*` — needs **no permissions at all** and runs fully offline.

## Quick start (script)

```ts
// main.ts
import steem from 'npm:@blazeapps/steem';

steem.api.setOptions({ url: 'https://api.steemit.com' });

const [account] = await steem.api.getAccountsAsync(['ned']);
console.log(account.name, account.balance);
```

```bash
deno run --allow-net=api.steemit.com main.ts
```

Offline key derivation needs nothing:

```bash
deno run offline.ts   # no flags
```

```ts
// offline.ts
import steem from 'npm:@blazeapps/steem';
console.log(steem.auth.toWif('alice', Deno.env.get('PW') ?? 'pw', 'posting'));
```

## Reading from the chain

```ts
const client = new steem.api.Steem({ url: 'https://api.steemit.com' });

const [account] = await client.getAccountsAsync(['ned']);
const props = await client.getDynamicGlobalPropertiesAsync();
console.log('SP:', steem.formatter.vestingSteem(account, props));
```

## Signing offline & broadcasting

```ts
// Offline: no network permission needed to build + sign
const wif = steem.auth.toWif('alice', Deno.env.get('STEEM_PASSWORD')!, 'posting');

// Broadcasting needs --allow-net. broadcast.* sends through the global steem.api,
// so configure its node with setOptions (not a per-request client).
steem.api.setOptions({ url: 'https://api.steemit.com' });
const tx = await steem.broadcast.vote(wif, 'alice', 'ned', 'a-post-permlink', 10000);
console.log(tx.id);
```

## Deno Deploy (edge functions)

[Deno Deploy](https://deno.com/deploy) runs a `Deno.serve` handler at the edge. The library works
there unchanged — HTTP transport only (same as other edge runtimes).

```ts
// main.ts
import steem from 'npm:@blazeapps/steem';

const RPC = Deno.env.get('STEEM_RPC_NODE') ?? 'https://api.steemit.com';

// Point the global client (used by both api reads and broadcast) at your node, once.
steem.api.setOptions({ url: RPC });

Deno.serve(async (req) => {
  if (req.method === 'GET') {
    const name = new URL(req.url).searchParams.get('account') ?? 'ned';
    const [account] = await steem.api.getAccountsAsync([name]);
    return account
      ? Response.json({ name: account.name, balance: account.balance })
      : new Response('not found', { status: 404 });
  }

  if (req.method === 'POST') {
    if (req.headers.get('authorization') !== `Bearer ${Deno.env.get('API_SECRET')}`)
      return new Response('unauthorized', { status: 401 });

    const { author, permlink, weight = 10000 } = await req.json();
    try {
      const tx = await steem.broadcast.vote(
        Deno.env.get('STEEM_POSTING_WIF')!, 'mybot', author, permlink, weight,
      );
      return Response.json({ ok: true, id: tx.id });
    } catch (err) {
      return Response.json({ ok: false, error: String(err) }, { status: 502 });
    }
  }

  return new Response('method not allowed', { status: 405 });
});
```

Deploy with the CLI or from a GitHub repo:

```bash
deno install -gArf jsr:@deno/deployctl
deployctl deploy --project=steem-edge main.ts
```

On Deno Deploy, network and env access are granted by the platform — you don't pass `--allow-*`
flags there.

## Concurrency: per-request clients

`steem.api` is a **module-global singleton**, and **`steem.broadcast.*` always sends through it**.
Set the node once (at module scope, as above) with `steem.api.setOptions({ url: RPC })`. Since
every request uses the same node this is safe, and signing keys are passed per call — never
global — so there's no key bleed between concurrent requests.

If different requests need different **read** nodes, build an isolated client for those reads
(broadcasting still uses the global node):

```ts
const reader = new steem.api.Steem({ url: someNode });
const [account] = await reader.getAccountsAsync(['ned']);
```

Crypto helpers (`steem.auth`, `steem.memo`, `steem.formatter`) are stateless and always safe.

## Secrets & environment

- **Locally**, reading env requires `--allow-env` (that's *your* call to `Deno.env.get`, not the
  library): `deno run --allow-net --allow-env main.ts`. Scope it: `--allow-env=STEEM_POSTING_WIF`.
- **On Deno Deploy**, set secrets in the project dashboard (or `deployctl --env`/`--env-file`);
  they're available via `Deno.env.get(...)` with no flags.
- Never commit keys. Use the **lowest** role required (usually `posting`) and gate write
  endpoints behind auth + rate limiting.

## Caching with Deno KV

[Deno KV](https://docs.deno.com/deploy/kv/manual/) is great for caching slow-changing reads.

```ts
const kv = await Deno.openKv();

async function globalProps(client: any) {
  const cached = await kv.get(['global-props']);
  if (cached.value) return cached.value;
  const props = await client.getDynamicGlobalPropertiesAsync();
  await kv.set(['global-props'], props, { expireIn: 5000 }); // 5s TTL
  return props;
}
```

Locally, KV needs `--unstable-kv`. On Deno Deploy it's built in.

## WebSocket transport

Deno has a global `WebSocket`, so the ws transport works without the optional `ws` package:

```ts
steem.api.setOptions({ url: 'wss://your-node:port' }); // selects the ws transport
```

HTTP is the default and is recommended for edge/Deno Deploy. See [Configuration](configuration).

## Testing

Offline crypto/serialization is fully testable with zero permissions:

```ts
// steem_test.ts  —  deno test
import steem from 'npm:@blazeapps/steem';
import { assertEquals } from 'jsr:@std/assert';

Deno.test('derives a known WIF', () => {
  assertEquals(
    steem.auth.toWif('alice', 'password123', 'active'),
    '5HsARJZiSjTxTQhjbAeZgD1KLhqUvewkfWWPAMBiCTZvhBvL1Qp',
  );
});
```

```bash
deno test            # no flags for offline tests
deno test --allow-net=api.steemit.com   # if a test hits the network
```

## Permissions cheat-sheet

| Task | Command |
|---|---|
| Derive keys / sign / memo (offline) | `deno run offline.ts` |
| Read or broadcast (network) | `deno run --allow-net=api.steemit.com main.ts` |
| Read your own env secrets too | `deno run --allow-net --allow-env main.ts` |
| Use Deno KV locally | add `--unstable-kv` |

See also: [Runtimes overview](runtimes) · [Cloudflare Workers](cloudflare-workers) ·
[Configuration](configuration) · [Broadcasting](broadcasting).
