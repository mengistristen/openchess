/*
    Purpose: This is the definition file for the board class.
*/
const axios = require('axios')
const btoa = require('btoa')
const redis = require('./redisClient')
const { pieces, colors, mainRow, empty } = require('./pieces')

const generateCheckersRow = (even, color) => {
    return [...Array(8)].map((_, index) =>
        index % 2 == even ? empty : { color, piece: pieces.checkers.STANDARD }
    )
}

class Board {
    constructor(options, id) {
        this.options = options

        if (!id) this.id = Date.now().toString().slice(4, -1)
        else this.id = id

        if (this.options.game === 'chess')
            this.board = this.generateChessBoard()
        if (this.options.game === 'checkers')
            this.board = this.generateCheckersBoard()
        else if (this.options.game === 'none')
            this.board = this.generateEmptyBoard()
    }

    generateChessBoard() {
        const board = Array(8)

        //Setup black side
        board[0] = mainRow.map((piece) => {
            return { color: colors.chess.BLACK, piece }
        })
        board[1] = [...Array(8)].map(() => {
            return { color: colors.chess.BLACK, piece: pieces.chess.PAWN }
        })

        //Setup empty spaces
        board[2] = [...Array(8)].map(() => empty)
        board[3] = [...Array(8)].map(() => empty)
        board[4] = [...Array(8)].map(() => empty)
        board[5] = [...Array(8)].map(() => empty)

        //Setup white side
        board[6] = [...Array(8)].map(() => {
            return { color: colors.chess.WHITE, piece: pieces.chess.PAWN }
        })
        board[7] = mainRow.map((piece) => {
            return { color: colors.chess.WHITE, piece }
        })

        return board
    }

    generateCheckersBoard() {
        const board = Array(8)

        board[0] = generateCheckersRow(true, colors.checkers.WHITE)
        board[1] = generateCheckersRow(false, colors.checkers.WHITE)
        board[2] = generateCheckersRow(true, colors.checkers.WHITE)
        board[3] = [...Array(8)].map(() => empty)
        board[4] = [...Array(8)].map(() => empty)
        board[5] = generateCheckersRow(false, colors.checkers.RED)
        board[6] = generateCheckersRow(true, colors.checkers.RED)
        board[7] = generateCheckersRow(false, colors.checkers.RED)

        return board
    }

    generateEmptyBoard() {
        return [...Array(8)].map(() => [...Array(8)].map(() => empty))
    }

    drawCoordinates(x, y) {
        let tileSize = this.options.boardSize / 8
        let x2
        let y2
        let anchor
        let baseline
        let output = ''

        if (y == 0) {
            x2 = `${x * tileSize + tileSize / 2}`
            y2 = `${0 + this.options.coordinates.margin}`
            baseline = 'hanging'
            anchor = 'middle'
        } else if (y == 7) {
            x2 = `${x * tileSize + tileSize / 2}`
            y2 = `${8 * tileSize - this.options.coordinates.margin}`
            baseline = 'baseline'
            anchor = 'middle'
        }
        if (y == 0 || y == 7) {
            output += `<text 
            x='${x2}' 
            y='${y2}' 
            alignment-baseline='${baseline}'
            style='
                text-anchor:${anchor};
                fill:${this.options.coordinates.color};
                font-family:${this.options.coordinates.fontFamily};
                font-size:${this.options.coordinates.fontSize};
                font-style:${this.options.coordinates.fontStyle};
                font-weight:${this.options.coordinates.fontWeight}'
            >${String.fromCharCode('A'.charCodeAt(0) + x)}</text>`
        }

        if (x == 0) {
            x2 = `${0 + this.options.coordinates.margin}`
            y2 = `${y * tileSize + tileSize / 2}`
            baseline = 'middle'
            anchor = 'start'
        } else if (x == 7) {
            x2 = `${8 * tileSize - this.options.coordinates.margin}`
            y2 = `${y * tileSize + tileSize / 2}`
            baseline = 'middle'
            anchor = 'end'
        }
        if (x == 0 || x == 7) {
            output += `<text 
            x='${x2}' 
            y='${y2}' 
            alignment-baseline='${baseline}'
            style='
                text-anchor:${anchor};
                fill:${this.options.coordinates.color};
                font-family:${this.options.coordinates.fontFamily};
                font-size:${this.options.coordinates.fontSize};
                font-style:${this.options.coordinates.fontStyle};
                font-weight:${this.options.coordinates.fontWeight}'
            >${8 - y}</text>`
        }

        return output
    }

    async render(animation) {
        let tileSize = this.options.boardSize / 8

        //Render all tile and board pieces
        let inner = await this._boardAsSvgString(animation, tileSize)

        //Draw animated piece above others
        if (animation) {
            let pieceData = this.board[animation.animateY][animation.animateX]

            inner += await this.drawPiece(
                animation.startX,
                animation.startY,
                tileSize,
                pieceData.piece,
                pieceData.color,
                animation.animation
            )
        }

        if (this.options.coordinates.show)
            for (let y = 0; y < 8; ++y)
                for (let x = 0; x < 8; ++x) inner += this.drawCoordinates(x, y)

        return `<svg 
            xmlns='http://www.w3.org/2000/svg' 
            xmlns:xlink="http://www.w3.org/1999/xlink" 
            width='${this.options.boardSize}' 
            height='${this.options.boardSize}'>
            ${inner}
        </svg>`
    }

