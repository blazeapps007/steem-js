---
title: Install
parent: Guide
nav_order: 1
---

# Install

## Node.js

```sh
npm install @steemit/steem-js --save
```

```js
const steem = require('@steemit/steem-js');
```

## Browser

A pre-built bundle is published in `dist/steem.min.js`.

```html
<script src="./steem.min.js"></script>
<script>
  steem.api.getAccounts(['ned', 'dan'], function (err, response) {
    console.log(err, response);
  });
</script>
```

### CDN

```html
<script src="https://cdn.jsdelivr.net/npm/steem/dist/steem.min.js"></script>
```

### Webpack

See the [webpack usage example](https://github.com/blazeapps007/steem-js/blob/master/examples/webpack-example)
in the repository.

## Building from source

The published package is compiled by Babel/webpack from `src/`:

```sh
npm run build          # both targets
npm run build-node     # CommonJS -> lib/
npm run build-browser  # bundle  -> dist/steem.min.js
```
