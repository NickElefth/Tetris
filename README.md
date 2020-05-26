# TETRIS

This is a vanilla JavaScript game. The functionality is complete and you can easily play this game as you would play any Tetris game. The design was kept at the bare minimum as this project was for educational purposes and just to have fun.

### Appearance

![Tetris outlook](/images/tetris-screen.png)

![instructions modal](/images/instructions-modal.png)

### About Tetris

Tetris is a tile-matching puzzle game from the 80’s. Try to get your personal high score by moving each of the 5 randomly selected Tetromino shapes sideways and/or rotating by quarter-turns, so that they form a solid horizontal line without gaps. When such a line is formed, it disappears and any blocks above it fall down to fill the space. For each line you will receive 10 points.

### Technologies used

* HTML5
* CSS3
* JavaScript

### Functionality

* The game starts when you press the start button
* The game should stop if a Tetrimino fills the highest row of the game board
* The player should be able to rotate each Tetrimino about its own axis
* The Tetrominos will not rotate if the next rotation of the shape is more than the width of the grid
* The next shape is displayed on the mini grid
* The instructions button opens a modal explaining how to play the game
* If the game has started, clicking the instructions button pauses the game and resumes when you close the modal.
* If a line is completed it should be removed and the pieces above should take its place
* The grid is initialized at the beginning
