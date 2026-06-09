---
title: Utils
parent: Guide
nav_order: 8
---

# Utils

`steem.utils` holds small standalone helpers.

## validateAccountName

Validates a Steem account name against the chain's rules. Returns `null` when the name is
valid, or a human-readable reason string when it is not.

```js
steem.utils.validateAccountName('test1234'); // => null  (valid)
steem.utils.validateAccountName('a1');        // => 'Account name should be longer.'
```

The rules it enforces: 3–16 characters; each dot-separated segment must start with a letter,
contain only lowercase letters, digits, and dashes, have no double dashes, and end with a
letter or digit.

## camelCase

Converts a `snake_case` string to `camelCase` — the same conversion the library uses to turn
RPC method names into JS method names.

```js
steem.utils.camelCase('example_string'); // => 'exampleString'
```
