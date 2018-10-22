import Swagger from 'swagger-client'
import hmacAuth from './hmacAuth'
import urljoin from 'url-join'
import { URL } from 'url'

let client
let limit = 10
const getClient = ({
  host, key, secret, swaggerUrl, ...userOptions
} = {}) =>
  new Promise((resolve, reject) => {
    if (client) {
      return resolve(client)
    }

    if (!(host || swaggerUrl) || !key || !secret) {
      return reject(new Error(
        'Required options (`host`, `key`, `secret`) missing! Aborting.'
      ))
    }

    swaggerUrl = swaggerUrl || urljoin(host, 'swagger.json')
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

    const getNewClient = () => {
      new Swagger(options)
        .then(generatedClient => {
          const parsedUrl = new URL(generatedClient.url)
          generatedClient.spec.host = parsedUrl.host
          generatedClient.spec.basePath = parsedUrl.pathname.replace(/swagger.json/ig, '')
          client = generatedClient

          resolve(client)
        })
        .catch(err => {
          if (count < limit) {
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
