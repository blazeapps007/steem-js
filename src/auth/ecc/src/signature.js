import assert from 'assert';
import hash from './hash.js';
import PublicKey from './key_public.js';
import PrivateKey from './key_private.js';
import {
    secp, G, n, NobleSignature,
    bytesToBig, bigToBytes, derIntLen, mod, invert,
} from './curve.js';

// RFC6979 deterministic k with the graphene nonce trick: when nonce>0 the message
// hash is replaced by sha256(hash || zeros(nonce)) before the DRBG. Reproduced verbatim
// (HMAC-SHA256 via @noble) so signatures are byte-identical to the bigi/ecurve version.
function deterministicGenerateK(hashBuf, d, checkSig, nonce) {
    if (nonce) {
        hashBuf = hash.sha256(Buffer.concat([hashBuf, Buffer.alloc(nonce)]));
    }
    assert.equal(hashBuf.length, 32, 'Hash must be 256 bit');

    const x = bigToBytes(d, 32);
    let k = Buffer.alloc(32, 0);
    let v = Buffer.alloc(32, 1);

    k = hash.HmacSHA256(Buffer.concat([v, new Buffer.from([0]), x, hashBuf]), k);
    v = hash.HmacSHA256(v, k);
    k = hash.HmacSHA256(Buffer.concat([v, new Buffer.from([1]), x, hashBuf]), k);
    v = hash.HmacSHA256(v, k);
    v = hash.HmacSHA256(v, k);

    let T = bytesToBig(v);
    while (T <= 0n || T >= n || !checkSig(T)) {
        k = hash.HmacSHA256(Buffer.concat([v, new Buffer.from([0])]), k);
        v = hash.HmacSHA256(v, k);
        v = hash.HmacSHA256(v, k);
        T = bytesToBig(v);
    }
    return T;
}

// One ECDSA signature with deterministic k (+ low-S), for a given retry `nonce`.
function ecdsaSign(hashBuf, d, nonce) {
    const e = bytesToBig(hashBuf);
    let r, s;
    deterministicGenerateK(hashBuf, d, (k) => {
        const Q = G.multiply(k);
        if (Q.is0()) return false;
        r = mod(Q.toAffine().x, n);
        if (r === 0n) return false;
        s = mod(invert(k, n) * (e + d * r), n);
        if (s === 0n) return false;
        return true;
    }, nonce);

    if (s > (n >> 1n)) s = n - s; // low-S (bip62)
    return { r, s };
}

function calcRecovery(r, s, hashBuf, pubCompressed) {
    const msg = Uint8Array.from(hashBuf);
    for (let j = 0; j < 4; j++) {
        try {
            const Q = new NobleSignature(r, s).addRecoveryBit(j).recoverPublicKey(msg);
            if (Buffer.compare(Buffer.from(Q.toBytes(true)), pubCompressed) === 0) return j;
        } catch (e) { /* try next */ }
    }
    throw new Error('Unable to find valid recovery factor');
}

class Signature {

    constructor(r1, s1, i1) {
        this.r = r1;
        this.s = s1;
        this.i = i1;
        assert.equal(this.r != null, true, 'Missing parameter');
        assert.equal(this.s != null, true, 'Missing parameter');
        assert.equal(this.i != null, true, 'Missing parameter');
    }

    static fromBuffer(buf) {
        assert.equal(buf.length, 65, 'Invalid signature length');
        const i = buf.readUInt8(0);
        assert.equal(i - 27, (i - 27) & 7, 'Invalid signature parameter');
        const r = bytesToBig(buf.slice(1, 33));
        const s = bytesToBig(buf.slice(33));
        return new Signature(r, s, i);
    }

    toBuffer() {
        const buf = new Buffer.alloc(65);
        buf.writeUInt8(this.i, 0);
        bigToBytes(this.r, 32).copy(buf, 1);
        bigToBytes(this.s, 32).copy(buf, 33);
        return buf;
    }

    recoverPublicKeyFromBuffer(buffer) {
        return this.recoverPublicKey(hash.sha256(buffer));
    }

    /** @return {PublicKey} */
    recoverPublicKey(sha256_buffer) {
        const recovery = (this.i - 27) & 3;
        const Q = new NobleSignature(this.r, this.s)
            .addRecoveryBit(recovery)
            .recoverPublicKey(Uint8Array.from(sha256_buffer));
        return PublicKey.fromPoint(Q);
    }

    /** @param {Buffer} buf @param {PrivateKey} private_key @return {Signature} */
    static signBuffer(buf, private_key) {
        return Signature.signBufferSha256(hash.sha256(buf), private_key);
    }

    /** Sign a 32-byte sha256 digest. @return {Signature} */
    static signBufferSha256(buf_sha256, private_key) {
        if (buf_sha256.length !== 32 || !Buffer.isBuffer(buf_sha256))
            throw new Error('buf_sha256: 32 byte buffer required');
        private_key = toPrivateObj(private_key);
        assert(private_key, 'private_key required');

        const d = private_key.d;
        const pubCompressed = private_key.toPublicKey().toBuffer(true);

        let nonce = 0;
        while (true) {
            const { r, s } = ecdsaSign(buf_sha256, d, nonce++);
            if (derIntLen(r) === 32 && derIntLen(s) === 32) {
                let i = calcRecovery(r, s, buf_sha256, pubCompressed);
                i += 4;  // compressed
                i += 27; // compact
                return new Signature(r, s, i);
            }
            if (nonce % 10 === 0) {
                console.log('WARN: ' + nonce + ' attempts to find canonical signature');
            }
        }
    }

    static sign(string, private_key) {
        return Signature.signBuffer(new Buffer.from(string), private_key);
    }

    verifyBuffer(buf, public_key) {
        return this.verifyHash(hash.sha256(buf), public_key);
    }

    verifyHash(hashBuf, public_key) {
        assert.equal(hashBuf.length, 32, 'A SHA 256 should be 32 bytes long, instead got ' + hashBuf.length);
        return secp.verify(
            new NobleSignature(this.r, this.s),
            Uint8Array.from(hashBuf),
            Uint8Array.from(public_key.toBuffer(true)),
            { prehash: false }
        );
    }

    static fromHex(hex) {
        return Signature.fromBuffer(new Buffer.from(hex, 'hex'));
    }

    toHex() {
        return this.toBuffer().toString('hex');
    }

    static signHex(hex, private_key) {
        return Signature.signBuffer(new Buffer.from(hex, 'hex'), private_key);
    }

    verifyHex(hex, public_key) {
        return this.verifyBuffer(new Buffer.from(hex, 'hex'), public_key);
    }
}

const toPrivateObj = o => (o ? (o.d != null ? o : PrivateKey.fromWif(o)) : o);

export default Signature;
