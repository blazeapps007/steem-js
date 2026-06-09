// Hashing on @noble/hashes (pure JS, isomorphic — no Node `crypto`/`stream` deps).
// Keeps the original Buffer-returning interface so the rest of the ecc layer is unchanged.
import { sha256 as nobleSha256, sha512 as nobleSha512 } from '@noble/hashes/sha2.js';
import { ripemd160 as nobleRipemd160, sha1 as nobleSha1 } from '@noble/hashes/legacy.js';
import { hmac as nobleHmac } from '@noble/hashes/hmac.js';

function toBytes(data) {
  if (data == null) return new Uint8Array(0);
  if (typeof data === 'string') return new TextEncoder().encode(data);
  return Uint8Array.from(data); // Buffer / Uint8Array / number[]
}

function digest(bytes, encoding) {
  const buf = Buffer.from(bytes);
  return encoding ? buf.toString(encoding) : buf;
}

/** @arg {string|Buffer} data @arg {string} [encoding] 'hex'|'base64'|… @return {string|Buffer} */
export function sha1(data, encoding) {
  return digest(nobleSha1(toBytes(data)), encoding);
}

/** @arg {string|Buffer} data @arg {string} [encoding] @return {string|Buffer} */
export function sha256(data, encoding) {
  return digest(nobleSha256(toBytes(data)), encoding);
}

/** @arg {string|Buffer} data @arg {string} [encoding] @return {string|Buffer} */
export function sha512(data, encoding) {
  return digest(nobleSha512(toBytes(data)), encoding);
}

export function HmacSHA256(buffer, secret) {
  return digest(nobleHmac(nobleSha256, toBytes(secret), toBytes(buffer)));
}

export function ripemd160(data) {
  return digest(nobleRipemd160(toBytes(data)));
}

export default { sha1, sha256, sha512, HmacSHA256, ripemd160 };
