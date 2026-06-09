// Pure CommonJS so both `require('../config')` (from the crypto modules) and
// `import config from '../config.js'` (default interop) resolve to the same instance.
const defaultConfig = require('../config.json');

class Config {
  constructor(c) {
    Object.keys(c).forEach((key) => {
      this[key] = c[key];
    });
  }

  get(k) {
    return this[k];
  }

  set(k, v) {
    this[k] = v;
  }
}

if (typeof defaultConfig.Config !== 'undefined') {
  throw new Error("default config.json file may not contain a property 'Config'");
}

const config = new Config(defaultConfig);
config.Config = Config;

module.exports = config;
