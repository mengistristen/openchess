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
    constructor(boardSize, generator = '') {
        this.boardSize = boardSize
        this.id = Date.now().toString().slice(4, -1)

        if (generator === 'chess') this.board = this.generateChessBoard()
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

    render() {
        let tileSize = this.boardSize / 8
        let inner = ''
        let margin = 15

        for (let y = 0; y < 8; ++y) {
            for (let x = 0; x < 8; ++x) {
                let pieceData = this.board[y][x]

                if (pieceData.piece !== pieces.NONE) {
                    inner += `<image 
                                    x='${x * tileSize + margin}' 
                                    y='${y * tileSize + margin}' 
                                    width='${tileSize - margin * 2}' 
                                    height='${tileSize - margin * 2}' 
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
        await redis.hset([
            `game:${this.id}`,
            'size',
            this.boardSize,
            'board',
            JSON.stringify(this.board),
        ])
    }

    static async getBoardById(id) {
        const boardSize = await redis.hget(`game:${id}`, 'size')

        if (boardSize === null) throw { message: 'Invalid game id' }

        const board = new Board(boardSize)
        board.board = JSON.parse(await redis.hget(`game:${id}`, 'board'))

        return board
    }
}

module.exports = Board
