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

        if (s.game === 'chess') this.board = this.generateChessBoard()
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
        console.log("in render!")
        let tileSize = this.boardSize / 8
        let inner = ''

        return `<img src="https://user-images.githubusercontent.com/33167265/90324114-63d36500-df1f-11ea-9d3c-c2795750e861.png" height="200"/>`

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
        await redis.hset([
            `id:${this.id}`,
            'game',
            this.boardSize.toString(),
            'bsize',
            this.boardSize.toString(),
            'pstyle',
            this.pieceStyle,
            'pmargin',
            this.pieceMargin.toString(),
            'board',
            JSON.stringify(this.board),
        ])
    }

    /*static async getBoardById(id) {
        const boardSize = await redis.hget(`game:${id}`, 'size')

        if (boardSize === null) throw { message: 'Invalid game id' }

        const board = new Board(boardSize)
        board.board = JSON.parse(await redis.hget(`game:${id}`, 'board'))

        return board
    }*/

    static async getBoardById(id) {
        const game = await redis.hget(`id:${id}`, 'game')

        if (game === null) throw { message: 'Invalid game id' }

        let s = {
            game: game,
            boardSize: await redis.hget(`id:${id}`, 'boardSize'),
            pieceStyle: await redis.hget(`id:${id}`, 'pieceStyle'),
            pieceMargin: await redis.hget(`id:${id}`, 'pieceMargin'),
        }

        const board = new Board(s)
        board.board = JSON.parse(await redis.hget(`id:${id}`, 'board'))

        return board
    }
}

module.exports = Board
