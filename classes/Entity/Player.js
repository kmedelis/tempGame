class Player {
    constructor(i, j, rectangleSize, context, clientId) {
        this.image = new Image();
        this.image.src = "images/player.png";
        this.i = i;
        this.j = j;
        this.clientId = clientId;
        this.rectangleSize = rectangleSize;
        this.gold = 0;
        this.context = context;
        this.army = [];
        const self = this;
        this.image.onload = function() {
            self.show();
        }
    }

    addUnit(unit) {
        this.army.push(unit);
    }

    show() {
        const self = this;
        this.context.drawImage(self.image, self.j * this.rectangleSize, self.i * this.rectangleSize, this.rectangleSize, this.rectangleSize);
    }

    walk = function (grid, client) {
        for (var i = path.length - 1; i >= 0; i--) {
            var self = this;
            (function(i, player) {
                setTimeout(function() {
                    var next = path.pop();
                    grid[self.i][self.j].color = baseGridColor;
                    grid[self.i][self.j].show(self.context);
                    client.sendPlayerMovement(next.i, next.j, player.i, player.j)
                    player.i = next.i;
                    player.j = next.j;
                    if (grid[player.i][player.j].type === "gold") {
                        player.gold++;
                        document.getElementById("goldAmount").innerHTML = player.gold;
                        grid[player.i][player.j].type = null;
                        grid[player.i][player.j].color = baseGridColor;
                        grid[self.i][self.j].show(self.context);
                    }
                    player.show();
                    }, (path.length - i) * 100);
            })(i, this);
        }
    }
}