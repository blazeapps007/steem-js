import base58 from 'bs58';
import assert from 'assert';
import hash from './hash.js';
import PublicKey from './key_public.js';
import { Point, G, n, bytesToBig, bigToBytes } from './curve.js';

class PrivateKey {

    /** @param {bigint} d */
    constructor(d) { this.d = d; }

    static fromBuffer(buf) {
        if (!Buffer.isBuffer(buf)) {
            throw new Error('Expecting parameter to be a Buffer type');
        }
        if (buf.length === 32) {
            // ok
        } else if (buf.length === 0) {
            throw new Error('Empty buffer');
        } else {
            console.log(`WARN: Expecting 32 bytes, instead got ${buf.length}, stack trace:`, new Error().stack);
        }
        return new PrivateKey(bytesToBig(buf));
    }

    /** @arg {string} seed - any length string (deterministic). */
    static fromSeed(seed) {
        if (!(typeof seed === 'string')) {
            throw new Error('seed must be of type string');
        }
        return PrivateKey.fromBuffer(hash.sha256(seed));
    }

    static isWif(text) {
        try {
            this.fromWif(text);
            return true;
        } catch (e) {
            return false;
        }
    }

    static fromWif(_private_wif) {
        const private_wif = new Buffer.from(base58.decode(_private_wif));
        const version = private_wif.readUInt8(0);
        assert.equal(0x80, version, `Expected version ${0x80}, instead got ${version}`);
        // checksum includes the version
        let private_key = private_wif.slice(0, -4);
        const checksum = private_wif.slice(-4);
        let new_checksum = hash.sha256(private_key);
        new_checksum = hash.sha256(new_checksum);
        new_checksum = new_checksum.slice(0, 4);
        if (checksum.toString() !== new_checksum.toString())
            throw new Error('Invalid WIF key (checksum miss-match)');

        private_key = private_key.slice(1);
        return PrivateKey.fromBuffer(private_key);
    }

    toWif() {
        let private_key = this.toBuffer();
        // checksum includes the version
        private_key = Buffer.concat([new Buffer.from([0x80]), private_key]);
        let checksum = hash.sha256(private_key);
        checksum = hash.sha256(checksum);
        checksum = checksum.slice(0, 4);
        const private_wif = Buffer.concat([private_key, checksum]);
        return base58.encode(private_wif);
    }

    /** Alias for {@link toWif} */
    toString() {
        return this.toWif();
    }

    /** @return {Point} */
    toPublicKeyPoint() {
        return G.multiply(this.d);
    }

    toPublic() {
        if (this.public_key) { return this.public_key; }
        return this.public_key = PublicKey.fromPoint(this.toPublicKeyPoint());
    }

    toBuffer() {
        return bigToBytes(this.d, 32);
    }

    /** ECIES */
    get_shared_secret(public_key) {
        public_key = toPublic(public_key);
        const KB = public_key.toUncompressed().toBuffer(); // [0x04, x(32), y(32)]
        const KBP = Point.fromAffine({
            x: bytesToBig(KB.slice(1, 33)),
            y: bytesToBig(KB.slice(33, 65)),
        });
        const P = KBP.multiply(this.d);
        const S = bigToBytes(P.toAffine().x, 32);
        // SHA512 used in ECIES
        return hash.sha512(S);
    }

    /** @throws {Error} - overflow of the key could not be derived */
    child(offset) {
        offset = Buffer.concat([this.toPublicKey().toBuffer(), offset]);
        offset = hash.sha256(offset);
        const c = bytesToBig(offset);

        if (c >= n) throw new Error('Child offset went out of bounds, try again');

        const derived = (this.d + c); // not reduced mod n, matching original
        if (derived === 0n) throw new Error('Child offset derived to an invalid key, try again');

        return new PrivateKey(derived);
    }

    static fromHex(hex) {
        return PrivateKey.fromBuffer(new Buffer.from(hex, 'hex'));
    }

    toHex() {
        return this.toBuffer().toString('hex');
    }

    toPublicKey() {
        return this.toPublic();
    }
}

export default PrivateKey;

const toPublic = data => data == null ? data :
    data.Q ? data : PublicKey.fromStringOrThrow(data);
