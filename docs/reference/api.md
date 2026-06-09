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

Methods flagged **(object arg)** take a single object argument instead of positional params.

Total methods: **108**.

## Account By Key API

<small>RPC namespace: `account_by_key_api`</small>

### getKeyReferences

```js
steem.api.getKeyReferences(key, callback)
```

<small>RPC method: `get_key_references`</small>

## Condenser API

<small>RPC namespace: `condenser_api`</small>

### findProposals

```js
steem.api.findProposals(id_set, callback)
```

Look up SPS/DHF proposals by an array of ids (`id_set`).

<small>RPC method: `find_proposals`</small>

### getExpiringVestingDelegations

```js
steem.api.getExpiringVestingDelegations(account, start, limit, callback)
```

Delegations from `account` that are expiring (being returned), starting at the `start` time.

<small>RPC method: `get_expiring_vesting_delegations`</small>

### getNaiPool

```js
steem.api.getNaiPool(callback)
```

Returns the pool of available NAI (asset) identifiers for creating SMTs.

<small>RPC method: `get_nai_pool`</small>

### listProposals

```js
steem.api.listProposals(start, limit, order_by, order_direction, status, callback)
```

List SPS/DHF proposals with paging/order/status filters (`start`, `limit`, `order_by`, `order_direction`, `status`).

<small>RPC method: `list_proposals`</small>

### listProposalVotes

```js
steem.api.listProposalVotes(start, limit, order_by, order_direction, status, callback)
```

List votes on SPS/DHF proposals with the same paging/order/status filters.

<small>RPC method: `list_proposal_votes`</small>

## Database API

<small>RPC namespace: `database_api`</small>

### cancelAllSubscriptions

```js
steem.api.cancelAllSubscriptions(callback)
```

<small>RPC method: `cancel_all_subscriptions`</small>

### findChangeRecoveryAccountRequests **(object arg)**

```js
steem.api.findChangeRecoveryAccountRequests(account, callback)
```

Pending change-recovery-account requests for the given account name(s). Takes an object argument.

<small>RPC method: `find_change_recovery_account_requests`</small>

### getAccountBandwidth

```js
steem.api.getAccountBandwidth(account, bandwidthType, callback)
```

Bandwidth for an account. `bandwidthType` is 1 for forum (posting) and 2 for market (trading).

<small>RPC method: `get_account_bandwidth`</small>

### getAccountCount

```js
steem.api.getAccountCount(callback)
```

<small>RPC method: `get_account_count`</small>

### getAccountHistory

```js
steem.api.getAccountHistory(account, from, limit, callback)
```

<small>RPC method: `get_account_history`</small>

### getAccountReferences

```js
steem.api.getAccountReferences(accountId, callback)
```

<small>RPC method: `get_account_references`</small>

### getAccounts

```js
steem.api.getAccounts(names, callback)
```

<small>RPC method: `get_accounts`</small>

### getAccountVotes

```js
steem.api.getAccountVotes(voter, callback)
```

<small>RPC method: `get_account_votes`</small>

### getActiveCategories

```js
steem.api.getActiveCategories(after, limit, callback)
```

<small>RPC method: `get_active_categories`</small>

### getActiveVotes

```js
steem.api.getActiveVotes(author, permlink, callback)
```

<small>RPC method: `get_active_votes`</small>

### getActiveWitnesses

```js
steem.api.getActiveWitnesses(callback)
```

<small>RPC method: `get_active_witnesses`</small>

### getBestCategories

```js
steem.api.getBestCategories(after, limit, callback)
```

<small>RPC method: `get_best_categories`</small>

### getBlock

```js
steem.api.getBlock(blockNum, callback)
```

<small>RPC method: `get_block`</small>

### getBlockHeader

```js
steem.api.getBlockHeader(blockNum, callback)
```

<small>RPC method: `get_block_header`</small>

### getChainProperties

```js
steem.api.getChainProperties(callback)
```

<small>RPC method: `get_chain_properties`</small>

### getCommentDiscussionsByPayout

```js
steem.api.getCommentDiscussionsByPayout(query, callback)
```

