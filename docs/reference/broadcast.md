---
title: Broadcast (steem.broadcast)
parent: Reference
nav_order: 2
---

# Broadcast reference (`steem.broadcast`)

Write operations. These sign a transaction and broadcast it to the network — they cause permanent changes on the blockchain. Generated from [`src/broadcast/operations.js`](https://github.com/blazeapps007/steem-js/blob/master/src/broadcast/operations.js).

Every method accepts a trailing callback **or** returns a Promise if you omit it (an `Async` suffix variant also exists for backwards compatibility). The first argument is the signing key (`wif`); the **Roles** column lists which key roles can authorize the operation — use a WIF for one of them.

Total operations: **63** (plus 4 auth helpers below).

## Operations

### accountCreate

```js
steem.broadcast.accountCreate(wif, fee, creator, new_account_name, owner, active, posting, memo_key, json_metadata, callback)
```

**Roles:** active, owner

Creates a new account, paying the creation `fee`. Supply owner/active/posting authority objects and a memo key.

<small>Operation: `account_create`</small>

### accountCreateWithDelegation

```js
steem.broadcast.accountCreateWithDelegation(wif, fee, delegation, creator, new_account_name, owner, active, posting, memo_key, json_metadata, extensions, callback)
```

**Roles:** active, owner

Creates a new account using a fee plus a VESTS `delegation` to cover bandwidth.

<small>Operation: `account_create_with_delegation`</small>

### accountUpdate

```js
steem.broadcast.accountUpdate(wif, account, owner, active, posting, memo_key, json_metadata, callback)
```

**Roles:** active, owner

Updates an account's authorities, memo key, and/or json_metadata.

<small>Operation: `account_update`</small>

### accountUpdate2

```js
steem.broadcast.accountUpdate2(wif, account, owner, active, posting, memo_key, json_metadata, posting_json_metadata, extensions, callback)
```

**Roles:** posting, active, owner

Like accountUpdate but also supports `posting_json_metadata` and extensions (HF21+).

<small>Operation: `account_update2`</small>

### accountWitnessProxy

```js
steem.broadcast.accountWitnessProxy(wif, account, proxy, callback)
```

**Roles:** active, owner

Delegates the account's witness voting to a proxy account (empty string clears it).

<small>Operation: `account_witness_proxy`</small>

### accountWitnessVote

```js
steem.broadcast.accountWitnessVote(wif, account, witness, approve, callback)
```

**Roles:** active, owner

Approves or unapproves a witness for the account's witness votes.

<small>Operation: `account_witness_vote`</small>

### cancelTransferFromSavings

```js
steem.broadcast.cancelTransferFromSavings(wif, from, request_id, callback)
```

**Roles:** active, owner

Cancels a pending savings withdrawal by `request_id`.

<small>Operation: `cancel_transfer_from_savings`</small>

### changeRecoveryAccount

```js
steem.broadcast.changeRecoveryAccount(wif, account_to_recover, new_recovery_account, extensions, callback)
```

**Roles:** owner

Sets a new recovery account (takes effect after a 30-day delay). Signed with owner.

<small>Operation: `change_recovery_account`</small>

### claimAccount

```js
steem.broadcast.claimAccount(wif, creator, fee, extensions, callback)
```

**Roles:** active, owner

Claims an account-creation token (pays the fee up front) to mint a discounted account later via createClaimedAccount.

<small>Operation: `claim_account`</small>

### claimRewardBalance

```js
steem.broadcast.claimRewardBalance(wif, account, reward_steem, reward_sbd, reward_vests, callback)
```

**Roles:** posting, active, owner

Claims pending author/curation rewards. Amounts are strings like '0.000 STEEM', '0.000 SBD', '0.000006 VESTS'.

<small>Operation: `claim_reward_balance`</small>

### claimRewardBalance2

```js
steem.broadcast.claimRewardBalance2(wif, account, reward_tokens, extensions, callback)
```

**Roles:** posting, active, owner

<small>Operation: `claim_reward_balance2`</small>

### comment

```js
steem.broadcast.comment(wif, parent_author, parent_permlink, author, permlink, title, body, json_metadata, callback)
```

**Roles:** posting, active, owner

Creates or edits a post/comment. Leave `parentAuthor`/`parentPermlink` empty for a top-level post. If `permlink` is omitted for a reply, one is derived from the parent.

<small>Operation: `comment`</small>

### commentOptions

```js
steem.broadcast.commentOptions(wif, author, permlink, max_accepted_payout, percent_steem_dollars, allow_votes, allow_curation_rewards, extensions, callback)
```

**Roles:** posting, active, owner

Sets payout options for a comment (max accepted payout, percent SBD, whether votes/curation are allowed).

<small>Operation: `comment_options`</small>

### commentReward

```js
steem.broadcast.commentReward(wif, author, permlink, payout, callback)
```

**Roles:** posting, active, owner

Virtual op: emitted when a comment pays out.

<small>Operation: `comment_reward`</small>

### convert

```js
steem.broadcast.convert(wif, owner, requestid, amount, callback)
```

**Roles:** active, owner

Requests conversion of SBD to STEEM (settles after the conversion delay).

<small>Operation: `convert`</small>

### createClaimedAccount

```js
steem.broadcast.createClaimedAccount(wif, creator, new_account_name, owner, active, posting, memo_key, json_metadata, extensions, callback)
```

**Roles:** active, owner

Creates an account using a previously claimed account-creation token (no fee at creation time).

<small>Operation: `create_claimed_account`</small>

### createProposal

```js
steem.broadcast.createProposal(wif, creator, receiver, start_date, end_date, daily_pay, subject, permlink, extensions, callback)
```

**Roles:** active, owner

Creates an SPS/DHF funding proposal (creator, receiver, dates, daily_pay, subject, permlink).

<small>Operation: `create_proposal`</small>

### custom

```js
steem.broadcast.custom(wif, required_auths, id, data, callback)
```

**Roles:** active, owner

Posts arbitrary binary custom data requiring the given active auths.

<small>Operation: `custom`</small>

### customBinary

```js
steem.broadcast.customBinary(wif, id, data, callback)
```

**Roles:** posting, active, owner

Posts arbitrary binary custom data (posting-level).

<small>Operation: `custom_binary`</small>

### customJson

```js
steem.broadcast.customJson(wif, required_auths, required_posting_auths, id, json, callback)
```

**Roles:** posting, active, owner

Posts a custom JSON operation (the basis for most second-layer apps), with required active and/or posting auths.

<small>Operation: `custom_json`</small>

### declineVotingRights

```js
steem.broadcast.declineVotingRights(wif, account, decline, callback)
```

**Roles:** owner

Irreversibly declines the account's voting rights (owner authority, takes effect after a delay).

<small>Operation: `decline_voting_rights`</small>

### delegateVestingShares

```js
steem.broadcast.delegateVestingShares(wif, delegator, delegatee, vesting_shares, callback)
```

**Roles:** active, owner

Delegates STEEM POWER (VESTS) from delegator to delegatee. Set to 0 VESTS to undelegate.

<small>Operation: `delegate_vesting_shares`</small>

### deleteComment

```js
steem.broadcast.deleteComment(wif, author, permlink, callback)
```

**Roles:** posting, active, owner

Deletes a post/comment that has no votes or replies.

<small>Operation: `delete_comment`</small>

### escrowApprove

```js
steem.broadcast.escrowApprove(wif, from, to, agent, who, escrow_id, approve, callback)
```

**Roles:** active, owner

Agent or recipient approves (or rejects) an escrow.

<small>Operation: `escrow_approve`</small>

### escrowDispute

```js
steem.broadcast.escrowDispute(wif, from, to, agent, who, escrow_id, callback)
```

**Roles:** active, owner

Raises a dispute on an escrow, handing release control to the agent.

<small>Operation: `escrow_dispute`</small>

### escrowRelease

```js
steem.broadcast.escrowRelease(wif, from, to, agent, who, receiver, escrow_id, sbd_amount, steem_amount, callback)
```

**Roles:** active, owner

Releases escrowed funds to a receiver.

<small>Operation: `escrow_release`</small>

### escrowTransfer

```js
steem.broadcast.escrowTransfer(wif, from, to, agent, escrow_id, sbd_amount, steem_amount, fee, ratification_deadline, escrow_expiration, json_meta, callback)
```

**Roles:** active, owner

Creates an escrow between `from` and `to` with an `agent`, fee, and ratification/expiration deadlines.

<small>Operation: `escrow_transfer`</small>

### feedPublish

```js
steem.broadcast.feedPublish(wif, publisher, exchange_rate, callback)
```

**Roles:** active, owner

Witness operation: publishes a STEEM/SBD price feed (`exchange_rate`).

<small>Operation: `feed_publish`</small>

### fillConvertRequest

```js
steem.broadcast.fillConvertRequest(wif, owner, requestid, amount_in, amount_out, callback)
```

**Roles:** active, owner

Virtual op: emitted when an SBD->STEEM conversion settles.

<small>Operation: `fill_convert_request`</small>

### fillOrder

```js
steem.broadcast.fillOrder(wif, current_owner, current_orderid, current_pays, open_owner, open_orderid, open_pays, callback)
```

**Roles:** posting, active, owner

Virtual op: emitted when an internal-market order is (partially) filled.

<small>Operation: `fill_order`</small>

### fillTransferFromSavings

```js
steem.broadcast.fillTransferFromSavings(wif, from, to, amount, request_id, memo, callback)
```

**Roles:** posting, active, owner

Virtual op: emitted when a savings withdrawal completes.

<small>Operation: `fill_transfer_from_savings`</small>

### fillVestingWithdraw

```js
steem.broadcast.fillVestingWithdraw(wif, from_account, to_account, withdrawn, deposited, callback)
```

**Roles:** active, owner

Virtual op: emitted on each scheduled power-down payment.

<small>Operation: `fill_vesting_withdraw`</small>

### interest

```js
steem.broadcast.interest(wif, owner, interest, callback)
```

**Roles:** active, owner

Virtual op: emitted when SBD interest is paid.

<small>Operation: `interest`</small>

### limitOrderCancel

```js
steem.broadcast.limitOrderCancel(wif, owner, orderid, callback)
```

**Roles:** active, owner

Cancels an open limit order by `orderid`. The order may fill before cancellation completes.

<small>Operation: `limit_order_cancel`</small>

### limitOrderCreate

```js
steem.broadcast.limitOrderCreate(wif, owner, orderid, amount_to_sell, min_to_receive, fill_or_kill, expiration, callback)
```

**Roles:** active, owner

Creates an internal-market limit order using a min-to-receive amount. `expiration` must be in the future; set `fill_or_kill` to fill only from the current book.

<small>Operation: `limit_order_create`</small>

### limitOrderCreate2

```js
steem.broadcast.limitOrderCreate2(wif, owner, orderid, amount_to_sell, exchange_rate, fill_or_kill, expiration, callback)
```

**Roles:** active, owner

Like limitOrderCreate but priced with an explicit exchange rate object instead of min-to-receive.

<small>Operation: `limit_order_create2`</small>

### liquidityReward

```js
steem.broadcast.liquidityReward(wif, owner, payout, callback)
```

**Roles:** active, owner

Virtual op: emitted when a liquidity reward is paid.

<small>Operation: `liquidity_reward`</small>

### pow

```js
steem.broadcast.pow(wif, worker, input, signature, work, callback)
```

**Roles:** active, owner

Legacy proof-of-work registration (pre-HF17).

<small>Operation: `pow`</small>

### pow2

```js
steem.broadcast.pow2(wif, input, pow_summary, callback)
```

**Roles:** active, owner

Legacy proof-of-work v2 registration (pre-HF17).

<small>Operation: `pow2`</small>

### price

```js
steem.broadcast.price(wif, base, quote, callback)
```

**Roles:** active, owner

<small>Operation: `price`</small>

### recoverAccount

```js
steem.broadcast.recoverAccount(wif, account_to_recover, new_owner_authority, recent_owner_authority, extensions, callback)
```

**Roles:** owner

Account owner completes recovery using a recent and the new owner authority. Signed with owner.

<small>Operation: `recover_account`</small>

### removeProposal

```js
steem.broadcast.removeProposal(wif, proposal_owner, proposal_ids, extensions, callback)
```

**Roles:** active, owner

Removes proposals owned by the account by their ids.

<small>Operation: `remove_proposal`</small>

### requestAccountRecovery

```js
steem.broadcast.requestAccountRecovery(wif, recovery_account, account_to_recover, new_owner_authority, extensions, callback)
```

**Roles:** active, owner

Recovery agent proposes a new owner authority for an account that requested recovery.

<small>Operation: `request_account_recovery`</small>

### resetAccount

```js
steem.broadcast.resetAccount(wif, reset_account, account_to_reset, new_owner_authority, callback)
```

**Roles:** active, owner

Reset-account operation (currently disabled on chain).

<small>Operation: `reset_account`</small>

### setResetAccount

```js
steem.broadcast.setResetAccount(wif, account, current_reset_account, reset_account, callback)
```

**Roles:** owner, posting

Sets the account's reset account (currently disabled on chain).

<small>Operation: `set_reset_account`</small>

### setWithdrawVestingRoute

```js
steem.broadcast.setWithdrawVestingRoute(wif, from_account, to_account, percent, auto_vest, callback)
```

**Roles:** active, owner

Routes a percentage of a power-down to another account, optionally auto-vesting it.

<small>Operation: `set_withdraw_vesting_route`</small>

### smtContribute

```js
steem.broadcast.smtContribute(wif, contributor, symbol, contribution_id, contribution, extensions, callback)
```

**Roles:** active, owner

Contributes STEEM to an SMT's ICO.

<small>Operation: `smt_contribute`</small>

### smtCreate

```js
steem.broadcast.smtCreate(wif, control_account, symbol, smt_creation_fee, precision, extensions, callback)
```

**Roles:** active, owner

Creates a Smart Media Token under a control account with a symbol, creation fee, and precision.

<small>Operation: `smt_create`</small>

### smtSetRuntimeParameters

```js
steem.broadcast.smtSetRuntimeParameters(wif, control_account, symbol, runtime_parameters, extensions, callback)
```

**Roles:** active, owner

Sets SMT runtime parameters.

<small>Operation: `smt_set_runtime_parameters`</small>

### smtSetSetupParameters

```js
steem.broadcast.smtSetSetupParameters(wif, control_account, symbol, setup_parameters, extensions, callback)
```

**Roles:** active, owner

Sets SMT setup-phase parameters.

<small>Operation: `smt_set_setup_parameters`</small>

### smtSetup

```js
steem.broadcast.smtSetup(wif, control_account, symbol, max_supply, contribution_begin_time, contribution_end_time, launch_time, steem_units_min, min_unit_ratio, max_unit_ratio, extensions, callback)
```

**Roles:** active, owner

Configures an SMT's supply, contribution window, launch time, and unit ratios.

<small>Operation: `smt_setup`</small>

### smtSetupEmissions

```js
steem.broadcast.smtSetupEmissions(wif, control_account, symbol, schedule_time, emissions_unit, interval_seconds, interval_coount, lep_time, rep_time, lep_abs_amount, rep_abs_amount, lep_rel_amount_numerator, rep_rel_amount_numerator, rel_amount_denom_bits, remove, floor_emissions, extensions, callback)
```

**Roles:** active, owner

Defines an SMT's token emission schedule.

<small>Operation: `smt_setup_emissions`</small>

### smtSetupIcoTier

```js
steem.broadcast.smtSetupIcoTier(wif, control_account, symbol, steem_units_cap, generation_policy, remove, extensions, callback)
```

**Roles:** active, owner

Adds or removes an ICO contribution tier for an SMT.

<small>Operation: `smt_setup_ico_tier`</small>

### transfer

```js
steem.broadcast.transfer(wif, from, to, amount, memo, callback)
```

**Roles:** active, owner

Transfers liquid assets between accounts. `amount` is a string like '5.150 SBD' with exactly 3 decimals.

<small>Operation: `transfer`</small>

### transferFromSavings

```js
steem.broadcast.transferFromSavings(wif, from, request_id, to, amount, memo, callback)
```

**Roles:** active, owner

Requests a withdrawal from savings (subject to the savings delay). Identified by `request_id`.

<small>Operation: `transfer_from_savings`</small>

### transferToSavings

```js
steem.broadcast.transferToSavings(wif, from, to, amount, memo, callback)
```

**Roles:** active, owner

Moves assets into the 3-day savings balance.

<small>Operation: `transfer_to_savings`</small>

### transferToVesting

```js
steem.broadcast.transferToVesting(wif, from, to, amount, callback)
```

**Roles:** active, owner

Powers up STEEM into STEEM POWER (VESTS). `to` may differ from `from` to power up another account; `amount` must be denominated in STEEM.

<small>Operation: `transfer_to_vesting`</small>

### updateProposalVotes

```js
steem.broadcast.updateProposalVotes(wif, voter, proposal_ids, approve, extensions, callback)
```

**Roles:** active, owner

Approves or removes the voter's approval for one or more proposal ids.

<small>Operation: `update_proposal_votes`</small>

### vote

```js
steem.broadcast.vote(wif, voter, author, permlink, weight, callback)
```

**Roles:** posting, active, owner

Casts a vote on a post or comment. `weight` ranges -10000..10000 (100% = 10000).

<small>Operation: `vote`</small>

### vote2

```js
steem.broadcast.vote2(wif, voter, author, permlink, rshares, extensions, callback)
```

**Roles:** posting, active, owner

<small>Operation: `vote2`</small>

### withdrawVesting

```js
steem.broadcast.withdrawVesting(wif, account, vesting_shares, callback)
```

**Roles:** active, owner

Starts (or stops, with 0) a power-down of `vesting_shares` VESTS.

<small>Operation: `withdraw_vesting`</small>

### witnessSetProperties

```js
steem.broadcast.witnessSetProperties(wif, owner, props, extensions, callback)
```

**Roles:** active, owner

Sets witness-controlled chain properties via a typed props map (HF20+ replacement for parts of witnessUpdate).

<small>Operation: `witness_set_properties`</small>

### witnessUpdate

```js
steem.broadcast.witnessUpdate(wif, owner, url, block_signing_key, props, fee, callback)
```

**Roles:** active, owner

Registers or updates a witness (signing key, URL, chain props, fee). Empty signing key resigns the witness.

<small>Operation: `witness_update`</small>

## Account auth helpers

Convenience methods (from [`src/broadcast/helpers.js`](https://github.com/blazeapps007/steem-js/blob/master/src/broadcast/helpers.js)) that read an account, mutate its authority, and broadcast an `accountUpdate` for you. They take a single options object.

### addAccountAuth

```js
steem.broadcast.addAccountAuth({ signingKey, username, authorizedUsername, role = 'posting', weight }, cb)
```

Grants another account authority over `username` for the given role (defaults to `posting`). Reads the account, adds the authorized account to that role's `account_auths`, and broadcasts an `accountUpdate`. If `weight` is omitted it defaults to the role's `weight_threshold`. No-ops if the account already has the authority.

### removeAccountAuth

```js
steem.broadcast.removeAccountAuth({ signingKey, username, authorizedUsername, role = 'posting' }, cb)
```

Revokes a previously granted account authority for the given role and broadcasts an `accountUpdate`. No-ops if the account was not present in `account_auths`.

### addKeyAuth

```js
steem.broadcast.addKeyAuth({ signingKey, username, authorizedKey, role = 'posting', weight }, cb)
```

Adds a public key to the given role's `key_auths` for `username` and broadcasts an `accountUpdate`. If `weight` is omitted it defaults to the role's `weight_threshold`. No-ops if the key is already authorized.

### removeKeyAuth

```js
steem.broadcast.removeKeyAuth({ signingKey, username, authorizedKey, role = 'posting' }, cb)
```

Removes a public key from the given role's `key_auths` and broadcasts an `accountUpdate`. No-ops if the key was not authorized.

