---
title: Broadcast (steem.broadcast)
parent: Reference
nav_order: 2
---

# Broadcast reference (`steem.broadcast`)

Write operations. These sign a transaction and broadcast it to the network — they cause permanent changes on the blockchain. Generated from [`src/broadcast/operations.js`](https://github.com/blazeapps007/steem-js/blob/master/src/broadcast/operations.js).

Every method accepts a trailing callback **or** returns a Promise if you omit it (an `Async` suffix variant also exists). The first argument is the signing key (`wif`); the **Roles** line lists which key roles may authorize the operation — pass a WIF for one of them.

Total operations: **63** (plus 4 auth helpers at the end).

## Operations

### accountCreate

```js
steem.broadcast.accountCreate(wif, fee, creator, new_account_name, owner, active, posting, memo_key, json_metadata, callback)
```

**Roles:** active, owner

Creates a new account, paying the creation fee.

**Parameters**

| Name | Type | Description |
|---|---|---|
| fee | string | Creation fee, e.g. `'3.000 STEEM'` |
| creator | string | Paying account |
| new_account_name | string | New account name |
| owner | object | Owner authority object |
| active | object | Active authority object |
| posting | object | Posting authority object |
| memo_key | string | Public memo key |
| json_metadata | object\|string | Account metadata |

**Example**
```js
steem.broadcast.accountCreate(wif, '3.000 STEEM', 'creator', 'newbie',
  ownerAuth, activeAuth, postingAuth, memoPubKey, {}, (err, r) => console.log(r));
```

<small>Operation: `account_create`</small>

### accountCreateWithDelegation

```js
steem.broadcast.accountCreateWithDelegation(wif, fee, delegation, creator, new_account_name, owner, active, posting, memo_key, json_metadata, extensions, callback)
```

**Roles:** active, owner

Creates a new account using a fee plus a VESTS delegation to cover bandwidth.

**Parameters**

| Name | Type | Description |
|---|---|---|
| fee | string | Creation fee |
| delegation | string | VESTS to delegate to the new account |
| creator | string | Paying account |
| new_account_name | string | New account name |
| owner | object | Owner authority |
| active | object | Active authority |
| posting | object | Posting authority |
| memo_key | string | Public memo key |
| json_metadata | object\|string | Account metadata |
| extensions | array | Operation extensions |

**Example**
```js
steem.broadcast.accountCreateWithDelegation(wif, '0.000 STEEM', '5000000.000000 VESTS',
  'creator', 'newbie', ownerAuth, activeAuth, postingAuth, memoPubKey, {}, [], (err, r) => console.log(r));
```

<small>Operation: `account_create_with_delegation`</small>

### accountUpdate

```js
steem.broadcast.accountUpdate(wif, account, owner, active, posting, memo_key, json_metadata, callback)
```

**Roles:** active, owner

Updates an account's authorities, memo key, and/or json_metadata. Pass `undefined` for any authority you don't want to change.

**Parameters**

| Name | Type | Description |
|---|---|---|
| account | string | Account to update |
| owner | object | New owner authority (or `undefined`) |
| active | object | New active authority (or `undefined`) |
| posting | object | New posting authority (or `undefined`) |
| memo_key | string | Public memo key |
| json_metadata | object\|string | Account metadata |

**Example**
```js
steem.broadcast.accountUpdate(wif, 'alice', undefined, undefined, newPosting, memoKey, {}, (err, r) => console.log(r));
```

<small>Operation: `account_update`</small>

### accountUpdate2

```js
steem.broadcast.accountUpdate2(wif, account, owner, active, posting, memo_key, json_metadata, posting_json_metadata, extensions, callback)
```

**Roles:** posting, active, owner

Like [accountUpdate](#accountupdate) but also supports `posting_json_metadata` and extensions (HF21+).

**Parameters**

| Name | Type | Description |
|---|---|---|
| account | string | Account to update |
| owner | object | New owner authority (or `undefined`) |
| active | object | New active authority (or `undefined`) |
| posting | object | New posting authority (or `undefined`) |
| memo_key | string | Public memo key |
| json_metadata | object\|string | Account metadata |
| posting_json_metadata | object\|string | Posting-level metadata (profile) |
| extensions | array | Operation extensions |

**Example**
```js
steem.broadcast.accountUpdate2(wif, 'alice', undefined, undefined, undefined, '', '',
  { profile: { name: 'Alice' } }, [], (err, r) => console.log(r));
```

<small>Operation: `account_update2`</small>

### accountWitnessProxy

```js
steem.broadcast.accountWitnessProxy(wif, account, proxy, callback)
```

**Roles:** active, owner

Delegates the account's witness voting to a proxy account. Pass `''` to clear the proxy.

**Parameters**

| Name | Type | Description |
|---|---|---|
| account | string | Account setting a proxy |
| proxy | string | Proxy account (`''` to clear) |

**Example**
```js
steem.broadcast.accountWitnessProxy(wif, 'alice', 'trusted-proxy', (err, r) => console.log(r));
```

<small>Operation: `account_witness_proxy`</small>

### accountWitnessVote

```js
steem.broadcast.accountWitnessVote(wif, account, witness, approve, callback)
```

**Roles:** active, owner

Approves or unapproves a witness for the account's witness votes (max 30 approvals).

**Parameters**

| Name | Type | Description |
|---|---|---|
| account | string | Voting account |
| witness | string | Witness account |
| approve | boolean | `true` to approve, `false` to remove |

**Example**
```js
steem.broadcast.accountWitnessVote(wif, 'alice', 'good-witness', true, (err, r) => console.log(r));
```

<small>Operation: `account_witness_vote`</small>

### cancelTransferFromSavings

```js
steem.broadcast.cancelTransferFromSavings(wif, from, request_id, callback)
```

**Roles:** active, owner

Cancels a pending savings withdrawal by id.

**Parameters**

| Name | Type | Description |
|---|---|---|
| from | string | Savings owner |
| request_id | number | The id used for the withdrawal |

**Example**
```js
steem.broadcast.cancelTransferFromSavings(wif, 'alice', 1, (err, r) => console.log(r));
```

<small>Operation: `cancel_transfer_from_savings`</small>

### changeRecoveryAccount

```js
steem.broadcast.changeRecoveryAccount(wif, account_to_recover, new_recovery_account, extensions, callback)
```

**Roles:** owner

Sets a new recovery account. Takes effect after a 30-day delay. Signed with **owner**.

**Parameters**

| Name | Type | Description |
|---|---|---|
| account_to_recover | string | Account whose recovery agent changes |
| new_recovery_account | string | New recovery agent |
| extensions | array | Operation extensions |

**Example**
```js
steem.broadcast.changeRecoveryAccount(ownerWif, 'alice', 'trusted', [], (err, r) => console.log(r));
```

<small>Operation: `change_recovery_account`</small>

### claimAccount

```js
steem.broadcast.claimAccount(wif, creator, fee, extensions, callback)
```

**Roles:** active, owner

Claims an account-creation token (pays the fee up front) to mint a discounted account later with [createClaimedAccount](#createclaimedaccount).

**Parameters**

| Name | Type | Description |
|---|---|---|
| creator | string | Account claiming the token |
| fee | string | Fee, or `'0.000 STEEM'` to use RC |
| extensions | array | Operation extensions |

**Example**
```js
steem.broadcast.claimAccount(wif, 'creator', '0.000 STEEM', [], (err, r) => console.log(r));
```

<small>Operation: `claim_account`</small>

### claimRewardBalance

```js
steem.broadcast.claimRewardBalance(wif, account, reward_steem, reward_sbd, reward_vests, callback)
```

**Roles:** posting, active, owner

Claims pending author/curation rewards into the liquid/vesting balances.

**Parameters**

| Name | Type | Description |
|---|---|---|
| account | string | Account claiming |
| reward_steem | string | e.g. `'0.000 STEEM'` |
| reward_sbd | string | e.g. `'0.000 SBD'` |
| reward_vests | string | e.g. `'0.000006 VESTS'` |

**Example**
```js
steem.broadcast.claimRewardBalance(wif, 'alice', '0.000 STEEM', '1.234 SBD', '500.000000 VESTS', (err, r) => console.log(r));
```

<small>Operation: `claim_reward_balance`</small>

### claimRewardBalance2

```js
steem.broadcast.claimRewardBalance2(wif, account, reward_tokens, extensions, callback)
```

**Roles:** posting, active, owner

Generalized reward claim that takes a list of reward tokens (supports SMT rewards) plus extensions.

**Parameters**

| Name | Type | Description |
|---|---|---|
| account | string | Account claiming |
| reward_tokens | string[] | Asset amounts to claim |
| extensions | array | Operation extensions |

**Example**
```js
steem.broadcast.claimRewardBalance2(wif, 'alice', ['1.234 SBD', '500.000000 VESTS'], [], (err, r) => console.log(r));
```

<small>Operation: `claim_reward_balance2`</small>

### comment

```js
steem.broadcast.comment(wif, parent_author, parent_permlink, author, permlink, title, body, json_metadata, callback)
```

**Roles:** posting, active, owner

Creates or edits a post or comment. Leave `parentAuthor`/`parentPermlink` empty for a top-level post; for a reply, omit `permlink` to have one derived from the parent.

**Parameters**

| Name | Type | Description |
|---|---|---|
| parentAuthor | string | Parent author (`''` for a root post) |
| parentPermlink | string | Parent permlink, or the main tag for a root post |
| author | string | Comment author |
| permlink | string | Unique permlink for this comment |
| title | string | Title (root posts only) |
| body | string | Markdown body |
| jsonMetadata | object\|string | Tags/app metadata |

**Example**
```js
steem.broadcast.comment(wif, '', 'photography', 'alice', 'my-post',
  'My Post', 'Hello **world**', { tags: ['photography'] }, (err, r) => console.log(r));
```

<small>Operation: `comment`</small>

### commentOptions

```js
steem.broadcast.commentOptions(wif, author, permlink, max_accepted_payout, percent_steem_dollars, allow_votes, allow_curation_rewards, extensions, callback)
```

**Roles:** posting, active, owner

Sets payout options for a comment (must be set before it receives votes).

**Parameters**

| Name | Type | Description |
|---|---|---|
| author | string | Comment author |
| permlink | string | Comment permlink |
| maxAcceptedPayout | string | Cap, e.g. `'1000000.000 SBD'`; `'0.000 SBD'` declines payout |
| percentSteemDollars | number | 0..10000 share paid in SBD |
| allowVotes | boolean | Whether votes are allowed |
| allowCurationRewards | boolean | Whether curation rewards are paid |
| extensions | array | Extensions (e.g. beneficiaries) |

**Example**
```js
steem.broadcast.commentOptions(wif, 'alice', 'my-post', '1000000.000 SBD', 10000, true, true, [], (err, r) => console.log(r));
```

<small>Operation: `comment_options`</small>

### commentReward

```js
steem.broadcast.commentReward(wif, author, permlink, payout, callback)
```

**Roles:** posting, active, owner

**Virtual operation** — emitted when a comment pays out.

**Parameters**

| Name | Type | Description |
|---|---|---|
| author | string | Comment author |
| permlink | string | Comment permlink |
| payout | string | Payout value |

**Example**
```js
// Observed via getAccountHistory / streamOperations.
```

<small>Operation: `comment_reward`</small>

### convert

```js
steem.broadcast.convert(wif, owner, requestid, amount, callback)
```

**Roles:** active, owner

Requests conversion of SBD to STEEM. Settles after the conversion delay at the median feed price.

**Parameters**

| Name | Type | Description |
|---|---|---|
| owner | string | Account converting |
| requestid | number | Client-chosen id for the request |
| amount | string | SBD amount, e.g. `'10.000 SBD'` |

**Example**
```js
steem.broadcast.convert(wif, 'alice', 1, '10.000 SBD', (err, r) => console.log(r));
```

<small>Operation: `convert`</small>

### createClaimedAccount

```js
steem.broadcast.createClaimedAccount(wif, creator, new_account_name, owner, active, posting, memo_key, json_metadata, extensions, callback)
```

**Roles:** active, owner

Creates an account using a previously claimed account-creation token (no fee at creation time).

**Parameters**

| Name | Type | Description |
|---|---|---|
| creator | string | Account holding the token |
| new_account_name | string | New account name |
| owner | object | Owner authority |
| active | object | Active authority |
| posting | object | Posting authority |
| memo_key | string | Public memo key |
| json_metadata | object\|string | Account metadata |
| extensions | array | Operation extensions |

**Example**
```js
steem.broadcast.createClaimedAccount(wif, 'creator', 'newbie',
  ownerAuth, activeAuth, postingAuth, memoPubKey, {}, [], (err, r) => console.log(r));
```

<small>Operation: `create_claimed_account`</small>

### createProposal

```js
steem.broadcast.createProposal(wif, creator, receiver, start_date, end_date, daily_pay, subject, permlink, extensions, callback)
```

**Roles:** active, owner

Creates an SPS/DHF (proposal system) funding proposal.

**Parameters**

| Name | Type | Description |
|---|---|---|
| creator | string | Account creating (and paying for) the proposal |
| receiver | string | Account that receives funding |
| start_date | string | ISO datetime funding starts |
| end_date | string | ISO datetime funding ends |
| daily_pay | string | SBD per day, e.g. `'10.000 SBD'` |
| subject | string | Short title |
| permlink | string | Permlink of the post describing the proposal |
| extensions | array | Operation extensions |

**Example**
```js
steem.broadcast.createProposal(wif, 'alice', 'alice',
  '2025-01-01T00:00:00', '2025-02-01T00:00:00', '10.000 SBD',
  'My proposal', 'my-proposal-post', [], (err, r) => console.log(r));
```

<small>Operation: `create_proposal`</small>

### custom

```js
steem.broadcast.custom(wif, required_auths, id, data, callback)
```

**Roles:** active, owner

Posts arbitrary binary custom data requiring the given active auths. App-specific.

**Parameters**

| Name | Type | Description |
|---|---|---|
| required_auths | string[] | Accounts whose active auth is required |
| id | number | Custom operation id |
| data | string | Hex/binary payload |

**Example**
```js
steem.broadcast.custom(wif, ['alice'], 777, '<hex>', (err, r) => console.log(r));
```

<small>Operation: `custom`</small>

### customBinary

```js
steem.broadcast.customBinary(wif, id, data, callback)
```

**Roles:** posting, active, owner

Posts arbitrary binary custom data at posting level.

**Parameters**

| Name | Type | Description |
|---|---|---|
| id | string | Custom id |
| data | string | Hex/binary payload |

**Example**
```js
steem.broadcast.customBinary(postingWif, 'myapp', '<hex>', (err, r) => console.log(r));
```

<small>Operation: `custom_binary`</small>

### customJson

```js
steem.broadcast.customJson(wif, required_auths, required_posting_auths, id, json, callback)
```

**Roles:** posting, active, owner

Posts a custom JSON operation — the basis for most second-layer apps.

**Parameters**

| Name | Type | Description |
|---|---|---|
| required_auths | string[] | Accounts whose active auth is required |
| required_posting_auths | string[] | Accounts whose posting auth is required |
| id | string | App id, e.g. `'follow'` |
| json | string | JSON-encoded payload |

**Example**
```js
steem.broadcast.customJson(wif, [], ['alice'], 'follow',
  JSON.stringify(['follow', { follower: 'alice', following: 'bob', what: ['blog'] }]), (err, r) => console.log(r));
```

<small>Operation: `custom_json`</small>

### declineVotingRights

```js
steem.broadcast.declineVotingRights(wif, account, decline, callback)
```

**Roles:** owner

Irreversibly declines the account's voting rights. Requires **owner** and takes effect after a delay.

**Parameters**

| Name | Type | Description |
|---|---|---|
| account | string | Account declining rights |
| decline | boolean | `true` to decline |

**Example**
```js
steem.broadcast.declineVotingRights(ownerWif, 'alice', true, (err, r) => console.log(r));
```

<small>Operation: `decline_voting_rights`</small>

### delegateVestingShares

```js
steem.broadcast.delegateVestingShares(wif, delegator, delegatee, vesting_shares, callback)
```

**Roles:** active, owner

Delegates STEEM POWER (VESTS) from delegator to delegatee. Set to `'0.000000 VESTS'` to undelegate.

**Parameters**

| Name | Type | Description |
|---|---|---|
| delegator | string | Account delegating |
| delegatee | string | Account receiving the delegation |
| vesting_shares | string | VESTS to delegate |

**Example**
```js
steem.broadcast.delegateVestingShares(wif, 'alice', 'bob', '500000.000000 VESTS', (err, r) => console.log(r));
```

<small>Operation: `delegate_vesting_shares`</small>

### deleteComment

```js
steem.broadcast.deleteComment(wif, author, permlink, callback)
```

**Roles:** posting, active, owner

Deletes a post or comment that has no votes and no replies.

**Parameters**

| Name | Type | Description |
|---|---|---|
| author | string | Comment author |
| permlink | string | Comment permlink |

**Example**
```js
steem.broadcast.deleteComment(wif, 'alice', 'my-post', (err, r) => console.log(r));
```

<small>Operation: `delete_comment`</small>

### escrowApprove

```js
steem.broadcast.escrowApprove(wif, from, to, agent, who, escrow_id, approve, callback)
```

**Roles:** active, owner

The agent and recipient approve (or reject) an escrow. Both must approve to activate it.

**Parameters**

| Name | Type | Description |
|---|---|---|
| from | string | Escrow sender |
| to | string | Escrow recipient |
| agent | string | Escrow agent |
| who | string | The approving party (`to` or `agent`) |
| escrow_id | number | Escrow id |
| approve | boolean | `true` to approve, `false` to reject |

**Example**
```js
steem.broadcast.escrowApprove(wif, 'alice', 'bob', 'agent', 'agent', 1, true, (err, r) => console.log(r));
```

<small>Operation: `escrow_approve`</small>

### escrowDispute

```js
steem.broadcast.escrowDispute(wif, from, to, agent, who, escrow_id, callback)
```

**Roles:** active, owner

Raises a dispute on an escrow, handing release control to the agent.

**Parameters**

| Name | Type | Description |
|---|---|---|
| from | string | Escrow sender |
| to | string | Escrow recipient |
| agent | string | Escrow agent |
| who | string | The party raising the dispute |
| escrow_id | number | Escrow id |

**Example**
```js
steem.broadcast.escrowDispute(wif, 'alice', 'bob', 'agent', 'alice', 1, (err, r) => console.log(r));
```

<small>Operation: `escrow_dispute`</small>

### escrowRelease

```js
steem.broadcast.escrowRelease(wif, from, to, agent, who, receiver, escrow_id, sbd_amount, steem_amount, callback)
```

**Roles:** active, owner

Releases escrowed funds to a receiver.

**Parameters**

| Name | Type | Description |
|---|---|---|
| from | string | Escrow sender |
| to | string | Escrow recipient |
| agent | string | Escrow agent |
| who | string | The party releasing funds |
| receiver | string | Who receives the released funds |
| escrow_id | number | Escrow id |
| sbd_amount | string | SBD to release |
| steem_amount | string | STEEM to release |

**Example**
```js
steem.broadcast.escrowRelease(wif, 'alice', 'bob', 'agent', 'alice', 'bob', 1, '0.000 SBD', '10.000 STEEM', (err, r) => console.log(r));
```

<small>Operation: `escrow_release`</small>

### escrowTransfer

```js
steem.broadcast.escrowTransfer(wif, from, to, agent, escrow_id, sbd_amount, steem_amount, fee, ratification_deadline, escrow_expiration, json_meta, callback)
```

**Roles:** active, owner

Creates an escrow between two accounts with an agent, fee, and ratification/expiration deadlines.

**Parameters**

| Name | Type | Description |
|---|---|---|
| from | string | Sender |
| to | string | Recipient |
| agent | string | Escrow agent (arbiter) |
| escrow_id | number | Client-chosen escrow id |
| sbd_amount | string | SBD held, e.g. `'0.000 SBD'` |
| steem_amount | string | STEEM held, e.g. `'10.000 STEEM'` |
| fee | string | Agent fee |
| ratification_deadline | string | ISO datetime to ratify by |
| escrow_expiration | string | ISO datetime the escrow expires |
| json_meta | object\|string | Arbitrary metadata |

**Example**
```js
steem.broadcast.escrowTransfer(wif, 'alice', 'bob', 'agent', 1,
  '0.000 SBD', '10.000 STEEM', '0.100 STEEM',
  '2025-01-01T00:00:00', '2025-02-01T00:00:00', {}, (err, r) => console.log(r));
```

<small>Operation: `escrow_transfer`</small>

### feedPublish

```js
steem.broadcast.feedPublish(wif, publisher, exchange_rate, callback)
```

**Roles:** active, owner

Witness operation: publishes a STEEM/SBD price feed.

**Parameters**

| Name | Type | Description |
|---|---|---|
| publisher | string | Witness account |
| exchange_rate | object | `{ base: 'X SBD', quote: 'Y STEEM' }` |

**Example**
```js
steem.broadcast.feedPublish(wif, 'witness', { base: '0.900 SBD', quote: '1.000 STEEM' }, (err, r) => console.log(r));
```

<small>Operation: `feed_publish`</small>

### fillConvertRequest

```js
steem.broadcast.fillConvertRequest(wif, owner, requestid, amount_in, amount_out, callback)
```

**Roles:** active, owner

**Virtual operation** — emitted by the chain when an SBD→STEEM conversion settles. You normally read it from history rather than broadcasting it.

**Parameters**

| Name | Type | Description |
|---|---|---|
| owner | string | Account that converted |
| requestid | number | The conversion request id |
| amount_in | string | SBD converted |
| amount_out | string | STEEM produced |

**Example**
```js
// Observed via getAccountHistory / streamOperations, not broadcast directly.
```

<small>Operation: `fill_convert_request`</small>

### fillOrder

```js
steem.broadcast.fillOrder(wif, current_owner, current_orderid, current_pays, open_owner, open_orderid, open_pays, callback)
```

**Roles:** posting, active, owner

**Virtual operation** — emitted when an internal-market order is (partially) filled.

**Parameters**

| Name | Type | Description |
|---|---|---|
| current_owner | string | Taker account |
| current_orderid | number | Taker order id |
| current_pays | string | Amount the taker pays |
| open_owner | string | Maker account |
| open_orderid | number | Maker order id |
| open_pays | string | Amount the maker pays |

**Example**
```js
// Observed via getAccountHistory / streamOperations.
```

<small>Operation: `fill_order`</small>

### fillTransferFromSavings

```js
steem.broadcast.fillTransferFromSavings(wif, from, to, amount, request_id, memo, callback)
```

**Roles:** posting, active, owner

**Virtual operation** — emitted when a savings withdrawal completes.

**Parameters**

| Name | Type | Description |
|---|---|---|
| from | string | Savings owner |
| to | string | Destination account |
| amount | string | Asset amount delivered |
| request_id | number | The withdrawal request id |
| memo | string | Memo |

**Example**
```js
// Observed via getAccountHistory / streamOperations.
```

<small>Operation: `fill_transfer_from_savings`</small>

### fillVestingWithdraw

```js
steem.broadcast.fillVestingWithdraw(wif, from_account, to_account, withdrawn, deposited, callback)
```

**Roles:** active, owner

**Virtual operation** — emitted on each scheduled power-down payment.

**Parameters**

| Name | Type | Description |
|---|---|---|
| from_account | string | Account powering down |
| to_account | string | Destination account |
| withdrawn | string | VESTS withdrawn |
| deposited | string | STEEM (or VESTS) deposited |

**Example**
```js
// Observed via getAccountHistory / streamOperations.
```

<small>Operation: `fill_vesting_withdraw`</small>

### interest

```js
steem.broadcast.interest(wif, owner, interest, callback)
```

**Roles:** active, owner

**Virtual operation** — emitted when SBD interest is paid to a balance.

**Parameters**

| Name | Type | Description |
|---|---|---|
| owner | string | Account paid interest |
| interest | string | SBD interest amount |

**Example**
```js
// Observed via getAccountHistory / streamOperations.
```

<small>Operation: `interest`</small>

### limitOrderCancel

```js
steem.broadcast.limitOrderCancel(wif, owner, orderid, callback)
```

**Roles:** active, owner

Cancels an open limit order by id. The order may fill before cancellation completes.

**Parameters**

| Name | Type | Description |
|---|---|---|
| owner | string | Order owner |
| orderid | number | The id used when creating the order |

**Example**
```js
steem.broadcast.limitOrderCancel(wif, 'alice', 1, (err, r) => console.log(r));
```

<small>Operation: `limit_order_cancel`</small>

### limitOrderCreate

```js
steem.broadcast.limitOrderCreate(wif, owner, orderid, amount_to_sell, min_to_receive, fill_or_kill, expiration, callback)
```

**Roles:** active, owner

Creates an internal-market limit order using a minimum-to-receive amount. `expiration` must be in the future.

**Parameters**

| Name | Type | Description |
|---|---|---|
| owner | string | Order owner |
| orderid | number | Client-chosen id (used to cancel) |
| amount_to_sell | string | e.g. `'10.000 STEEM'` |
| min_to_receive | string | e.g. `'9.000 SBD'` |
| fill_or_kill | boolean | If true, fill from the book now or cancel |
| expiration | string\|Date | When the order expires |

**Example**
```js
steem.broadcast.limitOrderCreate(wif, 'alice', 1, '10.000 STEEM', '9.000 SBD', false, '2025-01-01T00:00:00', (err, r) => console.log(r));
```

<small>Operation: `limit_order_create`</small>

### limitOrderCreate2

```js
steem.broadcast.limitOrderCreate2(wif, owner, orderid, amount_to_sell, exchange_rate, fill_or_kill, expiration, callback)
```

**Roles:** active, owner

Like [limitOrderCreate](#limitordercreate) but priced with an explicit exchange-rate object instead of a min-to-receive amount.

**Parameters**

| Name | Type | Description |
|---|---|---|
| owner | string | Order owner |
| orderid | number | Client-chosen id |
| amount_to_sell | string | Asset amount to sell |
| exchange_rate | object | `{ base, quote }` price |
| fill_or_kill | boolean | Fill-or-kill flag |
| expiration | string\|Date | Expiration time |

**Example**
```js
steem.broadcast.limitOrderCreate2(wif, 'alice', 2, '10.000 STEEM',
  { base: '1.000 STEEM', quote: '0.900 SBD' }, false, '2025-01-01T00:00:00', (err, r) => console.log(r));
```

<small>Operation: `limit_order_create2`</small>

### liquidityReward

```js
steem.broadcast.liquidityReward(wif, owner, payout, callback)
```

**Roles:** active, owner

**Virtual operation** — emitted when a legacy liquidity reward is paid.

**Parameters**

| Name | Type | Description |
|---|---|---|
| owner | string | Reward recipient |
| payout | string | Reward amount |

**Example**
```js
// Observed via getAccountHistory / streamOperations.
```

<small>Operation: `liquidity_reward`</small>

### pow

```js
steem.broadcast.pow(wif, worker, input, signature, work, callback)
```

**Roles:** active, owner

Legacy proof-of-work account registration (pre-HF17). No longer accepted on the live chain; documented for completeness.

**Parameters**

| Name | Type | Description |
|---|---|---|
| worker | object | Worker public key/account |
| input | object | PoW input |
| signature | string | PoW signature |
| work | object | PoW solution |

**Example**
```js
// Historical only — mining is disabled.
steem.broadcast.pow(wif, worker, input, signature, work, (err, r) => console.log(err));
```

<small>Operation: `pow`</small>

### pow2

```js
steem.broadcast.pow2(wif, input, pow_summary, callback)
```

**Roles:** active, owner

Legacy proof-of-work v2 registration (pre-HF17). No longer accepted on the live chain.

**Parameters**

| Name | Type | Description |
|---|---|---|
| input | object | PoW input |
| pow_summary | object | PoW summary/solution |

**Example**
```js
// Historical only — mining is disabled.
steem.broadcast.pow2(wif, input, powSummary, (err, r) => console.log(err));
```

<small>Operation: `pow2`</small>

### price

```js
steem.broadcast.price(wif, base, quote, callback)
```

**Roles:** active, owner

A price *type* (`{ base, quote }`), not a normal standalone broadcast operation. It appears as a serializable building block used inside other operations (e.g. exchange rates). Listed here for completeness.

**Parameters**

| Name | Type | Description |
|---|---|---|
| base | string | Base asset amount |
| quote | string | Quote asset amount |

**Example**
```js
const price = { base: '1.000 STEEM', quote: '0.900 SBD' };
```

<small>Operation: `price`</small>

### recoverAccount

```js
steem.broadcast.recoverAccount(wif, account_to_recover, new_owner_authority, recent_owner_authority, extensions, callback)
```

**Roles:** owner

The account owner completes recovery using a recent owner authority and the newly proposed one. Signed with **owner**.

**Parameters**

| Name | Type | Description |
|---|---|---|
| account_to_recover | string | Account being recovered |
| new_owner_authority | object | The proposed new owner authority |
| recent_owner_authority | object | An owner authority used in the last 30 days |
| extensions | array | Operation extensions |

**Example**
```js
steem.broadcast.recoverAccount(ownerWif, 'alice', newOwnerAuth, recentOwnerAuth, [], (err, r) => console.log(r));
```

<small>Operation: `recover_account`</small>

### removeProposal

```js
steem.broadcast.removeProposal(wif, proposal_owner, proposal_ids, extensions, callback)
```

**Roles:** active, owner

Removes proposals owned by the account.

**Parameters**

| Name | Type | Description |
|---|---|---|
| proposal_owner | string | Owner of the proposals |
| proposal_ids | number[] | Proposal ids to remove |
| extensions | array | Operation extensions |

**Example**
```js
steem.broadcast.removeProposal(wif, 'alice', [5], [], (err, r) => console.log(r));
```

<small>Operation: `remove_proposal`</small>

### requestAccountRecovery

```js
steem.broadcast.requestAccountRecovery(wif, recovery_account, account_to_recover, new_owner_authority, extensions, callback)
```

**Roles:** active, owner

The recovery agent proposes a new owner authority for an account that asked to be recovered. Valid for 24 hours.

**Parameters**

| Name | Type | Description |
|---|---|---|
| recovery_account | string | The account's recovery agent |
| account_to_recover | string | Account being recovered |
| new_owner_authority | object | Proposed new owner authority |
| extensions | array | Operation extensions |

**Example**
```js
steem.broadcast.requestAccountRecovery(wif, 'steem', 'alice', newOwnerAuth, [], (err, r) => console.log(r));
```

<small>Operation: `request_account_recovery`</small>

### resetAccount

```js
steem.broadcast.resetAccount(wif, reset_account, account_to_reset, new_owner_authority, callback)
```

**Roles:** active, owner

Reset-account operation. **Currently disabled on chain** (broadcasting returns an assertion error).

**Parameters**

| Name | Type | Description |
|---|---|---|
| reset_account | string | Account performing the reset |
| account_to_reset | string | Account being reset |
| new_owner_authority | object | New owner authority |

**Example**
```js
steem.broadcast.resetAccount(wif, 'resetter', 'alice', newOwnerAuth, (err, r) => console.log(err));
```

<small>Operation: `reset_account`</small>

### setResetAccount

```js
steem.broadcast.setResetAccount(wif, account, current_reset_account, reset_account, callback)
```

**Roles:** owner, posting

Sets an account's reset account. **Currently disabled on chain.**

**Parameters**

| Name | Type | Description |
|---|---|---|
| account | string | Account being configured |
| current_reset_account | string | Current reset account |
| reset_account | string | New reset account |

**Example**
```js
steem.broadcast.setResetAccount(wif, 'alice', '', 'resetter', (err, r) => console.log(err));
```

<small>Operation: `set_reset_account`</small>

### setWithdrawVestingRoute

```js
steem.broadcast.setWithdrawVestingRoute(wif, from_account, to_account, percent, auto_vest, callback)
```

**Roles:** active, owner

Routes a percentage of a power-down to another account, optionally re-vesting it there.

**Parameters**

| Name | Type | Description |
|---|---|---|
| from_account | string | Account powering down |
| to_account | string | Destination account |
| percent | number | 0..10000 (100% = 10000) |
| auto_vest | boolean | Re-vest at the destination if true |

**Example**
```js
steem.broadcast.setWithdrawVestingRoute(wif, 'alice', 'bob', 10000, true, (err, r) => console.log(r));
```

<small>Operation: `set_withdraw_vesting_route`</small>

### smtContribute

```js
steem.broadcast.smtContribute(wif, contributor, symbol, contribution_id, contribution, extensions, callback)
```

**Roles:** active, owner

Contributes STEEM to an SMT's ICO.

**Parameters**

| Name | Type | Description |
|---|---|---|
| contributor | string | Contributing account |
| symbol | object | SMT asset symbol |
| contribution_id | number | Client-chosen id |
| contribution | string | STEEM amount |
| extensions | array | Operation extensions |

**Example**
```js
steem.broadcast.smtContribute(wif, 'alice', symbol, 1, '10.000 STEEM', [], (err, r) => console.log(r));
```

<small>Operation: `smt_contribute`</small>

### smtCreate

```js
steem.broadcast.smtCreate(wif, control_account, symbol, smt_creation_fee, precision, extensions, callback)
```

**Roles:** active, owner

Creates a Smart Media Token under a control account.

**Parameters**

| Name | Type | Description |
|---|---|---|
| control_account | string | Account controlling the SMT |
| symbol | object | Asset symbol (NAI + precision) |
| smt_creation_fee | string | Creation fee |
| precision | number | Token decimal precision |
| extensions | array | Operation extensions |

**Example**
```js
steem.broadcast.smtCreate(wif, 'alice', symbol, '1000.000 STEEM', 3, [], (err, r) => console.log(r));
```

<small>Operation: `smt_create`</small>

### smtSetRuntimeParameters

```js
steem.broadcast.smtSetRuntimeParameters(wif, control_account, symbol, runtime_parameters, extensions, callback)
```

**Roles:** active, owner

Sets SMT runtime parameters (reward curves, windows, percentages).

**Parameters**

| Name | Type | Description |
|---|---|---|
| control_account | string | Controlling account |
| symbol | object | SMT asset symbol |
| runtime_parameters | array | Runtime parameter set |
| extensions | array | Operation extensions |

**Example**
```js
steem.broadcast.smtSetRuntimeParameters(wif, 'alice', symbol, runtimeParams, [], (err, r) => console.log(r));
```

<small>Operation: `smt_set_runtime_parameters`</small>

### smtSetSetupParameters

```js
steem.broadcast.smtSetSetupParameters(wif, control_account, symbol, setup_parameters, extensions, callback)
```

**Roles:** active, owner

Sets SMT setup-phase parameters (e.g. whether contributions are allowed).

**Parameters**

| Name | Type | Description |
|---|---|---|
| control_account | string | Controlling account |
| symbol | object | SMT asset symbol |
| setup_parameters | array | Setup parameter set |
| extensions | array | Operation extensions |

**Example**
```js
steem.broadcast.smtSetSetupParameters(wif, 'alice', symbol, setupParams, [], (err, r) => console.log(r));
```

<small>Operation: `smt_set_setup_parameters`</small>

### smtSetup

```js
steem.broadcast.smtSetup(wif, control_account, symbol, max_supply, contribution_begin_time, contribution_end_time, launch_time, steem_units_min, min_unit_ratio, max_unit_ratio, extensions, callback)
```

**Roles:** active, owner

Configures an SMT's supply, contribution window, launch time, and unit ratios.

**Parameters**

| Name | Type | Description |
|---|---|---|
| control_account | string | Controlling account |
| symbol | object | SMT asset symbol |
| max_supply | number | Maximum token supply |
| contribution_begin_time | string | ISO datetime |
| contribution_end_time | string | ISO datetime |
| launch_time | string | ISO datetime |
| steem_units_min | number | Minimum STEEM units to launch |
| min_unit_ratio | number | Minimum generation unit ratio |
| max_unit_ratio | number | Maximum generation unit ratio |
| extensions | array | Operation extensions |

**Example**
```js
steem.broadcast.smtSetup(wif, 'alice', symbol, 1000000,
  '2025-01-01T00:00:00', '2025-02-01T00:00:00', '2025-02-02T00:00:00',
  0, 0, 100, [], (err, r) => console.log(r));
```

<small>Operation: `smt_setup`</small>

### smtSetupEmissions

```js
steem.broadcast.smtSetupEmissions(wif, control_account, symbol, schedule_time, emissions_unit, interval_seconds, interval_coount, lep_time, rep_time, lep_abs_amount, rep_abs_amount, lep_rel_amount_numerator, rep_rel_amount_numerator, rel_amount_denom_bits, remove, floor_emissions, extensions, callback)
```

**Roles:** active, owner

Defines an SMT's token emission schedule.

**Parameters**

| Name | Type | Description |
|---|---|---|
| control_account | string | Controlling account |
| symbol | object | SMT asset symbol |
| schedule_time | string | ISO datetime emissions start |
| emissions_unit | object | Emission distribution unit |
| interval_seconds | number | Seconds between emissions |
| interval_coount | number | Number of intervals (note: param name is misspelled in source) |
| lep_time | string | Left-endpoint time |
| rep_time | string | Right-endpoint time |
| lep_abs_amount | string | Left-endpoint absolute amount |
| rep_abs_amount | string | Right-endpoint absolute amount |
| lep_rel_amount_numerator | number | Left relative numerator |
| rep_rel_amount_numerator | number | Right relative numerator |
| rel_amount_denom_bits | number | Relative denominator bits |
| remove | boolean | Remove this schedule |
| floor_emissions | boolean | Floor emissions flag |
| extensions | array | Operation extensions |

**Example**
```js
steem.broadcast.smtSetupEmissions(wif, 'alice', symbol, '2025-01-01T00:00:00',
  emissionsUnit, 86400, 30, lepTime, repTime, '0', '0', 0, 0, 0, false, false, [], (err, r) => console.log(r));
```

<small>Operation: `smt_setup_emissions`</small>

### smtSetupIcoTier

```js
steem.broadcast.smtSetupIcoTier(wif, control_account, symbol, steem_units_cap, generation_policy, remove, extensions, callback)
```

**Roles:** active, owner

Adds or removes an ICO contribution tier for an SMT.

**Parameters**

| Name | Type | Description |
|---|---|---|
| control_account | string | Controlling account |
| symbol | object | SMT asset symbol |
| steem_units_cap | number | STEEM units cap for this tier |
| generation_policy | object | Token generation policy |
| remove | boolean | `true` to remove the tier |
| extensions | array | Operation extensions |

**Example**
```js
steem.broadcast.smtSetupIcoTier(wif, 'alice', symbol, 10000, generationPolicy, false, [], (err, r) => console.log(r));
```

<small>Operation: `smt_setup_ico_tier`</small>

### transfer

```js
steem.broadcast.transfer(wif, from, to, amount, memo, callback)
```

**Roles:** active, owner

Transfers liquid assets between accounts.

**Parameters**

| Name | Type | Description |
|---|---|---|
| from | string | Sending account |
| to | string | Receiving account |
| amount | string | e.g. `'5.150 SBD'` — exactly 3 decimals |
| memo | string | Memo (prefix with `#` to encrypt — see [Memo](../guide/memo)) |

**Example**
```js
const wif = steem.auth.toWif(user, pass, 'active');
steem.broadcast.transfer(wif, 'alice', 'bob', '5.000 STEEM', 'thanks', (err, r) => console.log(r));
```

<small>Operation: `transfer`</small>

### transferFromSavings

```js
steem.broadcast.transferFromSavings(wif, from, request_id, to, amount, memo, callback)
```

**Roles:** active, owner

Requests a withdrawal from savings (subject to the 3-day delay). Identified by `request_id`.

**Parameters**

| Name | Type | Description |
|---|---|---|
| from | string | Savings owner |
| request_id | number | Client-chosen id |
| to | string | Destination account |
| amount | string | Asset amount |
| memo | string | Optional memo |

**Example**
```js
steem.broadcast.transferFromSavings(wif, 'alice', 1, 'alice', '10.000 STEEM', '', (err, r) => console.log(r));
```

<small>Operation: `transfer_from_savings`</small>

### transferToSavings

```js
steem.broadcast.transferToSavings(wif, from, to, amount, memo, callback)
```

**Roles:** active, owner

Moves assets into the 3-day savings balance.

**Parameters**

| Name | Type | Description |
|---|---|---|
| from | string | Source account |
| to | string | Savings owner (may equal `from`) |
| amount | string | Asset amount |
| memo | string | Optional memo |

**Example**
```js
steem.broadcast.transferToSavings(wif, 'alice', 'alice', '10.000 STEEM', '', (err, r) => console.log(r));
```

<small>Operation: `transfer_to_savings`</small>

### transferToVesting

```js
steem.broadcast.transferToVesting(wif, from, to, amount, callback)
```

**Roles:** active, owner

Powers up STEEM into STEEM POWER (VESTS). `to` may differ from `from` to power up another account.

**Parameters**

| Name | Type | Description |
|---|---|---|
| from | string | Account providing STEEM |
| to | string | Account to receive STEEM POWER (may equal `from`) |
| amount | string | STEEM amount, e.g. `'10.000 STEEM'` |

**Example**
```js
steem.broadcast.transferToVesting(wif, 'alice', 'alice', '10.000 STEEM', (err, r) => console.log(r));
```

<small>Operation: `transfer_to_vesting`</small>

### updateProposalVotes

```js
steem.broadcast.updateProposalVotes(wif, voter, proposal_ids, approve, extensions, callback)
```

**Roles:** active, owner

Approves or removes the voter's approval for one or more proposals.

**Parameters**

| Name | Type | Description |
|---|---|---|
| voter | string | Voting account |
| proposal_ids | number[] | Proposal ids |
| approve | boolean | `true` to approve, `false` to unapprove |
| extensions | array | Operation extensions |

**Example**
```js
steem.broadcast.updateProposalVotes(wif, 'alice', [0, 5], true, [], (err, r) => console.log(r));
```

<small>Operation: `update_proposal_votes`</small>

### vote

```js
steem.broadcast.vote(wif, voter, author, permlink, weight, callback)
```

**Roles:** posting, active, owner

Casts a vote on a post or comment. Re-voting changes the existing vote.

**Parameters**

| Name | Type | Description |
|---|---|---|
| voter | string | Voting account |
| author | string | Post author |
| permlink | string | Post permlink |
| weight | number | -10000..10000 (100% = 10000) |

**Example**
```js
const wif = steem.auth.toWif(user, pass, 'posting');
steem.broadcast.vote(wif, 'alice', 'bob', 'a-post', 10000, (err, result) => console.log(result));
```

<small>Operation: `vote`</small>

### vote2

```js
steem.broadcast.vote2(wif, voter, author, permlink, rshares, extensions, callback)
```

**Roles:** posting, active, owner

Extended vote operation that specifies `rshares` directly plus extensions (HF-specific). Most clients use [vote](#vote).

**Parameters**

| Name | Type | Description |
|---|---|---|
| voter | string | Voting account |
| author | string | Post author |
| permlink | string | Post permlink |
| rshares | number | Reward shares to apply |
| extensions | array | Operation extensions |

**Example**
```js
steem.broadcast.vote2(wif, 'alice', 'bob', 'a-post', 1000000, [], (err, r) => console.log(r));
```

<small>Operation: `vote2`</small>

### withdrawVesting

```js
steem.broadcast.withdrawVesting(wif, account, vesting_shares, callback)
```

**Roles:** active, owner

Starts a power-down of the given VESTS (paid out in 13 weekly installments). Pass `'0.000000 VESTS'` to stop an active power-down.

**Parameters**

| Name | Type | Description |
|---|---|---|
| account | string | Account powering down |
| vesting_shares | string | VESTS to withdraw, e.g. `'1000000.000000 VESTS'` |

**Example**
```js
steem.broadcast.withdrawVesting(wif, 'alice', '1000000.000000 VESTS', (err, r) => console.log(r));
```

<small>Operation: `withdraw_vesting`</small>

### witnessSetProperties

```js
steem.broadcast.witnessSetProperties(wif, owner, props, extensions, callback)
```

**Roles:** active, owner

Sets witness-controlled chain properties via a typed props map (HF20+ replacement for parts of [witnessUpdate](#witnessupdate)).

**Parameters**

| Name | Type | Description |
|---|---|---|
| owner | string | Witness account |
| props | object | Map of serialized witness properties |
| extensions | array | Operation extensions |

**Example**
```js
steem.broadcast.witnessSetProperties(wif, 'witness', { key: '...', account_creation_fee: '...' }, [], (err, r) => console.log(r));
```

<small>Operation: `witness_set_properties`</small>

### witnessUpdate

```js
steem.broadcast.witnessUpdate(wif, owner, url, block_signing_key, props, fee, callback)
```

**Roles:** active, owner

Registers or updates a witness. An empty `block_signing_key` resigns the witness.

**Parameters**

| Name | Type | Description |
|---|---|---|
| owner | string | Witness account |
| url | string | Witness info URL |
| block_signing_key | string | Public signing key (`STM1111...` to resign) |
| props | object | `{ account_creation_fee, maximum_block_size, sbd_interest_rate }` |
| fee | string | Legacy fee, usually `'0.000 STEEM'` |

**Example**
```js
steem.broadcast.witnessUpdate(wif, 'witness', 'https://...', 'STM8...',
  { account_creation_fee: '3.000 STEEM', maximum_block_size: 65536, sbd_interest_rate: 0 }, '0.000 STEEM', (err, r) => console.log(r));
```

<small>Operation: `witness_update`</small>

## Account auth helpers

Convenience methods (from [`src/broadcast/helpers.js`](https://github.com/blazeapps007/steem-js/blob/master/src/broadcast/helpers.js)) that read an account, mutate one of its authorities, and broadcast an `accountUpdate` for you. Each takes a single options object.

### addAccountAuth

```js
steem.broadcast.addAccountAuth({ signingKey, username, authorizedUsername, role, weight }, cb)
```

Grants another account authority over `username` for the given role (defaults to `posting`). Reads the account, adds the authorized account to that role's `account_auths`, and broadcasts an [accountUpdate](#accountupdate). No-ops if the authority already exists.

**Parameters**

| Name | Type | Description |
|---|---|---|
| signingKey | string | WIF that can sign an account update for `username` |
| username | string | Account being modified |
| authorizedUsername | string | Account to grant authority to |
| role | string | `posting` (default), `active`, or `owner` |
| weight | number | Optional; defaults to the role's `weight_threshold` |

**Example**
```js
steem.broadcast.addAccountAuth(
  { signingKey, username: 'alice', authorizedUsername: 'someapp', role: 'posting' },
  (err, r) => console.log(r)
);
```

### removeAccountAuth

```js
steem.broadcast.removeAccountAuth({ signingKey, username, authorizedUsername, role }, cb)
```

Revokes a previously granted account authority for the given role and broadcasts an [accountUpdate](#accountupdate). No-ops if the account was not present in `account_auths`.

**Parameters**

| Name | Type | Description |
|---|---|---|
| signingKey | string | WIF that can sign an account update for `username` |
| username | string | Account being modified |
| authorizedUsername | string | Account to revoke |
| role | string | `posting` (default), `active`, or `owner` |

**Example**
```js
steem.broadcast.removeAccountAuth(
  { signingKey, username: 'alice', authorizedUsername: 'someapp', role: 'posting' },
  (err, r) => console.log(r)
);
```

### addKeyAuth

```js
steem.broadcast.addKeyAuth({ signingKey, username, authorizedKey, role, weight }, cb)
```

Adds a public key to the given role's `key_auths` for `username` and broadcasts an [accountUpdate](#accountupdate). No-ops if the key is already authorized.

**Parameters**

| Name | Type | Description |
|---|---|---|
| signingKey | string | WIF that can sign an account update for `username` |
| username | string | Account being modified |
| authorizedKey | string | Public key (`STM...`) to authorize |
| role | string | `posting` (default), `active`, or `owner` |
| weight | number | Optional; defaults to the role's `weight_threshold` |

**Example**
```js
steem.broadcast.addKeyAuth(
  { signingKey, username: 'alice', authorizedKey: 'STM8...', role: 'posting' },
  (err, r) => console.log(r)
);
```

### removeKeyAuth

```js
steem.broadcast.removeKeyAuth({ signingKey, username, authorizedKey, role }, cb)
```

Removes a public key from the given role's `key_auths` and broadcasts an [accountUpdate](#accountupdate). No-ops if the key was not authorized.

**Parameters**

| Name | Type | Description |
|---|---|---|
| signingKey | string | WIF that can sign an account update for `username` |
| username | string | Account being modified |
| authorizedKey | string | Public key (`STM...`) to remove |
| role | string | `posting` (default), `active`, or `owner` |

**Example**
```js
steem.broadcast.removeKeyAuth(
  { signingKey, username: 'alice', authorizedKey: 'STM8...', role: 'posting' },
  (err, r) => console.log(r)
);
```

