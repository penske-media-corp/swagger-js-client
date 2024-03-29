'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _swaggerClient = require('swagger-client');

var _swaggerClient2 = _interopRequireDefault(_swaggerClient);

var _hmacAuth = require('./hmacAuth');

var _hmacAuth2 = _interopRequireDefault(_hmacAuth);

var _urlJoin = require('url-join');

var _urlJoin2 = _interopRequireDefault(_urlJoin);

var _url = require('url');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

let client = {};
const RETRY_COUNT_DEFAULT = 10;
const getClient = (_ref = {}) => {
  let {
    host, key, secret, swaggerUrl, retryCount } = _ref,
      userOptions = _objectWithoutProperties(_ref, ['host', 'key', 'secret', 'swaggerUrl', 'retryCount']);

  return new Promise((resolve, reject) => {
    if (!(host || swaggerUrl) || !key || !secret) {
      return reject(new Error('Required options (`host`, `key`, `secret`) missing! Aborting.'));
    }

    swaggerUrl = swaggerUrl || (0, _urlJoin2.default)(host, 'swagger.json');

    if (client[swaggerUrl]) {
      return resolve(client[swaggerUrl]);
    }

    const authHeaders = (0, _hmacAuth2.default)(key, secret).generateHeaders();

    const options = _extends({
      url: swaggerUrl,
      requestInterceptor: req => {
        req.headers.Authorization = authHeaders.Authorization;
        req.headers.Date = authHeaders.Date;

        return req;
      }
    }, userOptions);

    let count = 0;

    const retryLimit = parseInt(retryCount || RETRY_COUNT_DEFAULT, 10);

    const getNewClient = () => {
      new _swaggerClient2.default(options).then(generatedClient => {
        const parsedUrl = new _url.URL(generatedClient.url);
        generatedClient.spec.host = parsedUrl.host;
        generatedClient.spec.basePath = parsedUrl.pathname.replace(/swagger.json/ig, '');
        client[swaggerUrl] = generatedClient;

        resolve(client[swaggerUrl]);
      }).catch(err => {
        if (count < retryLimit) {
          count++;
          getNewClient();
        } else {
          err.message = `Could not create client: ${err.message}`;
          reject(new Error(err));
        }
      });
    };

    getNewClient();
  });
};

exports.default = getClient;