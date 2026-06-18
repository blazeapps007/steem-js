// Minimal drop-in replacement for the subset of `bytebuffer` (v5) used by the serializer
// and memo code. Backed by Uint8Array/DataView + a BigInt-based Long. Pure JS, isomorphic.
// CommonJS (module.exports = ByteBuffer) so existing `require('bytebuffer')` call sites work
// unchanged: ByteBuffer.LITTLE_ENDIAN, new ByteBuffer(), ByteBuffer.fromHex/fromBinary, .Long.

const td = new TextDecoder();
const te = new TextEncoder();

class Long {
  constructor(bi, unsigned = false) {
    this._v = BigInt.asUintN(64, bi);
    this.unsigned = unsigned;
  }
  static isLong(x) { return x instanceof Long; }
  static fromString(s, unsigned = false, radix = 10) {
    const bi = radix === 16 ? BigInt('0x' + String(s)) : BigInt(String(s));
    return new Long(bi, unsigned);
  }
  static fromNumber(n, unsigned = false) { return new Long(BigInt(Math.trunc(n)), unsigned); }
  static fromInt(n, unsigned = false) { return new Long(BigInt(n | 0), unsigned); }
  _signed() { return this.unsigned ? this._v : BigInt.asIntN(64, this._v); }
  toString(radix = 10) { return this._signed().toString(radix); }
  toInt() { return Number(BigInt.asIntN(64, this._v)); }
  toNumber() { return Number(this._signed()); }
  shiftRight(bits) { return new Long(this._v >> BigInt(bits), this.unsigned); }
  shiftLeft(bits) { return new Long(this._v << BigInt(bits), this.unsigned); }
  and(o) { return new Long(this._v & toBig(o), this.unsigned); }
  or(o) { return new Long(this._v | toBig(o), this.unsigned); }
}

function toBig(v) {
  if (v instanceof Long) return v._v;
  if (typeof v === 'bigint') return v;
  if (typeof v === 'number') return BigInt(Math.trunc(v));
  return BigInt(String(v));
}

function binaryToBytes(str) {
  const a = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) a[i] = str.charCodeAt(i) & 0xff;
  return a;
}
function hexToBytes(hex) {
  const a = new Uint8Array(hex.length / 2);
  for (let i = 0; i < a.length; i++) a[i] = parseInt(hex.substr(i * 2, 2), 16);
  return a;
}
function bytesToBinary(bytes) {
  let s = '';
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return s;
}
function bytesToHex(bytes) {
  let s = '';
  for (let i = 0; i < bytes.length; i++) s += bytes[i].toString(16).padStart(2, '0');
  return s;
}

class ByteBuffer {
  constructor(capacity = ByteBuffer.DEFAULT_CAPACITY, littleEndian = false) {
    this._buf = new Uint8Array(Math.max(1, capacity | 0));
    this._len = 0;       // high-water mark / limit
    this.offset = 0;     // read/write cursor
    this.markedOffset = -1;
    this.littleEndian = !!littleEndian;
  }

  static _wrap(bytes, littleEndian) {
    const bb = new ByteBuffer(bytes.length || 1, littleEndian);
    bb._buf = bytes.length ? bytes : new Uint8Array(0);
    bb._len = bytes.length;
    bb.offset = 0;
    return bb;
  }
  static fromBinary(str, capacity, littleEndian) {
    // (str, capacity, littleEndian) OR (str, littleEndian)
    const le = typeof capacity === 'boolean' ? capacity : littleEndian;
    return ByteBuffer._wrap(binaryToBytes(str), le);
  }
  static fromHex(hex, littleEndian) {
    return ByteBuffer._wrap(hexToBytes(hex), littleEndian);
  }

  _ensure(n) {
    const need = this.offset + n;
    if (need <= this._buf.length) return;
    let cap = this._buf.length;
    while (cap < need) cap = cap < 1 ? need : cap * 2;
    const next = new Uint8Array(cap);
    next.set(this._buf);
    this._buf = next;
  }
  _dv() { return new DataView(this._buf.buffer, this._buf.byteOffset, this._buf.length); }
  _advance(n) { this.offset += n; if (this.offset > this._len) this._len = this.offset; }

