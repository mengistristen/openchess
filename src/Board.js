/*
    Purpose: This is the definition file for the board class.
*/
const redis = require('./redisClient')
const { pieces, colors, mainRow, empty } = require('./pieces')

const generateCheckersRow = (even, color) => {
    return [...Array(8)].map((_, index) =>
        index % 2 == even ? empty : { color, piece: pieces.checkers.STANDARD }
    )
}

class Board {
    constructor(options, id) {
        this.options = options

        if (!id) this.id = Date.now().toString().slice(4, -1)
        else this.id = id

        if (this.options.game === 'chess')
            this.board = this.generateChessBoard()
        if (this.options.game === 'checkers')
            this.board = this.generateCheckersBoard()
        else if (this.options.game === 'none')
            this.board = this.generateEmptyBoard()
    }

    generateChessBoard() {
        const board = Array(8)

        //Setup black side
        board[0] = mainRow.map((piece) => {
            return { color: colors.BLACK, piece }
        })
        board[1] = [...Array(8)].map(() => {
            return { color: colors.BLACK, piece: pieces.chess.PAWN }
        })

        //Setup empty spaces
        board[2] = [...Array(8)].map(() => empty)
        board[3] = [...Array(8)].map(() => empty)
        board[4] = [...Array(8)].map(() => empty)
        board[5] = [...Array(8)].map(() => empty)

        //Setup white side
        board[6] = [...Array(8)].map(() => {
            return { color: colors.WHITE, piece: pieces.chess.PAWN }
        })
        board[7] = mainRow.map((piece) => {
            return { color: colors.WHITE, piece }
        })

        return board
    }

    generateCheckersBoard() {
        const board = Array(8)

        board[0] = generateCheckersRow(true, colors.WHITE)
        board[1] = generateCheckersRow(false, colors.WHITE)
        board[2] = generateCheckersRow(true, colors.WHITE)
        board[3] = [...Array(8)].map(() => empty)
        board[4] = [...Array(8)].map(() => empty)
        board[5] = generateCheckersRow(false, colors.RED)
        board[6] = generateCheckersRow(true, colors.RED)
        board[7] = generateCheckersRow(false, colors.RED)

        return board
    }

    generateEmptyBoard() {
        return [...Array(8)].map(() => [...Array(8)].map(() => empty))
    }

    drawCoordinates(inner, x, y) {
        let tileSize = this.options.boardSize / 8
        let x2
        let y2
        let anchor
        let baseline
        let output

        if (y == 0) {
            x2 = `${x * tileSize + tileSize / 2}`
            y2 = `${0 + this.options.coordinates.margin}`
            baseline = 'hanging'
            anchor = 'middle'
        } else if (y == 7) {
            x2 = `${x * tileSize + tileSize / 2}`
            y2 = `${8 * tileSize - this.options.coordinates.margin}`
            baseline = 'baseline'
            anchor = 'middle'
        }
        if (y == 0 || y == 7) {
            output += `<text 
            x='${x2}' 
            y='${y2}' 
            alignment-baseline='${baseline}'
            style='
                text-anchor:${anchor};
                fill:${this.options.coordinates.color};
                font-family:${this.options.coordinates.fontFamily};
                font-size:${this.options.coordinates.fontSize};
                font-style:${this.options.coordinates.fontStyle};
                font-weight:${this.options.coordinates.fontWeight}'
            >${String.fromCharCode('A'.charCodeAt(0) + x)}</text>`
        }

        if (x == 0) {
            x2 = `${0 + this.options.coordinates.margin}`
            y2 = `${y * tileSize + tileSize / 2}`
            baseline = 'middle'
            anchor = 'start'
        } else if (x == 7) {
            x2 = `${8 * tileSize - this.options.coordinates.margin}`
            y2 = `${y * tileSize + tileSize / 2}`
            baseline = 'middle'
            anchor = 'end'
        }
        if (x == 0 || x == 7) {
            output += `<text 
            x='${x2}' 
            y='${y2}' 
            alignment-baseline='${baseline}'
            style='
                text-anchor:${anchor};
                fill:${this.options.coordinates.color};
                font-family:${this.options.coordinates.fontFamily};
                font-size:${this.options.coordinates.fontSize};
                font-style:${this.options.coordinates.fontStyle};
                font-weight:${this.options.coordinates.fontWeight}'
            >${8 - y}</text>`
        }

        return output
    }

