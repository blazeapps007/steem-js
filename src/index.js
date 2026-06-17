import api from './api/index.js';
import auth from './auth/index.js';
import broadcast from './broadcast/index.js';
import formatterFactory from './formatter.js';
import memo from './auth/memo.js';
import config from './config.js';
import * as utils from './utils.js';

// Note: a build-time banner (see tsup.config.js) ensures globalThis.crypto exists on
// runtimes that lack it (e.g. Node 18) before any module code runs.

const formatter = formatterFactory(api);

const steem = {
  api,
  auth,
  broadcast,
  formatter,
  memo,
  config,
  utils,
};

if (typeof process !== 'undefined' && typeof process.on === 'function') {
  process.on('warning', (warning) => {
    console.log('warning_stack: ', warning.stack);
  });
}

export default steem;
export { api, auth, broadcast, formatter, memo, config, utils };
