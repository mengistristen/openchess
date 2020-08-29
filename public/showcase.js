const showcase = document.getElementById('boardShowcase')

const getGameButton = document.getElementById('getGame')
let svg = ''

getGameButton.addEventListener('click', async () => {
    try {
        let response = await fetch('/api/new?animation=true')
        const { id } = await response.json()

        let board = new Image()
        board.src = `/api/game/${id}`

        showcase.appendChild(board)
    } catch (err) {
        console.error(err.message)
    }
})
