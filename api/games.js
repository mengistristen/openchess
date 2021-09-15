const router = require('express').Router()
const { validate } = require('uuid')
const { Board } = require('../src/board')
const { GameError, ErrorTypes } = require('../error_handling')
const Coordinate = require('../src/coordinate')

/*
    Method: GET
    Route: /new
    Purpose: This route is used to create a new game.
*/
router.get('/new', async (req, res, next) => {
  try {
    const options = {
      game: req.query.game || 'chess',
      boardSize: parseInt(req.query.bsize) || 400,
      boardDarkColor: req.query.bdark || 'rgb(222,222,222)', // hex or rgb, encode hex in request with %23
      boardLightColor: req.query.blight || 'rgb(36,36,36)',
      pieceStyle: req.query.pstyle || 'style1',
      pieceMargin: parseInt(req.query.pmargin) || 5,
      strict: req.query.strict || 'false',
      animation: req.query.animation || 'false',
      fen: req.query.fen || '',
      coordinates: {
        show: req.query.cshow === 'true' || false,
        color: req.query.ccolor || 'rgb(106,132,167)',
        fontFamily: req.query.cfont || 'Georgia', //  https://websitesetup.org/web-safe-fonts-html-css/
        fontSize: parseInt(req.query.csize) || 13,
        fontStyle: req.query.cstyle || 'italic', // https://www.w3schools.com/cssref/pr_font_font-style.asp
        fontWeight: req.query.cweight || 'normal', // https://www.w3schools.com/cssref/pr_font_weight.asp
        margin: parseInt(req.query.cmargin) || 5
      }
    }

    if (
      options.game !== 'chess' &&
      options.game !== 'checkers' &&
      options.game !== 'none'
    ) {
      throw new GameError(
        `Invalid game type: ${options.game}`,
        ErrorTypes.RESOURCE
      )
    }

    const board = new Board(options)

    await board.save()

    res.status(201).json({
      id: board.id,
      options
    })
  } catch (error) {
    next(error)
  }
})

/*
    Method: GET
    Route: /game/:id
    Purpose: This method is used to get an SVG image
        for a game specified by an id.
*/
router.get('/game/:id', async (req, res, next) => {
  try {
    if (!validate(req.params.id)) {
      throw new GameError(
        `Invalid game id: ${req.params.id}`,
        ErrorTypes.RESOURCE
      )
    }

    const board = await Board.getBoardById(req.params.id)

    res
      .type('image/svg+xml')
      .status(200)
      .send(await board.render())
  } catch (error) {
    next(error)
  }
})

/*
    Method: GET
    Route: /game/:id/:from-:to
    Purpose: This route is used to move a piece
        on a board specified by an id.
*/
router.get('/game/:id/move/:from-:to', async (req, res, next) => {
  try {
    const { from, to, id } = req.params

    if (!validate(id)) throw new Error(`Invalid game id: ${id}`)

    if (!Coordinate.test(from)) {
      throw new GameError(
        `Invalid from coordinate: ${from}, expected to match [A-H][1-8]`,
        ErrorTypes.RESOURCE
      )
    }

    if (!Coordinate.test(to)) {
      throw new GameError(
        `Invalid to coordinate: ${to}, expected to match [A-H][1-8]`,
        ErrorTypes.RESOURCE
      )
    }

    if (from === to) {
      throw new GameError(
        `Piece at ${from} cannot move onto itself`,
        ErrorTypes.RESOURCE
      )
    }

    const board = await Board.getBoardById(id)
    const [x1, y1] = Coordinate.parseCoordinate(from)
    const [x2, y2] = Coordinate.parseCoordinate(to)

    const animation = board.movePiece(x1, y1, x2, y2)
    await board.save()

    res.type('image/svg+xml').status(200)

    if (board.options.animation !== 'false') {
      res.send(await board.render(animation))
    } else res.send(await board.render())
  } catch (error) {
    next(error)
  }
})

/*
    Method: GET
    Route: /game/:id/reset
    Purpose: This route is used to reset a game to its
        original state.
*/
router.get('/game/:id/reset', async (req, res, next) => {
  try {
    if (!validate(req.params.id)) {
      throw new GameError(
        `Invalid game id: ${req.params.id}`,
        ErrorTypes.RESOURCE
      )
    }

    const board = await Board.resetBoard(req.params.id)

    res
      .type('image/svg+xml')
      .status(200)
      .send(await board.render())
  } catch (error) {
    next(error)
  }
})

/*
    Method: GET
    Route: /game/:id/options
    Purpose: This route is used to view the options of
        a game
*/
router.get('/game/:id/options', async (req, res, next) => {
  try {
    if (!validate(req.params.id)) {
      throw new GameError(
        `Invalid game id: ${req.params.id}`,
        ErrorTypes.RESOURCE
      )
    }

    const board = await Board.getBoardById(req.params.id)

    res.status(200).json({ options: board.options })
  } catch (error) {
    next(error)
  }
})

/*
    Method: GET
    Route: /game/:id/set/:tile-:color-:piece
    Purpose: This route is used to set a new piece onto
        a specific tile on the board.
*/
router.get('/game/:id/set/:tile-:color-:piece', async (req, res, next) => {
  try {
    const { id, tile, color, piece } = req.params

    if (!validate(id)) {
      throw new GameError(`Invalid game id: ${id}`, ErrorTypes.RESOURCE)
    }

    if (!Coordinate.test(tile)) {
      throw new Error(
        `Invalid coordinate: ${tile}, expected to match [A-H][1-8]`,
        ErrorTypes.RESOURCE
      )
    }

    const board = await Board.getBoardById(id)
    const [x, y] = Coordinate.parseCoordinate(tile)

    board.setPiece(x, y, color, piece)
    await board.save()

    res
      .type('image/svg+xml')
      .status(200)
      .send(await board.render())
  } catch (error) {
    next(error)
  }
})

/*
    Method: GET
    Route: /game/:id/remove/:tile
    Purpose: This route is used to remove a piece at the
        given spot on the board
*/
router.get('/game/:id/remove/:tile', async (req, res, next) => {
  try {
    const { id, tile } = req.params

    if (!validate(id)) {
      throw new GameError(`Invalid game id: ${id}`, ErrorTypes.RESOURCE)
    }

    if (!Coordinate.test(tile)) {
      throw new GameError(
        `Invalid coordinate: ${tile}, expected to match [A-H][1-8]`,
        ErrorTypes.RESOURCE
      )
    }

    const board = await Board.getBoardById(id)
    const [x, y] = Coordinate.parseCoordinate(tile)

    board.removePiece(x, y)
    await board.save()

    res
      .type('image/svg+xml')
      .status(200)
      .send(await board.render())
  } catch (error) {
    next(error)
  }
})

module.exports = router
