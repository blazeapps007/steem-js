// Mocha-compatibility shims for legacy tests running under Vitest.
// `before`/`after` map to Vitest's `beforeAll`/`afterAll`.
import { beforeAll, afterAll } from 'vitest';

globalThis.before = globalThis.before || beforeAll;
globalThis.after = globalThis.after || afterAll;
