# SheKnows Universal Swagger JS Client

## Description ##
[SheKnows Universal Swagger](https://github.com/sheknows/swagger-js-client) JS Client.

## Installation

``` bash
# install dependencies
$ npm install

# build for production
$ npm run build

# run tests
npm test

```

## Usage
```js
import getClient from 'swagger-js-client'

getClient({
  host: 'HOST', // (or swaggerUrl)
  key: 'KEY',
  secret: 'SECRET'
})
  .then(client => client.apis['TAG_NAME']['METHOD_NAME'](params))
  .then(data => {
    console.log(data.body)
  })
  .catch(err => {
    console.error('Oops:', err)
  })
```
For more examples, please refer to the test directory.

## Update client
Because this client is generated on-the-fly by dynamically consuming `swagger.json`, no client update (often referred to as "regeneration") is needed.

If you would like to update the client's code however:
- `npm run build`
- bump the version
  - `npm version $version` where `$version` is `<newversion>`, `major`, `minor` or `patch` (for more info see [NPM docs](https://docs.npmjs.com/cli/version))

After the code is merged to master, run `npm publish`.

:warning: Make sure all [Tests](#Tests) are passing after updates.
