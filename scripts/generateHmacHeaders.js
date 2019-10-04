const HmacAuth = require('../build/hmacAuth').default
const program = require('commander')

const authHeaderKey = 'Authorization'
const dateHeaderKey = 'Date'

program
  .option('-k, --key <key>', 'HMAC Key')
  .option('-s, --secret <secret>', 'HMAC Secret')
  .option('-d, --date <date>', 'Date')

program.parse(process.argv)

if (!program.key) console.log(`key is a required argument`)
if (!program.secret) console.log(`secret is a required argument`)

const auth = HmacAuth(program.key, program.secret)
const headers = auth.generateHeaders(program.date)

console.log('---------------')
console.log('    HEADERS')
console.log('---------------')
console.log('')
console.log(`        ${authHeaderKey}:`, headers[authHeaderKey])
console.log(`        ${dateHeaderKey}:`, headers[dateHeaderKey])
console.log('')
console.log('---------------')
