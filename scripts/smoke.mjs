// Cross-runtime smoke test of the built bundle (Node + Deno). Offline; byte-exact checks
// against the frozen golden values. Exits non-zero on failure.
import steem from '../dist/index.mjs';

const exit = (code) => {
  if (typeof process !== 'undefined' && process.exit) process.exit(code);
  else if (typeof Deno !== 'undefined') Deno.exit(code);
};

const checks = [];
const add = (name, pass) => checks.push([name, pass]);

const wif = steem.auth.toWif('alice', 'password123', 'active');
add('auth.toWif', wif === '5HsARJZiSjTxTQhjbAeZgD1KLhqUvewkfWWPAMBiCTZvhBvL1Qp');

const keys = steem.auth.generateKeys('alice', 'password123', ['posting']);
add('auth.generateKeys', keys.posting === 'STM7Fbx298R8Dnk1VUbNaKxwHy24rdKsP6Z8g64mJdBAF4M35jBGr');

const tx = {
  ref_block_num: 1234,
  ref_block_prefix: 5678,
  expiration: '2024-01-01T00:00:00',
  operations: [['vote', { voter: 'alice', author: 'bob', permlink: 'test-permlink', weight: 10000 }]],
  extensions: [],
};
const signed = steem.auth.signTransaction(tx, ['5JhsDom1eiYo8aHj95izadr5L4KXupYphRPmd9u636QjgMEY3ct']);
add('auth.signTransaction', signed.signatures[0] ===
  '206ae22f1fcd2d7e29410d7411a07c00a20d76f94ec6a78fed045d150f44baff3f2aba1006ac1ae25b6e4495f71c781916a63eaa2130ba8c6d40a117237e4207d1');

const enc = steem.memo.encode(
  '5JyG3BRv59MCfApceA2pfPoA27HPKxYJN6gGyrFYYbHA4reKz5z',
  'STM52eGnUvfxL9Er38bGMoyPLHFxb378KXraSAqw4ad3m4BAXdkJZ',
  '#a secret memo', '1234567890');
add('memo.encode/decode', enc.startsWith('#AP5LTMDHtUFJenZQBtRJq1') &&
  steem.memo.decode('5JyG3BRv59MCfApceA2pfPoA27HPKxYJN6gGyrFYYbHA4reKz5z', enc) === '#a secret memo');

add('api methods present', typeof steem.api.getAccounts === 'function' &&
  typeof steem.api.findRcAccountsAsync === 'function');
add('broadcast methods present', typeof steem.broadcast.vote === 'function' &&
  typeof steem.broadcast.addAccountAuth === 'function');

let ok = true;
for (const [name, pass] of checks) {
  console.log(`${pass ? 'OK  ' : 'FAIL'} ${name}`);
  if (!pass) ok = false;
}
console.log(ok ? 'smoke passed' : 'smoke FAILED');
exit(ok ? 0 : 1);
