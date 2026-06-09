import api from './api/index.js';
import auth from './auth/index.js';
import memo from './auth/memo.js';
import broadcast from './broadcast/index.js';
import config from './config.js';
import formatterFactory from './formatter.js';
import * as utils from './utils.js';

const steem = {
  api,
  auth,
  memo,
  broadcast,
  config,
  formatter: formatterFactory(api),
  utils,
};

const g = typeof globalThis !== 'undefined' ? globalThis : undefined;
if (g) {
  g.steem = steem;
}

export default steem;
