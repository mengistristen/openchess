const router = require('express').Router()
const Board = require('../src/Board')
const Coordinate = require('../src/Coordinate')

/*
    Method: GET
    Route: /new
    Purpose: This route is used to create a new game.
*/
router.get('/new', async (req, res) => {
    try {
        let options = {
            game: req.query.game || 'chess',
            boardSize: parseInt(req.query.bsize) || 400,
            boardDarkColor: req.query.bdark || 'rgb(222,222,222)', //hex or rgb, encode hex in request with %23
            boardLightColor: req.query.blight || 'rgb(36,36,36)',
            pieceStyle: req.query.pstyle || 'style1',
            pieceMargin: parseInt(req.query.pmargin) || 5,
            strict: req.query.strict || 'false',
            animation: req.query.animation || 'false',
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

        if (
            options.game !== 'chess' &&
            options.game !== 'checkers' &&
            options.game !== 'none'
        )
            throw new Error(`Invalid game type: ${options.game}`)

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
router.get('/game/:id', async (req, res) => {
    try {
        const board = await Board.getBoardById(req.params.id)

        res.type('image/svg+xml')
            .status(200)
            .send(await board.render())
    } catch (err) {
        res.type('json').status(404).send({
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
router.get('/game/:id/:from-:to', async (req, res) => {
    try {
        const { from, to, id } = req.params

        if (!Coordinate.test(from))
            throw new Error(
                `Invalid from coordinate: ${from}, expected to match [A-H][1-8]`
            )

        if (!Coordinate.test(to))
            throw new Error(
                `Invalid to coordinate: ${to}, expected to match [A-H][1-8]`
            )

        const board = await Board.getBoardById(id)
        const [x1, y1] = Coordinate.parseCoordinate(from)
        const [x2, y2] = Coordinate.parseCoordinate(to)

        const animation = board.movePiece(x1, y1, x2, y2)
        await board.save()

        res.type('image/svg+xml').status(200)

        if (board.options.animation !== 'false')
            res.send(await board.render(animation))
        else res.send(await board.render())
    } catch (err) {
        res.type('json').status(400).send({
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
router.get('/game/:id/reset', async (req, res) => {
    try {
        const board = await Board.resetBoard(req.params.id)

        res.type('image/svg+xml')
            .status(200)
            .send(await board.render())
    } catch (err) {
        res.type('json').status(404).send({
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
router.get('/game/:id/set/:tile-:color-:piece', async (req, res) => {
    try {
        const { id, tile, color, piece } = req.params

        if (!Coordinate.test(tile))
            throw new Error(
                `Invalid coordinate: ${tile}, expected to match [A-H][1-8]`
            )

        const board = await Board.getBoardById(id)
        const [x, y] = Coordinate.parseCoordinate(tile)

        board.setPiece(x, y, color, piece)
        await board.save()

        res.type('image/svg+xml')
            .status(200)
            .send(await board.render())
    } catch (err) {
        res.type('json').status(404).send({
            message: err.message,
        })
    }
})

/*
    Method: GET
    Route: /game/:id/remove/:tile
    Purpose: This route is used to remove a piece at the 
        given spot on the board
*/
router.get('/game/:id/remove/:tile', async (req, res) => {
    try {
        const { id, tile } = req.params

        if (!Coordinate.test(tile))
            throw new Error(
                `Invalid coordinate: ${tile}, expected to match [A-H][1-8]`
            )

        const board = await Board.getBoardById(id)
        const [x, y] = Coordinate.parseCoordinate(tile)

        board.removePiece(x, y)
        await board.save()

        res.type('image/svg+xml')
            .status(200)
            .send(await board.render())
    } catch (err) {
        res.type('json').status(404).send({
            message: err.message,
        })
    }
})

module.exports = router