Recent comments (not posts) ordered by pending payout. Default `limit` is 0.

<small>RPC method: `get_comment_discussions_by_payout`</small>

### getConfig

```js
steem.api.getConfig(callback)
```

<small>RPC method: `get_config`</small>

### getContent

```js
steem.api.getContent(author, permlink, callback)
```

<small>RPC method: `get_content`</small>

### getContentReplies

```js
steem.api.getContentReplies(author, permlink, callback)
```

<small>RPC method: `get_content_replies`</small>

### getConversionRequests

```js
steem.api.getConversionRequests(accountName, callback)
```

<small>RPC method: `get_conversion_requests`</small>

### getCurrentMedianHistoryPrice

```js
steem.api.getCurrentMedianHistoryPrice(callback)
```

<small>RPC method: `get_current_median_history_price`</small>

### getDiscussionsByActive

```js
steem.api.getDiscussionsByActive(query, callback)
```

<small>RPC method: `get_discussions_by_active`</small>

### getDiscussionsByAuthorBeforeDate

```js
steem.api.getDiscussionsByAuthorBeforeDate(author, startPermlink, beforeDate, limit, callback)
```

<small>RPC method: `get_discussions_by_author_before_date`</small>

### getDiscussionsByBlog

```js
steem.api.getDiscussionsByBlog(query, callback)
```

<small>RPC method: `get_discussions_by_blog`</small>

### getDiscussionsByCashout

```js
steem.api.getDiscussionsByCashout(query, callback)
```

<small>RPC method: `get_discussions_by_cashout`</small>

### getDiscussionsByChildren

```js
steem.api.getDiscussionsByChildren(query, callback)
```

<small>RPC method: `get_discussions_by_children`</small>

### getDiscussionsByComments

```js
steem.api.getDiscussionsByComments(query, callback)
```

<small>RPC method: `get_discussions_by_comments`</small>

### getDiscussionsByCreated

```js
steem.api.getDiscussionsByCreated(query, callback)
```

<small>RPC method: `get_discussions_by_created`</small>

### getDiscussionsByFeed

```js
steem.api.getDiscussionsByFeed(query, callback)
```

<small>RPC method: `get_discussions_by_feed`</small>

### getDiscussionsByHot

```js
steem.api.getDiscussionsByHot(query, callback)
```

<small>RPC method: `get_discussions_by_hot`</small>

### getDiscussionsByPayout

```js
steem.api.getDiscussionsByPayout(query, callback)
```

<small>RPC method: `get_discussions_by_payout`</small>

### getDiscussionsByPromoted

```js
steem.api.getDiscussionsByPromoted(query, callback)
```

Posts ordered by how much was spent to promote them. Default `limit` is 0.

<small>RPC method: `get_discussions_by_promoted`</small>

### getDiscussionsByTrending

```js
steem.api.getDiscussionsByTrending(query, callback)
```

Posts as shown on the trending tab. Pass a query like `{ limit: 3, tag: 'steem' }`. Default `limit` is 0.

<small>RPC method: `get_discussions_by_trending`</small>

### getDiscussionsByTrending30

```js
steem.api.getDiscussionsByTrending30(query, callback)
```

<small>RPC method: `get_discussions_by_trending30`</small>

### getDiscussionsByVotes

```js
steem.api.getDiscussionsByVotes(query, callback)
```

<small>RPC method: `get_discussions_by_votes`</small>

### getDynamicGlobalProperties

```js
steem.api.getDynamicGlobalProperties(callback)
```

<small>RPC method: `get_dynamic_global_properties`</small>

### getEscrow

```js
steem.api.getEscrow(from, escrowId, callback)
```

Details of a specific escrow transfer by `from` account and `escrowId`.

<small>RPC method: `get_escrow`</small>

### getFeedHistory

```js
steem.api.getFeedHistory(callback)
```

<small>RPC method: `get_feed_history`</small>

### getHardforkVersion

```js
steem.api.getHardforkVersion(callback)
```

Current hardfork version as a plain string (not JSON).

<small>RPC method: `get_hardfork_version`</small>

### getLiquidityQueue

```js
steem.api.getLiquidityQueue(startAccount, limit, callback)
```

