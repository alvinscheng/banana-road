const $canvas = document.querySelector('#canvas')
const ctx = $canvas.getContext('2d')
const cw = $canvas.width
const ch = $canvas.height
let gameOn = false
let gameOver = false
let moving = false
const directions = ['straight', 'right', '270', '225', '180', '135', '90', 'left']
let cartDir = 2
let bananaCount = 0
let carRunning, banMoving, ban, user, carSpinning
const mario = new Image()
mario.src = 'images/mario-straight.png'

const $bananaCount = document.querySelector('#banana-count')
$bananaCount.textContent = bananaCount

const background = new Image()
background.src = 'images/bg.jpg'

const banana = new Image()
banana.src = 'images/banana.png'

function renderCanvas() {
  ctx.fillStyle = '#ecf0f1'
  ctx.drawImage(background, 0, 0, cw, ch)
}

function startScreen() {
  ctx.font = '48px serif'
  ctx.fillText('BANANA ROAD', 125, 165)
  ctx.font = '24px serif'
  ctx.fillText('Press Space to Start', 200, 200)
}

function newGame() {
  renderCanvas()
  startGame()
  bananaCount = 0
  $bananaCount.textContent = bananaCount
  user = new Car()
  user.render()
  startScreen()
}

function gameOverScreen() {
  ctx.font = '48px serif'
  ctx.fillText('GAME OVER', 155, 165)
  ctx.font = '32px serif'
  ctx.fillText('Score: ' + bananaCount, 240, 200)
  ctx.font = '18px serif'
  ctx.fillText('Press Space to Try Again', 210, 230)
}

function startGame() {
  ban = new Banana()
  ban.render()
  Banana.start(ban)
}

class Banana {
  constructor() {
    this.speed = 3
    this.x = Math.random() * 40 + (cw / 2 - 20)
    this.y = ch / 4
    this.w = 25
    this.h = 25
    this.angle = Math.random() * 4
  }

  render() {
    ctx.drawImage(banana, this.x - this.w / 2, this.y, this.w, this.h)
  }

  move() {
    if (gameOn) {
      ctx.clearRect(0, 0, cw, ch)
      renderCanvas()
      this.y += this.speed
      this.w += 1
      this.h += 1

      if (this.x > cw / 2) {
        this.x += this.angle
      }
      else if (this.x < cw / 2) {
        this.x -= this.angle
      }

      if (this.y <= ch) {
        this.render()
      }
      else {
        bananaCount++
        $bananaCount.textContent = bananaCount
        Banana.stop(banMoving)
        startGame()
      }

      user.render()
    }
  }

  static start(ban) {
    banMoving = setInterval(function () {
      ban.move()
    }, 16)
  }

  static stop() {
    clearInterval(banMoving)
  }
}

class Car {
  constructor() {
    this.direction = 'up'
    this.speed = 10
    this.x = cw / 2
    this.y = ch - 175
    this.w = 100
    this.h = 125
  }

  render() {
    if (this.direction === 'left') {
      mario.src = 'images/mario-left.png'
    }
    else if (this.direction === 'right') {
      mario.src = 'images/mario-right.png'
    }
    else {
      mario.src = 'images/mario-straight.png'
    }
    ctx.drawImage(mario, this.x - this.w / 2, this.y, this.w, this.h)
  }

  spin() {
    if (cartDir > 7) {
      cartDir = 0
    }
    ctx.clearRect(0, 0, cw, ch)
    renderCanvas()
    ban.render()
    gameOverScreen()
    mario.src = 'images/mario-' + directions[cartDir] + '.png'
    ctx.drawImage(mario, this.x - this.w / 2, this.y, this.w, this.h)

    cartDir++
  }

  turn(direction) {
    this.direction = direction
  }

  accelerate(amount) {
    this.speed += amount
  }

  move() {
    if (gameOn) {
      ctx.clearRect(0, 0, cw, ch)
      renderCanvas()

      if (this.x <= 0) {
        this.x = 0
      }
      else if (this.x >= cw) {
        this.x = cw
      }

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

      if (this.x + this.w >= ban.x && this.x <= ban.x + ban.w) {
        if (this.y + this.h >= ban.y + ban.h / 2 && this.y + 2 * this.h / 3 <= ban.y + ban.h) {
          gameOn = false
          gameOver = true
          Car.startSpinning(user)
        }
      }

      ban.render()
      this.render()
    }
  }

  static start(car) {
    carRunning = setInterval(function () {
      car.move()
    }, 16)
  }

  static stop(car) {
    clearInterval(carRunning)
  }

  static startSpinning(car) {
    carSpinning = setInterval(function () {
      car.spin()
    }, 16)
  }

  static stopSpinning(car) {
    clearInterval(carSpinning)
  }
}

window.addEventListener('load', () => {
  newGame()
})

window.addEventListener('keydown', function (event) {
  if (event.keyCode === 32) {
    if (gameOver) {
      gameOver = false
      Banana.stop()
      Car.stopSpinning()
      newGame()
    }
    else {
      gameOn = true
    }
  }
  if (gameOn === true) {
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
    }
  }
})

window.addEventListener('keyup', function (event) {
  moving = false
  Car.stop(user)
})
