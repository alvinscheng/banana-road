/* global $sendScore bananaCount */

$sendScore.addEventListener('submit', () => {
  event.preventDefault()
  const $username = document.querySelector('#username')
  const data = {
    score: bananaCount,
    username: $username.value
  }
  post('/scores', JSON.stringify(data), { 'Content-Type': 'application/json' })
    .then(() => {
      $sendScore.reset()
      console.log('sent!')
    })
})

function post(path, data, header) {
  return fetch(path, {
    method: 'POST',
    headers: header,
    body: data
  })
}
