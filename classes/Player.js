function Player(i, j) {


    this.image = new Image();
    this.image.src = "images/player.png";
    this.i = i;
    this.j = j;
    this.gold = 0;

    this.show = function () {
        console.log("draw");
        const self = this;
        context.drawImage(self.image, self.j * rectangleSize, self.i * rectangleSize, rectangleSize, rectangleSize);
    }

    this.render = function () {
        console.log("draw");
        const self = this;
        this.image.onload = function() {
          context.drawImage(self.image, self.j * rectangleSize, self.i * rectangleSize, rectangleSize, rectangleSize);
        }
      }

    this.walk = function (grid) {
        for (var i = path.length - 1; i >= 0; i--) {
            var self = this;
            (function(i, player) {
                setTimeout(function() {
                    var next = path.pop();
                    grid[self.i][self.j].color = baseGridColor;
                    grid[self.i][self.j].show();
                    player.i = next.i;
                    player.j = next.j;
                    if (grid[player.i][player.j].type === "gold") {
                        player.gold++;
                        document.getElementById("goldAmount").innerHTML = player.gold;
                        grid[player.i][player.j].type = null;
                        grid[player.i][player.j].color = baseGridColor;
                        grid[self.i][self.j].show();
                    }
                    player.show();
                    }, (path.length - i) * 100);
            })(i, this);
        }
    }
}