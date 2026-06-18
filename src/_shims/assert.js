// Tiny isomorphic `assert` replacement (build-time alias). Covers the subset used by the
// crypto/serializer code: the callable form plus equal/strictEqual/deepEqual/notEqual.
function assert(value, message) {
  if (!value) throw new Error(message || 'AssertionError');
  return value;
}

function eq(a, b) {
  if (a === b) return true;
  if (a && b && typeof a === 'object' && typeof b === 'object') {
    const al = a.length, bl = b.length;
    if (typeof al === 'number' && typeof bl === 'number') {
      if (al !== bl) return false;
      for (let i = 0; i < al; i++) if (a[i] !== b[i]) return false;
      return true;
    }
    const ak = Object.keys(a), bk = Object.keys(b);
    if (ak.length !== bk.length) return false;
    for (const k of ak) if (!eq(a[k], b[k])) return false;
    return true;
  }
  return false;
}

assert.equal = function (actual, expected, message) {
  // eslint-disable-next-line eqeqeq
  if (actual != expected) throw new Error(message || `${actual} != ${expected}`);
};
assert.strictEqual = function (actual, expected, message) {
  if (actual !== expected) throw new Error(message || `${actual} !== ${expected}`);
};
assert.notEqual = function (actual, expected, message) {
  // eslint-disable-next-line eqeqeq
  if (actual == expected) throw new Error(message || `${actual} == ${expected}`);
};
assert.deepEqual = function (actual, expected, message) {
  if (!eq(actual, expected)) throw new Error(message || 'deepEqual failed');
};
assert.deepStrictEqual = assert.deepEqual;

module.exports = assert;
module.exports.default = assert;
