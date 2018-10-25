import expect from 'expect.js'
import moment from 'moment-timezone'
import config from './config.json'
import getClient from '../../src'

const instance = () =>
  getClient({
    host: config.api.host,
    key: config.api.key,
    secret: config.api.secret,
    retryCount: config.params.retryCount
  })
    .then(client => {
      return client.apis['Content Management']
    })

describe('ContentManagementApi', () => {
  describe('#findContentById', () => {
    it('should find content', done => {
      instance()
        .then(client => client.findContentById({ recordId: 41 }))
        .then(({ body }) => {
          expect(body.id).to.equal(41)
          done()
        })
        .catch(message => {
          done(new Error('Api error was not expected: ' + message))
        })
    })

    it('should return not found', done => {
      instance()
        .then(client => client.findContentById({recordId: -1 }))
        .then(({ body }) => {
          done(new Error('Content should be returned ' + message))
        })
        .catch(error => {
          expect(error.status).to.equal(404)
          done()
        })
    })
  })

  describe('#findContentByJson', () => {
    it('should find slideshow', done => {
      const criteria = {
        contentId: 41,
        brand: 'SheKnows',
        type: 'slideshow',
        disabled: false
      }

      instance()
        .then(client => client.findContentByJson({
          json: JSON.stringify(criteria),
          limit: 1
        }))
        .then(response => {
          const data = response.body
          expect(data).not.to.be(undefined)
          expect(data.length).to.equal(1)
          done()
        }).catch(message => {
          done(new Error('Api error was not expected: ' + message))
        })
    })

    it('should find an article', done => {
      const criteria = {
        brand: 'SheKnows',
        type: 'articles',
        disabled: true
      }

      instance()
        .then(client => client.findContentByJson({
          json: JSON.stringify(criteria),
          limit: 10
        }))
        .then(response => {
          const [first, ...data] = response.body
          expect(first.brand).to.equal(criteria.brand)
          expect(first.type).to.equal(criteria.type)
          expect(data.length).to.equal(9)
          done()
        }).catch(message => {
          done(new Error('Api error was not expected: ' + message))
        })
    })

    it('should filter by publishAfter', done => {
      const criteria = {
        publishAfter: `(${moment().utc().format()}]`
      }
      const options = {}

      instance()
        .then(client => client.findContentByJson({
          json: JSON.stringify(criteria),
          limit: 10
        }))
        .then(response => {
          const data = response.body
          expect(data.length).to.equal(10)
          done()
        }).catch(message => {
          done(new Error('Api error was not expected: ' + message))
        })
    })
  })
})
