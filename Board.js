/*
    Purpose: This is the definition file for the board class.
*/
const redis = require('./redisClient')

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
    constructor(s) {
        this.game = s.game
        this.boardSize = s.boardSize
        this.pieceStyle = s.pieceStyle
        this.pieceMargin = s.pieceMargin
        this.id = Date.now().toString().slice(4, -1)

        if (this.game === "chess") this.board = this.generateChessBoard()
        console.log("passed to Board: " + JSON.stringify(s))
        console.log(this.board)
    }

    generateChessBoard() {
        console.log("in generate chess board")
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

    render() {
        console.log("in render")
        let tileSize = this.boardSize / 8
        let inner = ''

        for (let y = 0; y < 8; ++y) {
            for (let x = 0; x < 8; ++x) {
                if (x % 2 === 0) {
                    if (y % 2 === 0) {
                        inner += `<rect 
                            x='${x * tileSize}' 
                            y='${y * tileSize}' 
                            width='${tileSize}' 
                            height='${tileSize}'
                            style="fill:rgb(255,0,0)"/>`//;stroke-width:3;stroke:rgb(255,0,0)" />`
                    }
                    else {
                        inner += `<rect 
                        x='${x * tileSize}' 
                        y='${y * tileSize}' 
                        width='${tileSize}' 
                        height='${tileSize}'
                        style="fill:rgb(0,0,0)"/>`//;stroke-width:3;stroke:rgb(0,0,0)" />`
                    }
                }
                else {
                    if (y % 2 === 0) {
                        inner += `<rect 
                        x='${x * tileSize}' 
                        y='${y * tileSize}' 
                        width='${tileSize}' 
                        height='${tileSize}'
                        style="fill:rgb(0,0,0)"/>`//;stroke-width:3;stroke:rgb(0,0,0)" />`
                    }
                    else {
                        inner += `<rect 
                        x='${x * tileSize}' 
                        y='${y * tileSize}' 
                        width='${tileSize}' 
                        height='${tileSize}'
                        style="fill:rgb(255,0,0)"/>`//;stroke-width:3;stroke:rgb(255,0,0)" />`
                    }
                }
            }
        }

        for (let y = 0; y < 8; ++y) {
            for (let x = 0; x < 8; ++x) {
                let pieceData = this.board[y][x]

                if (pieceData.piece !== pieces.NONE) {
                    inner += `<image 
                                    x='${x * tileSize + this.pieceMargin}' 
                                    y='${y * tileSize + this.pieceMargin}' 
                                    width='${tileSize - this.pieceMargin * 2}' 
                                    height='${tileSize - this.pieceMargin * 2}' 
                                    href='https://openchess.s3-us-west-2.amazonaws.com/${
                        pieceData.piece
                        }_${pieceData.color}.svg' 
                                />`
                }
            }
        }

        return `
            <svg xmlns='https://www.w3.org/2000/svg' width='${this.boardSize}' height='${this.boardSize}'>
                ${inner}
            </svg>`
    }

    async save() {
        await redis.hset(`id:${this.id}`, 'game', this.game)
        await redis.hset(`id:${this.id}`, 'bsize', this.boardSize.toString())
        await redis.hset(`id:${this.id}`, 'pstyle', this.pieceStyle)
        await redis.hset(`id:${this.id}`, 'pmargin', this.pieceMargin.toString())
        await redis.hset(`id:${this.id}`, 'board', JSON.stringify(this.board))
    }

    static async getBoardById(id) {
        const game = await redis.hget(`id:${id}`, 'game')

        if (game === null) throw { message: 'Invalid game id' }

        let s = {
            game: game,
            boardSize: parseInt(await redis.hget(`id:${id}`, 'bsize')),
            pieceStyle: await redis.hget(`id:${id}`, 'pstyle'),
            pieceMargin: parseInt(await redis.hget(`id:${id}`, 'pmargin')),
        }

        const board = new Board(s)
        board.board = JSON.parse(await redis.hget(`id:${id}`, 'board'))

        return board
    }
}

module.exports = Board
