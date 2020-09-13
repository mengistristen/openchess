const { parseCoordinate } = require('../src/coordinate')
const cases = require('jest-in-case')

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
