const collapsible = document.getElementsByClassName('collapsible')

for (const control of collapsible) {
  control.addEventListener('click', function () {
    this.classList.toggle('active')
    const content = this.nextElementSibling
    if (content.style.display === 'block') content.style.display = 'none'
    else content.style.display = 'block'
  })
}
