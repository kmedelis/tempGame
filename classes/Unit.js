class Unit {
    constructor(i, j, rectangleSize, context, speed) {
        this.image = new Image();
        this.image.src = "images/duckMan.png";
        this.i = i;
        this.j = j;
        this.rectangleSize = rectangleSize;
        this.context = context;
        this.speed = speed;
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

    async walk(grid) {
        for (let i = path.length - 1; i >= 0; i--) {
            await new Promise(resolve => {
                setTimeout(() => {
                    walkingInBattle = true;
                    this.movement -= 1;
                    const next = path.pop();
                    grid[this.i][this.j].color = baseGridColor;
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
        // Add this code to paint the last tile
        grid[this.i][this.j].color = "#FF0000";
        grid[this.i][this.j].type = "player"
        grid[this.i][this.j].show(this.context);
        this.show();
    }
    
    
}