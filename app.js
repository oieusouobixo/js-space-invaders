document.addEventListener('DOMContentLoaded', () => {
  const SQUARES = document.querySelectorAll('.grid div')
  const RESULT_DISPLAY = document.querySelector('#result')
  let width = 15
  let currentShooterIndex = 202
  let currentInvaderIndex = 0
  let alienInvadersTakenDown = []
  let result = 0
  let direction = 1
  let invaderId

  // define alien invaders
  const ALIEN_INVADERS = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
    30, 31, 32, 33, 34, 35, 36, 37, 38, 39
  ]
  
  // draw alien invaders
  ALIEN_INVADERS.forEach(invader => SQUARES[currentInvaderIndex + invader].classList.add('invader'))

  // draw shooter
  SQUARES[currentShooterIndex].classList.add('shooter')

  // move shooter along a line
  function moveShooter(e) {
    SQUARES[currentShooterIndex].classList.remove('shooter')
    switch(e.keyCode) {
      case 37:
        if (currentShooterIndex % width !== 0) currentShooterIndex -=1
        break
      case 39:
        if (currentShooterIndex % width < width -1) currentShooterIndex +=1
        break
    }
    SQUARES[currentShooterIndex].classList.add('shooter')
  }
  document.addEventListener('keydown', moveShooter)

  // move alien invadesr
  function moveInvaders() {
    const LEFT_EDGE = ALIEN_INVADERS[0] % width === 0
    const RIGHT_EDGE = ALIEN_INVADERS[ALIEN_INVADERS.length -1] % width === width -1

    if ((LEFT_EDGE && direction === -1) || (RIGHT_EDGE && direction === 1)) {
      direction = width
    } else if (direction === width) {
      if (LEFT_EDGE) direction = 1
      else direction = -1
    }
    for (let i = 0; i <= ALIEN_INVADERS.length -1; i++) {
      SQUARES[ALIEN_INVADERS[i]].classList.remove('invader')
    }
    for (let i = 0; i <= ALIEN_INVADERS.length -1; i++) {
      ALIEN_INVADERS[i] += direction
    }
    for (let i = 0; i <= ALIEN_INVADERS.length -1; i++) {
      if (!alienInvadersTakenDown.includes(i)) {
        SQUARES[ALIEN_INVADERS[i]].classList.add('invader')
      }
    }

    // decide game over
    if (SQUARES[currentShooterIndex].classList.contains('invader', 'shooter')) {
      RESULT_DISPLAY.textContent = 'game over'
      SQUARES[currentShooterIndex].classList.add('boom')
      clearInterval(invaderId)
    }

    for (let i = 0; i <= ALIEN_INVADERS.length -1; i++) {
      if (ALIEN_INVADERS[i] > (SQUARES.length - (width-1))) {
        RESULT_DISPLAY.textContent = 'game over'
        clearInterval(invaderId)
      }
    }

    // decide a win
    if (alienInvadersTakenDown.length === ALIEN_INVADERS.length) {
      RESULT_DISPLAY.textContent = 'you win'
      clearInterval(invaderId)
    }
  }
  invaderId = setInterval(moveInvaders, 500)

  // shoot at aliens
  function shoot(e) {
    let laserId
    let currentLaserIndex = currentShooterIndex

    // move laser from shooter to alien invader
    function moveLaser() {
      SQUARES[currentLaserIndex].classList.remove('laser')
      currentLaserIndex -= width
      SQUARES[currentLaserIndex].classList.add('laser')
      if (SQUARES[currentLaserIndex].classList.contains('invader')) {
        SQUARES[currentLaserIndex].classList.remove('laser')
        SQUARES[currentLaserIndex].classList.remove('invader')
        SQUARES[currentLaserIndex].classList.add('boom')

        setTimeout(() => SQUARES[currentLaserIndex].classList.remove('boom'), 250)
        clearInterval(laserId)

        const ALIEN_TAKEN_DOWN = ALIEN_INVADERS.indexOf(currentLaserIndex)
        alienInvadersTakenDown.push(ALIEN_TAKEN_DOWN)
        result++
        RESULT_DISPLAY.textContent = result
      }
  
      if (currentLaserIndex < width) {
        clearInterval(laserId)
        setTimeout(() => SQUARES[currentLaserIndex].classList.remove('laser'), 100)
      }
    }

    switch(e.keyCode) {
      case 32:
        laserId = setInterval(moveLaser, 100)
        break
    }
  }

  document.addEventListener('keyup', shoot)
})