<small>RPC method: `get_liquidity_queue`</small>

### getMinerQueue

```js
steem.api.getMinerQueue(callback)
```

<small>RPC method: `get_miner_queue`</small>

### getNextScheduledHardfork

```js
steem.api.getNextScheduledHardfork(callback)
```

<small>RPC method: `get_next_scheduled_hardfork`</small>

### getOpenOrders

```js
steem.api.getOpenOrders(owner, callback)
```

<small>RPC method: `get_open_orders`</small>

### getOpsInBlock

```js
steem.api.getOpsInBlock(blockNum, onlyVirtual, callback)
```

Gets all operations in a block. Set `onlyVirtual` to true for virtual operations only.

<small>RPC method: `get_ops_in_block`</small>

### getOrderBook

```js
steem.api.getOrderBook(limit, callback)
```

<small>RPC method: `get_order_book`</small>

### getOwnerHistory

```js
steem.api.getOwnerHistory(account, callback)
```

<small>RPC method: `get_owner_history`</small>

### getPostDiscussionsByPayout

```js
steem.api.getPostDiscussionsByPayout(query, callback)
```

Recent posts ordered by pending payout. Note: the default `limit` is 0 — set one in the query or you get an empty result.

<small>RPC method: `get_post_discussions_by_payout`</small>

### getPotentialSignatures

```js
steem.api.getPotentialSignatures(trx, callback)
```

<small>RPC method: `get_potential_signatures`</small>

### getRecentCategories

```js
steem.api.getRecentCategories(after, limit, callback)
```

<small>RPC method: `get_recent_categories`</small>

### getRecoveryRequest

```js
steem.api.getRecoveryRequest(account, callback)
```

<small>RPC method: `get_recovery_request`</small>

### getRepliesByLastUpdate

```js
steem.api.getRepliesByLastUpdate(startAuthor, startPermlink, limit, callback)
```

<small>RPC method: `get_replies_by_last_update`</small>

### getRequiredSignatures

```js
steem.api.getRequiredSignatures(trx, availableKeys, callback)
```

<small>RPC method: `get_required_signatures`</small>

### getRewardFund

```js
steem.api.getRewardFund(name, callback)
```

<small>RPC method: `get_reward_fund`</small>

### getSavingsWithdrawFrom

```js
steem.api.getSavingsWithdrawFrom(account, callback)
```

Pending savings withdrawals initiated by `account`.

<small>RPC method: `get_savings_withdraw_from`</small>

### getSavingsWithdrawTo

```js
steem.api.getSavingsWithdrawTo(account, callback)
```

Pending savings withdrawals destined for `account`.

<small>RPC method: `get_savings_withdraw_to`</small>

### getState

```js
steem.api.getState(path, callback)
```

Returns a large state bundle for a frontend `path` such as `/@username`, `/@username/permlink`, `/trending`, or `/trending/tag`.

<small>RPC method: `get_state`</small>

### getTagsUsedByAuthor

```js
steem.api.getTagsUsedByAuthor(author, callback)
```

Gets the tags an author has used. Most accounts have none.

<small>RPC method: `get_tags_used_by_author`</small>

### getTransaction

```js
steem.api.getTransaction(trxId, callback)
```

<small>RPC method: `get_transaction`</small>

### getTransactionHex

```js
steem.api.getTransactionHex(trx, callback)
```

<small>RPC method: `get_transaction_hex`</small>

### getTrendingCategories

```js
steem.api.getTrendingCategories(after, limit, callback)
```

<small>RPC method: `get_trending_categories`</small>

### getTrendingTags

```js
steem.api.getTrendingTags(afterTag, limit, callback)
```

Returns a list of the currently trending tags in descending order by value. Pass the empty string `''` for `afterTag` to start; use the last returned tag name to paginate.

**Parameters:** `afterTag` (String) last tag to begin after, `limit` (Integer) max tags.

<small>RPC method: `get_trending_tags`</small>

### getVestingDelegations

```js
steem.api.getVestingDelegations(account, from, limit, callback)
```

Delegations made from `account`, denominated in VESTS. Paginate with the last delegatee's name in `from`.

