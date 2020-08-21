const Coordinate = /[A-H][1-8]/

Coordinate.parseCoordinate = (coordinate) => {
    if (!Coordinate.test(coordinate))
        throw {
            message: `Invalid coordinate: ${coordinate}, expected to match [A-H][1-8]`,
        }

    return [
        coordinate.charCodeAt(0) - 'A'.charCodeAt(),
        7 - (Number.parseInt(coordinate[1]) - 1),
    ]
}

module.exports = Coordinate
