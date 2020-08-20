const app = require('./app')
const { networkInterfaces } = require('os')

const PORT = 8000
app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
    console.log(`Or at http://${require('ip').address()}:${PORT}`)
})
