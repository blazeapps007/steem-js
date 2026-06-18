// Memo AES-256-CBC on @noble/ciphers (pure JS, isomorphic). Byte-compatible with the
// previous browserify-aes/bytebuffer implementation; validated by the memo golden vector.
import { cbc } from '@noble/ciphers/aes.js';
import { randomBytes } from '@noble/hashes/utils.js';
import assert from 'assert';
import PublicKey from './key_public.js';
import PrivateKey from './key_private.js';
import hash from './hash.js';

function u64leBuffer(bigintVal) {
  const b = Buffer.alloc(8);
  b.writeBigUInt64LE(BigInt.asUintN(64, bigintVal));
  return b;
}

function toBigIntNonce(n) {
  if (n == null) return null;
  if (typeof n === 'bigint') return n;
  // string | number | bytebuffer Long (has .toString)
  return BigInt(typeof n === 'object' && typeof n.toString === 'function' ? n.toString() : n);
}

/**
    @arg {PrivateKey} private_key - used to calculate the shared secret
    @arg {PublicKey} public_key - used to calculate the shared secret
    @arg {string} [nonce] - random/unique uint64 (as a decimal string)
    @return {{nonce: string, message: Buffer, checksum: number}}
*/
export function encrypt(private_key, public_key, message, nonce = uniqueNonce()) {
  return crypt(private_key, public_key, nonce, message);
}

/** @return {Buffer} decrypted message */
export function decrypt(private_key, public_key, nonce, message, checksum) {
  return crypt(private_key, public_key, nonce, message, checksum).message;
}

function crypt(private_key, public_key, nonce, message, checksum) {
  private_key = toPrivateObj(private_key);
  if (!private_key) throw new TypeError('private_key is required');

  public_key = toPublicObj(public_key);
  if (!public_key) throw new TypeError('public_key is required');

  const nonceBig = toBigIntNonce(nonce);
  if (nonceBig == null) throw new TypeError('nonce is required');

  if (!Buffer.isBuffer(message)) {
    if (typeof message !== 'string') throw new TypeError('message should be buffer or string');
    message = Buffer.from(message, 'binary');
  }
  if (checksum && typeof checksum !== 'number') throw new TypeError('checksum should be a number');

  const S = private_key.get_shared_secret(public_key); // Buffer (sha512, 64 bytes)
  const ebuf = Buffer.concat([u64leBuffer(nonceBig), Buffer.from(S)]);
  const encryption_key = hash.sha512(ebuf); // Buffer (64 bytes)

  const iv = encryption_key.slice(32, 48);
  const key = encryption_key.slice(0, 32);

  // check = first 32 bits (LE) of sha256(encryption_key)
  let check = hash.sha256(encryption_key).slice(0, 4).readUInt32LE(0);

  if (checksum) {
    if (check !== checksum) throw new Error('Invalid key');
    message = aesDecrypt(message, key, iv);
  } else {
    message = aesEncrypt(message, key, iv);
  }
  return { nonce: nonceBig.toString(), message, checksum: check };
}

function aesEncrypt(message, key, iv) {
  assert(message, 'Missing plain text');
  const ct = cbc(Uint8Array.from(key), Uint8Array.from(iv)).encrypt(Uint8Array.from(message));
  return Buffer.from(ct);
}

function aesDecrypt(message, key, iv) {
  assert(message, 'Missing cipher text');
  const pt = cbc(Uint8Array.from(key), Uint8Array.from(iv)).decrypt(Uint8Array.from(message));
  return Buffer.from(pt);
}

/** @return {string} unique 64-bit unsigned number as a decimal string. */
let unique_nonce_entropy = null;
function uniqueNonce() {
  if (unique_nonce_entropy === null) {
    const b = randomBytes(2);
    unique_nonce_entropy = parseInt((b[0] << 8) | b[1], 10);
  }
  const entropy = (++unique_nonce_entropy) % 0xffff;
  const long = (BigInt(Date.now()) << 16n) | BigInt(entropy);
  return long.toString();
}

const toPrivateObj = o => (o ? (o.d ? o : PrivateKey.fromWif(o)) : o);
const toPublicObj = o => (o ? (o.Q ? o : PublicKey.fromString(o)) : o);

export default { encrypt, decrypt };
