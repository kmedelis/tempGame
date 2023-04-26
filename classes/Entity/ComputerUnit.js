class ComputerUnit extends Unit {
    constructor(i, j, rectangleSize, context, speed, team) {
        super(i, j, rectangleSize, context, speed, team);
        
        this.playerUnits = [];
    }

    addPlayerUnits(unit) {
        this.playerUnits.push(unit);
    }

    calculateDistanceToPlayerUnits() {
        var distances = [];
        for (let i = 0; i < this.playerUnits.length; i++) {
            distances.push(this.chebyshevDistance(this.i, this.j, this.playerUnits[i].i, this.playerUnits[i].j));
        }

        var shortestDistance = Math.min(...distances);
        const indexOfShortestDistance = distances.indexOf(shortestDistance);
        return this.playerUnits[indexOfShortestDistance];
    }

    chebyshevDistance(x1, y1, x2, y2) {
        // Calculate the absolute differences between the x and y coordinates
        const deltaX = Math.abs(x2 - x1);
        const deltaY = Math.abs(y2 - y1);
      
        // Return the maximum of the absolute differences
        return Math.max(deltaX, deltaY);
      }

      async walk(grid) {
        var stepsLeft = this.speed;
        grid[this.i][this.j].type = null;
        grid[this.i][this.j].unit = null;
        for (let i = path.length - 1; i >= 0; i--) {
          const next = path.pop();
          if (stepsLeft <= 0) {
            break;
          }
          if (next.type === "player") {
            var gridObject = grid[this.i][this.j];
            walkingInBattle = false;
            gridObject.type = "AI";
            gridObject.unit = this;
            gridObject.color = this.color;
            gridObject.show(this.context);
            this.show();
            return true;
          }
          await new Promise(resolve => {
            setTimeout(() => {
              walkingInBattle = true;
              grid[this.i][this.j].color = baseGridColor;
              grid[this.i][this.j].type = null;
              grid[this.i][this.j].show(this.context);
              let hasMoved = false;
              if (this.i !== next.i || this.j !== next.j) {
                this.i = next.i;
                this.j = next.j;
                hasMoved = true;
              }
              this.show();
              if (hasMoved) {
                stepsLeft -= 1;
              }
              resolve();
            }, 100);
          });
        }
        var gridObject = grid[this.i][this.j];
        walkingInBattle = false;
        gridObject.type = "AI";
        gridObject.unit = this;
        gridObject.color = this.color;
        gridObject.show(this.context);
        this.show();
      }
      
    

}