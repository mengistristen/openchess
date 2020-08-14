const express = require('express')
const bodyParser = require('body-parser')

const app = express()

const getBoard = (size) => {
    let markup = ''
    let tileWidth = size / 8
    let color = true

    for(i = 0;i < 8; ++i)
        for(j = 0; j < 8; ++j)
            if(!color)
                markup += `<rect x='${tileWidth * i}' y='${tileWidth * j}' width='${tileWidth}' height='${tileWidth}' />`

    return markup
}

app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/:from-:to', (req, res) => {
    const { from, to } = req.params
    //res.setHeader('Content-Type', 'image/svg+xml')
    res.send(`
    <svg xmlns='https://www.w3.org/2000/svg' width='400' height='400'>
        ${getBoard(400)}
    </svg>
    `)
})

app.listen(8000, () => console.log('Server listening at http://localhost:8000'))