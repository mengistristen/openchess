const express = require('express')
const api = require('./api/server')

const app = express()

app.use(express.static('public'))
app.use('/api', api)

module.exports = app
