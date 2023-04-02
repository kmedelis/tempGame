class Map {
    constructor(player, gridSize, canvas, context) {
        this.grid = new Array(this.gridSize);
        this.player = player;
        this.gridSize = gridSize;
        this.canvas = canvas;
        this.rectangleSize = this.canvas.width / this.gridSize;
        this.context = context;
    }

    InitializeArray() {
        for (var i = 0; i < this.gridSize; i++) {
            this.grid[i] = new Array(this.gridSize);
        }
    }

    initializeGrid() {
        for (var i = 0; i < this.gridSize; i++) {
            for (var j = 0; j < this.gridSize; j++) {
                this.grid[i][j] = new MapSpot(i, j, this.gridSize, this.rectangleSize);     
            }
        }
    }

    addNeighbors() {
        for (var i = 0; i < this.gridSize; i++) {
            for (var j = 0; j < this.gridSize; j++) {
                this.grid[i][j].addNeighbors(this.grid, this.gridSize);
          }
        }
    }

    drawGrid() {
        let self = this;
        for (var i = 0; i < this.gridSize; i++) {
            for (var j = 0; j < this.gridSize; j++) {
                this.grid[i][j].show(this.context);
            }
        }
    }

    setStartingPlayerLocation() {
        start = this.grid[this.player.i][this.player.j];
        console.log(start)
    }

    renderTrees() {
        let self = this; // save a reference to the Map instance
        let treeImage = new Image();
        treeImage.src = "images/tree.png";
        treeImage.onload = function() {
            for (var i = 0; i < self.gridSize; i++) {
                for (var j = 0; j < self.gridSize; j++) {
                    if(self.grid[i][j].type === "wall")
                    {
                        console.log("draw tree")
                        self.context.drawImage(treeImage, j * self.rectangleSize, i * self.rectangleSize, self.rectangleSize, self.rectangleSize);
                    }
                }
            }
        }
    }
    

    renderCoins() {
        let self = this;
        let goldImage = new Image();
        goldImage.src = "images/coin.png";
        goldImage.onload = function() {
            for (var i = 0; i < self.gridSize; i++) {
                for (var j = 0; j < self.gridSize; j++) {
                    if(self.grid[i][j].type === "gold")
                    {
                        self.context.drawImage(goldImage, j * self.rectangleSize, i * self.rectangleSize, self.rectangleSize, self.rectangleSize);
                    }
                }
            }
        }
    }
    
    resetInformationAboutPrevious() {
        for (var i = 0; i < this.gridSize; i++) {
            for (var j = 0; j < this.gridSize; j++) {
                this.grid[i][j].previous = undefined;
            }
        }
    }

    checkIfWall(row, col) {
        if (this.grid[row][col].type === "wall") {
            console.log("can't go there")
            return true;
        }
        return false
    }

    go(row, col) {
        end = this.grid[row][col];
        openSet.push(start);
    
        while(!stop) {
            pathFinding();
        }
    }

    reset(row, col) {
        start = this.grid[row][col];
        stop = false;
        openSet = [];
        closedSet = [];
    }

    resetDrawnGridPaths()
    {
        for (var i = 0; i < path.length; i++) {
            path[i].color="#7CFC00";
        }
    }

    setup() {
        this.InitializeArray();
        this.initializeGrid();
        this.addNeighbors();
        this.renderTrees();
        this.renderCoins();
        this.setStartingPlayerLocation();
        this.drawGrid()
    }
}
