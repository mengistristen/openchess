/*
    Purpose: This is the definition file for the board class.
*/
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

    render() {
        let tileSize = this.boardSize / 8
        let inner = ''

        for(let y = 0; y < 8; ++y) {
            for(let x = 0; x < 8; ++x) {
                let pieceData = this.board[y][x]

                if(pieceData.piece !== pieces.NONE) {
                    inner += `<image 
                        x='${x * tileSize}' 
                        y='${y * tileSize}' 
                        width='${tileSize}' 
                        height='${tileSize}' 
                        href='https://openchess.s3-us-west-2.amazonaws.com/${pieceData.piece}_${pieceData.color}.svg' 
                    />`
                }
            }
        }

        return `
        <svg xmlns='https://www.w3.org/2000/svg' width='400' height='400'>
            ${inner}
        </svg>`
    }

    static fromDataString(boardSize, data) {
        let board = new Board(boardSize)
        board.board = JSON.parse(data)
        return board
    }
}

module.exports = Board