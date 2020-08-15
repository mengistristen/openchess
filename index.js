const express = require('express')
const Board = require('./Board')

const app = express()

//Serve the documentation site statically
app.use(express.static('public'))

/*
    Method: GET
    Route: /new
    Purpose: This route is used to create a new game.
*/
app.get('/new', async (req, res) => {
    let board = new Board(Number.parseInt(req.query.size) || 400)

    await board.save()

    res.status(201).send({
        id: board.id,
        size: board.boardSize
    })
})

/*
    Method: GET
    Route: /game/:id
    Purpose: This method is used to get an SVG image
        for a game specified by an id.
*/
app.get('/game/:id', (req, res) => {
    let board = new Board(400)
    
    res.send(board.render())
})

/*
    Method: GET
    Route: /game/:id/:from-:to
    Purpose: This route is used to move a piece
        on a board specified by an id.
*/
app.get('/game/:id/:from-:to', (req, res) => {
    try {
        const { from, to } = req.params
        let coordinate = /[A-H][1-8]/
        //res.setHeader('Content-Type', 'image/svg+xml')
        
        if(!coordinate.test(from) || !coordinate.test(to))
            res.send('no') 
        else
            res.send({from, to})
    }
    catch (err) {
        res.send({

        })
    }
})

app.listen(8000, () => console.log('Server listening at http://localhost:8000'))