const redis = require('redis')
const url = require('url')
const { promisify } = require('util')
let client

if (process.env.REDISTOGO_URL) {
  const rtg = url.parse(process.env.REDISTOGO_URL)

  client = redis.createClient(rtg.port, rtg.hostname)
  client.auth(rtg.auth.split(':')[1])
} else client = redis.createClient()

client.on('error', (err) => console.log(err))

module.exports.set = promisify(client.set).bind(client)
module.exports.get = promisify(client.get).bind(client)
module.exports.hset = promisify(client.hset).bind(client)
module.exports.hget = promisify(client.hget).bind(client)
module.exports.exists = promisify(client.exists).bind(client)
module.exports.expire = promisify(client.expire).bind(client)
