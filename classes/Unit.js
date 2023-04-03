class Unit {
    constructor(i, j, rectangleSize, context, speed, team) {
        this.image = new Image();
        this.image.src = "images/duckMan.png";
        this.i = i;
        this.j = j;
        this.rectangleSize = rectangleSize;
        this.context = context;
        this.speed = speed;
        this.attack = 1;
        this.health = 10;
        this.team = team;
        this.walking = false;
        this.movement = 0;

        const self = this;
        this.image.onload = function() {
            self.show();
        }
    }

    show() {
        this.context.drawImage(this.image, this.j * this.rectangleSize, this.i * this.rectangleSize, this.rectangleSize, this.rectangleSize);
    }

    setMovement() {
        this.movement = this.speed;
    }

    attack() {

    }

    async walk(grid) {
        for (let i = path.length - 1; i >= 0; i--) {
            await new Promise(resolve => {
                setTimeout(() => {
                    console.log(path.length)
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
        grid[this.i][this.j].type = this.team;
        grid[this.i][this.j].show(this.context);
        this.show();
    }
    
    
}