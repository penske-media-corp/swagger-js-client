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

let client;
const getClient = (_ref = {}) => {
  let {
    host, key, secret, swaggerUrl } = _ref,
      userOptions = _objectWithoutProperties(_ref, ['host', 'key', 'secret', 'swaggerUrl']);

  return new Promise((resolve, reject) => {
    if (client) {
      return resolve(client);
    }

    if (!(host || swaggerUrl) || !key || !secret) {
      return reject(new Error('Required options (`host`, `key`, `secret`) missing! Aborting.'));
    }

    swaggerUrl = swaggerUrl || (0, _urlJoin2.default)(host, 'swagger.json');
    const authHeaders = (0, _hmacAuth2.default)(key, secret).generateHeaders();

    const options = _extends({
      url: swaggerUrl,
      requestInterceptor: req => {
        req.headers.Authorization = authHeaders.Authorization;
        req.headers.Date = authHeaders.Date;

        return req;
      }
    }, userOptions);

    new _swaggerClient2.default(options).then(generatedClient => {
      const parsedUrl = new _url.URL(generatedClient.url);
      generatedClient.spec.host = parsedUrl.host;
      generatedClient.spec.basePath = parsedUrl.pathname.replace(/swagger.json/ig, '');
      client = generatedClient;

      resolve(client);
    }).catch(err => {
      err.message = `Could not create client: ${err.message}`;
      reject(new Error(err));
    });
  });
};

exports.default = getClient;