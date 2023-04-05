class BattleMap {
    constructor(player1, player2, gridSize, canvas, context) {
        this.grid = new Array(this.gridSize);
        this.player1 = player1;
        this.player2 = player2;
        this.gridSize = gridSize;
        this.canvas = canvas;
        this.rectangleSize = this.canvas.width / this.gridSize;
        this.context = context;
        this.walkablePath = [];
    }

    InitializeArray() {
        for (var i = 0; i < this.gridSize; i++) {
            this.grid[i] = new Array(this.gridSize);
        }
    }

    initializeGrid() {
        for (var i = 0; i < this.gridSize; i++) {
            for (var j = 0; j < this.gridSize; j++) {
                this.grid[i][j] = new BattleSpot(i, j, this.gridSize, this.rectangleSize);     
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
        for (var i = 0; i < this.gridSize; i++) {
            for (var j = 0; j < this.gridSize; j++) {
                this.grid[i][j].show(this.context);
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

    checkIfWalkable(row, col) {
        if (this.grid[row][col].type !== "walkable") {
            return false;
        }
        return true
    }

    checkIfEnemy(player, enemy) {
        if (enemy === null) {
            return false;
        }
        if (player.team !== enemy.team) {
            return true;
        }
        return false
    }

    async go(row, col) {
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

    renderTrees() {
        let self = this; // save a reference to the Map instance
        let treeImage = new Image();
        treeImage.src = "images/tree.png";
        treeImage.onload = function() {
            for (var i = 0; i < self.gridSize; i++) {
                for (var j = 0; j < self.gridSize; j++) {
                    if(self.grid[i][j].type === "wall")
                    {
                        self.context.drawImage(treeImage, j * self.rectangleSize, i * self.rectangleSize, self.rectangleSize, self.rectangleSize);
                    }
                }
            }
        }
    }

    getPossiblePath(row, col, maxSteps) {
        this.walkablePath = BFS(row, col, maxSteps, this.grid, this.gridSize);
        this.drawGrid();
    }      

    resetWalkablePath() {
        for (let i = 0; i < this.walkablePath.length; i++) {
            if (this.walkablePath[i].type == "walkable") {
                this.walkablePath[i].color = baseGridColor;
                this.walkablePath[i].type = null;
                this.walkablePath[i].show(this.context);
            }
        }
    }

    drawGrid() {
        for (var i = 0; i < this.gridSize; i++) {
            for (var j = 0; j < this.gridSize; j++) {
                this.grid[i][j].show(this.context);
            }
        }
    }

    initializeTroopPositions() {
        for (var i = 0; i < this.player1.army.length; i++) {
            let troop = this.player1.army[i];
            this.grid[troop.i][troop.j].type = "player";
            this.grid[troop.i][troop.j].color = team1Color;
        }
        for (var i = 0; i < this.player2.army.length; i++) {
            let troop = this.player2.army[i];
            this.grid[troop.i][troop.j].type = "player";
            this.grid[troop.i][troop.j].color = team2Color;
        }
    }


    setup() {
        this.InitializeArray();
        this.initializeGrid();
        this.addNeighbors();
        this.drawGrid();
        this.initializeTroopPositions();
    }
}
