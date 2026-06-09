import newDebug from 'debug';
import { promisifyAll, nodeify } from '../_promise.js';

import broadcastHelpers from './helpers.js';
import formatterFactory from '../formatter.js';
import operations from './operations.js';
import steemApi from '../api/index.js';
import steemAuth from '../auth/index.js';
import { camelCase } from '../utils.js';

const debug = newDebug('steem:broadcast');
const noop = function() {}
const formatter = formatterFactory(steemApi);

const steemBroadcast = {};

// Base transaction logic -----------------------------------------------------

/**
 * Sign and broadcast transactions on the steem network
 * @param {Object} tx - Transaction object
 * @param {Object|String} privKeys - Private keys or key string
 * @param {Function} [callback] - Optional callback function
 * @return {Promise} - Returns a promise if no callback is provided
 */
steemBroadcast.send = function steemBroadcast$send(tx, privKeys, callback) {
  const resultP = steemBroadcast._prepareTransaction(tx)
    .then((transaction) => {
      debug(
        'Signing transaction (transaction, transaction.operations)',
        transaction, transaction.operations
      );
      return Promise.all([
        transaction,
        steemAuth.signTransaction(transaction, privKeys)
      ]);
    })
    .then(([transaction, signedTransaction]) => {
      debug(
        'Broadcasting transaction (transaction, transaction.operations)',
        transaction, transaction.operations
      );
      return steemApi.broadcastTransactionSynchronousAsync(
        signedTransaction
      ).then((result) => {
        return Object.assign({}, result, signedTransaction);
      });
    });

  return nodeify(resultP, callback);
};

steemBroadcast._prepareTransaction = function steemBroadcast$_prepareTransaction(tx) {
  const propertiesP = steemApi.getDynamicGlobalPropertiesAsync();
  return propertiesP
    .then((properties) => {
      // Set defaults on the transaction
      const chainDate = new Date(properties.time + 'Z');
      const refBlockNum = (properties.last_irreversible_block_num - 1) & 0xFFFF;
      return steemApi.getBlockHeaderAsync(properties.last_irreversible_block_num).then((block) => {
        const headBlockId = block ? block.previous : '0000000000000000000000000000000000000000';
        return Object.assign({
          ref_block_num: refBlockNum,
          ref_block_prefix: new Buffer.from(headBlockId, 'hex').readUInt32LE(4),
          expiration: new Date(
            chainDate.getTime() +
            600 * 1000
          ),
        }, tx);
      });
    });
};

// Generated wrapper ----------------------------------------------------------

// Generate operations from operations.json
operations.forEach((operation) => {
  const operationName = camelCase(operation.operation);
  const operationParams = operation.params || [];

  const useCommentPermlink =
    operationParams.indexOf('parent_author') !== -1 &&
    operationParams.indexOf('parent_permlink') !== -1;

  steemBroadcast[`${operationName}With`] =
    function steemBroadcast$specializedSendWith(wif, options, callback) {
      debug(`Sending operation "${operationName}" with`, {options, callback});
      const keys = {};
      if (operation.roles && operation.roles.length) {
        keys[operation.roles[0]] = wif; // TODO - Automatically pick a role? Send all?
      }
      return steemBroadcast.send({
        extensions: [],
        operations: [[operation.operation, Object.assign(
          {},
          options,
          options.json_metadata != null ? {
            json_metadata: toString(options.json_metadata),
          } : {},
          useCommentPermlink && options.permlink == null ? {
            permlink: formatter.commentPermlink(options.parent_author, options.parent_permlink),
          } : {}
        )]],
      }, keys, callback);
    };

  steemBroadcast[operationName] =
    function steemBroadcast$specializedSend(wif, ...args) {
      debug(`Parsing operation "${operationName}" with`, {args});
      const options = operationParams.reduce((memo, param, i) => {
        memo[param] = args[i]; // eslint-disable-line no-param-reassign
        return memo;
      }, {});
      // Check if the last argument is a function (callback)
      let callback = null;
      if (args.length > operationParams.length && typeof args[operationParams.length] === 'function') {
        callback = args[operationParams.length];
      }
      return steemBroadcast[`${operationName}With`](wif, options, callback);
    };
});

const toString = obj => typeof obj === 'object' ? JSON.stringify(obj) : obj;
broadcastHelpers(steemBroadcast);

// For backwards compatibility, maintain the Async versions
promisifyAll(steemBroadcast);

export default steemBroadcast;
