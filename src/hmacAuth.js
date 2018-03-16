import crypto from 'crypto'
import moment from 'moment-timezone'

/**
 * HMAC Authorization
 */
class HmacAuth {
  constructor (key, secret) {
    this.key = key
    this.secret = secret
  }

  generateHeaders (d) {
    const date = d || moment().tz('America/New_York').format('ddd, DD MMM YYYY HH:mm:ss z')
    const dateText = `date: ${date}`
    const signature = encodeURIComponent(crypto.createHmac('sha1', this.secret).update(dateText).digest('base64'))
    const signatureText = `Signature keyId="${this.key}",algorithm="hmac-sha1",signature="${signature}"`

    return {
      Authorization: signatureText,
      Date: date
    }
  }

  checkHeaders (headers) {
    if (!headers.authorization && !headers.date) {
      throw new Error('Required authorization headers are missing')
    }

    const generated = this.generateHeaders(headers.date)

    if (generated.Authorization !== headers.authorization || generated.Date !== headers.date) {
      throw new Error('Нeaders authorization invalid')
    }

    return true
  }
}

export default (key, secret) => new HmacAuth(key, secret)
