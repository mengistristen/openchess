const pieces = {
    NONE: 'none',
    chess: {
        PAWN: 'pawn',
        ROOK: 'rook',
        BISHOP: 'bishop',
        KNIGHT: 'knight',
        QUEEN: 'queen',
        KING: 'king',
    },
    checkers: {
        STANDARD: 'standard',
        KINGED: 'kinged',
    },
}

const colors = {
    NONE: 'none',
    WHITE: 'white',
    BLACK: 'black',
    RED: 'red',
}

const mainRow = [
    pieces.chess.ROOK,
    pieces.chess.BISHOP,
    pieces.chess.KNIGHT,
    pieces.chess.KING,
    pieces.chess.QUEEN,
    pieces.chess.KNIGHT,
    pieces.chess.BISHOP,
    pieces.chess.ROOK,
]

const empty = {
    color: colors.NONE,
    piece: pieces.NONE,
}

module.exports = { pieces, colors, mainRow, empty }
