---
title: Install
parent: Guide
nav_order: 1
---

# Install

```sh
npm install @blazeapps/steem
# or: pnpm add @blazeapps/steem   /   yarn add @blazeapps/steem
```

Modernized build not yet on npm? Install from the fork branch:

```sh
npm install github:blazeapps007/steem-js#BlazeDevelopment
```

## Runtime support

| Runtime | Supported | Notes |
|---|---|---|
| Node.js | ✅ 18+ | Native `fetch`/`WebSocket`; ESM **and** CommonJS builds |
| Browsers (bundled) | ✅ | Via Vite/webpack/Rollup/esbuild — no Node polyfills needed |
| Browser `<script>` (CDN) | ✅ | Minified IIFE exposing a global `steem` |
| Cloudflare Workers / Vercel Edge | ✅ | No `Buffer`/Node builtins required at runtime |
| Deno | ✅ | `import … from 'npm:@blazeapps/steem'` |

For platform-specific setups and examples, see **[Runtimes](runtimes)**.

## Build outputs

The package ships three builds plus types, selected automatically via the `exports` map:

| File | Format | Used by |
|---|---|---|
| `dist/index.mjs` | ESM | `import` (bundlers, Node ESM, edge, Deno) |
| `dist/index.js` | CommonJS | `require` (Node CJS) |
| `dist/steem.min.js` | minified IIFE | `<script>` / CDN (global `steem`) |
| `dist/index.d.ts` | TypeScript declarations | editors / `tsc` |

## Import styles

```js
// ESM — default import (the full steem object)
import steem from '@blazeapps/steem';

// ESM — named imports (tree-shakeable)
import { api, broadcast, auth } from '@blazeapps/steem';

// CommonJS
const steem = require('@blazeapps/steem');
```

## Browser via CDN

```html
<script src="https://cdn.jsdelivr.net/npm/@blazeapps/steem/dist/steem.min.js"></script>
<script>
  steem.api.getAccounts(['ned', 'dan'], function (err, accounts) {
    console.log(err, accounts);
  });
</script>
```

## TypeScript

Types are bundled — no `@types/...` package needed. See the [TypeScript guide](typescript).

```ts
import steem from '@blazeapps/steem';
const [account] = await steem.api.getAccountsAsync(['ned']); // fully typed
```

## Building from source

```sh
git clone https://github.com/blazeapps007/steem-js
cd steem-js
npm install
npm run build   # tsup -> dist/{index.mjs,index.js,steem.min.js} + dist/index.d.ts
npm test        # vitest (offline); STEEM_LIVE=1 npm test for live integration
```
