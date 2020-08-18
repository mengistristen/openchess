/*
    Purpose: This is the definition file for the board class.
*/
const redis = require('./redisClient')
const { json } = require('express')

const pieces = {
    NONE: 'none',
    PAWN: 'pawn',
    ROOK: 'rook',
    BISHOP: 'bishop',
    KNIGHT: 'knight',
    QUEEN: 'queen',
    KING: 'king',
    STANDARD: 'standard',
    KINGED: 'kinged',
}

const colors = {
    NONE: 'none',
    WHITE: 'white',
    BLACK: 'black',
    RED: 'red',
}

const mainRow = [
    pieces.ROOK,
    pieces.KNIGHT,
    pieces.BISHOP,
    pieces.KING,
    pieces.QUEEN,
    pieces.BISHOP,
    pieces.KNIGHT,
    pieces.ROOK,
]

class Board {
    constructor(options, id) {
        this.options = options

        if (!id) this.id = Date.now().toString().slice(4, -1)
        else this.id = id

        if (this.options.game === 'chess')
            this.board = this.generateChessBoard()
    }

    generateChessBoard() {
        const board = Array(8)

        //Setup black side
        board[0] = mainRow.map((piece) => {
            return { color: colors.BLACK, piece }
        })
        board[1] = [...Array(8)].map((item) => {
            return { color: colors.BLACK, piece: pieces.PAWN }
        })

        //Setup empty spaces
        board[2] = [...Array(8)].map(() => {
            return { color: colors.NONE, piece: pieces.NONE }
        })
        board[3] = [...Array(8)].map(() => {
            return { color: colors.NONE, piece: pieces.NONE }
        })
        board[4] = [...Array(8)].map(() => {
            return { color: colors.NONE, piece: pieces.NONE }
        })
        board[5] = [...Array(8)].map(() => {
            return { color: colors.NONE, piece: pieces.NONE }
        })

        //Setup white side
        board[6] = [...Array(8)].map(() => {
            return { color: colors.WHITE, piece: pieces.PAWN }
        })
        board[7] = mainRow.map((piece) => {
            return { color: colors.WHITE, piece }
        })

        return board
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
        if (this.board[y1][x1].piece === pieces.NONE)
            throw { message: `(${x1},${y1}) contains no piece` }

        this.board[y2][x2] = this.board[y1][x1]
        this.board[y1][x1] = { color: colors.NONE, piece: pieces.NONE }
    }

    setPiece(x, y, color, piece) {
        if (!Object.values(colors).includes(color) || color === colors.NONE)
            throw {
                message: `Invalid color attribute: '${color}', expected: ${Object.values(
                    colors
                )
                    .filter((item) => item !== colors.NONE)
                    .join(', ')}`,
            }

        if (!Object.values(pieces).includes(piece) || piece === pieces.NONE)
            throw {
                message: `Invalid piece: '${piece}', expected: ${Object.values(
                    pieces
                )
                    .filter((item) => item !== pieces.NONE)
                    .join(', ')}`,
            }

        this.board[y][x] = { color, piece }
    }

    async save() {
        await redis.hset(
            `id:${this.id}`,
            'options',
            JSON.stringify(this.options)
        )
        await redis.hset(`id:${this.id}`, 'board', JSON.stringify(this.board))
    }

    static async getBoardById(id) {
        if (!redis.hexists(`id:${id}`, 'board'))
            throw { message: `Invalid game id: ${id}` }

        const options = JSON.parse(await redis.hget(`id:${id}`, 'options'))
        const board = new Board(options, id)

        board.board = JSON.parse(await redis.hget(`id:${id}`, 'board'))

        return board
    }

    static async resetBoard(id) {
        if (!redis.hexists(`id:${id}`, 'board'))
            throw { message: `Invalid game id: ${id}` }

        const options = JSON.parse(await redis.hget(`id:${id}`, 'options'))
        const board = new Board(options, id)

        await board.save()

        return board
    }
}

module.exports = Board
