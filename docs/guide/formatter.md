---
title: Formatter
parent: Guide
nav_order: 7
---

# Formatter

`steem.formatter` provides display and conversion helpers. It is constructed with the API
instance, so the helpers that need network data work against your configured endpoint.

All examples below assume:

```js
import steem from '@steemit/steem-js';
// CommonJS: const steem = require('@steemit/steem-js');
```

## reputation

Converts a raw reputation integer into the human 25-based score shown in UIs.

```js
steem.formatter.reputation(3512485230915);    // => 56
steem.formatter.reputation(3512485230915, 2); // => 56.07  (decimal_places optional)
```

## vestToSteem

Converts VESTS to STEEM using the global vesting totals.

```js
const sp = steem.formatter.vestToSteem(vestingShares, totalVestingShares, totalVestingFundSteem);
```

## vestingSteem

Convenience over `vestToSteem` that takes an account object and the global props.

```js
const [account] = await steem.api.getAccountsAsync(['username']);
const props = await steem.api.getDynamicGlobalPropertiesAsync();
const sp = steem.formatter.vestingSteem(account, props);
```

## amount

Formats a number and asset into a broadcast-ready string (3 decimal places).

```js
steem.formatter.amount(53.442346, 'STEEM'); // => '53.442 STEEM'
```

## numberWithCommas

Adds thousands separators. Operates on **strings**, not numbers.

```js
steem.formatter.numberWithCommas('53304432342.432'); // => '53,304,432,342.432'
```

## commentPermlink

Builds a valid reply permlink from the parent author and permlink.

```js
steem.formatter.commentPermlink('ned', 'a-selfie');
// => 're-ned-a-selfie-20170621t080403765z'
```

## createSuggestedPassword

Returns a random 32-character master-password-strength string.

```js
steem.formatter.createSuggestedPassword(); // => 'GAz3GYFvvQvgm7t2fQmwMDuXEzDqTzn9'
```

## estimateAccountValue

Estimates the USD value of an account's assets. Returns a Promise. Pass precomputed inputs
(`gprops`, `feed_price`, `open_orders`, `savings_withdraws`, `vesting_steem`) in the second
argument to avoid extra RPC calls.

```js
const [account] = await steem.api.getAccountsAsync(['username']);
const usd = await steem.formatter.estimateAccountValue(account);
```

## pricePerSteem

Derives the STEEM price from a feed-price object (`{ base, quote }`), or `undefined` if the
shape is not SBD/STEEM.

```js
const history = await steem.api.getFeedHistoryAsync();
const price = steem.formatter.pricePerSteem(history.current_median_history);
```
