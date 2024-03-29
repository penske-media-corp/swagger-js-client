import Swagger from 'swagger-client'
import hmacAuth from './hmacAuth'
import urljoin from 'url-join'
import { URL } from 'url'

let client = {}
const RETRY_COUNT_DEFAULT = 10
const getClient = ({
  host, key, secret, swaggerUrl, retryCount, ...userOptions
} = {}) =>
  new Promise((resolve, reject) => {
    if (!(host || swaggerUrl) || !key || !secret) {
      return reject(new Error(
        'Required options (`host`, `key`, `secret`) missing! Aborting.'
      ))
    }

    swaggerUrl = swaggerUrl || urljoin(host, 'swagger.json')

    if (client[swaggerUrl]) {
      return resolve(client[swaggerUrl])
    }

    const authHeaders = hmacAuth(key, secret).generateHeaders()

    const options = {
      url: swaggerUrl,
      requestInterceptor: req => {
        req.headers.Authorization = authHeaders.Authorization
        req.headers.Date = authHeaders.Date

        return req
      },
      ...userOptions
    }

    let count = 0

    const retryLimit = parseInt(retryCount || RETRY_COUNT_DEFAULT, 10)

    const getNewClient = () => {
      new Swagger(options)
        .then(generatedClient => {
          const parsedUrl = new URL(generatedClient.url)
          generatedClient.spec.host = parsedUrl.host
          generatedClient.spec.basePath = parsedUrl.pathname.replace(/swagger.json/ig, '')
          client[swaggerUrl] = generatedClient

          resolve(client[swaggerUrl])
        })
        .catch(err => {
          if (count < retryLimit) {
            count++
            getNewClient()
          } else {
            err.message = `Could not create client: ${err.message}`
            reject(new Error(err))
          }
        })
    }

    getNewClient()
  })

export default getClient
