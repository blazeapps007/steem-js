// Tiny native-Promise replacements for the bluebird helpers the library used.
// Internal (not part of the public `steem.utils` surface).

/**
 * Wrap a Node-callback-style function `fn(...args, (err, result) => …)` into one that
 * returns a Promise. Preserves `this`, matching bluebird's Promise.promisify.
 */
export function promisify(fn) {
  return function promisified(...args) {
    return new Promise((resolve, reject) => {
      fn.call(this, ...args, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  };
}

/**
 * For every callback-style method on `target` (own props, incl. non-enumerable so class
 * prototypes work), add a Promise-returning `<name>Async` sibling. Mirrors
 * bluebird's Promise.promisifyAll.
 */
export function promisifyAll(target) {
  for (const key of Object.getOwnPropertyNames(target)) {
    if (key === 'constructor') continue;
    let fn;
    try { fn = target[key]; } catch (e) { continue; } // skip throwing getters
    if (typeof fn !== 'function') continue;
    if (key.endsWith('Async')) continue;
    if (typeof target[`${key}Async`] === 'function') continue;
    target[`${key}Async`] = promisify(fn);
  }
  return target;
}

/** Resolve after `ms` milliseconds. */
export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Bridge a Promise to an optional Node callback. If `callback` is provided, forwards the
 * settlement to it and returns undefined; otherwise returns the Promise. Mirrors
 * bluebird's `.nodeify`.
 */
export function nodeify(promise, callback) {
  if (typeof callback === 'function') {
    promise.then((result) => callback(null, result), (err) => callback(err));
    return undefined;
  }
  return promise;
}
