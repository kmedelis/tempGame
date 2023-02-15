var player = new Player(0, 0);

var map = new Map(player);
map.setup();

function showFirst() {
    canvas.classList.remove('hide');
    canvasBattle.classList.add('hide');
}

function showSecond() {
    canvas.classList.add('hide');
    canvasBattle.classList.remove('hide');
}

showFirst();

player.render();

canvas.addEventListener("click", (event) => {
    path = [];

    map.resetInformationAboutPrevious();
    map.resetDrawnGridPaths();

    // get the x and y position of the click
    const x = event.clientX - canvas.offsetLeft;
    const y = event.clientY - canvas.offsetTop;
  
    // calculate the row and column based on the x and y position
    const row = Math.floor(y / rectangleSize);
    const col = Math.floor(x / rectangleSize);
  
    // do something with the row and column

    var isWall = map.checkIfWall(row, col);
    if (isWall) {
        return;
    }
    else {
        map.go(row, col);
    }

    // path[path.length - 1].color="green";
    for (var i = 0; i < path.length-1; i++) {
        path[i].color="blue";
    }

    player.walk(map.grid);

    map.reset(row, col);
});
