const {
  isValidFen,
  generateFromFen,
  generateCheckersRow
} = require('../src/board')
const { parseCoordinate } = require('../src/coordinate')
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

//  parseCoordinate
cases(
  'parseCoordinate: valid coordinates',
  (options) => {
    expect(() => parseCoordinate(options.value)).not.toThrow()
    expect(parseCoordinate(options.value)).toStrictEqual(options.expected)
  },
  [
    { name: 'bottom left', value: 'A1', expected: [0, 7] },
    { name: 'upper right', value: 'H8', expected: [7, 0] },
    { name: 'middle', value: 'E5', expected: [4, 3] }
  ]
)

cases(
  'parseCoordinate: invalid coordinates',
  (options) => {
    expect(() => parseCoordinate(options.value)).toThrow()
  },
  [
    { name: 'column out of bounds', value: 'A9' },
    { name: 'row out of bounds', value: 'I1' },
    { name: 'other string', value: 'other' },
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

//  generateCheckersRow
cases(
  'generateCheckersRow generates rows with full and empty spaces',
  (options) => {
    expect(generateCheckersRow(options.even, options.color)).toContainEqual(
      empty
    )
    expect(generateCheckersRow(options.even, options.color)).toContainEqual({
      color: options.color,
      piece: pieces.checkers.STANDARD
    })
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
