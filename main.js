const $canvas = document.querySelector('#canvas')
const ctx = $canvas.getContext('2d')
const cw = $canvas.width
const ch = $canvas.height

let ban, user, treeL, treeR
let gameOn = false
let gameOver = false
let moving = false

const directions = ['straight', 'right', '270', '225', '180', '135', '90', 'left']
let cartDir = 2

let bananaCount = 0
const $bananaCount = document.querySelector('#banana-count')
$bananaCount.textContent = bananaCount

const mario = new Image()
mario.src = 'images/mario-straight.png'
const background = new Image()
background.src = 'images/bg.jpg'
const banana = new Image()
banana.src = 'images/banana.png'
const tree = new Image()
tree.src = 'images/tree.png'

function renderCanvas() {
  ctx.fillStyle = '#ecf0f1'
  ctx.drawImage(background, 0, 0, cw, ch)
}

function startScreen() {
  ctx.save()
  ctx.fillStyle = 'rgba(73, 80, 91, 0.7)'
  ctx.fillRect(cw / 6, ch / 4, 2 * cw / 3, ch / 3 - 10)
  ctx.restore()
  ctx.font = '48px serif'
  ctx.fillText('BANANA ROAD', 125, 165)
  ctx.font = '24px serif'
  ctx.fillText('Press Space to Start', 200, 200)
}

function gameOverScreen() {
  ctx.save()
  ctx.fillStyle = 'rgba(73, 80, 91, 0.6)'
  ctx.fillRect(cw / 6, ch / 4, 2 * cw / 3, ch / 3 + 15)
  ctx.restore()
  ctx.font = '48px serif'
  ctx.fillText('GAME OVER', 155, 165)
  ctx.font = '32px serif'
  ctx.fillText('Score: ' + bananaCount, 240, 200)
  ctx.font = '18px serif'
  ctx.fillText('Press Space to Try Again', 210, 230)
}

function newGame() {
  renderCanvas()
  startBananas()
  startTreeLeft()
  startTreeRight()
  bananaCount = 0
  $bananaCount.textContent = bananaCount
  user = new Car()
  user.render()
  startScreen()
}

function startBananas() {
  ban = new Banana()
  ban.render()
  Banana.start(ban)
}

function startTreeLeft() {
  treeL = new Tree('left')
  treeL.render()
  Tree.start(treeL)
}

function startTreeRight() {
  treeR = new Tree('right')
  treeR.render()
  Tree.start(treeR)
}

class Tree {
  constructor(side) {
    this.side = side
    if (side === 'left') {
      this.x = cw / 2 - 10
    }
    else if (side === 'right') {
      this.x = cw / 2 + 50
    }
    this.speed = 0.1
    this.y = ch / 5
    this.w = 40
    this.h = 40
  }

  render() {
    ctx.drawImage(tree, this.x - this.w, this.y, this.w, this.h)
  }
  move() {
    if (gameOn) {
      ctx.clearRect(0, 0, cw, ch)
      renderCanvas()
      this.y += this.speed
      this.w += 4
      this.h += 4

      if (this.side === 'right') {
        this.x += 10.6
      }
      else if (this.side === 'left') {
        this.x -= 6.6
      }

      if (this.x >= 0) {
        this.render()
      }
      else {
        Tree.stop(treeL)
        Tree.stop(treeR)
        startTreeLeft()
        startTreeRight()
      }
      ban.render()
      user.render()
    }
  }

  static start(tr) {
    tr.isMoving = setInterval(function () {
      tr.move()
    }, 20)
  }

  static stop(tr) {
    clearInterval(tr.isMoving)
  }
}

class Banana {
  constructor() {
    this.speed = 4
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
        Banana.stop(ban)
        startBananas()
      }
      treeL.render()
      treeR.render()
      user.render()
    }
  }

  static start(ban) {
    ban.isMoving = setInterval(function () {
      ban.move()
    }, 16)
  }

  static stop(ban) {
    clearInterval(ban.isMoving)
  }
}

class Car {
  constructor() {
    this.direction = 'straight'
    this.speed = 10
    this.x = cw / 2
    this.y = ch - 175
    this.w = 100
    this.h = 125
  }

  render() {
    mario.src = 'images/mario-' + this.direction + '.png'
    ctx.drawImage(mario, this.x - this.w / 2, this.y, this.w, this.h)
  }

  spin() {
    if (cartDir > 7) {
      cartDir = 0
    }
    ctx.clearRect(0, 0, cw, ch)
    renderCanvas()
    ban.render()
    treeL.render()
    treeR.render()
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
        case 'right':
          this.x += this.speed
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
      treeL.render()
      treeR.render()
      this.render()
    }
  }

  static start(car) {
    car.isRunning = setInterval(function () {
      car.move()
    }, 16)
  }

  static stop(car) {
    clearInterval(car.isRunning)
  }

  static startSpinning(car) {
    car.isSpinning = setInterval(function () {
      car.spin()
    }, 32)
  }

  static stopSpinning(car) {
    clearInterval(car.isSpinning)
  }
}

window.addEventListener('load', () => {
  newGame()
})

window.addEventListener('keydown', function (event) {
  if (event.keyCode === 32) {
    if (gameOver) {
      gameOver = false
      Banana.stop(ban)
      Tree.stop(treeL)
      Tree.stop(treeR)
      Car.stopSpinning(user)
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
      case 39:
        user.turn('right')
        if (!moving) {
          moving = true
          Car.start(user)
        }
        break
    }
  }
})

window.addEventListener('keyup', function (event) {
  moving = false
  user.direction = 'straight'
  user.render()
  Car.stop(user)
})
