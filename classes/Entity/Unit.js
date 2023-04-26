class Unit {
    constructor(i, j, rectangleSize, context, speed, team) {
        this.image = new Image();
        this.image.src = "images/duckMan.png";
        this.i = i;
        this.j = j;
        this.rectangleSize = rectangleSize;
        this.context = context;
        this.speed = speed;
        this.attackDmg = 1;
        this.health = 2;
        this.team = team;
        this.walking = false;
        this.movement = 0;
        this.id = null;
        this.color = this.determineColor();

        const self = this;
        this.image.onload = function() {
            self.show();
        }
    }

    determineColor() {
        if (this.team === "player") {
            return team1Color;
        } else if (this.team === "AI") {
            return team2Color;
        }
    }

    show() {
        this.context.drawImage(this.image, this.j * this.rectangleSize, this.i * this.rectangleSize, this.rectangleSize, this.rectangleSize);
    }

    setMovement() {
        this.movement = this.speed;
    }

    die() {
        this.image.src = "images/deadDuckMan.png";
        console.log("Unit died")
        this.show();
    }

    tryToKill(enemy) {
        this.movement = 0;
        enemy.health -= this.attackDmg;
        if (enemy.health <= 0) {
            enemy.die();
            return true;
        }
        return false;
    }

    async walk(grid) {
        grid[this.i][this.j].type = null;
        grid[this.i][this.j].unit = null;
        for (let step = path.length - 1; step >= 0; step--) {
          await new Promise(resolve => {
            setTimeout(() => {
              walkingInBattle = true;
              const next = path.pop();
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
                this.movement -= 1;
              }
              resolve();
            }, 100);
          });
        }
        walkingInBattle = false;
        var gridObject = grid[this.i][this.j];
        gridObject.type = "player";
        gridObject.unit = this;
        gridObject.color = this.color;
        gridObject.show(this.context);
        this.show();
      }
      
    
    
}