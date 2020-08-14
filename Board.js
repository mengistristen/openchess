const pieces = {
    NONE: 'none',
    PAWN: 'pawn', 
    ROOK: 'rook',
    BISHOP: 'bishop',
    KNIGHT: 'knight',
    QUEEN: 'queen',
    KING: 'king'
}

const colors = {
    NONE: 'none',
    WHITE: 'white',
    BLACK: 'black'
}

const mainRow = [pieces.ROOK, pieces.KNIGHT, pieces.BISHOP, pieces.KING, pieces.QUEEN, pieces.BISHOP, pieces.KNIGHT, pieces.ROOK]

class Board {
    constructor (boardSize) {
        this.boardSize = boardSize
        this.board = Array(8)

        //Setup black side
        this.board[0] = mainRow.map(piece => {
            return { color: colors.BLACK, piece }
        })
        this.board[1] = [...Array(8)].map(item => {
            return { color: colors.BLACK, piece: pieces.PAWN }
        })

        //Setup empty spaces
        this.board[2] = [...Array(8)].map(() => {
            return { color: colors.NONE, piece: pieces.NONE }
        })
        this.board[3] = [...Array(8)].map(() => {
            return { color: colors.NONE, piece: pieces.NONE }
        })
        this.board[4] = [...Array(8)].map(() => {
            return { color: colors.NONE, piece: pieces.NONE }
        })
        this.board[5] = [...Array(8)].map(() => {
            return { color: colors.NONE, piece: pieces.NONE }
        })

        //Setup white side
        this.board[6] = [...Array(8)].map(() => {
            return { color: colors.WHITE, piece: pieces.PAWN }
        })
        this.board[7] = mainRow.map(piece => {
            return { color: colors.WHITE, piece }
        })
    }

    save() {

    }

    static fromData(boardSize, data) {
        return new Board(boardSize)
    }
}

module.exports = Board