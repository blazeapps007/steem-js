Per-operation detail for steem.broadcast, spliced into docs/reference/broadcast.md by
scripts/gen-docs.js. Blocks are separated by a line `=== name`. The generator adds the
heading, signature, Roles line, and Operation footer; each body below adds description,
parameters, an example, and returns.

Unless noted otherwise, broadcast methods resolve with the synchronous transaction result —
`{ id, block_num, trx_num, expired }` merged with the signed transaction — or reject/err.

=== vote
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

=== comment
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

=== deleteComment
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

=== commentOptions
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

=== vote2
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

=== transfer
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

=== transferToVesting
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

=== withdrawVesting
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

=== setWithdrawVestingRoute
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

=== delegateVestingShares
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

=== convert
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

=== claimRewardBalance
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

=== claimRewardBalance2
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

=== limitOrderCreate
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

=== limitOrderCreate2
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

=== limitOrderCancel
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

=== price
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

=== feedPublish
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

=== accountCreate
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

=== accountCreateWithDelegation
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

=== claimAccount
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

=== createClaimedAccount
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

=== accountUpdate
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

=== accountUpdate2
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

=== accountWitnessVote
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

=== accountWitnessProxy
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

=== witnessUpdate
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

=== witnessSetProperties
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

=== custom
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

=== customJson
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

=== customBinary
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

=== requestAccountRecovery
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

=== recoverAccount
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

=== changeRecoveryAccount
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

=== resetAccount
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

=== setResetAccount
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

=== declineVotingRights
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

=== escrowTransfer
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

=== escrowApprove
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

=== escrowDispute
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

=== escrowRelease
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

=== transferToSavings
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

=== transferFromSavings
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

=== cancelTransferFromSavings
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

=== createProposal
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

=== updateProposalVotes
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

=== removeProposal
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

=== smtCreate
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

=== smtSetup
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

=== smtSetupEmissions
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

=== smtSetupIcoTier
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

=== smtSetSetupParameters
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

=== smtSetRuntimeParameters
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

=== smtContribute
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

=== pow
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

=== pow2
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

=== fillConvertRequest
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

=== commentReward
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

=== liquidityReward
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

=== interest
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

=== fillVestingWithdraw
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

=== fillOrder
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

=== fillTransferFromSavings
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

=== addAccountAuth
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

=== removeAccountAuth
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

=== addKeyAuth
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

=== removeKeyAuth
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

