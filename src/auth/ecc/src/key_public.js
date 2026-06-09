import base58 from 'bs58';
import assert from 'assert';
import hash from './hash.js';
import config from '../../../config.js';
import { Point, G, n, bytesToBig } from './curve.js';

const NULL_HEX = '00'.repeat(33);

class PublicKey {

    /** @param {Point} Q public key point (or null) */
    constructor(Q, compressed = true) { this.Q = Q; this._compressed = compressed; }

    static fromBinary(bin) {
        return PublicKey.fromBuffer(new Buffer.from(bin, 'binary'));
    }

    static fromBuffer(buffer) {
        if (buffer.toString('hex') === NULL_HEX) return new PublicKey(null);
        const compressed = buffer.length === 33;
        return new PublicKey(Point.fromBytes(Uint8Array.from(buffer)), compressed);
    }

    toBuffer(compressed = this.Q ? this._compressed : null) {
        if (this.Q === null) return Buffer.from(NULL_HEX, 'hex');
        return Buffer.from(this.Q.toBytes(compressed));
    }

    static fromPoint(point) {
        return new PublicKey(point);
    }

    toUncompressed() {
        return new PublicKey(this.Q, false);
    }

    /** bts::blockchain::address (unique but not a full public key) */
    toBlockchainAddress() {
        const pub_buf = this.toBuffer();
        const pub_sha = hash.sha512(pub_buf);
        return hash.ripemd160(pub_sha);
    }

    toString(address_prefix = config.get('address_prefix')) {
        return this.toPublicKeyString(address_prefix);
    }

    toPublicKeyString(address_prefix = config.get('address_prefix')) {
        if (this.pubdata) return address_prefix + this.pubdata;
        const pub_buf = this.toBuffer();
        const checksum = hash.ripemd160(pub_buf);
        const addy = Buffer.concat([pub_buf, checksum.slice(0, 4)]);
        this.pubdata = base58.encode(addy);
        return address_prefix + this.pubdata;
    }

    /** @deprecated use fromString instead. @return PublicKey or null */
    static fromString(public_key, address_prefix = config.get('address_prefix')) {
        try {
            return PublicKey.fromStringOrThrow(public_key, address_prefix);
        } catch (e) {
            return null;
        }
    }

    /** @throws {Error} if public key is invalid. @return PublicKey */
    static fromStringOrThrow(public_key, address_prefix = config.get('address_prefix')) {
        const prefix = public_key.slice(0, address_prefix.length);
        assert.equal(
            address_prefix, prefix,
            `Expecting key to begin with ${address_prefix}, instead got ${prefix}`);
        public_key = public_key.slice(address_prefix.length);

        public_key = new Buffer.from(base58.decode(public_key), 'binary');
        const checksum = public_key.slice(-4);
        public_key = public_key.slice(0, -4);
        let new_checksum = hash.ripemd160(public_key);
        new_checksum = new_checksum.slice(0, 4);
        assert.deepEqual(checksum, new_checksum, 'Checksum did not match');
        return PublicKey.fromBuffer(public_key);
    }

    toAddressString(address_prefix = config.get('address_prefix')) {
        const pub_buf = this.toBuffer();
        const pub_sha = hash.sha512(pub_buf);
        let addy = hash.ripemd160(pub_sha);
        const checksum = hash.ripemd160(addy);
        addy = Buffer.concat([addy, checksum.slice(0, 4)]);
        return address_prefix + base58.encode(addy);
    }

    toPtsAddy() {
        const pub_buf = this.toBuffer();
        const pub_sha = hash.sha256(pub_buf);
        let addy = hash.ripemd160(pub_sha);
        addy = Buffer.concat([new Buffer.from([0x38]), addy]); // version 56(decimal)

        let checksum = hash.sha256(addy);
        checksum = hash.sha256(checksum);

        addy = Buffer.concat([addy, checksum.slice(0, 4)]);
        return base58.encode(addy);
    }

    child(offset) {
        assert(Buffer.isBuffer(offset), 'Buffer required: offset');
        assert.equal(offset.length, 32, 'offset length');

        offset = Buffer.concat([this.toBuffer(), offset]);
        offset = hash.sha256(offset);

        const c = bytesToBig(offset);
        if (c >= n) throw new Error('Child offset went out of bounds, try again');

        const cG = G.multiply(c);
        const Qprime = this.Q.add(cG);

        if (Qprime.is0()) throw new Error('Child offset derived to an invalid key, try again');

        return PublicKey.fromPoint(Qprime);
    }

    static fromHex(hex) {
        return PublicKey.fromBuffer(new Buffer.from(hex, 'hex'));
    }

    toHex() {
        return this.toBuffer().toString('hex');
    }

    static fromStringHex(hex) {
        return PublicKey.fromString(new Buffer.from(hex, 'hex'));
    }
}

export default PublicKey;
