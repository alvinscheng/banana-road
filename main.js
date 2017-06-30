const $canvas = document.querySelector('#canvas')
const ctx = $canvas.getContext('2d')
const cw = $canvas.width
const ch = $canvas.height
let moving = false
let carRunning

function renderCanvas() {
  ctx.fillStyle = '#ecf0f1'
  ctx.fillRect(0, 0, cw, ch)
}

class Car {
  constructor(direction, speed) {
    this.direction = direction
    this.speed = speed
    this.x = cw / 2
    this.y = ch - 100
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
    ctx.clearRect(0, 0, cw, ch)

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

    renderCanvas()
    this.render()
  }

  static start(car) {
    carRunning = setInterval(function () {
      car.move()
    }, 16)
  }

  static stop(car) {
    clearInterval(carRunning)
  }
}

const user = new Car('up', 1)

window.addEventListener('load', () => {
  renderCanvas()
  user.render()
})

window.addEventListener('keydown', function (event) {
  if (event.keyCode === 38) {
    if (!moving) {
      moving = true
      Car.start(user)
    }
  }
})

window.addEventListener('keyup', function (event) {
  moving = false
  Car.stop(user)
})
