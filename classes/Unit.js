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
        if (this.team === "player1") {
            return team1Color;
        } else if (this.team === "player2") {
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
        for (let i = path.length - 1; i >= 0; i--) {
            await new Promise(resolve => {
                setTimeout(() => {
                    walkingInBattle = true;
                    this.movement -= path.length - 1;
                    const next = path.pop();
                    grid[this.i][this.j].color = baseGridColor;
                    grid[this.i][this.j].type = null;
                    grid[this.i][this.j].show(this.context);
                    this.i = next.i;
                    this.j = next.j;
                    this.show();
                    
                    if (i === 0) {
                        walkingInBattle = false;
                    }
                    resolve();
                }, (path.length - i) * 100);
            });
        }
        var gridObject = grid[this.i][this.j];
        gridObject.type = "player";
        gridObject.unit = this;
        gridObject.color = this.color;
        gridObject.show(this.context);
        this.show();
    }
    
    
}