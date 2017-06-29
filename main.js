const $canvas = document.querySelector('#canvas')
const context = $canvas.getContext('2d')
context.fillStyle = '#ecf0f1'
context.fillRect(10, 10, $canvas.width, $canvas.height)

class Car {
  constructor(direction, speed, location) {
    this.direction = direction
    this.speed = speed
    this.location = location
  }

  render() {
    context.fillStyle = 'black'
    context.fillRect($canvas.width / 2, $canvas.height / 2, 10, 20)
  }
}

window.addEventListener('load', function (event) {
  const user = new Car('up', 0, [0, 0])
  user.render()
})
