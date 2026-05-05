let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let scoreElement = document.getElementById('score');
let eatingFood = document.getElementById('eatingFood');
let gameOverSound = document.getElementById('gameOverSound');
let nextLevelSound = document.getElementById('nextLevelSound');
let mainMusic = document.getElementById('mainMusic');
let upArrow = document.getElementById('up');
let downArrow = document.getElementById('down');
let leftArrow = document.getElementById('left');
let rightArrow = document.getElementById('right');
let startButton = document.getElementById('name');

let width = canvas.width;
let height = canvas.height;
let score = 0;
let speed = 100;
let blockSize = 10;
let lineWidth = width / blockSize;
let lineHeight = height / blockSize;
let colors = ["red", "green", "blue", "yellow", "purple", "coral", "orange", "pink"];
let randomColor = colors[Math.floor(Math.random() * colors.length)];

let drawScore = function() {
  scoreElement.innerText = "Score: " + score;
  scoreElement.style.color = "white";
};

let gameOver = function() {
  clearInterval(intervalId);
  ctx.beginPath();
  ctx.fillStyle = "white";
  ctx.font = "55px Broadway, serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("GAME OVER", width / 2, height / 2);
  ctx.fill();
  ctx.closePath();
  gameOverSound.play();
  gameOverSound.volume = 0.5;
  mainMusic.pause();
  mainMusic.currentTime = 0;
};

let Block = function(col, row) {
  this.col = col;
  this.row = row;
};

let circle = function(x, y, radius) {
  ctx.beginPath();
  ctx.fillStyle = "white";
  ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
  ctx.fill();
  ctx.closePath();
};

Block.prototype.drawCircle = function() {
  let x = this.col * blockSize + blockSize / 2;
  let y = this.row * blockSize + blockSize / 2;
  circle(x, y, 5);
};

Block.prototype.drawSquare = function() {
  let squareX = this.col * blockSize;
  let squareY = this.row * blockSize;
  ctx.beginPath();
  if (score > 65) {
    ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
    ctx.shadowColor = "white";
    ctx.shadowBlur = 10;

  }
  else {
    ctx.fillStyle = randomColor;
  }
  ctx.fillRect(squareX, squareY, blockSize, blockSize);
  ctx.fill();
  ctx.closePath();
};

let Snake = function() {
  this.segments = [
    new Block(15, 10),
    new Block(14, 10),
    new Block(13, 10),
  ];
  this.direction = "right";
  this.nextDirection = "right";
};

Snake.prototype.drawSnake = function() {
  for (let i = 0; i < this.segments.length; i++) {
    this.segments[i].drawSquare();
  }
};

Snake.prototype.moveSnake = function() {
  let head = this.segments[0];
  let newHead;
  this.direction = this.nextDirection;
  if (this.direction === "right") {
    newHead = new Block(head.col + 1, head.row)
  }
  else if (this.direction === "left") {
    newHead = new Block(head.col - 1, head.row)
  }
  else if (this.direction === "up") {
    newHead = new Block(head.col, head.row - 1)
  }
  else if (this.direction === "down") {
    newHead = new Block(head.col, head.row + 1)
  }
  this.segments.unshift(newHead);
};

Snake.prototype.checkWalls = function() {
  let head = this.segments[0];
  if (head.col === lineWidth - 1 || head.col === 0
    || head.row === lineHeight || head.row === 0) {
    gameOver();
  }
};

let Food = function() {
  this.block = new Block(Math.floor(Math.random() * lineWidth),
    Math.floor(Math.random() * lineHeight),);
};

Food.prototype.drawFood = function() {
  this.block.drawCircle();
};

Food.prototype.eatFood = function() {
  if (snake.segments[0].col === this.block.col &&
    snake.segments[0].row === this.block.row) {
    eatingFood.play();
    score ++;
    this.block = new Block(
      Math.floor(Math.random() * (lineWidth - 2)) + 1,
      Math.floor(Math.random() * (lineHeight - 2)) + 1
    );
  }
  else {
    snake.segments.pop();
  }
  if (score === 20) {
    nextLevelSound.play();
    speed = 80;
    updateSpeed();
  }
  else if (score === 35) {
    nextLevelSound.play();
    speed = 60;
    updateSpeed();
  }
  else if (score === 65) {
    nextLevelSound.play();
    speed = 30;
    updateSpeed();
  }
};

let actionKeys = {
  38: "up",
  39: "right",
  37: "left",
  40: "down"
};

let snake = new Snake();
let food = new Food();

upArrow.onclick = function () {
  snake.nextDirection = "up";
};
downArrow.onclick = function () {
  snake.nextDirection = "down";
};
leftArrow.onclick = function () {
  snake.nextDirection = "left";
};
rightArrow.onclick = function () {
  snake.nextDirection = "right";
};

$("body").keydown(function (event) {
    let newDirection = actionKeys[event.keyCode];

    if (
      snake.direction === "right" && newDirection === "left" ||
      snake.direction === "left" && newDirection === "right" ||
      snake.direction === "up" && newDirection === "down" ||
      snake.direction === "down" && newDirection === "up"
    ) {
      return;
    }
    if (newDirection) {
      snake.nextDirection = newDirection;
    }
  }
);

let intervalId;

let startGame = function () {

  clearInterval(intervalId);

  snake = new Snake();
  food = new Food();

  score = 0;
  speed = 100;

  mainMusic.currentTime = 0;
  mainMusic.play();

  intervalId = setInterval(gameLoop, speed);
};

let gameLoop = function () {

  ctx.clearRect(0, 0, width, height);
  drawScore();
  snake.moveSnake();
  food.eatFood();
  snake.checkWalls();
  food.drawFood();
  snake.drawSnake();
};

let updateSpeed = function () {

  clearInterval(intervalId);

  intervalId = setInterval(gameLoop, speed);
};

startButton.onclick = function () {
  startGame()
};
