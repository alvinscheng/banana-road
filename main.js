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
  constructor() {
    this.direction = 'up'
    this.speed = 2
    this.x = cw / 2
    this.y = ch - 100
    this.angle = Math.PI / 2
  }

  render() {
    ctx.save()
    // ctx.translate(this.x, this.y)
    // ctx.rotate((Math.PI / 180) * 30)
    ctx.fillStyle = 'black'
    ctx.fillRect(this.x, this.y, 30, 60)
    ctx.restore()
  }

  turn(direction) {
    this.direction = direction
  }

  accelerate(amount) {
    this.speed += amount
  }

  move() {
    ctx.clearRect(0, 0, cw, ch)
    renderCanvas()

    switch (this.direction) {
      case 'up':
        this.y -= this.speed
        this.angle = Math.PI / 2
        break
      case 'right':
        this.x += this.speed
        this.angle = 0
        break
      case 'down':
        this.y += this.speed
        this.angle = 3 * Math.PI / 2
        break
      case 'left':
        this.x -= this.speed
        this.angle = Math.PI
    }

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

const user = new Car()

window.addEventListener('load', () => {
  renderCanvas()
  user.render()
})

window.addEventListener('keydown', function (event) {
  switch (event.keyCode) {
    case 37:
      user.turn('left')
      if (!moving) {
        moving = true
        Car.start(user)
      }
      break
    case 38:
      user.turn('up')
      if (!moving) {
        moving = true
        Car.start(user)
      }
      break
    case 39:
      user.turn('right')
      if (!moving) {
        moving = true
        Car.start(user)
      }
      break
    case 40:
      user.turn('down')
      if (!moving) {
        moving = true
        Car.start(user)
      }
      break
  }
})

window.addEventListener('keyup', function (event) {
  moving = false
  Car.stop(user)
})
