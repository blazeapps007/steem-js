import PrivateKey from './key_private.js';
import hash from './hash.js';
import { randomBytes } from '@noble/hashes/utils.js';

// hash for .25 second
const HASH_POWER_MILLS = 250;

let entropyPos = 0, entropyCount = 0;
const entropyArray = Buffer.from(randomBytes(101));

export function addEntropy(...ints) {
  entropyCount++;
  for (const i of ints) {
    const pos = entropyPos++ % 101;
    const i2 = entropyArray[pos] += i;
    if (i2 > 9007199254740991) entropyArray[pos] = 0;
  }
}

/**
    A weak random number generator can run out of entropy. This ensures even the worst RNG
    is reasonably safe. @arg {string} entropy of at least 32 bytes
*/
export function random32ByteBuffer(entropy = browserEntropy()) {
  if (!(typeof entropy === 'string')) {
    throw new Error('string required for entropy');
  }
  if (entropy.length < 32) {
    throw new Error('expecting at least 32 bytes of entropy');
  }

  const start_t = Date.now();
  while (Date.now() - start_t < HASH_POWER_MILLS) entropy = hash.sha256(entropy);

  const hash_array = [];
  hash_array.push(entropy);
  hash_array.push(Buffer.from(randomBytes(32)));

  return hash.sha256(Buffer.concat(hash_array));
}

export function get_random_key(entropy) {
  return PrivateKey.fromBuffer(random32ByteBuffer(entropy));
}

/** Isomorphic entropy gathering (WebCrypto-backed randomBytes; no window/navigator). */
export function browserEntropy() {
  let entropyStr = Array.from(entropyArray).join();
  entropyStr += new Date().toString() + ' ' + Buffer.from(randomBytes(32)).toString('hex');
  return entropyStr;
}

export default { addEntropy, random32ByteBuffer, get_random_key, browserEntropy };
