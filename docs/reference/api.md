---
title: API (steem.api)
parent: Reference
nav_order: 1
---

# API reference (`steem.api`)

Read calls against a Steem RPC node. Every method below is generated from [`src/api/methods.js`](https://github.com/blazeapps007/steem-js/blob/master/src/api/methods.js).

Each method has four call styles, created automatically:

| Style | Signature | Notes |
|---|---|---|
| Positional + callback | `steem.api.name(...args, cb)` | classic Node callback |
| Positional + promise | `steem.api.nameAsync(...args)` | returns a Promise |
| Options object + callback | `steem.api.nameWith({ ...opts }, cb)` | pass params by name |
| Options object + promise | `steem.api.nameWithAsync({ ...opts })` | returns a Promise |

Methods flagged **(object arg)** take a single object argument instead of positional params. Examples below use the callback form; swap in the `Async` form for Promises.

Total methods: **108**.

## Account By Key API

<small>RPC namespace: `account_by_key_api`</small>

### getKeyReferences

```js
steem.api.getKeyReferences(key, callback)
```

Returns the account(s) that use the given public key(s) in any authority — the reverse lookup from key to account.

**Parameters**

| Name | Type | Description |
|---|---|---|
| key | string[] | One or more public keys (`STM...`) |

**Example**
```js
steem.api.getKeyReferences(['STM7Q2r...'], (err, result) => console.log(result));
```

**Returns:** an array (aligned with input) of arrays of account names.

<small>RPC method: `get_key_references`</small>

## Condenser API

<small>RPC namespace: `condenser_api`</small>

### findProposals

```js
steem.api.findProposals(id_set, callback)
```

Looks up SPS/DHF (proposal system) proposals by id.

**Parameters**

| Name | Type | Description |
|---|---|---|
| id_set | number[] | Proposal ids to fetch |

**Example**
```js
steem.api.findProposals([0, 1], (err, result) => console.log(result));
```

**Returns:** an array of proposal objects.
```js
[ { id: 0, proposal_id: 0, creator: 'gtg', receiver: 'steem.dao',
    start_date: '2019-08-27T00:00:00', end_date: '2029-12-31T23:59:59',
    daily_pay: '240000000.000 SBD', subject: 'Return Proposal', permlink: 'steemdao',
    total_votes: '81911325896766565' } ]
```

<small>RPC method: `find_proposals`</small>

### getExpiringVestingDelegations

```js
steem.api.getExpiringVestingDelegations(account, start, limit, callback)
```

Returns delegations from an account that are expiring (being returned), starting at a given time.

**Parameters**

| Name | Type | Description |
|---|---|---|
| account | string | Delegator account |
| start | string | ISO datetime to start from |
| limit | number | Maximum records |

**Example**
```js
steem.api.getExpiringVestingDelegations('ned', '2018-01-01T00:00:00', 50, (err, result) => console.log(result));
```

**Returns:** an array of `{ delegator, vesting_shares, expiration }`.

<small>RPC method: `get_expiring_vesting_delegations`</small>

### getNaiPool

```js
steem.api.getNaiPool(callback)
```

Returns the pool of available NAI (asset) identifiers used when creating SMTs. Requires a node with SMT support — not available on Steem mainnet (returns an error there).

**Example**
```js
steem.api.getNaiPool((err, result) => console.log(result));
```

**Returns:** `{ nai_pool: ['@@...', ...] }`.

<small>RPC method: `get_nai_pool`</small>

### listProposals

```js
steem.api.listProposals(start, limit, order_by, order_direction, status, callback)
```

Lists SPS/DHF proposals with paging, ordering, and status filters.

**Parameters**

| Name | Type | Description |
|---|---|---|
| start | array | Start key for the chosen ordering |
| limit | number | Maximum to return (≤ 1000) |
| order_by | number | Sort field (e.g. by creator, start date, total votes) |
| order_direction | number | 0 = ascending, 1 = descending |
| status | number | Proposal status filter (all/active/inactive/…) |

**Example**
```js
steem.api.listProposals([], 10, 33, 1, 0, (err, result) => console.log(result));
```

**Returns:** an array of proposal objects.

<small>RPC method: `list_proposals`</small>

### listProposalVotes

```js
steem.api.listProposalVotes(start, limit, order_by, order_direction, status, callback)
```

Lists votes on SPS/DHF proposals with the same paging/ordering/status filters as [listProposals](#listproposals).

**Parameters**

| Name | Type | Description |
|---|---|---|
| start | array | Start key for the chosen ordering |
| limit | number | Maximum to return (≤ 1000) |
| order_by | number | Sort field |
| order_direction | number | 0 = ascending, 1 = descending |
| status | number | Status filter |

**Example**
```js
steem.api.listProposalVotes([], 10, 33, 1, 0, (err, result) => console.log(result));
```

**Returns:** an array of proposal-vote objects.

<small>RPC method: `list_proposal_votes`</small>

## Database API

<small>RPC namespace: `database_api`</small>

### cancelAllSubscriptions

```js
steem.api.cancelAllSubscriptions(callback)
```

Cancels every active subscription registered on the connection.

**Example**
```js
steem.api.cancelAllSubscriptions((err, result) => console.log(err, result));
```

**Returns:** `null` on success.

<small>RPC method: `cancel_all_subscriptions`</small>

### findChangeRecoveryAccountRequests **(object arg)**

```js
steem.api.findChangeRecoveryAccountRequests(account, callback)
```

Returns pending change-recovery-account requests for the given account name(s). Takes a single object argument.

**Parameters**

| Name | Type | Description |
|---|---|---|
| accounts | string[] | Account names to look up |

**Example**
```js
steem.api.findChangeRecoveryAccountRequests(['justyy222', 'ety001'], (err, result) => console.log(result));
```

**Returns:** `{ requests: [ { id, account_to_recover, recovery_account, effective_on } ] }`.

<small>RPC method: `find_change_recovery_account_requests`</small>

### getAccountBandwidth

```js
steem.api.getAccountBandwidth(account, bandwidthType, callback)
```

Returns an account's bandwidth usage. `bandwidthType` is 1 for forum (posting) and 2 for market (trading). The bandwidth plugin is often disabled on public nodes (resource credits replaced it post-HF20 — see [findRcAccounts](#findrcaccounts)), so this may return an error.

**Parameters**

| Name | Type | Description |
|---|---|---|
| account | string | Account name |
| bandwidthType | number | 1 = forum, 2 = market |

**Example**
```js
steem.api.getAccountBandwidth('ned', 1, (err, result) => console.log(result));
```

**Returns:** `{ account, type, average_bandwidth, lifetime_bandwidth, last_bandwidth_update }`.

<small>RPC method: `get_account_bandwidth`</small>

### getAccountCount

```js
steem.api.getAccountCount(callback)
```

Returns the total number of accounts on the chain.

**Example**
```js
steem.api.getAccountCount((err, result) => console.log(result)); // 1300000
```

**Returns:** an integer.

<small>RPC method: `get_account_count`</small>

### getAccountHistory

```js
steem.api.getAccountHistory(account, from, limit, callback)
```

Returns an account's operation history, newest-first, paged by sequence number. Use `from = -1` with a `limit` to fetch the most recent operations.

**Parameters**

| Name | Type | Description |
|---|---|---|
| account | string | Account name |
| from | number | Starting sequence number (`-1` for newest) |
| limit | number | How many to return (must be ≤ `from`; max 10000) |

**Example**
```js
steem.api.getAccountHistory('ned', -1, 100, (err, result) => console.log(result));
```

**Returns:** an array of `[sequence, { block, trx_id, trx_in_block, op_in_trx, virtual_op, timestamp, op: [name, payload] }]` entries.

<small>RPC method: `get_account_history`</small>

### getAccountReferences

```js
steem.api.getAccountReferences(accountId, callback)
```

Returns the account ids that reference a given account id. Often disabled on public nodes.

**Parameters**

| Name | Type | Description |
|---|---|---|
| accountId | number | Internal account id |

**Example**
```js
steem.api.getAccountReferences(1234, (err, result) => console.log(result));
```

**Returns:** an array of referencing account ids.

<small>RPC method: `get_account_references`</small>

### getAccounts

```js
steem.api.getAccounts(names, callback)
```

Returns full account objects for the given names. Accepts up to ~1000 names per call.

**Parameters**

| Name | Type | Description |
|---|---|---|
| names | string[] | Array of account names |

**Example**
```js
steem.api.getAccounts(['ned', 'dan'], (err, result) => console.log(result));
```

**Returns:** an array of account objects (balances, authorities, vesting, metadata, …).

<small>RPC method: `get_accounts`</small>

### getAccountVotes

```js
steem.api.getAccountVotes(voter, callback)
```

Returns all votes an account has ever cast.

**Parameters**

| Name | Type | Description |
|---|---|---|
| voter | string | Account name |

**Example**
```js
steem.api.getAccountVotes('ned', (err, result) => console.log(result));
```

**Returns:** an array of vote records (`authorperm`, `weight`, `rshares`, `percent`, `time`).

<small>RPC method: `get_account_votes`</small>

### getActiveCategories

```js
steem.api.getActiveCategories(after, limit, callback)
```

Legacy: categories ordered by recent activity.

**Parameters**

| Name | Type | Description |
|---|---|---|
| after | string | Category to begin after; `''` to start |
| limit | number | Maximum to return |

**Example**
```js
steem.api.getActiveCategories('', 10, (err, result) => console.log(result));
```

**Returns:** an array of category objects.

<small>RPC method: `get_active_categories`</small>

### getActiveVotes

```js
steem.api.getActiveVotes(author, permlink, callback)
```

Returns all votes cast on a post or comment.

**Parameters**

| Name | Type | Description |
|---|---|---|
| author | string | Post author |
| permlink | string | Post permlink |

**Example**
```js
steem.api.getActiveVotes('ned', 'my-post', (err, result) => console.log(result));
```

**Returns:** an array of `{ voter, weight, rshares, percent, reputation, time }`.

<small>RPC method: `get_active_votes`</small>

### getActiveWitnesses

```js
steem.api.getActiveWitnesses(callback)
```

Returns the names of the witnesses currently scheduled to produce blocks.

**Example**
```js
steem.api.getActiveWitnesses((err, result) => console.log(result));
```

**Returns:** an array of witness-name strings (21 entries).

<small>RPC method: `get_active_witnesses`</small>

### getBestCategories

```js
steem.api.getBestCategories(after, limit, callback)
```

Legacy: categories ordered "best". Largely superseded by tag queries.

**Parameters**

| Name | Type | Description |
|---|---|---|
| after | string | Category to begin after; `''` to start |
| limit | number | Maximum to return |

**Example**
```js
steem.api.getBestCategories('', 10, (err, result) => console.log(result));
```

**Returns:** an array of category objects.

<small>RPC method: `get_best_categories`</small>

### getBlock

```js
steem.api.getBlock(blockNum, callback)
```

Returns a full block by number, including all transactions.

**Parameters**

| Name | Type | Description |
|---|---|---|
| blockNum | number | Block height |

**Example**
```js
steem.api.getBlock(10000000, (err, result) => console.log(result));
```

**Returns:** the block header fields plus `transactions`, `transaction_ids`, `block_id`, `signing_key`, and `witness_signature`.

<small>RPC method: `get_block`</small>

### getBlockHeader

```js
steem.api.getBlockHeader(blockNum, callback)
```

Returns the header (no transactions) of a block by number.

**Parameters**

| Name | Type | Description |
|---|---|---|
| blockNum | number | Block height |

**Example**
```js
steem.api.getBlockHeader(10000000, (err, result) => console.log(result));
```

**Returns:** a block header.
```js
{ previous: '0098967f...', timestamp: '2017-03-08T17:34:21', witness: 'witness.acc',
  transaction_merkle_root: '0000...', extensions: [] }
```

<small>RPC method: `get_block_header`</small>

### getChainProperties

```js
steem.api.getChainProperties(callback)
```

Returns witness-voted chain properties (account creation fee, max block size, SBD interest rate).

**Example**
```js
steem.api.getChainProperties((err, result) => console.log(result));
```

**Returns:** `{ account_creation_fee, account_subsidy_budget, account_subsidy_decay, maximum_block_size, sbd_interest_rate }`.

<small>RPC method: `get_chain_properties`</small>

### getCommentDiscussionsByPayout

```js
steem.api.getCommentDiscussionsByPayout(query, callback)
```

Recent **comments** (not posts) ordered by pending payout. Default `limit` is 0.

**Parameters**

| Name | Type | Description |
|---|---|---|
| query | object | `{ limit, tag, ... }` discussion query |

**Example**
```js
steem.api.getCommentDiscussionsByPayout({ limit: 3, tag: 'steem' }, (err, result) => console.log(result));
```

**Returns:** an array of discussion (comment) objects.

<small>RPC method: `get_comment_discussions_by_payout`</small>

### getConfig

```js
steem.api.getConfig(callback)
```

Returns the node's compile-time configuration constants (asset symbols, limits, percentages).

**Example**
```js
steem.api.getConfig((err, result) => console.log(result));
```

**Returns:** an object of `STEEMIT_*` constants, e.g. `STEEMIT_CHAIN_ID`, `STEEMIT_MAX_VOTE_CHANGES`, `STEEM_SYMBOL`.

<small>RPC method: `get_config`</small>

### getContent

```js
steem.api.getContent(author, permlink, callback)
```

Returns a single post or comment with its metadata and current payout state.

**Parameters**

| Name | Type | Description |
|---|---|---|
| author | string | Author account |
| permlink | string | Content permlink |

**Example**
```js
steem.api.getContent('ned', 'my-post', (err, result) => console.log(result));
```

**Returns:** a content object (`title`, `body`, `json_metadata`, `net_votes`, `pending_payout_value`, …).

<small>RPC method: `get_content`</small>

### getContentReplies

```js
steem.api.getContentReplies(author, permlink, callback)
```

Returns the direct replies to a post or comment.

**Parameters**

| Name | Type | Description |
|---|---|---|
| author | string | Parent author |
| permlink | string | Parent permlink |

**Example**
```js
steem.api.getContentReplies('ned', 'my-post', (err, result) => console.log(result));
```

**Returns:** an array of content (reply) objects.

<small>RPC method: `get_content_replies`</small>

### getConversionRequests

```js
steem.api.getConversionRequests(accountName, callback)
```

Returns an account's pending SBD→STEEM conversion requests.

**Parameters**

| Name | Type | Description |
|---|---|---|
| accountName | string | Account name |

**Example**
```js
steem.api.getConversionRequests('ned', (err, result) => console.log(result));
```

**Returns:** an array of `{ id, owner, requestid, amount, conversion_date }`.

<small>RPC method: `get_conversion_requests`</small>

### getCurrentMedianHistoryPrice

```js
steem.api.getCurrentMedianHistoryPrice(callback)
```

Returns just the current median price feed (base/quote).

**Example**
```js
steem.api.getCurrentMedianHistoryPrice((err, result) => console.log(result));
```

**Returns:** a price object `{ base, quote }` of aggregate amounts, e.g. `{ base: '59379011.253 SBD', quote: '549521217.137 STEEM' }`.

<small>RPC method: `get_current_median_history_price`</small>

### getDiscussionsByActive

```js
steem.api.getDiscussionsByActive(query, callback)
```

Posts ordered by most recent activity (new comments/votes). Default `limit` is 0.

**Parameters**

| Name | Type | Description |
|---|---|---|
| query | object | `{ limit, tag, ... }` discussion query |

**Example**
```js
steem.api.getDiscussionsByActive({ limit: 3, tag: 'steem' }, (err, result) => console.log(result));
```

**Returns:** an array of discussion objects.

<small>RPC method: `get_discussions_by_active`</small>

### getDiscussionsByAuthorBeforeDate

```js
steem.api.getDiscussionsByAuthorBeforeDate(author, startPermlink, beforeDate, limit, callback)
```

Returns an author's posts created before a given date — the canonical way to page a blog backwards in time.

**Parameters**

| Name | Type | Description |
|---|---|---|
| author | string | Author account |
| startPermlink | string | Permlink to start before; `''` for newest |
| beforeDate | string | ISO datetime upper bound |
| limit | number | Maximum posts (≤ 100) |

**Example**
```js
steem.api.getDiscussionsByAuthorBeforeDate('ned', '', '2018-01-01T00:00:00', 10, (err, result) => console.log(result));
```

**Returns:** an array of discussion objects.

<small>RPC method: `get_discussions_by_author_before_date`</small>

### getDiscussionsByBlog

```js
steem.api.getDiscussionsByBlog(query, callback)
```

Posts and resteems in an account's blog. Requires `tag` set to the account name. Default `limit` is 0.

**Parameters**

| Name | Type | Description |
|---|---|---|
| query | object | `{ limit, tag: '<account>' }` |

**Example**
```js
steem.api.getDiscussionsByBlog({ limit: 3, tag: 'ned' }, (err, result) => console.log(result));
```

**Returns:** an array of discussion objects.

<small>RPC method: `get_discussions_by_blog`</small>

### getDiscussionsByCashout

```js
steem.api.getDiscussionsByCashout(query, callback)
```

Posts ordered by upcoming cashout (payout) time. Default `limit` is 0.

**Parameters**

| Name | Type | Description |
|---|---|---|
| query | object | `{ limit, tag, ... }` discussion query |

**Example**
```js
steem.api.getDiscussionsByCashout({ limit: 3, tag: 'steem' }, (err, result) => console.log(result));
```

**Returns:** an array of discussion objects.

<small>RPC method: `get_discussions_by_cashout`</small>

### getDiscussionsByChildren

```js
steem.api.getDiscussionsByChildren(query, callback)
```

Posts ordered by number of child comments. Default `limit` is 0.

**Parameters**

| Name | Type | Description |
|---|---|---|
| query | object | `{ limit, tag, ... }` discussion query |

**Example**
```js
steem.api.getDiscussionsByChildren({ limit: 3, tag: 'steem' }, (err, result) => console.log(result));
```

**Returns:** an array of discussion objects.

<small>RPC method: `get_discussions_by_children`</small>

### getDiscussionsByComments

```js
steem.api.getDiscussionsByComments(query, callback)
```

An author's recent comments. Requires `start_author` (and usually `start_permlink`) in the query. Default `limit` is 0.

**Parameters**

| Name | Type | Description |
|---|---|---|
| query | object | `{ limit, start_author, start_permlink }` |

**Example**
```js
steem.api.getDiscussionsByComments({ limit: 3, start_author: 'ned', start_permlink: '' }, (err, result) => console.log(result));
```

**Returns:** an array of discussion (comment) objects.

<small>RPC method: `get_discussions_by_comments`</small>

### getDiscussionsByCreated

```js
steem.api.getDiscussionsByCreated(query, callback)
```

Posts ordered newest-first by creation time. Default `limit` is 0.

**Parameters**

| Name | Type | Description |
|---|---|---|
| query | object | `{ limit, tag, ... }` discussion query |

**Example**
```js
steem.api.getDiscussionsByCreated({ limit: 3, tag: 'steem' }, (err, result) => console.log(result));
```

**Returns:** an array of discussion objects.

<small>RPC method: `get_discussions_by_created`</small>

### getDiscussionsByFeed

```js
steem.api.getDiscussionsByFeed(query, callback)
```

Posts in an account's feed (followed authors + their resteems). Requires `tag` set to the account name. Default `limit` is 0.

**Parameters**

| Name | Type | Description |
|---|---|---|
| query | object | `{ limit, tag: '<account>' }` |

**Example**
```js
steem.api.getDiscussionsByFeed({ limit: 3, tag: 'ned' }, (err, result) => console.log(result));
```

**Returns:** an array of discussion objects.

<small>RPC method: `get_discussions_by_feed`</small>

### getDiscussionsByHot

```js
steem.api.getDiscussionsByHot(query, callback)
```

Posts as shown on the hot tab. Default `limit` is 0.

**Parameters**

| Name | Type | Description |
|---|---|---|
| query | object | `{ limit, tag, ... }` discussion query |

**Example**
```js
steem.api.getDiscussionsByHot({ limit: 3, tag: 'steem' }, (err, result) => console.log(result));
```

**Returns:** an array of discussion objects.

<small>RPC method: `get_discussions_by_hot`</small>

### getDiscussionsByPayout

```js
steem.api.getDiscussionsByPayout(query, callback)
```

Posts ordered by total payout. Default `limit` is 0.

**Parameters**

| Name | Type | Description |
|---|---|---|
| query | object | `{ limit, tag, ... }` discussion query |

**Example**
```js
steem.api.getDiscussionsByPayout({ limit: 3, tag: 'steem' }, (err, result) => console.log(result));
```

**Returns:** an array of discussion objects.

<small>RPC method: `get_discussions_by_payout`</small>

### getDiscussionsByPromoted

```js
steem.api.getDiscussionsByPromoted(query, callback)
```

Posts ordered by how much was spent to promote them. Default `limit` is 0.

**Parameters**

| Name | Type | Description |
|---|---|---|
| query | object | `{ limit, tag, ... }` discussion query |

**Example**
```js
steem.api.getDiscussionsByPromoted({ limit: 3, tag: 'steem' }, (err, result) => console.log(result));
```

**Returns:** an array of discussion objects.

<small>RPC method: `get_discussions_by_promoted`</small>

### getDiscussionsByTrending

```js
steem.api.getDiscussionsByTrending(query, callback)
```

Posts as shown on the trending tab. Default `limit` is 0.

**Parameters**

| Name | Type | Description |
|---|---|---|
| query | object | `{ limit, tag, ... }` discussion query |

**Example**
```js
steem.api.getDiscussionsByTrending({ limit: 3, tag: 'steem' }, (err, result) => console.log(result));
```

**Returns:** an array of discussion objects.

<small>RPC method: `get_discussions_by_trending`</small>

### getDiscussionsByTrending30

```js
steem.api.getDiscussionsByTrending30(query, callback)
```

Like [getDiscussionsByTrending](#getdiscussionsbytrending) but over a 30-day trending window. Default `limit` is 0.

**Parameters**

| Name | Type | Description |
|---|---|---|
| query | object | `{ limit, tag, ... }` discussion query |

**Example**
```js
steem.api.getDiscussionsByTrending30({ limit: 3, tag: 'steem' }, (err, result) => console.log(result));
```

**Returns:** an array of discussion objects.

<small>RPC method: `get_discussions_by_trending30`</small>

### getDiscussionsByVotes

```js
steem.api.getDiscussionsByVotes(query, callback)
```

Posts ordered by net vote count. Default `limit` is 0.

**Parameters**

| Name | Type | Description |
|---|---|---|
| query | object | `{ limit, tag, ... }` discussion query |

**Example**
```js
steem.api.getDiscussionsByVotes({ limit: 3, tag: 'steem' }, (err, result) => console.log(result));
```

**Returns:** an array of discussion objects.

<small>RPC method: `get_discussions_by_votes`</small>

### getDynamicGlobalProperties

```js
steem.api.getDynamicGlobalProperties(callback)
```

Returns frequently-changing chain state (head block, time, supplies, vesting totals). Used internally to build transactions.

**Example**
```js
steem.api.getDynamicGlobalProperties((err, result) => console.log(result));
```

**Returns:** the dynamic global properties.
```js
{ head_block_number: 20000000, time: '2018-02-10T20:00:00',
  current_supply: '...', total_vesting_fund_steem: '...', total_vesting_shares: '...',
  last_irreversible_block_num: 19999980 }
```

<small>RPC method: `get_dynamic_global_properties`</small>

### getEscrow

```js
steem.api.getEscrow(from, escrowId, callback)
```

Returns a specific escrow transfer by the sender and escrow id.

**Parameters**

| Name | Type | Description |
|---|---|---|
| from | string | Account that created the escrow |
| escrowId | number | Escrow id |

**Example**
```js
steem.api.getEscrow('ned', 23456789, (err, result) => console.log(result));
```

**Returns:** the escrow object, or `null`.

<small>RPC method: `get_escrow`</small>

### getFeedHistory

```js
steem.api.getFeedHistory(callback)
```

Returns the current and historical median price feed used for SBD conversions.

**Example**
```js
steem.api.getFeedHistory((err, result) => console.log(result));
```

**Returns:** `{ current_median_history: { base, quote }, price_history: [ ... ] }`.

<small>RPC method: `get_feed_history`</small>

### getHardforkVersion

```js
steem.api.getHardforkVersion(callback)
```

Returns the chain's current hardfork version as a plain string (not JSON).

**Example**
```js
steem.api.getHardforkVersion((err, result) => console.log(result)); // '0.23.0'
```

**Returns:** a version string.

<small>RPC method: `get_hardfork_version`</small>

### getLiquidityQueue

```js
steem.api.getLiquidityQueue(startAccount, limit, callback)
```

Returns the legacy liquidity-reward queue starting from an account.

**Parameters**

| Name | Type | Description |
|---|---|---|
| startAccount | string | Account to start from; `''` for the top |
| limit | number | Maximum entries |

**Example**
```js
steem.api.getLiquidityQueue('', 10, (err, result) => console.log(result));
```

**Returns:** an array of liquidity-reward records.

<small>RPC method: `get_liquidity_queue`</small>

### getMinerQueue

```js
steem.api.getMinerQueue(callback)
```

Returns the legacy proof-of-work miner queue.

**Example**
```js
steem.api.getMinerQueue((err, result) => console.log(result));
```

**Returns:** an array of miner account names (empty post-mining).

<small>RPC method: `get_miner_queue`</small>

### getNextScheduledHardfork

```js
steem.api.getNextScheduledHardfork(callback)
```

Returns the next scheduled hardfork version and its activation time, if any.

**Example**
```js
steem.api.getNextScheduledHardfork((err, result) => console.log(result));
```

**Returns:** `{ hf_version, live_time }`.

<small>RPC method: `get_next_scheduled_hardfork`</small>

### getOpenOrders

```js
steem.api.getOpenOrders(owner, callback)
```

Returns an account's open limit orders on the internal market.

**Parameters**

| Name | Type | Description |
|---|---|---|
| owner | string | Account name |

**Example**
```js
steem.api.getOpenOrders('ned', (err, result) => console.log(result));
```

**Returns:** an array of open-order objects (`id`, `orderid`, `for_sale`, `sell_price`, …).

<small>RPC method: `get_open_orders`</small>

### getOpsInBlock

```js
steem.api.getOpsInBlock(blockNum, onlyVirtual, callback)
```

Returns all operations in a block, including virtual operations. Set `onlyVirtual` to `true` for virtual operations only.

**Parameters**

| Name | Type | Description |
|---|---|---|
| blockNum | number | Block height |
| onlyVirtual | boolean | `true` = virtual ops only; `false` = all |

**Example**
```js
steem.api.getOpsInBlock(10000001, false, (err, result) => console.log(result));
```

**Returns:** an array of operation records.
```js
[ { trx_id: '4b688c13...', block: 10000001, trx_in_block: 0, op_in_trx: 0,
    virtual_op: 0, timestamp: '2017-03-08T17:34:24', op: [ 'vote', { /* ... */ } ] } ]
```

<small>RPC method: `get_ops_in_block`</small>

### getOrderBook

```js
steem.api.getOrderBook(limit, callback)
```

Returns the internal-market order book (top bids and asks) from the database API.

**Parameters**

| Name | Type | Description |
|---|---|---|
| limit | number | Depth per side (≤ 500) |

**Example**
```js
steem.api.getOrderBook(5, (err, result) => console.log(result));
```

**Returns:** `{ bids: [...], asks: [...] }` with order-price/levels. See also [getMarketOrderBook](#getmarketorderbook).

<small>RPC method: `get_order_book`</small>

### getOwnerHistory

```js
steem.api.getOwnerHistory(account, callback)
```

Returns recent owner-authority changes for an account (used during recovery).

**Parameters**

| Name | Type | Description |
|---|---|---|
| account | string | Account name |

**Example**
```js
steem.api.getOwnerHistory('ned', (err, result) => console.log(result));
```

**Returns:** an array of past owner authorities with timestamps.

<small>RPC method: `get_owner_history`</small>

### getPostDiscussionsByPayout

```js
steem.api.getPostDiscussionsByPayout(query, callback)
```

Recent **posts** ordered by pending payout. The default `limit` is 0 — set one in the query or you get an empty result.

**Parameters**

| Name | Type | Description |
|---|---|---|
| query | object | `{ limit, tag, ... }` discussion query |

**Example**
```js
steem.api.getPostDiscussionsByPayout({ limit: 3, tag: 'photography' }, (err, result) => console.log(result));
```

**Returns:** an array of discussion (post) objects.

<small>RPC method: `get_post_discussions_by_payout`</small>

### getPotentialSignatures

```js
steem.api.getPotentialSignatures(trx, callback)
```

Returns every public key that could potentially be required to sign the transaction.

**Parameters**

| Name | Type | Description |
|---|---|---|
| trx | object | Transaction object |

**Example**
```js
steem.api.getPotentialSignatures(trx, (err, result) => console.log(result));
```

**Returns:** an array of public keys.

<small>RPC method: `get_potential_signatures`</small>

### getRecentCategories

```js
steem.api.getRecentCategories(after, limit, callback)
```

Legacy: most recently used categories.

**Parameters**

| Name | Type | Description |
|---|---|---|
| after | string | Category to begin after; `''` to start |
| limit | number | Maximum to return |

**Example**
```js
steem.api.getRecentCategories('', 10, (err, result) => console.log(result));
```

**Returns:** an array of category objects.

<small>RPC method: `get_recent_categories`</small>

### getRecoveryRequest

```js
steem.api.getRecoveryRequest(account, callback)
```

Returns the pending account-recovery request for an account, if any.

**Parameters**

| Name | Type | Description |
|---|---|---|
| account | string | Account being recovered |

**Example**
```js
steem.api.getRecoveryRequest('ned', (err, result) => console.log(result));
```

**Returns:** the request object, or `null` if none is pending.

<small>RPC method: `get_recovery_request`</small>

### getRepliesByLastUpdate

```js
steem.api.getRepliesByLastUpdate(startAuthor, startPermlink, limit, callback)
```

Returns replies to an author, ordered by last update — i.e. the author's "recent replies" inbox.

**Parameters**

| Name | Type | Description |
|---|---|---|
| startAuthor | string | Author whose replies to fetch |
| startPermlink | string | Permlink to start from; `''` for newest |
| limit | number | Maximum replies (≤ 100) |

**Example**
```js
steem.api.getRepliesByLastUpdate('ned', '', 10, (err, result) => console.log(result));
```

**Returns:** an array of reply (content) objects.

<small>RPC method: `get_replies_by_last_update`</small>

### getRequiredSignatures

```js
steem.api.getRequiredSignatures(trx, availableKeys, callback)
```

Given a transaction and a set of available keys, returns the subset of keys actually required to sign it.

**Parameters**

| Name | Type | Description |
|---|---|---|
| trx | object | Transaction object |
| availableKeys | string[] | Candidate public keys |

**Example**
```js
steem.api.getRequiredSignatures(trx, ['STM...'], (err, result) => console.log(result));
```

**Returns:** an array of required public keys.

<small>RPC method: `get_required_signatures`</small>

### getRewardFund

```js
steem.api.getRewardFund(name, callback)
```

Returns a named reward fund's current balance and parameters.

**Parameters**

| Name | Type | Description |
|---|---|---|
| name | string | Fund name, usually `'post'` |

**Example**
```js
steem.api.getRewardFund('post', (err, result) => console.log(result));
```

**Returns:** `{ id, name, reward_balance, recent_claims, last_update, content_constant, percent_content_rewards, percent_curation_rewards, author_reward_curve, curation_reward_curve }`.

<small>RPC method: `get_reward_fund`</small>

### getSavingsWithdrawFrom

```js
steem.api.getSavingsWithdrawFrom(account, callback)
```

Returns pending savings withdrawals initiated by an account.

**Parameters**

| Name | Type | Description |
|---|---|---|
| account | string | Account name |

**Example**
```js
steem.api.getSavingsWithdrawFrom('ned', (err, result) => console.log(result));
```

**Returns:** an array of pending savings-withdrawal objects.

<small>RPC method: `get_savings_withdraw_from`</small>

### getSavingsWithdrawTo

```js
steem.api.getSavingsWithdrawTo(account, callback)
```

Returns pending savings withdrawals destined for an account.

**Parameters**

| Name | Type | Description |
|---|---|---|
| account | string | Account name |

**Example**
```js
steem.api.getSavingsWithdrawTo('ned', (err, result) => console.log(result));
```

**Returns:** an array of pending savings-withdrawal objects.

<small>RPC method: `get_savings_withdraw_to`</small>

### getState

```js
steem.api.getState(path, callback)
```

Returns a large state bundle for a frontend `path`. Used to render whole pages in one call.

**Parameters**

| Name | Type | Description |
|---|---|---|
| path | string | A frontend route, e.g. `/@username`, `/@username/permlink`, `/trending`, `/trending/tag` |

**Example**
```js
steem.api.getState('/@ned', (err, result) => console.log(result));
```

**Returns:** an object keyed by section.
```js
{ accounts: { username: { /* ... */ } },
  content:  { 'username/permlink': { /* ... */ } },
  current_route: '/@username',
  feed_price: { base: '3.889 SBD', quote: '1.000 STEEM' },
  props: { /* ... */ }, tags: { /* ... */ }, witness_schedule: { /* ... */ } }
```

<small>RPC method: `get_state`</small>

### getTagsUsedByAuthor

```js
steem.api.getTagsUsedByAuthor(author, callback)
```

Lists the tags an author has used, with a usage weight. Most accounts return an empty list.

**Parameters**

| Name | Type | Description |
|---|---|---|
| author | string | A Steem account name |

**Example**
```js
steem.api.getTagsUsedByAuthor('good-karma', (err, result) => console.log(result));
```

**Returns:** array of `[tag, weight]` pairs, e.g. `[ [ 'challenge', 0 ] ]`.

<small>RPC method: `get_tags_used_by_author`</small>

### getTransaction

```js
steem.api.getTransaction(trxId, callback)
```

Returns a previously-included transaction by id. Requires a node with transaction history enabled.

**Parameters**

| Name | Type | Description |
|---|---|---|
| trxId | string | Transaction id (hex) |

**Example**
```js
steem.api.getTransaction('6fde0190a97835ea6d9e651293e90c89911f933c', (err, result) => console.log(result));
```

**Returns:** the signed transaction object.

<small>RPC method: `get_transaction`</small>

### getTransactionHex

```js
steem.api.getTransactionHex(trx, callback)
```

Serializes a transaction to its hex wire format (without broadcasting).

**Parameters**

| Name | Type | Description |
|---|---|---|
| trx | object | A transaction object |

**Example**
```js
steem.api.getTransactionHex(trx, (err, result) => console.log(result));
```

**Returns:** a hex string.

<small>RPC method: `get_transaction_hex`</small>

### getTrendingCategories

```js
steem.api.getTrendingCategories(after, limit, callback)
```

Legacy: trending categories after a given name. Prefer [getTrendingTags](#gettrendingtags).

**Parameters**

| Name | Type | Description |
|---|---|---|
| after | string | Category to begin after; `''` to start |
| limit | number | Maximum to return |

**Example**
```js
steem.api.getTrendingCategories('', 10, (err, result) => console.log(result));
```

**Returns:** an array of category objects.

<small>RPC method: `get_trending_categories`</small>

### getTrendingTags

```js
steem.api.getTrendingTags(afterTag, limit, callback)
```

Returns the currently trending tags in descending order by value. Pass the empty string `''` for `afterTag` to start at the top, then pass the last returned tag name to page forward.

**Parameters**

| Name | Type | Description |
|---|---|---|
| afterTag | string | Last tag to begin after; `''` to start |
| limit | number | Maximum number of tags to return |

**Example**
```js
steem.api.getTrendingTags('', 2, (err, result) => console.log(result));
```

**Returns:** an array of tag stats.
```js
[ { name: '', total_payouts: '37610793.383 SBD', net_votes: 4211122, top_posts: 411832, comments: 1344461, trending: '5549490701' },
  { name: 'life', total_payouts: '8722947.658 SBD', net_votes: 1498401, top_posts: 127103, comments: 54049, trending: '570954588' } ]
```

<small>RPC method: `get_trending_tags`</small>

### getVestingDelegations

```js
steem.api.getVestingDelegations(account, from, limit, callback)
```

Returns delegations made from an account, denominated in VESTS. Paginate with the last delegatee's name in `from`.

**Parameters**

| Name | Type | Description |
|---|---|---|
| account | string | Delegator account |
| from | string | Last delegatee seen; `''` to start |
| limit | number | Maximum records (≤ 1000) |

**Example**
```js
steem.api.getVestingDelegations('ned', '', 50, (err, result) => console.log(result));
```

**Returns:** an array of `{ id, delegator, delegatee, vesting_shares, min_delegation_time }`. See also [delegateVestingShares](broadcast#delegatevestingshares).

<small>RPC method: `get_vesting_delegations`</small>

### getWithdrawRoutes

```js
steem.api.getWithdrawRoutes(account, withdrawRouteType, callback)
```

Returns an account's power-down (vesting withdraw) routes.

**Parameters**

| Name | Type | Description |
|---|---|---|
| account | string | Account name |
| withdrawRouteType | number | 0 = incoming, 1 = outgoing, 2 = all |

**Example**
```js
steem.api.getWithdrawRoutes('ned', 1, (err, result) => console.log(result));
```

**Returns:** an array of `{ from_account, to_account, percent, auto_vest }`.

<small>RPC method: `get_withdraw_routes`</small>

### getWitnessByAccount

```js
steem.api.getWitnessByAccount(accountName, callback)
```

Returns the witness owned by an account.

**Parameters**

| Name | Type | Description |
|---|---|---|
| accountName | string | Witness account name |

**Example**
```js
steem.api.getWitnessByAccount('blocktrades', (err, result) => console.log(result));
```

**Returns:** a witness object (`owner`, `url`, `total_missed`, `votes`, `props`, `signing_key`, `running_version`, `sbd_exchange_rate`, …) or `null`.

<small>RPC method: `get_witness_by_account`</small>

### getWitnessCount

```js
steem.api.getWitnessCount(callback)
```

Returns the total number of registered witnesses.

**Example**
```js
steem.api.getWitnessCount((err, result) => console.log(result));
```

**Returns:** an integer.

<small>RPC method: `get_witness_count`</small>

### getWitnesses

```js
steem.api.getWitnesses(witnessIds, callback)
```

Returns witness objects by their internal ids.

**Parameters**

| Name | Type | Description |
|---|---|---|
| witnessIds | number[] | Array of witness ids |

**Example**
```js
steem.api.getWitnesses([0, 1, 2], (err, result) => console.log(result));
```

**Returns:** an array of witness objects.

<small>RPC method: `get_witnesses`</small>

### getWitnessesByVote

```js
steem.api.getWitnessesByVote(from, limit, callback)
```

Returns witnesses ordered by vote weight, starting from a name.

**Parameters**

| Name | Type | Description |
|---|---|---|
| from | string | Witness name to start from; `''` for the top |
| limit | number | Maximum to return (≤ 100) |

**Example**
```js
steem.api.getWitnessesByVote('', 25, (err, result) => console.log(result));
```

**Returns:** an array of witness objects, highest-voted first.

<small>RPC method: `get_witnesses_by_vote`</small>

### getWitnessSchedule

```js
steem.api.getWitnessSchedule(callback)
```

Returns the current witness scheduling object (shuffled witnesses, median props, weights).

**Example**
```js
steem.api.getWitnessSchedule((err, result) => console.log(result));
```

**Returns:** the witness schedule, including `current_shuffled_witnesses`, `num_scheduled_witnesses`, and `median_props`.

<small>RPC method: `get_witness_schedule`</small>

### lookupAccountNames

```js
steem.api.lookupAccountNames(accountNames, callback)
```

Returns account objects for an exact list of names (like [getAccounts](#getaccounts)); missing names come back as `null`.

**Parameters**

| Name | Type | Description |
|---|---|---|
| accountNames | string[] | Array of account names |

**Example**
```js
steem.api.lookupAccountNames(['ned', 'doesnotexist'], (err, result) => console.log(result));
```

**Returns:** an array aligned with the input, `null` where a name doesn't exist.

<small>RPC method: `lookup_account_names`</small>

### lookupAccounts

```js
steem.api.lookupAccounts(lowerBoundName, limit, callback)
```

Returns account names alphabetically from a lower bound — useful for autocomplete.

**Parameters**

| Name | Type | Description |
|---|---|---|
| lowerBoundName | string | Name to start from |
| limit | number | Maximum names to return (≤ 1000) |

**Example**
```js
steem.api.lookupAccounts('ned', 10, (err, result) => console.log(result));
```

**Returns:** an array of account-name strings.

<small>RPC method: `lookup_accounts`</small>

### lookupWitnessAccounts

```js
steem.api.lookupWitnessAccounts(lowerBoundName, limit, callback)
```

Returns witness account names alphabetically from a lower bound.

**Parameters**

| Name | Type | Description |
|---|---|---|
| lowerBoundName | string | Name to start from |
| limit | number | Maximum to return (≤ 1000) |

**Example**
```js
steem.api.lookupWitnessAccounts('', 100, (err, result) => console.log(result));
```

**Returns:** an array of witness-name strings.

<small>RPC method: `lookup_witness_accounts`</small>

### setBlockAppliedCallback

```js
steem.api.setBlockAppliedCallback(cb, callback)
```

Registers a callback fired each time a new block is applied to the chain. WebSocket transport only. For most use cases prefer [streamBlock](../guide/streaming).

**Parameters**

| Name | Type | Description |
|---|---|---|
| cb | function | Invoked with each newly applied block header |

**Example**
```js
steem.api.setBlockAppliedCallback((err, header) => console.log(header), (err, result) => {});
```

**Returns:** `null` on success; block headers arrive via `cb`.

<small>RPC method: `set_block_applied_callback`</small>

### setPendingTransactionCallback

```js
steem.api.setPendingTransactionCallback(cb, callback)
```

Registers a callback fired for each transaction that enters the node's pending (mempool) state. WebSocket transport only.

**Parameters**

| Name | Type | Description |
|---|---|---|
| cb | function | Invoked with each pending transaction |

**Example**
```js
steem.api.setPendingTransactionCallback((err, tx) => console.log(tx), (err, result) => {});
```

**Returns:** `null` on success; transactions arrive via `cb`.

<small>RPC method: `set_pending_transaction_callback`</small>

### setSubscribeCallback

```js
steem.api.setSubscribeCallback(callback, clearFilter, callback)
```

Registers a callback that the node calls when subscribed objects change (WebSocket transport only). `clearFilter` resets any existing subscription filter.

**Parameters**

| Name | Type | Description |
|---|---|---|
| callback | function | Invoked on each matching change |
| clearFilter | boolean | Reset the current subscription filter first |

**Example**
```js
steem.api.setSubscribeCallback(myCallback, true, (err, result) => {
  console.log(err, result);
});
```

**Returns:** `null` on success; updates arrive via `callback`.

<small>RPC method: `set_subscribe_callback`</small>

### verifyAccountAuthority

```js
steem.api.verifyAccountAuthority(nameOrId, signers, callback)
```

Returns whether a set of keys would satisfy an account's authority for the given level.

**Parameters**

| Name | Type | Description |
|---|---|---|
| nameOrId | string | Account name |
| signers | string[] | Public keys to test |

**Example**
```js
steem.api.verifyAccountAuthority('ned', ['STM...'], (err, result) => console.log(result));
```

**Returns:** a boolean.

<small>RPC method: `verify_account_authority`</small>

### verifyAuthority

```js
steem.api.verifyAuthority(trx, callback)
```

Returns whether a transaction carries all the signatures its operations require.

**Parameters**

| Name | Type | Description |
|---|---|---|
| trx | object | A signed transaction |

**Example**
```js
steem.api.verifyAuthority(signedTrx, (err, result) => console.log(result)); // true
```

**Returns:** a boolean.

<small>RPC method: `verify_authority`</small>

## Follow API

<small>RPC namespace: `follow_api`</small>

### getAccountReputations

```js
steem.api.getAccountReputations(lowerBoundName, limit, callback)
```

Returns reputation scores for `limit` accounts whose names are closest to `lowerBoundName`.

**Parameters**

| Name | Type | Description |
|---|---|---|
| lowerBoundName | string | Name to start from |
| limit | number | Maximum to return |

**Example**
```js
steem.api.getAccountReputations('ned', 5, (err, result) => console.log(result));
```

**Returns:** an array of `{ account, reputation }` (raw reputation; format with [formatter.reputation](../guide/formatter#reputation)).

<small>RPC method: `get_account_reputations`</small>

### getBlog

```js
steem.api.getBlog(account, entryId, limit, callback)
```

Returns an account's blog as full discussion objects (posts and resteems).

**Parameters**

| Name | Type | Description |
|---|---|---|
| account | string | Blog account |
| entryId | number | Entry id to start from; `0` for newest |
| limit | number | Maximum entries (≤ 500) |

**Example**
```js
steem.api.getBlog('ned', 0, 10, (err, result) => console.log(result));
```

**Returns:** an array of `{ comment, blog, reblog_on, entry_id }` (`comment` is a full content object).

<small>RPC method: `get_blog`</small>

### getBlogAuthors

```js
steem.api.getBlogAuthors(blogAccount, callback)
```

Returns everyone who has appeared in an account's blog, with how many times. Requires the follow plugin; not exposed on every public node.

**Parameters**

| Name | Type | Description |
|---|---|---|
| blogAccount | string | Blog account |

**Example**
```js
steem.api.getBlogAuthors('ned', (err, result) => console.log(result));
```

**Returns:** an array of `[author, count]` pairs.

<small>RPC method: `get_blog_authors`</small>

### getBlogEntries

```js
steem.api.getBlogEntries(account, entryId, limit, callback)
```

Returns an account's blog as lightweight entries (posts and resteems).

**Parameters**

| Name | Type | Description |
|---|---|---|
| account | string | Blog account |
| entryId | number | Entry id to start from; `0` for newest |
| limit | number | Maximum entries (≤ 500) |

**Example**
```js
steem.api.getBlogEntries('ned', 0, 10, (err, result) => console.log(result));
```

**Returns:** an array of `{ author, blog, entry_id, permlink, reblogged_on }`.

<small>RPC method: `get_blog_entries`</small>

### getFeed

```js
steem.api.getFeed(account, entryId, limit, callback)
```

Returns a user's feed (followed authors plus their resteems) as full discussion objects.

**Parameters**

| Name | Type | Description |
|---|---|---|
| account | string | Account whose feed to read |
| entryId | number | Entry id to start from; `0` for newest |
| limit | number | Maximum entries (≤ 500) |

**Example**
```js
steem.api.getFeed('ned', 0, 10, (err, result) => console.log(result));
```

**Returns:** an array of `{ comment, reblog_by, reblog_on, entry_id }` where `comment` is a full content object.

<small>RPC method: `get_feed`</small>

### getFeedEntries

```js
steem.api.getFeedEntries(account, entryId, limit, callback)
```

Returns a user's feed as lightweight entries. `reblog_by` is populated when the post appears because it was resteemed.

**Parameters**

| Name | Type | Description |
|---|---|---|
| account | string | Account whose feed to read |
| entryId | number | Entry id to start from; `0` for newest |
| limit | number | Maximum entries (≤ 500) |

**Example**
```js
steem.api.getFeedEntries('ned', 0, 10, (err, result) => console.log(result));
```

**Returns:** an array of `{ author, permlink, reblog_by, reblog_on, entry_id }`.

<small>RPC method: `get_feed_entries`</small>

### getFollowCount

```js
steem.api.getFollowCount(account, callback)
```

Returns the follower and following totals for an account.

**Parameters**

| Name | Type | Description |
|---|---|---|
| account | string | Account name (no leading `@`) |

**Example**
```js
steem.api.getFollowCount('ned', (err, result) => console.log(result));
```

**Returns:** `{ account, follower_count, following_count }`.

<small>RPC method: `get_follow_count`</small>

### getFollowers

```js
steem.api.getFollowers(following, startFollower, followType, limit, callback)
```

Returns accounts that follow `following`, alphabetically. Page forward using the last follower's name.

**Parameters**

| Name | Type | Description |
|---|---|---|
| following | string | Account being followed (no leading `@`) |
| startFollower | string | Follower to start from; `''` to start |
| followType | string | `'blog'` (or `0`); `'ignore'` for mutes |
| limit | number | Maximum to return (≤ 1000) |

**Example**
```js
steem.api.getFollowers('ned', '', 'blog', 10, (err, result) => console.log(result));
```

**Returns:** an array of `{ follower, following, reputation, what: ['blog', ''] }`.

<small>RPC method: `get_followers`</small>

### getFollowing

```js
steem.api.getFollowing(follower, startFollowing, followType, limit, callback)
```

Returns accounts that `follower` follows, alphabetically.

**Parameters**

| Name | Type | Description |
|---|---|---|
| follower | string | Account doing the following |
| startFollowing | string | Followed account to start from; `''` to start |
| followType | string | `'blog'` (or `0`); `'ignore'` for mutes |
| limit | number | Maximum to return (≤ 1000) |

**Example**
```js
steem.api.getFollowing('dan', '', 'blog', 10, (err, result) => console.log(result));
```

**Returns:** an array of `{ follower, following, reputation, what: ['blog', ''] }`.

<small>RPC method: `get_following`</small>

### getRebloggedBy

```js
steem.api.getRebloggedBy(author, permlink, callback)
```

Returns the accounts that reblogged (resteemed) a given post. Requires the follow plugin; not exposed on every public node.

**Parameters**

| Name | Type | Description |
|---|---|---|
| author | string | Post author |
| permlink | string | Post permlink |

**Example**
```js
steem.api.getRebloggedBy('ned', 'my-post', (err, result) => console.log(result));
```

**Returns:** an array of account-name strings (includes the original author).

<small>RPC method: `get_reblogged_by`</small>

## Login API

<small>RPC namespace: `login_api`</small>

### getApiByName

```js
steem.api.getApiByName(database_api, callback)
```

Returns the numeric API id for a named API on legacy WebSocket nodes. Rarely needed with modern `condenser_api`/HTTP.

**Parameters**

| Name | Type | Description |
|---|---|---|
| database_api | string | The API name to resolve, e.g. `'database_api'` |

**Example**
```js
steem.api.getApiByName('database_api', (err, result) => console.log(result));
```

**Returns:** an API id number, or `null` if unavailable.

<small>RPC method: `get_api_by_name`</small>

### getVersion

```js
steem.api.getVersion(callback)
```

Returns the node's software version information.

**Example**
```js
steem.api.getVersion((err, result) => console.log(result));
```

**Returns:** `{ blockchain_version, steem_revision, fc_revision }`.

<small>RPC method: `get_version`</small>

### login

```js
steem.api.login(username, password, callback)
```

Legacy login. Always returns `true`; only used internally with empty values to enable broadcast. **Do not** pass real credentials.

**Parameters**

| Name | Type | Description |
|---|---|---|
| username | string | Pass `''` |
| password | string | Pass `''` |

**Example**
```js
steem.api.login('', '', (err, result) => console.log(result)); // true
```

**Returns:** a boolean (always `true`).

<small>RPC method: `login`</small>

## Market History API

<small>RPC namespace: `market_history_api`</small>

### getMarketHistory

```js
steem.api.getMarketHistory(bucket_seconds, start, end, callback)
```

Returns OHLCV market buckets between two datetimes. Use a `bucket_seconds` value from [getMarketHistoryBuckets](#getmarkethistorybuckets).

**Parameters**

| Name | Type | Description |
|---|---|---|
| bucket_seconds | number | Bucket size in seconds |
| start | string | ISO datetime |
| end | string | ISO datetime |

**Example**
```js
steem.api.getMarketHistory(3600, '2018-01-01T00:00:00', '2018-01-02T00:00:00', (err, result) => console.log(result));
```

**Returns:** an array of buckets with `open`, `high`, `low`, `close`, and per-asset volume fields.

<small>RPC method: `get_market_history`</small>

### getMarketHistoryBuckets

```js
steem.api.getMarketHistoryBuckets(callback)
```

Returns the bucket sizes (in seconds) the node supports for [getMarketHistory](#getmarkethistory).

**Example**
```js
steem.api.getMarketHistoryBuckets((err, result) => console.log(result)); // [15, 60, 300, 3600, 86400]
```

**Returns:** an array of integers.

<small>RPC method: `get_market_history_buckets`</small>

### getMarketOrderBook

```js
steem.api.getMarketOrderBook(limit, callback)
```

Returns the top of the internal-market order book for both sides, from the market-history API.

**Parameters**

| Name | Type | Description |
|---|---|---|
| limit | number | Depth per side (≤ 500) |

**Example**
```js
steem.api.getMarketOrderBook(2, (err, result) => console.log(result));
```

**Returns:** `{ bids, asks }` with `order_price`, `real_price`, `steem`, and `sbd` per level.
```js
{ bids: [ { created: '2026-06-03T09:09:39', order_price: { base: '208.000 SBD', quote: '1932.817 STEEM' },
            real_price: '0.107614', sbd: 208000, steem: 1932817 } ],
  asks: [ { created: '2026-06-09T03:52:33', order_price: { base: '3862.653 STEEM', quote: '416.000 SBD' },
            real_price: '0.107697', sbd: 416000, steem: 3862653 } ] }
```

<small>RPC method: `get_order_book`</small>

### getRecentTrades

```js
steem.api.getRecentTrades(limit, callback)
```

Returns the most recent internal-market trades.

**Parameters**

| Name | Type | Description |
|---|---|---|
| limit | number | Maximum trades (≤ 1000) |

**Example**
```js
steem.api.getRecentTrades(10, (err, result) => console.log(result));
```

**Returns:** an array of `{ date, current_pays, open_pays }`.

<small>RPC method: `get_recent_trades`</small>

### getTicker

```js
steem.api.getTicker(callback)
```

Returns a summary of the internal market.

**Example**
```js
steem.api.getTicker((err, result) => console.log(result));
```

**Returns:** market summary.
```js
{ latest: '0.897321', lowest_ask: '0.896840', highest_bid: '0.896000',
  percent_change: '-14.567129', steem_volume: '7397.697 STEEM', sbd_volume: '6662.316 SBD' }
```

<small>RPC method: `get_ticker`</small>

### getTradeHistory

```js
steem.api.getTradeHistory(start, end, limit, callback)
```

Returns internal-market trades between two datetimes.

**Parameters**

| Name | Type | Description |
|---|---|---|
| start | string | ISO datetime, e.g. `'2018-01-01T00:00:00'` |
| end | string | ISO datetime |
| limit | number | Maximum trades (≤ 1000) |

**Example**
```js
steem.api.getTradeHistory('2018-01-01T00:00:00', '2018-01-02T00:00:00', 5, (err, result) => console.log(result));
```

**Returns:** an array of `{ date, current_pays, open_pays }`.

<small>RPC method: `get_trade_history`</small>

### getVolume

```js
steem.api.getVolume(callback)
```

Returns 24-hour internal-market volumes.

**Example**
```js
steem.api.getVolume((err, result) => console.log(result));
```

**Returns:** `{ steem_volume: '8101.888 STEEM', sbd_volume: '7287.268 SBD' }`.

<small>RPC method: `get_volume`</small>

## Network Broadcast API

<small>RPC namespace: `network_broadcast_api`</small>

### broadcastBlock

```js
steem.api.broadcastBlock(b, callback)
```

Broadcasts a full block to the network (witness/infrastructure use).

**Parameters**

| Name | Type | Description |
|---|---|---|
| b | object | A signed block |

**Example**
```js
steem.api.broadcastBlock(block, (err, result) => console.log(err, result));
```

**Returns:** empty/`null` on acceptance; an error otherwise.

<small>RPC method: `broadcast_block`</small>

### broadcastTransaction

```js
steem.api.broadcastTransaction(trx, callback)
```

Broadcasts an already-signed transaction and returns once the node accepts it into the mempool (does not wait for inclusion in a block). Most code uses [steem.broadcast](broadcast) helpers instead of calling this directly.

**Parameters**

| Name | Type | Description |
|---|---|---|
| trx | object | A signed transaction |

**Example**
```js
steem.api.broadcastTransaction(signedTrx, (err, result) => console.log(err, result));
```

**Returns:** empty/`null` on acceptance; an error otherwise.

<small>RPC method: `broadcast_transaction`</small>

### broadcastTransactionSynchronous

```js
steem.api.broadcastTransactionSynchronous(trx, callback)
```

Broadcasts a signed transaction and waits for the node's synchronous result. This is what the `steem.broadcast` helpers use under the hood.

**Parameters**

| Name | Type | Description |
|---|---|---|
| trx | object | A signed transaction |

**Example**
```js
steem.api.broadcastTransactionSynchronous(signedTrx, (err, result) => console.log(result));
```

**Returns:** `{ id, block_num, trx_num, expired }`.

<small>RPC method: `broadcast_transaction_synchronous`</small>

### broadcastTransactionWithCallback

```js
steem.api.broadcastTransactionWithCallback(confirmationCallback, trx, callback)
```

Broadcasts a signed transaction and invokes `confirmationCallback` when it is included in a block.

**Parameters**

| Name | Type | Description |
|---|---|---|
| confirmationCallback | function | Called with the block confirmation |
| trx | object | A signed transaction |

**Example**
```js
steem.api.broadcastTransactionWithCallback(
  (confirm) => console.log('included:', confirm),
  signedTrx,
  (err, result) => console.log(err, result)
);
```

**Returns:** empty/`null` on acceptance; confirmation arrives via the callback.

<small>RPC method: `broadcast_transaction_with_callback`</small>

### setMaxBlockAge

```js
steem.api.setMaxBlockAge(maxBlockAge, callback)
```

Tells the node the maximum block age to accept when broadcasting, guarding against broadcasting against a stale fork.

**Parameters**

| Name | Type | Description |
|---|---|---|
| maxBlockAge | number | Maximum acceptable block age (seconds) |

**Example**
```js
steem.api.setMaxBlockAge(200, (err, result) => console.log(err, result));
```

**Returns:** empty/`null` on success.

<small>RPC method: `set_max_block_age`</small>

## RC API

<small>RPC namespace: `rc_api`</small>

### findRcAccounts **(object arg)**

```js
steem.api.findRcAccounts(accounts, callback)
```

Returns Resource-Credit state for the given accounts. Takes a single object argument.

**Parameters**

| Name | Type | Description |
|---|---|---|
| accounts | string[] | Account names to look up |

**Example**
```js
steem.api.findRcAccounts({ accounts: ['ned'] }, (err, result) => console.log(result));
```

**Returns:** `{ rc_accounts: [ { account, rc_manabar: { current_mana, last_update_time }, max_rc_creation_adjustment, max_rc } ] }`.

<small>RPC method: `find_rc_accounts`</small>

