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
    try {
        const { size } = req.query
        const generator = req.query.generator || 'chess'

        if (generator !== 'chess')
            throw { message: 'Invalid generator' }

        let board = new Board(Number.parseInt(size) || 400, generator)

        await board.save()

        res.status(201).send({
            id: board.id,
            size: board.boardSize
        })
    }
    catch (err) {
        res.send({
            message: err.message
        })
    }
})

/*
    Method: GET
    Route: /game/:id
    Purpose: This method is used to get an SVG image
        for a game specified by an id.
*/
app.get('/game/:id', async (req, res) => {
    try {
        const board = await Board.getBoardById(req.params.id)
    
        res.send(board.render())
    }
    catch (err) {
        res.send({
            message: err.message
        })
    }
})

/*
    Method: GET
    Route: /game/:id/:from-:to
    Purpose: This route is used to move a piece
        on a board specified by an id.
*/
app.get('/game/:id/:from-:to', (req, res) => {
    try {
        const { from, to, id } = req.params
        let coordinate = /[A-H][1-8]/
        
        if(!coordinate.test(from) || !coordinate.test(to))
            throw { message: 'Invalid coordinates' }
        
        const board = Board.getBoardById(id)

        res.send({from, to})
    }
    catch (err) {
        res.send({
            message: err.message
        })
    }
})

app.listen(8000, () => console.log('Server listening at http://localhost:8000'))