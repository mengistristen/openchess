const pieces = {
  NONE: 'none',
  chess: {
    PAWN: 'pawn',
    ROOK: 'rook',
    BISHOP: 'bishop',
    KNIGHT: 'knight',
    QUEEN: 'queen',
    KING: 'king'
  },
  checkers: {
    STANDARD: 'standard',
    KINGED: 'kinged'
  }
}

const colors = {
  NONE: 'none',
  chess: {
    BLACK: 'black',
    WHITE: 'white'
  },
  checkers: {
    BLACK: 'black',
    WHITE: 'white',
    RED: 'red'
  }
}

const mainRow = [
  pieces.chess.ROOK,
  pieces.chess.BISHOP,
  pieces.chess.KNIGHT,
  pieces.chess.KING,
  pieces.chess.QUEEN,
  pieces.chess.KNIGHT,
  pieces.chess.BISHOP,
  pieces.chess.ROOK
]

const empty = {
  color: colors.NONE,
  piece: pieces.NONE
}

const fen = {
  r: { color: colors.chess.BLACK, piece: pieces.chess.ROOK },
  n: { color: colors.chess.BLACK, piece: pieces.chess.KNIGHT },
  b: { color: colors.chess.BLACK, piece: pieces.chess.BISHOP },
  q: { color: colors.chess.BLACK, piece: pieces.chess.QUEEN },
  k: { color: colors.chess.BLACK, piece: pieces.chess.KING },
  p: { color: colors.chess.BLACK, piece: pieces.chess.PAWN },
  R: { color: colors.chess.WHITE, piece: pieces.chess.ROOK },
  N: { color: colors.chess.WHITE, piece: pieces.chess.KNIGHT },
  B: { color: colors.chess.WHITE, piece: pieces.chess.BISHOP },
  Q: { color: colors.chess.WHITE, piece: pieces.chess.QUEEN },
  K: { color: colors.chess.WHITE, piece: pieces.chess.KING },
  P: { color: colors.chess.WHITE, piece: pieces.chess.PAWN }
}

module.exports = { pieces, colors, mainRow, empty, fen }
