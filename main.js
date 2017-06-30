const $canvas = document.querySelector('#canvas')
const ctx = $canvas.getContext('2d')
ctx.fillStyle = '#ecf0f1'
ctx.fillRect(0, 0, $canvas.width, $canvas.height)

class Car {
  constructor(direction, speed) {
    this.direction = direction
    this.speed = speed
    this.x = $canvas.width / 2
    this.y = $canvas.height - 100
  }

  render() {
    ctx.fillStyle = 'black'
    ctx.fillRect(this.x, this.y, 10, 20)
  }

  turn(direction) {
    this.direction = direction
  }

  accelerate(amount) {
    this.speed += amount
  }

  move() {
    ctx.clearRect(0, 0, $canvas.width, $canvas.height)

    switch (this.direction) {
      case 'up':
        this.y -= this.speed
        break
      case 'right':
        this.x += this.speed
        break
      case 'down':
        this.y += this.speed
        break
      case 'left':
        this.x -= this.speed
    }

    ctx.fillStyle = '#ecf0f1'
    ctx.fillRect(0, 0, $canvas.width, $canvas.height)
    this.render()
  }

  static start(car) {
    setInterval(function () {
      car.move()
    }, 16)
  }
}

const user = new Car('up', 1)

window.addEventListener('load', () => user.render())

window.addEventListener('keydown', function (event) {
  if (event.keyCode === 38) {
    Car.start(user)
  }
})