  // --- writes ---
  writeUint8(v) { this._ensure(1); this._buf[this.offset] = v & 0xff; this._advance(1); return this; }
  writeInt8(v) { return this.writeUint8(v); }
  writeUint16(v) { this._ensure(2); this._dv().setUint16(this.offset, v & 0xffff, this.littleEndian); this._advance(2); return this; }
  writeInt16(v) { this._ensure(2); this._dv().setInt16(this.offset, v, this.littleEndian); this._advance(2); return this; }
  writeUint32(v) { this._ensure(4); this._dv().setUint32(this.offset, v >>> 0, this.littleEndian); this._advance(4); return this; }
  writeInt32(v) { this._ensure(4); this._dv().setInt32(this.offset, v | 0, this.littleEndian); this._advance(4); return this; }
  writeUint64(v) { this._ensure(8); this._dv().setBigUint64(this.offset, BigInt.asUintN(64, toBig(v)), this.littleEndian); this._advance(8); return this; }
  writeInt64(v) { return this.writeUint64(v); }

  writeVarint32(value) {
    value >>>= 0;
    while (value > 0x7f) { this.writeUint8((value & 0x7f) | 0x80); value >>>= 7; }
    this.writeUint8(value & 0x7f);
    return this;
  }

  writeVString(str) {
    const bytes = te.encode(String(str));
    this.writeVarint32(bytes.length);
    this._ensure(bytes.length);
    this._buf.set(bytes, this.offset);
    this._advance(bytes.length);
    return this;
  }

  append(source, encoding) {
    let bytes;
    if (source instanceof ByteBuffer) {
      bytes = source._buf.subarray(source.offset, source._len);
    } else if (typeof source === 'string') {
      bytes = encoding === 'hex' ? hexToBytes(source)
        : encoding === 'utf8' ? te.encode(source)
        : binaryToBytes(source);
    } else {
      bytes = Uint8Array.from(source); // Buffer / Uint8Array / number[]
    }
    this._ensure(bytes.length);
    this._buf.set(bytes, this.offset);
    this._advance(bytes.length);
    return this;
  }

  // --- reads ---
  readUint8() { const v = this._buf[this.offset]; this.offset += 1; return v; }
  readInt8() { const v = this._dv().getInt8(this.offset); this.offset += 1; return v; }
  readUint16() { const v = this._dv().getUint16(this.offset, this.littleEndian); this.offset += 2; return v; }
  readInt16() { const v = this._dv().getInt16(this.offset, this.littleEndian); this.offset += 2; return v; }
  readUint32() { const v = this._dv().getUint32(this.offset, this.littleEndian); this.offset += 4; return v; }
  readInt32() { const v = this._dv().getInt32(this.offset, this.littleEndian); this.offset += 4; return v; }
  readUint64() { const v = this._dv().getBigUint64(this.offset, this.littleEndian); this.offset += 8; return new Long(v, true); }
  readInt64() { const v = this._dv().getBigInt64(this.offset, this.littleEndian); this.offset += 8; return new Long(v, false); }
  readBigInt64() { return this.readInt64(); }

  readVarint32() {
    let c = 0, value = 0, b;
    do { b = this._buf[this.offset++]; if (c < 5) value |= (b & 0x7f) << (7 * c); c++; } while (b & 0x80);
    return value >>> 0;
  }

  readVString() {
    const len = this.readVarint32();
    const bytes = this._buf.subarray(this.offset, this.offset + len);
    this.offset += len;
    return td.decode(bytes);
  }

  // --- cursor / output ---
  skip(n) { this.offset += n; return this; }
  mark() { this.markedOffset = this.offset; return this; }
  reset() { this.offset = this.markedOffset >= 0 ? this.markedOffset : 0; return this; }
  printDebug() { /* no-op */ }

  copy(begin = this.offset, end = this._len) {
    return ByteBuffer._wrap(this._buf.slice(begin, end), this.littleEndian);
  }
  toBinary(begin = this.offset, end = this._len) {
    if (begin === this.offset && end === this._len && this.offset === 0) {
      return bytesToBinary(this._buf.subarray(0, this._len));
    }
    return bytesToBinary(this._buf.subarray(begin, end));
  }
  toHex(begin = this.offset, end = this._len) {
    return bytesToHex(this._buf.subarray(begin, end));
  }
  toString(encoding) {
    const bytes = this._buf.subarray(0, this._len);
    if (encoding === 'hex') return bytesToHex(bytes);
    if (encoding === 'binary') return bytesToBinary(bytes);
    if (encoding === 'utf8') return td.decode(bytes);
    return `ByteBufferLite(offset=${this.offset},length=${this._len})`;
  }
}

ByteBuffer.DEFAULT_CAPACITY = 64;
ByteBuffer.LITTLE_ENDIAN = true;
ByteBuffer.BIG_ENDIAN = false;
ByteBuffer.Long = Long;

module.exports = ByteBuffer;
module.exports.Long = Long;
