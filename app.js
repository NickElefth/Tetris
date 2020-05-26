document.addEventListener('DOMContentLoaded', () => {
  const HEIGHT = 20
  const WIDTH = 10
  const GRID_SIZE = HEIGHT * WIDTH

  const grid = createGrid()
  let hasBegun = false
  let squares = Array.from(grid.querySelectorAll('div'))
  const scoreDisplay = document.querySelector('#score')
  const startButton = document.querySelector('#start-button')
  const instructionsButton = document.querySelector('#instructions-button')
  const instructionsModal = document.querySelector('#instructions-modal')
  const instructionsModalClose = document.querySelector('#instructions-close')
  const restartButton = document.querySelector('#restart-button')

  const colors = [
    'url(squares/blue-block.png)',
    'url(squares/green-block.png)',
    'url(squares/purple-block.png)',
    'url(squares/red-block.png)',
    'url(squares/orange-block.png)'
  ]

  //TETROMINOS
  const lTetromino = [
    [1, WIDTH + 1, WIDTH * 2 + 1, 2],
    [WIDTH, WIDTH + 1, WIDTH + 2, WIDTH * 2 + 2],
    [1, WIDTH + 1, WIDTH * 2 + 1, WIDTH * 2],
    [WIDTH, WIDTH * 2, WIDTH * 2 + 1, WIDTH * 2 + 2]
  ]

  const zTetromino = [
    [0, WIDTH, WIDTH + 1, WIDTH * 2 + 1],
    [WIDTH + 1, WIDTH + 2, WIDTH * 2, WIDTH * 2 + 1],
    [0, WIDTH, WIDTH + 1, WIDTH * 2 + 1],
    [WIDTH + 1, WIDTH + 2, WIDTH * 2, WIDTH * 2 + 1]
  ]

  const tTetromino = [
    [1, WIDTH, WIDTH + 1, WIDTH + 2],
    [1, WIDTH + 1, WIDTH + 2, WIDTH * 2 + 1],
    [WIDTH, WIDTH + 1, WIDTH + 2, WIDTH * 2 + 1],
    [1, WIDTH, WIDTH + 1, WIDTH * 2 + 1]
  ]

  const oTetromino = [
    [0, 1, WIDTH, WIDTH + 1],
    [0, 1, WIDTH, WIDTH + 1],
    [0, 1, WIDTH, WIDTH + 1],
    [0, 1, WIDTH, WIDTH + 1]
  ]

  const iTetromino = [
    [1, WIDTH + 1, WIDTH * 2 + 1, WIDTH * 3 + 1],
    [WIDTH, WIDTH + 1, WIDTH + 2, WIDTH + 3],
    [1, WIDTH + 1, WIDTH * 2 + 1, WIDTH * 3 + 1],
    [WIDTH, WIDTH + 1, WIDTH + 2, WIDTH + 3]
  ]

  const theTetrominos = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

  let currentPosition = 4
  let currentRotation = 0
  let nextRandom = 0
  let score = 0
  let timerId

  //Randomely select a tetromino in its first rotation
  let random = Math.floor(Math.random()*theTetrominos.length)
  let current = theTetrominos[random][currentRotation]

  // Add taken class to botom squares
  initializeSquares()

  // Display Modal and pause
  instructionsButton.addEventListener('click', () => {
    instructionsModal.style.display = 'block'
    if (hasBegun) {
      startPauseGame()
    }
  })

  // Close Modal
  instructionsModalClose.addEventListener('click', () => {
    instructionsModal.style.display = 'none'
    if (hasBegun) {
      startPauseGame()
    }
  })

  // Restart game
  restartButton.addEventListener('click', () => {
    var confirmRestart = confirm("Are you sure you want to restart?");
    if (confirmRestart) {
      location.reload()
    }
  })
  // Create grid
  function createGrid() {
    let grid = document.querySelector('.grid')
    for (let i=0; i < GRID_SIZE + WIDTH; i ++) {
      let gridElement = document.createElement('div')
      grid.appendChild(gridElement)
    }
    return grid
  }

  //Add define boundaries
  function initializeSquares() {
    for (let i=GRID_SIZE; i < GRID_SIZE + WIDTH; i++) {
      squares[i].classList.add('taken')
    }
  }
  //draw tetromino
  function draw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.add('tetromino')
      squares[currentPosition + index].style.backgroundImage = colors[random]
    })
  }

  //undraw tetromino
  function undraw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.remove('tetromino')
      squares[currentPosition + index].style.backgroundImage= ''
    })
  }

  // make the tetromino move down
  function moveDown() {
    undraw()
    currentPosition += WIDTH
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition -= WIDTH
    }
    draw()
    freeze()
  }

  function freeze() {
    if (current.some(index => squares[currentPosition + index + WIDTH].classList.contains('taken'))) {
      current.forEach(index => squares[currentPosition + index].classList.add('taken'))
      random = nextRandom
      nextRandom = Math.floor(Math.random()*theTetrominos.length)
      current = theTetrominos[random][currentRotation]
      currentPosition = 4
      draw()
      displayShape()
      addScore()
      gameOver()
    }
  }

  // Assign functions to keys
  function control(e) {
    if (e.keyCode === 37) {
      moveLeft()
    } else if (e.keyCode === 38){
      rotate()
    } else if (e.keyCode === 39) {
      moveRight()
    } else if (e.keyCode === 40) {
      moveDown()
    }
  }
  document.addEventListener('keyup', control)

  // Move left if possible
  function moveLeft() {
    undraw()
    const isAtLeftEdge = current.some(index => (currentPosition + index) % WIDTH === 0)
    if (!isAtLeftEdge) currentPosition -= 1
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition +=1
    }
    draw()
  }

  // Move left if possible
  function moveRight() {
    undraw()
    const isAtRightEdge = current.some(index => (currentPosition + index) % WIDTH === 9)
    if (!isAtRightEdge) currentPosition += 1
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition -=1
    }
    draw()
  }

  function rotate() {
    undraw()
    getRotation()
    current = theTetrominos[random][currentRotation]
    draw()
  }

  // Get next rotations
  function getRotation(){
    increaseRotation()
    let futureMove = theTetrominos[random][currentRotation]
    const isAtLeftEdge = futureMove.some(index => (currentPosition + index) % WIDTH === 0)
    const isAtRightEdge = futureMove.some(index => (currentPosition + index) % WIDTH === 9)
    // if future move is at both sides dont allow rotation
    if (isAtLeftEdge && isAtRightEdge) {
      revertRotation()
    }
  }

  //Increase rotation
  function increaseRotation() {
    currentRotation ++
    if (currentRotation === current.length) {
      currentRotation = 0
    }
  }

  //Revert rotations
  function revertRotation() {
    currentRotation --
    if (currentRotation < 0) {
      currentRotation = 4
    }
  }
  //show up next tetromino in mini-grid

  // MINI GRID
  const MINI_GRID_SIZE = 16
  const displaySquares = createMiniGrid()
  console.log(displaySquares)
  const displayWidth = 4
  const displayIndex = 0
  const upNextTetrominos = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2], /* lTetromino */
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], /* zTetromino */
    [1, displayWidth, displayWidth + 1, displayWidth + 2], /* tTetromino */
    [0, 1, displayWidth, displayWidth + 1], /* oTetromino */
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1] /* iTetromino */
  ]

  function createMiniGrid() {
    let displaySquares = document.querySelector('.mini-grid')
    for (let i=0; i < MINI_GRID_SIZE; i ++) {
      let gridElement = document.createElement('div')
      displaySquares.appendChild(gridElement)
    }
    return displaySquares.querySelectorAll('div')
  }


  function displayShape() {
    //remove any trace of tetromino from the entire grid
    displaySquares.forEach(square => {
      square.classList.remove('tetromino')
      square.style.backgroundImage = ''
    })
    upNextTetrominos[nextRandom].forEach( index => {
      displaySquares[displayIndex + index ].classList.add('tetromino')
      displaySquares[displayIndex + index ].style.backgroundImage = colors[nextRandom]
    })
  }

  // Add event listener to start button
  startButton.addEventListener('click', () => {
    startPauseGame()
  })

  // Start/Pause button
  function startPauseGame() {
    if (timerId) {
      clearInterval(timerId)
      timerId = null
    } else {
      draw()
      timerId = setInterval(moveDown, 750)
      if (!hasBegun){
        nextRandom = Math.floor(Math.random()*theTetrominos.length)
        displayShape()
      }
      hasBegun = true;
    }
  }
  // Add score functionality
  function addScore() {
    for (let i=0; i < 199; i+=WIDTH) {
      const row = [i , i + 1, i +2, i + 3, i + 4, i + 5, i +6, i + 7, i +8, i + 9]
      if (row.every(index => squares[index].classList.contains('taken'))) {
        score += 10
        scoreDisplay.innerHTML = score
        row.forEach(index => {
          squares[index].classList.remove('taken')
          squares[index].classList.remove('tetromino')
          squares[index].style.backgroundImage = ''

        })
        const squaresRemoved = squares.splice(i, WIDTH)
        squares = squaresRemoved.concat(squares)
        squares.forEach(cell => grid.appendChild(cell))
      }
    }
  }

  // Check if game ended
  function gameOver() {
    if(current.some(index => squares[index + currentPosition].classList.contains('taken'))) {
      scoreDisplay.innerHTML = 'Game Over'
      clearInterval(timerId)
      document.removeEventListener('keyup', control)
    }
  }

})
