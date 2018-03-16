'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _momentTimezone = require('moment-timezone');

var _momentTimezone2 = _interopRequireDefault(_momentTimezone);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * HMAC Authorization
 */
class HmacAuth {
  constructor(key, secret) {
    this.key = key;
    this.secret = secret;
  }

  generateHeaders(d) {
    const date = d || (0, _momentTimezone2.default)().tz('America/New_York').format('ddd, DD MMM YYYY HH:mm:ss z');
    const dateText = `date: ${date}`;
    const signature = encodeURIComponent(_crypto2.default.createHmac('sha1', this.secret).update(dateText).digest('base64'));
    const signatureText = `Signature keyId="${this.key}",algorithm="hmac-sha1",signature="${signature}"`;

    return {
      Authorization: signatureText,
      Date: date
    };
  }

  checkHeaders(headers) {
    if (!headers.authorization && !headers.date) {
      throw new Error('Required authorization headers are missing');
    }

    const generated = this.generateHeaders(headers.date);

    if (generated.Authorization !== headers.authorization || generated.Date !== headers.date) {
      throw new Error('Нeaders authorization invalid');
    }

    return true;
  }
}

exports.default = (key, secret) => new HmacAuth(key, secret);