    render() {
        let tileSize = this.options.boardSize / 8
        let inner = ''

        for (let y = 0; y < 8; ++y) {
            for (let x = 0; x < 8; ++x) {
                let pieceData = this.board[y][x]
                let color

                if (
                    (x % 2 === 0 && y % 2 === 1) ||
                    (x % 2 === 1 && y % 2 === 0)
                )
                    color = this.options.boardDarkColor
                else color = this.options.boardLightColor

                // background (board)
                inner += `<rect 
                            x='${x * tileSize}' 
                            y='${y * tileSize}' 
                            width='${tileSize}' 
                            height='${tileSize}'
                            style="fill:${color}" />` //;stroke-width:3;stroke:rgb(255,0,0)" />`

                // middleground (pieces)
                if (pieceData.piece !== pieces.NONE) {
                    //console.log('drawing piece: ' + pieceData.piece + '\tcolor: ' + pieceData.color + '\tmargin: ' + this.options.pieceMargin)
                    inner += `<image 
                                    x='${
                                        x * tileSize + this.options.pieceMargin
                                    }' 
                                    y='${
                                        y * tileSize + this.options.pieceMargin
                                    }' 
                                    width='${
                                        tileSize - this.options.pieceMargin * 2
                                    }' 
                                    height='${
                                        tileSize - this.options.pieceMargin * 2
                                    }' 
                                    href='https://openchess.s3-us-west-2.amazonaws.com/${
                                        pieceData.piece
                                    }_${pieceData.color}.svg' 
                                />`
                }

                // foreground (coordinates)
                if (this.options.coordinates.show)
                    inner += this.drawCoordinates(inner, x, y)
            }
        }

        return `<svg xmlns='https://www.w3.org/2000/svg' width='${this.options.boardSize}' height='${this.options.boardSize}'>
            ${inner}
        </svg>`
    }

    movePiece(x1, y1, x2, y2) {
        //can't move an empty piece onto another spot
        if (this.board[y1][x1].piece === pieces.NONE)
            throw new Error(`(${x1},${y1}) contains no piece`)

        this.board[y2][x2] = this.board[y1][x1]
        this.board[y1][x1] = empty
    }

    setPiece(x, y, color, piece) {
        if (!Object.values(colors).includes(color) || color === colors.NONE)
            throw new Error(
                `Invalid color attribute: '${color}', expected: ${Object.values(
                    colors
                )
                    .filter((item) => item !== colors.NONE)
                    .join(', ')}`
            )

        //check whether or not a piece placement is valid depending on the game
        //and the strict option
        let validPieces

        //if the game isn't strict or if their is no game, all pieces are valid
        if (this.options.strict === 'false' || this.options.game === 'none')
            validPieces = [
                ...Object.values(pieces.chess),
                ...Object.values(pieces.checkers),
            ]
        else validPieces = Object.values(pieces[this.options.game])

        if (!validPieces.includes(piece) || piece === pieces.NONE)
            throw new Error(
                `Invalid piece: '${piece}', expected: ${validPieces.join(', ')}`
            )

        this.board[y][x] = { color, piece }
    }

    removePiece(x, y) {
        this.board[y][x] = empty
    }

    async save() {
        await redis.hset(
            `game:${this.id}`,
            'options',
            JSON.stringify(this.options)
        )
        await redis.hset(`game:${this.id}`, 'board', JSON.stringify(this.board))
        await redis.expire(`game:${this.id}`, 60 * 60)
    }

    static async getBoardById(id) {
        if (!(await redis.exists(`game:${id}`)))
            throw { message: `Invalid game id: ${id}` }

        const options = JSON.parse(await redis.hget(`game:${id}`, 'options'))
        const board = new Board(options, id)

        board.board = JSON.parse(await redis.hget(`game:${id}`, 'board'))

        return board
    }

    static async resetBoard(id) {
        if (!redis.hexists(`game:${id}`, 'board'))
            throw new Error(`Invalid game id: ${id}`)

        const options = JSON.parse(await redis.hget(`game:${id}`, 'options'))
        const board = new Board(options, id)

        await board.save()

        return board
    }
}

module.exports = Board