<small>RPC method: `get_vesting_delegations`</small>

### getWithdrawRoutes

```js
steem.api.getWithdrawRoutes(account, withdrawRouteType, callback)
```

Power-down (vesting withdraw) routes for `account`. `withdrawRouteType` is 0, 1, or 2.

<small>RPC method: `get_withdraw_routes`</small>

### getWitnessByAccount

```js
steem.api.getWitnessByAccount(accountName, callback)
```

Information about the witness owned by `accountName`.

<small>RPC method: `get_witness_by_account`</small>

### getWitnessCount

```js
steem.api.getWitnessCount(callback)
```

<small>RPC method: `get_witness_count`</small>

### getWitnesses

```js
steem.api.getWitnesses(witnessIds, callback)
```

<small>RPC method: `get_witnesses`</small>

### getWitnessesByVote

```js
steem.api.getWitnessesByVote(from, limit, callback)
```

<small>RPC method: `get_witnesses_by_vote`</small>

### getWitnessSchedule

```js
steem.api.getWitnessSchedule(callback)
```

<small>RPC method: `get_witness_schedule`</small>

### lookupAccountNames

```js
steem.api.lookupAccountNames(accountNames, callback)
```

<small>RPC method: `lookup_account_names`</small>

### lookupAccounts

```js
steem.api.lookupAccounts(lowerBoundName, limit, callback)
```

<small>RPC method: `lookup_accounts`</small>

### lookupWitnessAccounts

```js
steem.api.lookupWitnessAccounts(lowerBoundName, limit, callback)
```

<small>RPC method: `lookup_witness_accounts`</small>

### setBlockAppliedCallback

```js
steem.api.setBlockAppliedCallback(cb, callback)
```

<small>RPC method: `set_block_applied_callback`</small>

### setPendingTransactionCallback

```js
steem.api.setPendingTransactionCallback(cb, callback)
```

<small>RPC method: `set_pending_transaction_callback`</small>

### setSubscribeCallback

```js
steem.api.setSubscribeCallback(callback, clearFilter, callback)
```

<small>RPC method: `set_subscribe_callback`</small>

### verifyAccountAuthority

```js
steem.api.verifyAccountAuthority(nameOrId, signers, callback)
```

<small>RPC method: `verify_account_authority`</small>

### verifyAuthority

```js
steem.api.verifyAuthority(trx, callback)
```

<small>RPC method: `verify_authority`</small>

## Follow API

<small>RPC namespace: `follow_api`</small>

### getAccountReputations

```js
steem.api.getAccountReputations(lowerBoundName, limit, callback)
```

Reputation points for `limit` accounts whose names are closest to `lowerBoundName`.

<small>RPC method: `get_account_reputations`</small>

### getBlog

```js
steem.api.getBlog(account, entryId, limit, callback)
```

Gets up to `limit` posts of `account` ending at the post with index `entryId` (zero-based, counting backwards).

<small>RPC method: `get_blog`</small>

### getBlogAuthors

```js
steem.api.getBlogAuthors(blogAccount, callback)
```

Lists everyone who has written in an account's blog, with how many times each did.

<small>RPC method: `get_blog_authors`</small>

### getBlogEntries

```js
steem.api.getBlogEntries(account, entryId, limit, callback)
```

Like getBlog but returns lightweight entry objects (author, permlink, blog, reblog_on, entry_id).

<small>RPC method: `get_blog_entries`</small>

### getFeed

```js
steem.api.getFeed(account, entryId, limit, callback)
```

Gets the posts in a user's feed (followed accounts plus their resteems) as full discussion objects.

<small>RPC method: `get_feed`</small>

### getFeedEntries

```js
steem.api.getFeedEntries(account, entryId, limit, callback)
```

Gets a user's feed as lightweight entry objects; `reblog_by` is populated when the post appears because it was resteemed.

<small>RPC method: `get_feed_entries`</small>

### getFollowCount

```js
steem.api.getFollowCount(account, callback)
```

<small>RPC method: `get_follow_count`</small>

### getFollowers

```js
steem.api.getFollowers(following, startFollower, followType, limit, callback)
```

