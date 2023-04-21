class OtherPlayer {
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
}