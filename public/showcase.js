const showcase = document.getElementById('boardShowcase')

const getGameButton = document.getElementById('getGame')

getGameButton.addEventListener('click', async () => {
  try {
    const response = await fetch('/api/new?animation=true')
    const { id } = await response.json()

    const board = new Image()
    board.src = `/api/game/${id}`

    showcase.appendChild(board)
  } catch (err) {
    console.error(err.message)
  }
})
