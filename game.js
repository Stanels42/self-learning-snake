const SIZE = 500; // Size of play field in pixels
const GRID_SIZE = SIZE / 50; //Get size of play field (50x50)
const GROWTH_FACTOR = 2; //How much the snake grows by for eating the candy
const MOVE_GROWTH = Math.round(GRID_SIZE * GRID_SIZE * 1.1); // number of moves gained for eating a candy
const GAME_SPEED = 75; //control the pace of the game
var c = document.getElementById("c"); //Get the canvas from HTML
c.height = c.width = SIZE * 2; // 2x our resolution so retina screens look good
c.style.width = c.style.height = SIZE + "px";
var context = c.getContext("2d");
context.scale(2, 2); //Scale canvas to screen

//Both variables to be displayed
var score;
var moves; //Moves remaining till the snake 'STARVES'
var maxMoves;

//A list of variables that need to be set each game
var direction = (newDirection = 1); //-2: up, 2: down, -1: left, 1: right
var snakeLength;
var snake = [];
var candy;
var end;
var arrayField = [GRID_SIZE][GRID_SIZE];

function start() {
  setGame();
  setInterval(tick, 75);
  window.onkeydown = function(e) {
    newDirection = { 37: -1, 38: -2, 39: 1, 40: 2 }[e.keyCode] || newDirection;
  };
}

function setGame() {
  snakeLength = 2; //Set starting length
  snake = [{ x: SIZE / 2, y: SIZE / 2 }]; // Start in the center
  candy = null;
  end = false;
  arrayField = [GRID_SIZE][GRID_SIZE]; //reset the learning field
  direction = 1; //Start going right
  moves = MOVE_GROWTH * 2;
  score = 0;
}

function randomOffset() {
  return Math.floor((Math.random() * SIZE) / GRID_SIZE) * GRID_SIZE;
}

function printGameOver(newHead) {
  context.fillStyle = "#002b36";
  context.fillRect(0, 0, SIZE, SIZE); // Reset the play area
  if (end) {
    context.fillStyle = "#eee8d5";
    context.font = "40px serif";
    context.textAlign = "center";
    context.fillText("Refresh to play again", SIZE / 2, SIZE / 2);
    gameOver();
  } else {
    snake.unshift(newHead); // Add the new head to the front
    snake = snake.slice(0, snakeLength); // Enforce the snake's max length
    moves--;
  }
}

function stringifyCoord(obj) {
  return [obj.x, obj.y].join(",");
}

function gameOver() {
  clearInterval();
}

function tick() {

  var newHead = { x: snake[0].x, y: snake[0].y };

  if (Math.abs(direction) !== Math.abs(newDirection)) {
    direction = newDirection;
  }

  var axis = Math.abs(direction) === 1 ? "x" : "y";

  if (direction < 0) {
    newHead[axis] -= GRID_SIZE;
  } else {
    newHead[axis] += GRID_SIZE;
  }

  //Candy collision with snake head
  if (candy && candy.x === newHead.x && candy.y === newHead.y) {
    candy = null;
    snakeLength += GROWTH_FACTOR;
    score++;
    moves += MOVE_GROWTH;
  }

  printGameOver(newHead);

  // Detect wall collisions
  if (newHead.x < 0 || newHead.x >= SIZE || newHead.y < 0 || newHead.y >= SIZE) {
    end = true;
  }

  var snakeObj = {};
  context.fillStyle = "#43F0AA";
  context.fillRect(snake[0].x, snake[0].y, GRID_SIZE, GRID_SIZE);
  context.fillStyle = "#268bd2";
  for (var i = 1; i < snake.length; i++) {

    var a = snake[i];
    context.fillRect(a.x, a.y, GRID_SIZE, GRID_SIZE); // Paint the snake
    
    // Build a collision lookup object
    if (i > 0) {
      snakeObj[stringifyCoord(a)] = true;
    }
  }

  document.getElementById("score").innerHTML = "Score: " + score;

  document.getElementById("moves").innerHTML = "Moves Remaining: " + moves;

  if (snakeObj[stringifyCoord(newHead)]) {
    end = true; // Collided with our tail
  } else if (moves <= 0) {
    end = true;
  }

  // Place a candy (not on the snake) if needed
  while (!candy || snakeObj[stringifyCoord(candy)]) {
    candy = { x: randomOffset(), y: randomOffset() };
  }

  context.fillStyle = "#b58900";
  context.fillRect(candy.x, candy.y, GRID_SIZE, GRID_SIZE); // Paint the candy
}

start();
