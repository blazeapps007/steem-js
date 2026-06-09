// Golden-vector parity tests. These freeze the exact crypto/serializer outputs of the
// library so the modernization (crypto → @noble, serializer → ByteWriter, etc.) can be
// proven byte-for-byte non-regressive. DO NOT update these constants to make a refactor
// pass — a change here means the on-chain behavior changed and would break real accounts.
import assert from 'assert';
import steem from '../src';
import { ops } from '../src/auth/serializer';

const NAME = 'alice';
const PASS = 'password123';

const EXPECT = {
  wifOwner: '5K9ZVmgNjcgr9NJmCAUygZ2N56qDSnKu7BwTgbNvNtw2ApUuXYU',
  wifActive: '5HsARJZiSjTxTQhjbAeZgD1KLhqUvewkfWWPAMBiCTZvhBvL1Qp',
  wifPosting: '5JhsDom1eiYo8aHj95izadr5L4KXupYphRPmd9u636QjgMEY3ct',
  wifMemo: '5JyG3BRv59MCfApceA2pfPoA27HPKxYJN6gGyrFYYbHA4reKz5z',
  keys: {
    owner: 'STM8KUQENPVA5edLNs8Dj8J69Pa565aSK86owMkzWioDj8Urr9Stv',
    active: 'STM7rn5ss3AdWAKMasVVFLWwn8J9MzawCAwkG9YA7FueZK8iaxQUB',
    posting: 'STM7Fbx298R8Dnk1VUbNaKxwHy24rdKsP6Z8g64mJdBAF4M35jBGr',
    memo: 'STM52eGnUvfxL9Er38bGMoyPLHFxb378KXraSAqw4ad3m4BAXdkJZ',
  },
  postingPubkey: 'STM7Fbx298R8Dnk1VUbNaKxwHy24rdKsP6Z8g64mJdBAF4M35jBGr',
  signature:
    '206ae22f1fcd2d7e29410d7411a07c00a20d76f94ec6a78fed045d150f44baff3f2aba1006ac1ae25b6e4495f71c781916a63eaa2130ba8c6d40a117237e4207d1',
  txHex:
    'd2042e16000080009265010005616c69636503626f620d746573742d7065726d6c696e6b102700',
  memoEncoded:
    '#AP5LTMDHtUFJenZQBtRJq1xg2hnq2AscMw9qgqHt2vQZL83VxexC6WrGEekX1RsLka48i845pWPWPh6pSDk61XJhNHUmy73bjGUrJmPu87pKVN4yjb1eQLjxMojmvAh27',
};

const TX = {
  ref_block_num: 1234,
  ref_block_prefix: 5678,
  expiration: '2024-01-01T00:00:00',
  operations: [['vote', { voter: 'alice', author: 'bob', permlink: 'test-permlink', weight: 10000 }]],
  extensions: [],
};

describe('golden vectors (crypto + serializer parity)', () => {
  it('toWif derives the same WIFs per role', () => {
    assert.equal(steem.auth.toWif(NAME, PASS, 'owner'), EXPECT.wifOwner);
    assert.equal(steem.auth.toWif(NAME, PASS, 'active'), EXPECT.wifActive);
    assert.equal(steem.auth.toWif(NAME, PASS, 'posting'), EXPECT.wifPosting);
    assert.equal(steem.auth.toWif(NAME, PASS, 'memo'), EXPECT.wifMemo);
  });

  it('generateKeys derives the same public keys', () => {
    const keys = steem.auth.generateKeys(NAME, PASS, ['owner', 'active', 'posting', 'memo']);
    assert.deepEqual(keys, EXPECT.keys);
  });

  it('wifToPublic and getPrivateKeys match', () => {
    assert.equal(steem.auth.wifToPublic(EXPECT.wifActive), EXPECT.keys.active);
    const priv = steem.auth.getPrivateKeys(NAME, PASS, ['posting']);
    assert.equal(priv.posting, EXPECT.wifPosting);
    assert.equal(priv.postingPubkey, EXPECT.postingPubkey);
  });

  it('signTransaction produces the same canonical signature', () => {
    const signed = steem.auth.signTransaction(TX, [EXPECT.wifPosting]);
    assert.deepEqual(signed.signatures, [EXPECT.signature]);
  });

  it('serializes the transaction to the same hex', () => {
    assert.equal(ops.transaction.toBuffer(TX).toString('hex'), EXPECT.txHex);
  });

  it('memo encodes deterministically (fixed nonce) and roundtrips', () => {
    const encoded = steem.memo.encode(EXPECT.wifMemo, EXPECT.keys.memo, '#a secret memo', '1234567890');
    assert.equal(encoded, EXPECT.memoEncoded);
    assert.equal(steem.memo.decode(EXPECT.wifMemo, encoded), '#a secret memo');
  });
});
