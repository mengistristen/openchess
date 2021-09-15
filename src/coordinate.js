const { GameError, ErrorTypes } = require('../error_handling')
const Coordinate = /[A-H][1-8]/

Coordinate.parseCoordinate = (coordinate) => {
  if (!Coordinate.test(coordinate)) {
    throw new GameError(
      `Invalid coordinate: ${coordinate}, expected to match [A-H][1-8]`,
      ErrorTypes.RESOURCE
    )
  }

  return [
    coordinate.charCodeAt(0) - 'A'.charCodeAt(),
    7 - (Number.parseInt(coordinate[1]) - 1)
  ]
}

module.exports = Coordinate
