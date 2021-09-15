class GameError extends Error {
  constructor(message, type) {
    super(message)
    this._type = type
  }

  get Type() {
    return this._type
  }
}

const ErrorTypes = {
  RESOURCE: 1,
  GAME: 2
}

const ErrorMiddleware = (error, req, res, next) => {
  if (error.Type === ErrorTypes.RESOURCE) {
    res.status(404).send(`Resource Error: ${error.message}`)
  } else if (error.Type === ErrorTypes.GAME) {
    res.status(404).send(`Game Error: ${error.message}`)
  } else res.sendStatus(500)
}

module.exports = { GameError, ErrorTypes, ErrorMiddleware }
