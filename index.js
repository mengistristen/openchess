const express = require('express')
const bodyParser = require('body-parser')
const Board = require('./Board')

const app = express()

const getBoard = (size) => {
    let markup = ''
    let tileWidth = size / 8
    let rowColor = false

    for(i = 0;i < 8; ++i) {
        rowColor = !rowColor
        let tileColor = rowColor

        for(j = 0; j < 8; ++j) {
            tileColor = !tileColor
            
            if(tileColor)
                markup += `<rect x='${tileWidth * i}' y='${tileWidth * j}' width='${tileWidth}' height='${tileWidth}' />`
        }
    }
        

    return markup
}

app.use(express.static('public'))

app.get('/new', (req, res) => {
    new Board(400)
    res.send({
        id: '1234'
    })
})

app.get('/:id', (req, res) => {
    res.send(`
    <svg xmlns='https://www.w3.org/2000/svg' width='400' height='400'>
        ${getBoard(400)}
    </svg>
    `)
})

app.get('/:from-:to', (req, res) => {
    const { from, to } = req.params
    //res.setHeader('Content-Type', 'image/svg+xml')
    
})

app.listen(8000, () => console.log('Server listening at http://localhost:8000'))