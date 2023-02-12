var start;
var end;
var w,h;
var stop = false;
const rectangleSize = 15;
const gridSize = 30;
const canvas = document.getElementById("myCanvas");
const context = canvas.getContext("2d");

var grid = new Array(gridSize);

function Player(i, j) {
    this.i = i;
    this.j = j;
    this.show = function () {
        context.fillStyle = "green";
        context.fillRect(this.j * rectangleSize, this.i * rectangleSize, rectangleSize, rectangleSize);
    }
    this.walk = function () {
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

for (var i = 0; i < gridSize; i++) {
    for (var j = 0; j < gridSize; j++) {
        grid[i][j].show();
        grid[i][j].previous = undefined;
    }
}

var player = new Player(5, 5);
player.show()
console.log(player);

canvas.addEventListener("click", (event) => {

    resetInformationAboutPrevious();

    resetDrawnGridPaths();

    console.log(player.i, player.j)
    // get the x and y position of the click
    const x = event.clientX - canvas.offsetLeft;
    const y = event.clientY - canvas.offsetTop;
  
    // calculate the row and column based on the x and y position
    const row = Math.floor(y / rectangleSize);
    const col = Math.floor(x / rectangleSize);
  
    // do something with the row and column

    var isWall = checkIfWall(row, col);
    if (isWall) {
        return;
    }
    else {
        go(row, col);
    }

    grid[row][col].color = "red";

    // path[path.length - 1].color="green";
    for (var i = 0; i < path.length-1; i++) {
        path[i].color="blue";
    }

    redrawGrid();
    player.show()

    reset(row, col);
});

function checkIfWall(row, col) {
    if (grid[row][col].wall) {
        console.log("can't go there")
        return true;
    }
    return false
}

function reset(row, col) {
    start = grid[row][col];
    stop = false;
    openSet = [];
    closedSet = [];
}

function go(row, col) {
    player.i = row;
    player.j = col;
    end = grid[row][col];
    openSet.push(start);

    while(!stop) {
        pathFinding();
    }
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

function resetDrawnGridPaths()
{
    for (var i = 0; i < path.length; i++) {
        path[i].color="white";
    }
}
