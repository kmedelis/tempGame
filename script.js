var start;
var end;
var w,h;
var stop = false;
const rectangleSize = 15;
const gridSize = 30;
const canvas = document.getElementById("myCanvas");
const context = canvas.getContext("2d");

var grid = new Array(gridSize);

function addResources() {
    const playerImage = new Image();
    playerImage.src = "images/playerDown.png";
    playerImage.onload = () => {
        context.drawImage(playerImage, 0, 0, rectangleSize, rectangleSize);
    }
}

function setup() {

    // making a 2D array
    for (var i = 0; i < gridSize; i++) {
        grid[i] = new Array(gridSize);
    }

    for (var i = 0; i < gridSize; i++) {
        for (var j = 0; j < gridSize; j++) {
            grid[i][j] = new Spot(i, j);
        }
    }

    for (var i = 0; i < gridSize; i++) {
      for (var j = 0; j < gridSize; j++) {
          grid[i][j].addNeighbors(grid);
      }
    }

    start = grid[0][0];
}

setup();
addResources();

for (var i = 0; i < gridSize; i++) {
    for (var j = 0; j < gridSize; j++) {
        grid[i][j].show();
        grid[i][j].previous = undefined;
    }
}

canvas.onclick = event => {
    if (event.detail === 1) {
      console.log("single click")
    } else if (event.detail === 2) {
      console.log("double click")
    }
 };

canvas.addEventListener("click", (event) => {

    resetInformationAboutPrevious();

    for (var i = 0; i < path.length; i++) {
        path[i].color="white";
    }

    // get the x and y position of the click
    const x = event.clientX - canvas.offsetLeft;
    const y = event.clientY - canvas.offsetTop;
  
    // calculate the row and column based on the x and y position
    const row = Math.floor(y / rectangleSize);
    const col = Math.floor(x / rectangleSize);
  
    // do something with the row and column

    end = grid[row][col];
    openSet.push(start);

    while(!stop) {
        pathFinding();
    }

    grid[row][col].color = "red";

    path[path.length - 1].color="green";
    for (var i = 0; i < path.length-1; i++) {
        path[i].color="blue";
    }

    redrawGrid();
    reset(row, col);
});

function reset(row, col) {
    start = grid[row][col];
    stop = false;
    openSet = [];
    closedSet = [];
}

function redrawGrid() {
    for (var i = 0; i < gridSize; i++) {
        for (var j = 0; j < gridSize; j++) {
            grid[i][j].show();
        }
    }
}

function resetInformationAboutPrevious() {
    for (var i = 0; i < gridSize; i++) {
        for (var j = 0; j < gridSize; j++) {
            grid[i][j].previous = undefined;
        }
    }
}