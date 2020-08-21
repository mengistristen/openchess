const redis = require('redis')
const { promisify } = require('util')
const client = redis.createClient()

client.on('error', (err) => console.log(err))

module.exports.hset = promisify(client.hset).bind(client)
module.exports.hget = promisify(client.hget).bind(client)
module.exports.exists = promisify(client.exists).bind(client)
module.exports.expire = promisify(client.expire).bind(client)
