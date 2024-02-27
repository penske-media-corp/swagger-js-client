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
      return client.apis['Sites']
    })

describe('Sites', () => {
  describe('#getRecordById', () => {
    it('should find site', done => {
      instance()
        .then(client => client.getRecordById({ recordId: 1 }))
        .then(({ body }) => {
          expect(body.id).to.equal(1)
          done()
        })
        .catch(message => {
          done(new Error('Api error was not expected: ' + message))
        })
    })

    it('should return not found', done => {
      instance()
        .then(client => client.getRecordById({recordId: -1 }))
        .then(({ body }) => {
          done(new Error('Content should be returned ' + message))
        })
        .catch(error => {
          expect(error.status).to.equal(404)
          done()
        })
    })
  })

  describe('#findByJson', () => {
    it('should find site', done => {
      const criteria = {
        id: 1,
        name: 'Little Bit Funky',
        enabled: true
      }

      instance()
        .then(client => client.findByJson({
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
  })
})
