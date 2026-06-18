// Injected by tsup so bundles provide `Buffer` on runtimes that lack it (browser, edge, Deno).
// On Node the global Buffer would suffice, but injecting the pure-JS polyfill keeps the
// output truly isomorphic.
import { Buffer } from 'buffer';
export { Buffer };
