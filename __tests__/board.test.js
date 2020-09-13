const {
  isValidFen,
  generateFromFen,
  generateFenRow,
  generateCheckersRow,
  generateCheckersBoard,
  generateChessBoard,
  generateEmptyBoard
} = require('../src/board')
const { pieces, colors, empty } = require('../src/pieces')
const redis = require('../src/redis_client')
const cases = require('jest-in-case')

afterAll(async (done) => {
  await redis.shutdown()
  done()
})

//  isValidFen
cases(
  'isValidFen: valid FEN codes',
  (options) => {
    expect(isValidFen(options.value)).toBe(true)
  },
  [
    { name: 'empty board', value: '8-8-8-8-8-8-8-8' },
    {
      name: 'default configuration',
      value: 'rnbqkbnr-pppppppp-8-8-8-8-PPPPPPPP-RNBQKBNR'
    },
    {
      name: 'random game board',
      value: 'r1bq2r1-b4pk1-p1pp1p2-1p2pP2-1P2P1PB-3P4-1PPQ2P1-R3K2R'
    }
  ]
)

cases(
  'isValidFen: invalid FEN codes',
  (options) => {
    expect(isValidFen(options.value)).toBe(false)
  },
  [
    { name: 'not enough rows', value: '8-8-8-8-8-8-8' },
    { name: 'not enough spaces in row', value: 'ppp-8-8-8-8-8-8-8' },
    { name: 'to many spaces in row', value: '88-8-8-8-8-8-8-8' },
    { name: 'invalid symbol', value: '8t-8-8-8-8-8-8-8' },
    { name: 'empty', value: '' }
  ]
)

//  generateFromFen
describe('generateFromFen only generates from valid FEN codes', () => {
  test('invalid FEN code throws error', () => {
    expect(() => generateFromFen('')).toThrow()
  })

  test('valid FEN generates 8 rows', () => {
    expect(generateFromFen('8-8-8-8-8-8-8-8')).toHaveLength(8)
  })

  test('all rows have 8 columns', () => {
    generateFromFen('8-8-8-8-8-8-8-8').forEach((row) => {
      expect(row).toHaveLength(8)
    })
  })
})

//  generateFenRow
cases(
  'generateFenRow: valid fen rows',
  (options) => {
    expect(generateFenRow(options.fen)).toHaveLength(8)
    expect(() => generateFenRow(options.fen)).not.toThrow()
  },
  [
    { name: 'all empty', fen: '8' },
    { name: 'all pieces', fen: 'pppppppp' },
    { name: 'mixed empty and pieces', fen: '2pk2qr' }
  ]
)

cases(
  'generateFenRow: invalid fen rows',
  (options) => {
    expect(() => generateFenRow(options.fen)).toThrow()
  },
  [
    { name: 'too short, all empty', fen: '3' },
    { name: 'too short, some empty', fen: 'pqk' },
    { name: 'too long, all empty', fen: '9' },
    { name: 'too long, some empty', fen: '2ppkq4' },
    { name: 'invalid piece id', fen: 'pppppppt' }
  ]
)

//  generateCheckersRow
cases(
  'generateCheckersRow generates rows with full and empty spaces',
  (options) => {
    const result = generateCheckersRow(options.even, options.color)
    expect(result).toContainEqual(empty)
    expect(result).toContainEqual({
      color: options.color,
      piece: pieces.checkers.STANDARD
    })
    expect(result).toHaveLength(8)
  },
  [
    { name: 'black even pieces', even: true, color: colors.checkers.BLACK },
    { name: 'white even pieces', even: true, color: colors.checkers.WHITE },
    { name: 'red even pieces', even: true, color: colors.checkers.RED },
    { name: 'black odd pieces', even: false, color: colors.checkers.BLACK },
    { name: 'white odd pieces', even: false, color: colors.checkers.WHITE },
    { name: 'red odd pieces', even: false, color: colors.checkers.RED }
  ]
)

describe('generateCheckersRow: invalid colors', () => {
  test('generateCheckersRow fails for invalid color', () => {
    expect(() => generateCheckersRow(true, 'green')).toThrow()
    expect(() => generateCheckersRow(true, '')).toThrow()
    expect(() => generateCheckersRow(true)).toThrow()
  })
})

describe('generateCheckersBoard creates valid board', () => {
  const board = generateCheckersBoard()
  test('board has 8 rows', () => {
    expect(board.length).toBe(8)
  })

  test('board has 8 columns', () => {
    board.forEach((row) => expect(row.length).toBe(8))
  })
})

describe('generateChessBoard creates valid board', () => {
  const board = generateChessBoard()

  test('board has 8 rows', () => {
    expect(board.length).toBe(8)
  })

  test('board has 8 columns', () => {
    board.forEach((row) => expect(row.length).toBe(8))
  })
})

describe('generateEmptyBoard creates valid board', () => {
  const board = generateEmptyBoard()

  test('board has 8 rows', () => {
    expect(board.length).toBe(8)
  })

  test('board has 8 columns', () => {
    board.forEach((row) => expect(row.length).toBe(8))
  })
})
