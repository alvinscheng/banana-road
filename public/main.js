const $canvas = document.querySelector('#canvas')
const $sendScore = document.querySelector('#send-score')
const $username = document.querySelector('#username')
const $leaderboard = document.querySelector('#leaderboard')

const ctx = $canvas.getContext('2d')
const cw = $canvas.width
const ch = $canvas.height

let user
let trees = []
let bananas = []
let gameOn = false
let gameOver = false
let moving = false
let top10 = false
let isLeaderboard = false

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

const $mainMenuMusic = document.querySelector('#main-menu-audio')
const $gameMusic = document.querySelector('#game-audio')
const $gameOverAudio = document.querySelector('#game-over-audio')
const $muteButton = document.querySelector('#mute')
const sounds = [$mainMenuMusic, $gameMusic, $gameOverAudio]

$muteButton.addEventListener('click', () => {
  if ($muteButton.src.endsWith('sound-on.png')) {
    $muteButton.src = 'images/sound-off.png'
    sounds.forEach(sound => {
      sound.muted = true
    })
  }
  else {
    $muteButton.src = 'images/sound-on.png'
    sounds.forEach(sound => {
      sound.muted = false
    })
  }
})

function renderCanvas() {
  ctx.fillStyle = '#ecf0f1'
  ctx.drawImage(background, 0, 0, cw, ch)
}

function startScreen() {
  ctx.fillStyle = 'rgba(73, 80, 91, 0.7)'
  ctx.fillRect(cw / 6, ch / 4, 2 * cw / 3, ch / 2 - 50)
  ctx.fillStyle = 'white'
  ctx.font = '64px "Bangers", cursive'
  ctx.fillText('BANANA ROAD', 150, 165)
  ctx.font = '24px "Bangers", cursive'
  ctx.fillText('Press SPACE to Start', 210, 200)
  ctx.font = '16px "Oswald", sans-serif'
  ctx.fillText('Use the LEFT and RIGHT arrow keys to move', 175, 230)
}

function gameOverScreen() {
  ctx.save()
  ctx.fillStyle = 'rgba(73, 80, 91, 0.6)'
  ctx.fillRect(cw / 6, ch / 4 - 20, 2 * cw / 3, ch / 2)
  ctx.restore()
  ctx.font = '64px "Bangers", cursive'
  ctx.fillText('GAME OVER', 165, 145)
  ctx.font = '32px "Bangers", cursive'
  ctx.fillText('Score: ' + bananaCount, 250, 180)
  ctx.font = '20px "Bangers", sans-serif'
  ctx.fillText('Please Enter Your Name', 215, 208)
  ctx.font = '18px "Oswald", sans-serif'
  ctx.fillText('Press Space to Try Again', 215, 265)
}

function leaderboardScreen() {
  ctx.save()
  ctx.fillStyle = 'rgba(73, 80, 91, 0.6)'
  ctx.fillRect(cw / 6, ch / 4 - 20, 2 * cw / 3, ch / 2)
  ctx.restore()
  ctx.font = '36px "Bangers", cursive'
  ctx.fillText('Leaderboard', 215, 117)
  ctx.font = '18px "Oswald", sans-serif'
  ctx.fillText('Press Space', 263, 270)
}

function newGame() {
  $leaderboard.classList.add('hidden')
  $leaderboard.classList.remove('flex')
  startAudio($mainMenuMusic)
  renderCanvas()
  user = new Car()
  user.render()
  trees = []
  bananas = []
  bananaCount = 0
  $bananaCount.textContent = bananaCount
  startBananas()
  startTrees()
  startScreen()
}

function startAudio(audio) {
  audio.currentTime = 0
  audio.play()
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
      else if (bananaCount >= 20 && bananaCount < 50) {
        if (this.y > ch / 2 && bananas.length === 1) {
          addBananas()
        }
        if (this.y > user.y + user.h && bananas.length === 2) {
          addBananas()
        }
      }
      else if (bananaCount >= 50) {
        if (this.y > ch / 2 && bananas.length === 1) {
          addBananas()
        }
        if (this.y > user.y + user.h / 3 && bananas.length === 2) {
          addBananas()
        }
        if (this.y > user.y + user.h && bananas.length === 3) {
          addBananas()
        }
      }

      if (this.y > ch) {
        bananaCount++
        $bananaCount.textContent = bananaCount
        bananas.forEach(banana => Banana.stop(banana))
        startBananas()
      }

      if (this.x < user.x + 60 && this.x + this.w >= user.x + 5) {
        if (this.y + this.h >= user.y + 3 * user.h / 4 && this.y + this.h / 2 <= user.y + user.h - 5) {
          $gameOverAudio.currentTime = 0.5
          $gameOverAudio.play()
          gameOn = false
          gameOver = true
          $gameMusic.pause()
          Car.startSpinning(user)
          getTop10()
            .then(res => res.json())
            .then(scores => {
              if (scores.length < 10 || bananaCount > scores[9].score) {
                $sendScore.classList.remove('hidden')
                top10 = true
              }
            })
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
    if ($username !== document.activeElement) {
      $username.select()
    }
    if (cartDir > 7) {
      cartDir = 0
    }
    ctx.clearRect(0, 0, cw, ch)
    renderCanvas()
    bananas.forEach(banana => banana.render())
    trees.forEach(tree => tree.render())
    mario.src = 'images/mario-' + directions[cartDir] + '.png'
    ctx.drawImage(mario, this.x - this.w / 2, this.y, this.w, this.h)

    if (!isLeaderboard) {
      gameOverScreen()
    }
    else {
      leaderboardScreen()
    }

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
      $sendScore.classList.add('hidden')
      if (!isLeaderboard) {
        if (top10) {
          top10 = false
          submitScore()
            .then(() => {
              showLeaderboard()
            })
        }
        else {
          showLeaderboard()
        }
      }
      else {
        $gameOverAudio.pause()
        isLeaderboard = false
        gameOver = false
        bananas.forEach(banana => Banana.stop(banana))
        trees.forEach(tree => Tree.stop(tree))
        Car.stopSpinning(user)
        newGame()
      }
    }
    else {
      gameOn = true
      $mainMenuMusic.pause()
      startAudio($gameMusic)
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
  Car.stop(user)
})

function submitScore() {
  const data = {
    score: bananaCount,
    username: $username.value
  }
  return post('/scores', JSON.stringify(data), { 'Content-Type': 'application/json' })
}

function post(path, data, header) {
  return fetch(path, {
    method: 'POST',
    headers: header,
    body: data
  })
}

function getTop10() {
  return fetch('/scores')
}

function renderScore(data) {
  const $row = document.createElement('tr')
  const $score = document.createElement('td')
  const $name = document.createElement('td')
  $score.textContent = data.score
  $name.textContent = data.username
  $row.appendChild($score)
  $row.appendChild($name)
  return $row
}

function showLeaderboard() {
  getTop10()
    .then(res => res.json())
    .then(scores => {
      const $top5 = document.querySelector('#top5')
      const $next5 = document.querySelector('#next5')
      const $scores = scores.map(score => renderScore(score))
      $top5.innerHTML = ''
      $next5.innerHTML = ''
      for (let i = 0; i < 5; i++) {
        if ($scores[i]) {
          $top5.appendChild($scores[i])
        }
      }
      for (let i = 5; i < 10; i++) {
        if ($scores[i]) {
          $next5.appendChild($scores[i])
        }
      }
    })
    .then(() => {
      isLeaderboard = true
      $leaderboard.classList.remove('hidden')
      $leaderboard.classList.add('flex')
    })
}
