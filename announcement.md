# 🚀 Modernizing Steem.js: Isomorphic, Edge-Ready, and Fully Documented

Steem.js is the JavaScript gateway to the STEEM blockchain — but its build and dependency
stack had aged. I'm upgrading my fork into a modern, runtime-agnostic library that works the
same whether you ship to Node, the browser, an edge function, or Deno.

## What's changing

- **Runs everywhere (isomorphic):** one package for **Node 18+, browsers, edge runtimes
  (Cloudflare Workers / Vercel Edge), and Deno** — no more `Buffer is not defined` surprises.
- **Vite-friendly ESM:** proper ESM + CJS builds with an `exports` map and per-runtime
  conditions, so modern bundlers just work. A minified `<script>` build stays for CDN users.
- **Modern, audited crypto:** replacing the old `bigi`/`ecurve`/`browserify-aes` stack with
  the zero-dependency, pure-JS **`@noble/curves`**, **`@noble/hashes`**, and **`@noble/ciphers`**
  — smaller, faster, and edge/Deno-safe. Signatures, keys, and memos remain byte-for-byte
  compatible (guarded by golden-vector tests).
- **Modern tooling:** webpack 4 + Babel → **tsup (esbuild)** builds and **Vitest** tests.
- **Types included:** shipped `.d.ts` for first-class editor autocomplete.
- **100% documented:** every API method and broadcast operation now has parameters, examples,
  and return shapes — auto-generated from source so the docs never drift.

## Backwards compatible

The public API is unchanged — `steem.api.*`, `steem.broadcast.*`, `steem.auth`, `steem.memo`,
`steem.formatter`, callbacks **and** promises all keep working. This is a runtime + tooling
upgrade, not a rewrite of how you use the library.

## Links

- 🛠️ Code (fork): https://github.com/blazeapps007/steem-js (`BlazeDevelopment` branch)
- 📖 Documentation: https://blazeapps007.github.io/steem-js/

Feedback and contributions welcome — issues and PRs against the fork are appreciated. 🙌

<center>
## Support Secure Steem Development

If you value proactive engineering, UX polish, and performance optimizations for the STEEM ecosystem, please consider supporting my witness: **blaze.apps**

🗳️ Vote Here:  
[Vote for blaze.apps Witness](https://auth.steem.fans/sign/ops/W1siYWNjb3VudF93aXRuZXNzX3ZvdGUiLHsiYWNjb3VudCI6Il9fc2lnbmVyIiwid2l0bmVzcyI6ImJsYXplLmFwcHMiLCJhcHByb3ZlIjp0cnVlfV1d)
</center>
