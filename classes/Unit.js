class Unit {
    constructor(i, j, rectangleSize, context) {
        this.image = new Image();
        this.image.src = "images/duckMan.png";
        this.i = i;
        this.j = j;
        this.rectangleSize = rectangleSize;
        this.context = context;

        const self = this;
        this.image.onload = function() {
            self.show();
        }
    }

    show() {
        this.context.drawImage(this.image, this.j * this.rectangleSize, this.i * this.rectangleSize, this.rectangleSize, this.rectangleSize);
    }

    walk(grid) {
        for (var i = path.length - 1; i >= 0; i--) {
            var self = this;
            (function(i, player) {
                setTimeout(function() {
                    var next = path.pop();
                    grid[self.i][self.j].color = baseGridColor;
                    grid[self.i][self.j].show(self.context);
                    player.i = next.i;
                    player.j = next.j;
                    player.show();
                    }, (path.length - i) * 100);
            })(i, this);
        }
    }
}