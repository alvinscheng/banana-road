const $canvas = document.querySelector('#canvas')
const ctx = $canvas.getContext('2d')
const cw = $canvas.width
const ch = $canvas.height

let user
let trees = []
let bananas = []
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
  user = new Car()
  trees = []
  bananas = []
  bananaCount = 0
  $bananaCount.textContent = bananaCount
  startBananas()
  startTrees()
  user.render()
  startScreen()
}

function startBananas() {
  bananas.splice(0, 1)
  bananas.push(new Banana())
  bananas.forEach(banana => {
    banana.render()
    Banana.start(banana)
  })
}

function startTrees() {
  trees.splice(0, 2)
  trees.push(new Tree('left'), new Tree('right'))
  trees.forEach(tree => {
    tree.render()
    Tree.start(tree)
  })
}

function addTrees() {
  trees.push(new Tree('left'), new Tree('right'))
  trees.forEach(tree => tree.render())
  Tree.start(trees[trees.length - 2])
  Tree.start(trees[trees.length - 1])
}

function addBananas() {
  bananas.push(new Banana())
  bananas.forEach(banana => banana.render())
  Banana.start(bananas[bananas.length - 1])
}

class Tree {
  constructor(side) {
    this.side = side
    if (side === 'left') {
      this.x = cw / 2 + 17
    }
    else if (side === 'right') {
      this.x = cw / 2 + 80
    }
    this.speed = 0.1
    this.y = 25
    this.w = 100
    this.h = 100
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

      if (this.x < cw / 3 && trees.length === 2) {
        addTrees()
      }

      if (this.x < cw / 6 && trees.length === 4) {
        addTrees()
      }

      if (this.x < 0) {
        trees.forEach(tree => Tree.stop(tree))
        startTrees()
      }

      trees.forEach(tree => tree.render())
      bananas.forEach(banana => banana.render())
      user.render()
    }
  }

  static start(tr) {
    tr.isMoving = setInterval(function () {
      tr.move()
    }, 25)
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
    this.w = 15
    this.h = 15
    this.angle = Math.random() * 8
  }

  render() {
    ctx.drawImage(banana, this.x - this.w / 2, this.y, this.w, this.h)
  }

  move() {
    if (gameOn) {
      ctx.clearRect(0, 0, cw, ch)
      renderCanvas()
      this.y += this.speed
      this.w += 1.5
      this.h += 1.5

      if (this.x > cw / 2) {
        this.x += this.angle
      }
      else if (this.x < cw / 2) {
        this.x -= this.angle
      }

      if (bananaCount < 20) {
        if (this.y > user.y + user.h / 2 && bananas.length === 1) {
          addBananas()
        }
      }
      else if (bananaCount >= 20) {
        if (this.y > ch / 2 && bananas.length === 1) {
          addBananas()
        }
        if (this.y > user.y + user.h && bananas.length === 2) {
          addBananas()
        }
      }

      if (this.y > ch) {
        bananaCount++
        $bananaCount.textContent = bananaCount
        bananas.forEach(banana => Banana.stop(banana))
        startBananas()
      }

      if (this.x < user.x + user.w / 2 && this.x + this.w >= user.x) {
        if (this.y + this.h >= user.y + 2 * user.h / 3 && this.y + this.h / 2 <= user.y + user.h) {
          gameOn = false
          gameOver = true
          Car.startSpinning(user)
        }
      }

      bananas.forEach(banana => banana.render())
      trees.forEach(tree => tree.render())
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
    this.speed = 12
    this.x = cw / 2
    this.y = ch - 200
    this.w = 125
    this.h = 150
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
    bananas.forEach(banana => banana.render())
    trees.forEach(tree => tree.render())
    mario.src = 'images/mario-' + directions[cartDir] + '.png'
    ctx.drawImage(mario, this.x - this.w / 2, this.y, this.w, this.h)
    gameOverScreen()

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

      if (this.x <= this.w / 2) {
        this.x = this.w / 2
      }
      else if (this.x >= cw - this.w / 2) {
        this.x = cw - this.w / 2
      }

      switch (this.direction) {
        case 'right':
          this.x += this.speed
          break
        case 'left':
          this.x -= this.speed
      }

      bananas.forEach(banana => banana.render())
      trees.forEach(tree => tree.render())
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
      bananas.forEach(banana => Banana.stop(banana))
      trees.forEach(tree => Tree.stop(tree))
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