<small>RPC method: `get_followers`</small>

### getFollowing

```js
steem.api.getFollowing(follower, startFollowing, followType, limit, callback)
```

<small>RPC method: `get_following`</small>

### getRebloggedBy

```js
steem.api.getRebloggedBy(author, permlink, callback)
```

Lists the accounts that reblogged (resteemed) a given post.

<small>RPC method: `get_reblogged_by`</small>

## Login API

<small>RPC namespace: `login_api`</small>

### getApiByName

```js
steem.api.getApiByName(database_api, callback)
```

<small>RPC method: `get_api_by_name`</small>

### getVersion

```js
steem.api.getVersion(callback)
```

Blockchain/daemon version info (blockchain_version, steem_revision, fc_revision).

<small>RPC method: `get_version`</small>

### login

```js
steem.api.login(username, password, callback)
```

Legacy login. Always returns true; only used internally with empty values to enable broadcast. Do NOT pass real credentials.

<small>RPC method: `login`</small>

## Market History API

<small>RPC namespace: `market_history_api`</small>

### getMarketHistory

```js
steem.api.getMarketHistory(bucket_seconds, start, end, callback)
```

OHLCV market buckets of `bucket_seconds` between `start` and `end` (use a value from getMarketHistoryBuckets).

<small>RPC method: `get_market_history`</small>

### getMarketHistoryBuckets

```js
steem.api.getMarketHistoryBuckets(callback)
```

The bucket sizes (in seconds) supported by getMarketHistory, e.g. [15, 60, 300, 3600, 86400].

<small>RPC method: `get_market_history_buckets`</small>

### getMarketOrderBook

```js
steem.api.getMarketOrderBook(limit, callback)
```

<small>RPC method: `get_order_book`</small>

### getRecentTrades

```js
steem.api.getRecentTrades(limit, callback)
```

The most recent `limit` internal-market trades.

<small>RPC method: `get_recent_trades`</small>

### getTicker

```js
steem.api.getTicker(callback)
```

Latest summarized internal-market data (latest price, bid/ask, 24h change, volumes).

<small>RPC method: `get_ticker`</small>

### getTradeHistory

```js
steem.api.getTradeHistory(start, end, limit, callback)
```

Internal-market trades between two ISO datetimes (e.g. '2018-01-01T00:00:00').

<small>RPC method: `get_trade_history`</small>

### getVolume

```js
steem.api.getVolume(callback)
```

Current STEEM and SBD internal-market volumes.

<small>RPC method: `get_volume`</small>

## Network Broadcast API

<small>RPC namespace: `network_broadcast_api`</small>

### broadcastBlock

```js
steem.api.broadcastBlock(b, callback)
```

<small>RPC method: `broadcast_block`</small>

### broadcastTransaction

```js
steem.api.broadcastTransaction(trx, callback)
```

Broadcasts an already-signed transaction and returns once the node accepts it into the mempool (does not wait for a block).

<small>RPC method: `broadcast_transaction`</small>

### broadcastTransactionSynchronous

```js
steem.api.broadcastTransactionSynchronous(trx, callback)
```

Broadcasts a signed transaction and waits for the node's synchronous result (block_num, trx_num, etc.).

<small>RPC method: `broadcast_transaction_synchronous`</small>

### broadcastTransactionWithCallback

```js
steem.api.broadcastTransactionWithCallback(confirmationCallback, trx, callback)
```

Broadcasts a signed transaction and invokes `confirmationCallback` when it is included in a block.

<small>RPC method: `broadcast_transaction_with_callback`</small>

### setMaxBlockAge

```js
steem.api.setMaxBlockAge(maxBlockAge, callback)
```

Tells the node the maximum block age it should accept when broadcasting; used to guard against broadcasting against a stale fork.

<small>RPC method: `set_max_block_age`</small>

## RC API

<small>RPC namespace: `rc_api`</small>

### findRcAccounts **(object arg)**

```js
steem.api.findRcAccounts(accounts, callback)
```

Resource-credit balances/state for the given accounts. Takes an object argument: { accounts: [...] }.

<small>RPC method: `find_rc_accounts`</small>

