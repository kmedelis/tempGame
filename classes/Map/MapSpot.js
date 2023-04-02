class MapSpot extends Spot {
    constructor(i, j, gridSize, rectangleSize) {
        super(i, j, gridSize, rectangleSize);

        if (Math.random() < 0.2) {
            this.type = "wall";
        }

        if (Math.random() < 0.1) {
            if (this.type != "wall") {
                this.type = "gold";
            }
        }

        if (Math.random() < 0.1) {
            if (this.type != "wall" && this.type != "gold") {
                this.color = "red";
                this.type = "enemy";
            }
        }
    }
}