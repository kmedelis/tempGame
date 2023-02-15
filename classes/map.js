class Map {
    constructor(player) {
        this.grid = new Array(gridSize);
        this.player = player;
    }

    InitializeArray() {
        for (var i = 0; i < gridSize; i++) {
            this.grid[i] = new Array(gridSize);
        }
    }

    initializeGrid() {
        for (var i = 0; i < gridSize; i++) {
            for (var j = 0; j < gridSize; j++) {
                this.grid[i][j] = new Spot(i, j);     
            }
        }
    }

    addNeighbors() {
        for (var i = 0; i < gridSize; i++) {
            for (var j = 0; j < gridSize; j++) {
                this.grid[i][j].addNeighbors(this.grid);
          }
        }
    }

    drawGrid() {
        for (var i = 0; i < gridSize; i++) {
            for (var j = 0; j < gridSize; j++) {
                this.grid[i][j].show();
            }
        }
    }

    setStartingPlayerLocation() {
        start = this.grid[this.player.i][this.player.j];
    }

    renderTrees() {
        let self = this; // save a reference to the Map instance
        let treeImage = new Image();
        treeImage.src = "images/tree.png";
        treeImage.onload = function() {
            for (var i = 0; i < gridSize; i++) {
                for (var j = 0; j < gridSize; j++) {
                    if(self.grid[i][j].type === "wall")
                    {
                        context.drawImage(treeImage, j * rectangleSize, i * rectangleSize, rectangleSize, rectangleSize);
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
            for (var i = 0; i < gridSize; i++) {
                for (var j = 0; j < gridSize; j++) {
                    if(self.grid[i][j].type === "gold")
                    {
                        context.drawImage(goldImage, j * rectangleSize, i * rectangleSize, rectangleSize, rectangleSize);
                    }
                }
            }
        }
    }
    
    resetInformationAboutPrevious() {
        for (var i = 0; i < gridSize; i++) {
            for (var j = 0; j < gridSize; j++) {
                this.grid[i][j].previous = undefined;
            }
        }
    }

    checkIfWall(row, col) {
        console.log(this.grid[row][col].type)
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
        this.drawGrid()
        this.renderTrees();
        this.renderCoins();
        this.setStartingPlayerLocation();
    }
}
