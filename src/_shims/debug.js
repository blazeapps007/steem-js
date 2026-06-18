// Tiny isomorphic `debug` replacement (build-time alias). No-op by default; opt in by
// setting globalThis.DEBUG to a truthy value to log namespaced messages to the console.
function createDebug(namespace) {
  const fn = (...args) => {
    if (typeof globalThis !== 'undefined' && globalThis.DEBUG) {
      // eslint-disable-next-line no-console
      console.log(namespace, ...args);
    }
  };
  fn.enabled = false;
  fn.namespace = namespace;
  fn.extend = (sub) => createDebug(`${namespace}:${sub}`);
  return fn;
}

module.exports = createDebug;
module.exports.default = createDebug;
