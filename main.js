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

  turn(direction) {
    this.direction = direction
  }

  accelerate(amount) {
    this.speed += amount
  }

  move() {
    switch (this.direction) {
      case 'up':
        this.location[1] -= this.speed
        break
      case 'right':
        this.location[0] += this.speed
        break
      case 'down':
        this.location[1] += this.speed
        break
      case 'left':
        this.location[0] -= this.speed
    }
  }

  static start(car) {
    setInterval(function () {
      car.move()
    }, 16)
  }
}

const user = new Car('up', 10, [0, 0])

window.addEventListener('load', function (event) {
  user.render()
})
