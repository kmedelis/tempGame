class Map {
    constructor(player1, player2, gridSize, canvas, context) {
        this.grid = new Array(this.gridSize);
        this.player1 = player1;
        this.player2 = player2;
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

    setGrid(grid) {
        for (var i = 0; i < this.gridSize; i++) {
            for (var j = 0; j < this.gridSize; j++) {
                this.grid[i][j].i = grid[i][j].i;
                this.grid[i][j].j = grid[i][j].j;
                this.grid[i][j].type = grid[i][j].type;
                this.grid[i][j].color = grid[i][j].color;  
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
        start = this.grid[this.player1.i][this.player1.j];
    }

    renderTrees(resolve) {
        let self = this;
        let treeImage = new Image();
        treeImage.src = "images/tree.png";
        treeImage.onload = function() {
            for (var i = 0; i < self.gridSize; i++) {
                for (var j = 0; j < self.gridSize; j++) {
                    if (self.grid[i][j].type === "wall") {
                        self.context.drawImage(treeImage, j * self.rectangleSize, i * self.rectangleSize, self.rectangleSize, self.rectangleSize);
                    }
                }
            }
            resolve(); // Resolve the Promise
        }
    }
    
    renderCoins(resolve) {
        let self = this;
        let goldImage = new Image();
        goldImage.src = "images/coin.png";
        goldImage.onload = function() {
            for (var i = 0; i < self.gridSize; i++) {
                for (var j = 0; j < self.gridSize; j++) {
                    if (self.grid[i][j].type === "gold") {
                        self.context.drawImage(goldImage, j * self.rectangleSize, i * self.rectangleSize, self.rectangleSize, self.rectangleSize);
                    }
                }
            }
            resolve(); // Resolve the Promise
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
    }

    draw() {
        this.setStartingPlayerLocation();
        this.drawGrid();
    
        const treesLoaded = new Promise((resolve) => {
            this.renderTrees(resolve);
        });
    
        const coinsLoaded = new Promise((resolve) => {
            this.renderCoins(resolve);
        });
    
        return Promise.all([treesLoaded, coinsLoaded]);
    }
    
}
