class Spot {
    constructor(i, j, gridSize, rectangleSize) {
        this.i = i;
        this.j = j;
        this.f = 0;
        this.g = 0;
        this.h = 0;
        this.color = baseGridColor;
        this.neighbors = [];
        this.previous = undefined;
        this.gridSize = gridSize;
        this.rectangleSize = rectangleSize;
        this.type = null;
        this.unit = null;
    }

    setUnit(unit) {
        this.unit = unit;
    }

    getUnit() {
        return this.unit;
    }

    show(ctx) {
        if (this.type === "player") {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.j * this.rectangleSize, this.i * this.rectangleSize, this.rectangleSize, this.rectangleSize);
            ctx.strokeStyle = 'black';
            ctx.strokeRect(this.j * this.rectangleSize, this.i * this.rectangleSize, this.rectangleSize, this.rectangleSize);
            this.unit.show()
            return;
        }
        if (this.type === "otherPlayer") {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.j * this.rectangleSize, this.i * this.rectangleSize, this.rectangleSize, this.rectangleSize);
            ctx.strokeStyle = 'black';
            ctx.strokeRect(this.j * this.rectangleSize, this.i * this.rectangleSize, this.rectangleSize, this.rectangleSize);
            this.unit.show()
            return;
        }
        ctx.fillStyle = this.color;
        ctx.fillRect(this.j * this.rectangleSize, this.i * this.rectangleSize, this.rectangleSize, this.rectangleSize);
        ctx.strokeStyle = 'black';
        ctx.strokeRect(this.j * this.rectangleSize, this.i * this.rectangleSize, this.rectangleSize, this.rectangleSize);
    }

    addNeighbors(grid) {
        const { i, j, gridSize } = this;

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