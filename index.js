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
        let s = {
            game: req.query.game || "chess",
            boardSize: req.query.bsize || 400,
            pieceStyle: req.query.pstyle || "style1",
            pieceMargin: req.query.pmargin || 5
        }

        if (s.game !== 'chess')
            throw { message: 'Invalid generator' }

        let board = new Board(s)

        await board.save()

        res.status(201).send({
            id: board.id,
            game: s.game,
            boardSize: parseInt(s.boardSize),
            pieceStyle: s.pieceStyle,
            pieceMargin: parseInt(s.pieceMargin),
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

        if (!coordinate.test(from) || !coordinate.test(to))
            throw { message: 'Invalid coordinates' }

        const board = Board.getBoardById(id)

        res.send({ from, to })
    }
    catch (err) {
        res.send({
            message: err.message
        })
    }
})

const PORT = 8000
app.listen(PORT, () => console.log(`Server listening at http://localhost:${PORT}`))