const showcase = document.getElementById('boardShowcase')

const getGameButton = document.getElementById('getGame')
let svg = ''

getGameButton.addEventListener('click', async () => {
    try {
        let response = await fetch('/api/new')
        const { id } = await response.json()

        response = await fetch(`/api/game/${id}`)
        const svg = await response.text()

        showcase.innerHTML = svg
    } catch (err) {
        console.error(err.message)
    }
})
