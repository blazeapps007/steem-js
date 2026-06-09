// secp256k1 primitives on @noble/curves (pure JS, isomorphic) + bigint<->bytes helpers.
// Replaces bigi + ecurve. Keeps Buffer I/O so callers are unchanged.
import { secp256k1 } from '@noble/curves/secp256k1.js';
import { mod, invert } from '@noble/curves/abstract/modular.js';

export const secp = secp256k1;
export const Point = secp256k1.Point;
export const G = Point.BASE;
export const n = Point.Fn.ORDER; // curve order
export const NobleSignature = secp256k1.Signature;
export { mod, invert };

/** Big-endian bytes -> bigint */
export function bytesToBig(u8) {
  let hex = '';
  for (let i = 0; i < u8.length; i++) hex += u8[i].toString(16).padStart(2, '0');
  return hex === '' ? 0n : BigInt('0x' + hex);
}

/** Minimal big-endian bytes for a non-negative bigint (>= 1 byte). */
export function bigToMinBytes(x) {
  if (x === 0n) return Buffer.from([0]);
  let hex = x.toString(16);
  if (hex.length % 2) hex = '0' + hex;
  return Buffer.from(hex.match(/../g).map(b => parseInt(b, 16)));
}

/** Fixed-size (left-zero-padded) big-endian Buffer for a bigint. */
export function bigToBytes(x, size = 32) {
  let a = Array.from(bigToMinBytes(x));
  if (a.length > size) a = a.slice(a.length - size);
  while (a.length < size) a.unshift(0);
  return Buffer.from(a);
}

/** DER INTEGER byte length (matches bigi's toDERInteger length): +1 if MSB set. */
export function derIntLen(x) {
  const b = bigToMinBytes(x);
  return (b[0] & 0x80) ? b.length + 1 : b.length;
}
