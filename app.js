const express = require('express')
const api = require('./api/games')
const helmet = require('helmet')
const compression = require('compression')
const rateLimit = require('express-rate-limit')

const app = express()

if (process.env.NODE_ENV === 'production') {
  app.use(helmet())
  app.use(compression())
  app.use(
    rateLimit({
      windowMs: 60 * 1000,
      max: 20
    })
  )
}

app.use(express.static('public'))
app.use('/api', api)

module.exports = app
