function Spot(i, j) {
    this.i = i;
    this.j = j;
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.color = "white";
    this.neighbors = [];
    this.previous = undefined;
    this.type = null;

    if (Math.random() < 0.1) {
      this.type = "wall";
      this.color = "black";
    }

    if (Math.random() < 0.1) {
        if (this.type != "wall")
        {
            this.type = "gold"; 
            this.color = "yellow";
        }
    }
  
    this.show = function () {
        context.fillStyle = this.color;
        context.fillRect(this.j * rectangleSize, this.i * rectangleSize, rectangleSize, rectangleSize);
        context.strokeRect(this.j * rectangleSize, this.i * rectangleSize, rectangleSize, rectangleSize);
        context.strokeStyle = "black";
    } 
    
    this.addNeighbors = function (grid) {
        var i = this.i;
        var j = this.j;
        if (i < gridSize - 1) {
            this.neighbors.push(grid[i + 1][j]);
        }
        if (i > 0) {
            this.neighbors.push(grid[i - 1][j]);
        }
        if (j < gridSize - 1) {
            this.neighbors.push(grid[i][j + 1]);
        }
        if (j > 0) {
            this.neighbors.push(grid[i][j - 1]);
        }
        if (i > 0 && j > 0) {
            this.neighbors.push(grid[i - 1][j - 1]);
        }
        if (i < gridSize - 1 && j > 0) {
            this.neighbors.push(grid[i + 1][j - 1]);
        }
        if (i > 0 && j < gridSize - 1) {
            this.neighbors.push(grid[i - 1][j + 1]);
        }
        if (i < gridSize - 1 && j < gridSize - 1) {
            this.neighbors.push(grid[i + 1][j + 1]);
        }
    }
}