    async drawPiece(x, y, tileSize, piece, color, inner) {
        let svgData

        //If the data url already exists...
        if (await redis.exists(`${piece}:${color}`)) {
            svgData = await redis.get(`${piece}:${color}`)
        } else {
            try {
                //Otherwise, get the image and generate the data url
                const { data } = await axios.get(
                    `https://openchess.s3-us-west-2.amazonaws.com/${piece}_${color}.svg`
                )
                svgData = btoa(data)

                await redis.set(`${piece}:${color}`, svgData)
            } catch (err) {
                throw new Error(
                    `Invalid color-piece combination: ${color}-${piece}`
                )
            }
        }

        return `<image
            x='${x * tileSize + this.options.pieceMargin}' 
            y='${y * tileSize + this.options.pieceMargin}' 
            width='${tileSize - this.options.pieceMargin * 2}' 
            height='${tileSize - this.options.pieceMargin * 2}' 
            href='data:image/svg+xml;base64,${svgData}'>
                ${inner ? inner : ''}
        </image>`
    }

    movePiece(x1, y1, x2, y2) {
        let tileSize = this.options.boardSize / 8
        //can't move an empty piece onto another spot
        if (this.board[y1][x1].piece === pieces.NONE)
            throw new Error(`(${x1},${y1}) contains no piece`)

        this.board[y2][x2] = this.board[y1][x1]
        this.board[y1][x1] = empty

        const animation = `
            <animate attributeName="x" values="${
                x1 * tileSize + this.options.pieceMargin
            };${
            x2 * tileSize + this.options.pieceMargin
        }" dur="1s" fill="freeze" calcMode="spline" keySplines="0.5 0 0.5 1"/>
            <animate attributeName="y" values="${
                y1 * tileSize + this.options.pieceMargin
            };${
            y2 * tileSize + this.options.pieceMargin
        }" dur="1s" fill="freeze" calcMode="spline" keySplines="0.5 0 0.5 1"/>
        `

        return {
            startX: x1,
            startY: y1,
            animateX: x2,
            animateY: y2,
            animation,
        }
    }

    setPiece(x, y, color, piece) {
        //Decide which piece colors are valid given the game
        //and the piece
        let validColors

        if (this.options.game === 'chess' && this.options.strict !== 'false')
            validColors = Object.values(colors.chess)
        else if (
            this.options.game === 'checkers' &&
            this.options.strict !== 'false'
        )
            validColors = Object.values(colors.checkers)
        else if (
            this.options.game === 'none' ||
            this.options.strict === 'false'
        ) {
            if (Object.values(pieces.chess).includes(piece))
                validColors = Object.values(colors.chess)
            else if (Object.values(pieces.checkers).includes(piece))
                validColors = Object.values(colors.checkers)
        }

        if (!validColors.includes(color) || color === colors.NONE)
            throw new Error(
                `Invalid color attribute: '${color}', expected: ${validColors.join(
                    ', '
                )}`
            )

        //check whether or not a piece placement is valid depending on the game
        //and the strict option
        let validPieces

        //if the game isn't strict or if their is no game, all pieces are valid
        if (this.options.strict === 'false' || this.options.game === 'none')
            validPieces = [
                ...Object.values(pieces.chess),
                ...Object.values(pieces.checkers),
            ]
        else validPieces = Object.values(pieces[this.options.game])

        if (!validPieces.includes(piece) || piece === pieces.NONE)
            throw new Error(
                `Invalid piece: '${piece}', expected: ${validPieces.join(', ')}`
            )

        this.board[y][x] = { color, piece }
    }

    removePiece(x, y) {
        this.board[y][x] = empty
    }

    async save() {
        await redis.hset(
            `game:${this.id}`,
            'options',
            JSON.stringify(this.options)
        )
        await redis.hset(`game:${this.id}`, 'board', JSON.stringify(this.board))
        await redis.expire(`game:${this.id}`, 60 * 60)
    }

    static async getBoardById(id) {
        if (!(await redis.exists(`game:${id}`)))
            throw { message: `Invalid game id: ${id}` }

        const options = JSON.parse(await redis.hget(`game:${id}`, 'options'))
        const board = new Board(options, id)

        board.board = JSON.parse(await redis.hget(`game:${id}`, 'board'))

        return board
    }

    static async resetBoard(id) {
        if (!redis.exists(`game:${id}`))
            throw new Error(`Invalid game id: ${id}`)

        const options = JSON.parse(await redis.hget(`game:${id}`, 'options'))
        const board = new Board(options, id)

        await board.save()

        return board
    }

    async _boardAsSvgString(animation, tileSize) {
        //Take each string representing a row and join them together
        return (
            await Promise.all(
                this.board.map(async (row, y) => {
                    return await this._rowAsSvgString(
                        row,
                        y,
                        animation,
                        tileSize
                    )
                })
            )
        ).join('')
    }

    async _rowAsSvgString(row, y, animation, tileSize) {
        //Take each tile and join them
        return (
            await Promise.all(
                row.map(async (cell, x) => {
                    let markup = ''
                    let color

                    //Set tile color
                    if (
                        (x % 2 === 0 && y % 2 === 1) ||
                        (x % 2 === 1 && y % 2 === 0)
                    )
                        color = this.options.boardDarkColor
                    else color = this.options.boardLightColor

                    //Draw tile
                    markup += `<rect 
                    x='${x * tileSize}' 
                    y='${y * tileSize}' 
                    width='${tileSize}' 
                    height='${tileSize}'
                    style="fill:${color}" />\n`

                    //If the tile isn't empty or animated, draw the piece
                    if (cell.piece !== pieces.NONE) {
                        if (
                            !(
                                animation &&
                                animation.animateX === x &&
                                animation.animateY === y
                            )
                        )
                            markup += await this.drawPiece(
                                x,
                                y,
                                tileSize,
                                cell.piece,
                                cell.color
                            )
                    }

                    return markup
                })
            )
        ).join('')
    }
}

module.exports = Board
