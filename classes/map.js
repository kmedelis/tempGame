function map() {

    this.InitializeArray = function() {
        for (var i = 0; i < gridSize; i++) {
            grid[i] = new Array(gridSize);
        }
    }

    this.initializeGrid = function() {
        for (var i = 0; i < gridSize; i++) {
            for (var j = 0; j < gridSize; j++) {
                grid[i][j] = new Spot(i, j);
            }
        }
    }

    this.addNeighbors = function() {
        for (var i = 0; i < gridSize; i++) {
            for (var j = 0; j < gridSize; j++) {
                grid[i][j].addNeighbors(grid);
          }
        }
    }

    this.renderTrees = function() {
        image = new Image();
        image.src = "images/tree.png";
        image.onload = function() {
            for (var i = 0; i < gridSize; i++) {
                for (var j = 0; j < gridSize; j++) {
                    if(grid[i][j].type === "wall")
                    {
                        console.log("tree")
                        context.drawImage(image, j * rectangleSize, i * rectangleSize, rectangleSize, rectangleSize);
                    }
                }
            }
        }
    }

    this.setup = function() {
        this.InitializeArray();
        this.initializeGrid();
        this.addNeighbors();
        this.renderTrees();
    }
}
