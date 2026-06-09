import Address from './src/address.js';
import Aes from './src/aes.js';
import PrivateKey from './src/key_private.js';
import PublicKey from './src/key_public.js';
import Signature from './src/signature.js';
import * as brainKey from './src/brain_key.js';
import key_utils from './src/key_utils.js';
import hash from './src/hash.js';
import ecc_config from '../../config.js';

export { Address, Aes, PrivateKey, PublicKey, Signature, brainKey, key_utils, hash, ecc_config };

export default {
  Address,
  Aes,
  PrivateKey,
  PublicKey,
  Signature,
  brainKey,
  key_utils,
  hash,
  ecc_config,
};
