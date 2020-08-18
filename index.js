const express = require('express')
const Board = require('./Board')
const app = express()

const coordinate = /[A-H][1-8]/

//Serve the documentation site statically
app.use(express.static('public'))

/*
    Method: GET
    Route: /new
    Purpose: This route is used to create a new game.
*/
app.get('/new', async (req, res) => {
    try {
        let options = {
            game: req.query.game || 'chess',
            boardSize: parseInt(req.query.bsize) || 400,
            boardDarkColor: req.query.bdark || 'rgb(222,222,222)', //hex or rgb, encode hex in request with %23
            boardLightColor: req.query.blight || 'rgb(36,36,36)',
            pieceStyle: req.query.pstyle || 'style1',
            pieceMargin: parseInt(req.query.pmargin) || 5,
            coordinates: {
                show: req.query.cshow == 'true' || false,
                color: req.query.ccolor || 'rgb(106,132,167)',
                fontFamily: req.query.cfont || 'Georgia', //https://websitesetup.org/web-safe-fonts-html-css/
                fontSize: parseInt(req.query.csize) || 13,
                fontStyle: req.query.cstyle || 'italic', //https://www.w3schools.com/cssref/pr_font_font-style.asp
                fontWeight: req.query.cweight || 'normal', //https://www.w3schools.com/cssref/pr_font_weight.asp
                margin: parseInt(req.query.cmargin) || 5,
            },
        }

        if (!(options.game !== 'chess' || options.game !== 'none'))
            throw { message: `Invalid game type: ${options.game}` }

        let board = new Board(options)

        await board.save()

        res.status(201).send({
            id: board.id,
            options,
        })
    } catch (err) {
        res.send({
            message: err.message,
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
    } catch (err) {
        res.send({
            message: err.message,
        })
    }
})

/*
    Method: GET
    Route: /game/:id/:from-:to
    Purpose: This route is used to move a piece
        on a board specified by an id.
*/
app.get('/game/:id/:from-:to', async (req, res) => {
    try {
        const { from, to, id } = req.params

        if (!coordinate.test(from))
            throw {
                message: `Invalid from coordinate: ${from}, expected to match [A-H][1-8]`,
            }

        if (!coordinate.test(to))
            throw {
                message: `Invalid to coordinate: ${to}, expected to match [A-H][1-8]`,
            }

        const board = await Board.getBoardById(id)

        board.movePiece(
            from.charCodeAt(0) - 'A'.charCodeAt(),
            7 - (Number.parseInt(from[1]) - 1),
            to.charCodeAt(0) - 'A'.charCodeAt(),
            7 - (Number.parseInt(to[1]) - 1)
        )

        await board.save()

        res.send(board.render())
    } catch (err) {
        res.send({
            message: err.message,
        })
    }
})

/*
    Method: GET
    Route: /game/:id/reset
    Purpose: This route is used to reset a game to its
        original state.
*/
app.get('/game/:id/reset', async (req, res) => {
    try {
        const board = await Board.resetBoard(req.params.id)

        res.send(board.render())
    } catch (err) {
        res.send({
            message: err.message,
        })
    }
})

/* 
    Method: GET
    Route: /game/:id/set/:tile-:color-:piece
    Purpose: This route is used to set a new piece onto
        a specific tile on the board.
*/
app.get('/game/:id/set/:tile-:color-:piece', async (req, res) => {
    try {
        const { id, tile, color, piece } = req.params

        if (!coordinate.test(tile))
            throw {
                message: `Invalid coordinate: ${tile}, expected to match [A-H][1-8]`,
            }

        const board = await Board.getBoardById(id)

        board.setPiece(
            tile.charCodeAt(0) - 'A'.charCodeAt(),
            7 - (Number.parseInt(tile[1]) - 1),
            color,
            piece
        )
        await board.save()

        res.send(board.render())
    } catch (err) {
        res.send({
            message: err.message,
        })
    }
})

//get /logo returns logo png
//get /rules/chess

const PORT = 8000
app.listen(PORT, () =>
    console.log(`Server listening at http://localhost:${PORT}`)
)
